import fs from 'fs';
import path from 'path';

const src = path.resolve('frontend/dist');
const dest = path.resolve('dist');

if (fs.existsSync(src)) {
  fs.cpSync(src, dest, { recursive: true, force: true });
  console.log('✓ Build artifacts ready in ./dist and ./frontend/dist for Vercel deployment.');
} else {
  console.error('Build output frontend/dist not found.');
  process.exit(1);
}
