import { spawn } from 'child_process';

console.log('Starting Next.js development server...');

const nextProcess = spawn('npx', ['next', 'dev', '--port', '5000', '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
});