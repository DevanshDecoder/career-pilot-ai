const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- CareerPilot AI Monorepo Build ---');
const frontendDir = path.join(__dirname, 'frontend');
const rootDist = path.join(__dirname, 'dist');
const frontendDist = path.join(frontendDir, 'dist');

try {
  console.log('1. Installing frontend dependencies in ./frontend...');
  execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

  console.log('2. Running frontend production build (vite build)...');
  execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

  console.log('3. Mirroring ./frontend/dist to root ./dist...');
  if (fs.existsSync(rootDist)) {
    fs.rmSync(rootDist, { recursive: true, force: true });
  }
  fs.cpSync(frontendDist, rootDist, { recursive: true });

  console.log('Build complete! Both ./frontend/dist and ./dist are ready.');
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}
