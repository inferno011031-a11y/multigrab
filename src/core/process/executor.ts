import { spawn } from 'child_process';
import { config } from '@/lib/config';
import { logger } from '@/lib/logger';

export interface ProcessOutput {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ProgressCallback {
  (progress: { percent: number; speed?: string; eta?: string }): void;
}

export class SubprocessExecutor {
  private static cachedCommand: { cmd: string; baseArgs: string[] } | null = null;
  private static cachedFfmpegPath: string | null = null;

  /**
   * Pre-warm executor paths on server startup.
   */
  public static async prewarm(): Promise<void> {
    try {
      await Promise.all([
        SubprocessExecutor.getExtractorCommand(),
        SubprocessExecutor.getFfmpegPath(),
      ]);
      logger.info('SubprocessExecutor pre-warmed successfully', 'EXECUTOR');
    } catch {}
  }

  /**
   * Discovers ffmpeg executable path on the system.
   */
  public static async getFfmpegPath(): Promise<string | null> {
    if (SubprocessExecutor.cachedFfmpegPath !== null) {
      return SubprocessExecutor.cachedFfmpegPath || null;
    }

    // 1. Try direct system ffmpeg
    try {
      await SubprocessExecutor.runRaw('ffmpeg', ['-version'], { timeout: 3000 });
      SubprocessExecutor.cachedFfmpegPath = 'ffmpeg';
      return 'ffmpeg';
    } catch {}

    // 2. Try python imageio_ffmpeg
    const isWin = process.platform === 'win32';
    const pythonExecs = isWin
      ? ['py', 'C:\\Python314\\python.exe', config.extractor.pythonPath, 'python', 'python3']
      : [config.extractor.pythonPath, 'python3', 'python', 'py'];

    for (const py of pythonExecs) {
      try {
        const out = await SubprocessExecutor.runRaw(
          py,
          ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'],
          { timeout: 4000 }
        );
        const ffmpegExe = out.stdout.trim();
        if (ffmpegExe && !ffmpegExe.includes('Traceback')) {
          SubprocessExecutor.cachedFfmpegPath = ffmpegExe;
          logger.info(`Discovered ffmpeg executable at ${ffmpegExe}`, 'EXECUTOR');
          return ffmpegExe;
        }
      } catch {}
    }

    SubprocessExecutor.cachedFfmpegPath = '';
    return null;
  }

  /**
   * Discovers the best way to execute yt-dlp on the current host.
   */
  public static async getExtractorCommand(): Promise<{ cmd: string; baseArgs: string[] }> {
    if (SubprocessExecutor.cachedCommand) {
      return SubprocessExecutor.cachedCommand;
    }

    // 1. If custom binary is specified in config
    if (config.extractor.customBinaryPath && config.extractor.customBinaryPath !== 'yt-dlp') {
      SubprocessExecutor.cachedCommand = {
        cmd: config.extractor.customBinaryPath,
        baseArgs: [],
      };
      return SubprocessExecutor.cachedCommand;
    }

    // 2. Try global yt-dlp binary
    try {
      await SubprocessExecutor.runRaw('yt-dlp', ['--version'], { timeout: 3000 });
      SubprocessExecutor.cachedCommand = { cmd: 'yt-dlp', baseArgs: [] };
      return SubprocessExecutor.cachedCommand;
    } catch {}

    // 3. Try python module execution
    const isWin = process.platform === 'win32';
    const pythonExecs = isWin
      ? ['py', 'C:\\Python314\\python.exe', config.extractor.pythonPath, 'python', 'python3']
      : [config.extractor.pythonPath, 'python3', 'python', 'py'];

    for (const py of pythonExecs) {
      try {
        await SubprocessExecutor.runRaw(py, ['-m', 'yt_dlp', '--version'], { timeout: 4000 });
        SubprocessExecutor.cachedCommand = { cmd: py, baseArgs: ['-m', 'yt_dlp'] };
        return SubprocessExecutor.cachedCommand;
      } catch {}
    }

    // Fallback default
    SubprocessExecutor.cachedCommand = { cmd: 'yt-dlp', baseArgs: [] };
    return SubprocessExecutor.cachedCommand;
  }

  /**
   * Fast metadata extraction via JSON with low socket timeout.
   */
  public static async extractJson(
    url: string,
    extraArgs: string[] = []
  ): Promise<Record<string, unknown>> {
    const { cmd, baseArgs } = await SubprocessExecutor.getExtractorCommand();

    const args = [
      ...baseArgs,
      '--dump-single-json',
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificates',
      '--skip-download',
      '--socket-timeout',
      '8',
      '--extractor-retries',
      '2',
      ...extraArgs,
      url,
    ];

    logger.debug(`Extracting metadata via ${cmd}`, 'EXECUTOR');

    const output = await SubprocessExecutor.runRaw(cmd, args, {
      timeout: config.security.requestTimeoutMs || 30000,
    });

    try {
      const json = JSON.parse(output.stdout);
      return json;
    } catch {
      throw new Error(`Failed to parse metadata extractor JSON output: ${output.stderr || output.stdout.slice(0, 100)}`);
    }
  }

  /**
   * Spawns a raw process securely without invoking a shell.
   */
  public static runRaw(
    command: string,
    args: string[],
    options: {
      cwd?: string;
      timeout?: number;
      onProgress?: ProgressCallback;
    } = {}
  ): Promise<ProcessOutput> {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout ?? config.security.requestTimeoutMs ?? 30000;
      const { cwd, onProgress } = options;

      let stdout = '';
      let stderr = '';
      let isTimedOut = false;

      const child = spawn(command, args, {
        cwd,
        shell: false,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      const timer = setTimeout(() => {
        isTimedOut = true;
        child.kill('SIGKILL');
        reject(new Error(`Subprocess timed out after ${timeout}ms`));
      }, timeout);

      if (child.stdout) {
        child.stdout.setEncoding('utf-8');
        child.stdout.on('data', (chunk: string) => {
          stdout += chunk;
          if (onProgress) {
            SubprocessExecutor.parseProgress(chunk, onProgress);
          }
        });
      }

      if (child.stderr) {
        child.stderr.setEncoding('utf-8');
        child.stderr.on('data', (chunk: string) => {
          stderr += chunk;
        });
      }

      child.on('error', (err) => {
        clearTimeout(timer);
        if (!isTimedOut) {
          logger.warn(`Subprocess spawn error: ${err.message}`, 'EXECUTOR', { cmd: command });
          reject(err);
        }
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        if (isTimedOut) return;

        if (code === 0) {
          resolve({ stdout, stderr, exitCode: code });
        } else {
          logger.warn(`Subprocess exited with code ${code}`, 'EXECUTOR', { cmd: command, exitCode: code, stderr: stderr.slice(0, 200) });
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });
    });
  }

  /**
   * Parses standard extractor download progress lines.
   */
  private static parseProgress(output: string, callback: ProgressCallback): void {
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('[download]') && line.includes('%')) {
        const percentMatch = line.match(/(\d+(?:\.\d+)?)%/);
        const speedMatch = line.match(/at\s+([^\s]+)/);
        const etaMatch = line.match(/ETA\s+([^\s]+)/);

        if (percentMatch) {
          const percent = parseFloat(percentMatch[1]);
          callback({
            percent: Math.min(Math.max(percent, 0), 100),
            speed: speedMatch ? speedMatch[1] : undefined,
            eta: etaMatch ? etaMatch[1] : undefined,
          });
        }
      }
    }
  }
}

// Automatically trigger background pre-warm on module load
SubprocessExecutor.prewarm().catch(() => {});
