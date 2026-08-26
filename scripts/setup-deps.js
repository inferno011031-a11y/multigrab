const { execSync } = require('child_process');

if (process.platform === 'linux') {
  try {
    execSync('pip3 install --break-system-packages --no-cache-dir yt-dlp imageio-ffmpeg', { stdio: 'inherit' });
  } catch {
    try {
      execSync('pip install --no-cache-dir yt-dlp imageio-ffmpeg', { stdio: 'inherit' });
    } catch {}
  }
}
