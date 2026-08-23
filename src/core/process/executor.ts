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
   * Discovers ffmpeg executable path on the system.
   */
  public static async getFfmpegPath(): Promise<string | null> {
    if (SubprocessExecutor.cachedFfmpegPath !== null) {
      return SubprocessExecutor.cachedFfmpegPath;
    }

    // 1. Try direct system ffmpeg
    try {
      await SubprocessExecutor.runRaw('ffmpeg', ['-version'], { timeout: 3000 });
      SubprocessExecutor.cachedFfmpegPath = 'ffmpeg';
      return 'ffmpeg';
    } catch {}

    // 2. Try python imageio_ffmpeg
    const pythonExecs = [config.extractor.pythonPath, 'python3', 'python', 'py'];
    for (const py of pythonExecs) {
      try {
        const out = await SubprocessExecutor.runRaw(py, ['-c', 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())'], { timeout: 4000 });
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
    if (config.extractor.customBinaryPath) {
      SubprocessExecutor.cachedCommand = { cmd: config.extractor.customBinaryPath, baseArgs: [] };
      return SubprocessExecutor.cachedCommand;
    }

    // 2. Test direct `yt-dlp` binary
    try {
      await SubprocessExecutor.runRaw('yt-dlp', ['--version'], { timeout: 3000 });
      SubprocessExecutor.cachedCommand = { cmd: 'yt-dlp', baseArgs: [] };
      return SubprocessExecutor.cachedCommand;
    } catch {
      // direct binary not found, try python module
    }

    // 3. Test `python -m yt_dlp`
    const pythonExecs = [config.extractor.pythonPath, 'python3', 'python', 'py'];
    for (const py of pythonExecs) {
      try {
        await SubprocessExecutor.runRaw(py, ['-m', 'yt_dlp', '--version'], { timeout: 4000 });
        SubprocessExecutor.cachedCommand = { cmd: py, baseArgs: ['-m', 'yt_dlp'] };
        return SubprocessExecutor.cachedCommand;
      } catch {
        // continue
      }
    }

    // Fallback default
    SubprocessExecutor.cachedCommand = { cmd: 'python', baseArgs: ['-m', 'yt_dlp'] };
    return SubprocessExecutor.cachedCommand;
  }

  /**
   * Executes a command directly via spawn without a shell to prevent injection.
   */
  public static runRaw(
    cmd: string,
    args: string[],
    options?: { timeout?: number; cwd?: string; onProgress?: ProgressCallback }
  ): Promise<ProcessOutput> {
    return new Promise((resolve, reject) => {
      const timeoutMs = options?.timeout || config.security.requestTimeoutMs;

      // Notice: shell is explicitly FALSE to eliminate shell injection vulnerabilities
      const child = spawn(cmd, args, {
        cwd: options?.cwd,
        shell: false,
        windowsHide: true,
        env: {
          ...process.env,
          PYTHONIOENCODING: 'utf-8',
          LANG: 'en_US.UTF-8',
        },
      });

      let stdout = '';
      let stderr = '';
      let killed = false;

      const timer = setTimeout(() => {
        killed = true;
        child.kill('SIGKILL');
        reject(new Error(`Subprocess timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      child.stdout.setEncoding('utf8');
      child.stderr.setEncoding('utf8');

      child.stdout.on('data', (chunk: string) => {
        stdout += chunk;
        if (options?.onProgress) {
          SubprocessExecutor.parseProgress(chunk, options.onProgress);
        }
      });

      child.stderr.on('data', (chunk: string) => {
        stderr += chunk;
        if (options?.onProgress) {
          SubprocessExecutor.parseProgress(chunk, options.onProgress);
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        reject(err);
      });

      child.on('close', (exitCode) => {
        clearTimeout(timer);
        if (killed) return;
        if (exitCode === 0) {
          resolve({ stdout, stderr, exitCode: exitCode ?? 0 });
        } else {
          logger.warn(`Subprocess exited with code ${exitCode}`, 'EXECUTOR', { cmd, exitCode, stderr: stderr.slice(-300) });
          reject(new Error(`Process exited with code ${exitCode}: ${stderr.slice(-300)}`));
        }
      });
    });
  }

  /**
   * Parses progress updates from standard yt-dlp output.
   */
  private static parseProgress(output: string, callback: ProgressCallback) {
    // Example: [download]  45.2% of  12.34MiB at  2.45MiB/s ETA 00:03
    const match = output.match(/\[download\]\s+([\d.]+)%\s+of\s+~?([^\s]+)\s+at\s+([^\s]+)\s+ETA\s+([^\s]+)/);
    if (match) {
      const percent = parseFloat(match[1]);
      const speed = match[3];
      const eta = match[4];
      if (!isNaN(percent)) {
        callback({ percent, speed, eta });
      }
    }
  }

  /**
   * Executes the media extractor with strict arguments and safe JSON parsing.
   */
  public static async extractJson(url: string, extraArgs: string[] = []): Promise<Record<string, unknown>> {
    const { cmd, baseArgs } = await SubprocessExecutor.getExtractorCommand();

    const args = [
      ...baseArgs,
      '--dump-single-json',
      '--no-warnings',
      '--no-playlist',
      '--no-check-certificates',
      '--socket-timeout',
      '20',
      ...extraArgs,
      url,
    ];

    logger.debug(`Extracting metadata via ${cmd}`, 'EXECUTOR');
    const result = await SubprocessExecutor.runRaw(cmd, args, {
      timeout: config.security.requestTimeoutMs,
    });

    try {
      return JSON.parse(result.stdout) as Record<string, unknown>;
    } catch {
      throw new Error('Failed to parse extractor JSON output.');
    }
  }
}
