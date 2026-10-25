const fs = require('fs');
const path = require('path');

// Next.js production server wrapper
// Load .env if present (Delcom deployment writes PORT & APP_PORT to .env)
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const port = process.env.PORT || process.env.APP_PORT || '3000';
process.argv = [process.argv[0], require.resolve('next/dist/bin/next'), 'start', '-p', String(port), '-H', '0.0.0.0'];
require('next/dist/bin/next');
