import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DIST = path.resolve(__dirname, '../src/frontend/dist');

const required = ['SFTP_HOST', 'SFTP_PORT', 'SFTP_USER', 'SFTP_PASS', 'REMOTE_PATH'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\nMissing required env vars: ${missing.join(', ')}`);
  console.error(`Fill them in deploy/.env — see deploy/.env.example for the template.\n`);
  process.exit(1);
}

if (!fs.existsSync(LOCAL_DIST) || !fs.existsSync(path.join(LOCAL_DIST, 'index.html'))) {
  console.error(`\nNo build found at ${LOCAL_DIST}`);
  console.error(`Run \`npm run build\` in src/frontend/ first.\n`);
  process.exit(1);
}

const sftp = new SftpClient();
let uploadCount = 0;

async function main() {
  const host = process.env.SFTP_HOST;
  const port = parseInt(process.env.SFTP_PORT, 10);
  const remotePath = process.env.REMOTE_PATH;

  console.log(`\n→ Connecting to ${host}:${port} as ${process.env.SFTP_USER}...`);

  await sftp.connect({
    host,
    port,
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    readyTimeout: 20000,
  });

  console.log(`✓ Connected.\n`);
  console.log(`→ Uploading ${LOCAL_DIST}`);
  console.log(`         → ${remotePath}`);
  console.log(`  (only overwrites — does NOT delete remote files)\n`);

  sftp.on('upload', (info) => {
    uploadCount++;
    const rel = info.source.replace(LOCAL_DIST + path.sep, '').replace(/\\/g, '/');
    console.log(`  ✓ ${rel}`);
  });

  await sftp.uploadDir(LOCAL_DIST, remotePath);

  console.log(`\n✓ Done. ${uploadCount} files uploaded.\n`);
  await sftp.end();
}

main().catch(async (err) => {
  console.error(`\n✗ Deploy failed: ${err.message}\n`);
  try {
    await sftp.end();
  } catch {}
  process.exit(1);
});
