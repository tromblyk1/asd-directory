// Cleans stale hashed bundles from the Hostinger web root.
// Compares remote /assets and /images (recursively) against local dist/ and
// deletes remote files that no longer exist locally.
//
// Usage:
//   node clean.mjs           → list-only (dry run, default)
//   node clean.mjs --delete  → actually delete stale files
import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DIST = path.resolve(__dirname, '../src/frontend/dist');
const DELETE = process.argv.includes('--delete');

const required = ['SFTP_HOST', 'SFTP_PORT', 'SFTP_USER', 'SFTP_PASS', 'REMOTE_PATH'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\nMissing required env vars: ${missing.join(', ')}\n`);
  process.exit(1);
}

if (!fs.existsSync(LOCAL_DIST)) {
  console.error(`\nNo build found at ${LOCAL_DIST}\nRun \`npm run build\` in src/frontend/ first.\n`);
  process.exit(1);
}

// Recursively list files (relative paths, POSIX style) under a local dir.
function walkLocal(dir, base = dir, out = new Set()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkLocal(full, base, out);
    } else {
      out.add(path.relative(base, full).split(path.sep).join('/'));
    }
  }
  return out;
}

async function walkRemote(sftp, root, subdir = '', out = []) {
  const remoteDir = subdir ? `${root}/${subdir}` : root;
  let items;
  try {
    items = await sftp.list(remoteDir);
  } catch {
    return out;
  }
  for (const item of items) {
    const rel = subdir ? `${subdir}/${item.name}` : item.name;
    if (item.type === 'd') {
      await walkRemote(sftp, root, rel, out);
    } else {
      out.push(rel);
    }
  }
  return out;
}

const sftp = new SftpClient();

async function main() {
  const remoteRoot = process.env.REMOTE_PATH.replace(/\/$/, '');

  console.log(`\n→ Connecting to ${process.env.SFTP_HOST}:${process.env.SFTP_PORT}...`);
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT, 10),
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    readyTimeout: 20000,
  });
  console.log(`✓ Connected.\n`);

  const local = walkLocal(LOCAL_DIST);
  console.log(`Local dist/ contains ${local.size} files.`);

  // Only clean subtrees the deploy pipeline manages.
  const subtrees = ['assets', 'images', 'data'];
  const staleByTree = {};
  for (const tree of subtrees) {
    const remoteFiles = await walkRemote(sftp, `${remoteRoot}/${tree}`);
    const stale = remoteFiles.filter((rel) => !local.has(`${tree}/${rel}`));
    staleByTree[tree] = stale;
    console.log(`  ${tree}/: ${remoteFiles.length} remote, ${stale.length} stale`);
  }

  const totalStale = Object.values(staleByTree).reduce((n, arr) => n + arr.length, 0);
  console.log(`\nTotal stale files: ${totalStale}\n`);

  if (totalStale === 0) {
    console.log(`Nothing to clean.\n`);
    await sftp.end();
    return;
  }

  for (const [tree, files] of Object.entries(staleByTree)) {
    if (files.length === 0) continue;
    console.log(`--- ${tree}/ (${files.length}) ---`);
    for (const f of files) console.log(`  ${f}`);
    console.log();
  }

  if (!DELETE) {
    console.log(`Dry run only. Re-run with --delete to remove these files.\n`);
    await sftp.end();
    return;
  }

  console.log(`Deleting ${totalStale} files...\n`);
  let deleted = 0;
  for (const [tree, files] of Object.entries(staleByTree)) {
    for (const f of files) {
      const remotePath = `${remoteRoot}/${tree}/${f}`;
      try {
        await sftp.delete(remotePath);
        deleted++;
        console.log(`  ✓ ${tree}/${f}`);
      } catch (e) {
        console.log(`  ✗ ${tree}/${f} — ${e.message}`);
      }
    }
  }
  console.log(`\n✓ Done. ${deleted}/${totalStale} files deleted.\n`);

  await sftp.end();
}

main().catch(async (err) => {
  console.error(`\n✗ Clean failed: ${err.message}\n`);
  try { await sftp.end(); } catch {}
  process.exit(1);
});
