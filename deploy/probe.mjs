// One-off probe: list candidate remote paths to find where the live web root actually is.
// Usage: node probe.mjs
import 'dotenv/config';
import SftpClient from 'ssh2-sftp-client';

const sftp = new SftpClient();

async function listPath(path) {
  console.log(`\n=== ${path} ===`);
  try {
    const items = await sftp.list(path);
    if (items.length === 0) {
      console.log('  (empty)');
      return;
    }
    for (const item of items) {
      const kind = item.type === 'd' ? 'DIR ' : 'FILE';
      const mtime = new Date(item.modifyTime).toISOString().slice(0, 10);
      console.log(`  ${kind} ${item.name.padEnd(40)} ${mtime}`);
    }
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
  }
}

async function main() {
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: parseInt(process.env.SFTP_PORT, 10),
    username: process.env.SFTP_USER,
    password: process.env.SFTP_PASS,
    readyTimeout: 20000,
  });
  console.log(`Connected. Probing common Hostinger paths...`);

  await listPath('.');
  await listPath('/');

  const user = process.env.SFTP_USER;
  await listPath(`/home/${user}/domains/floridaautismservices.com/public_html`);
  await listPath(`/home/${user}/domains/floridaautismservices.com/public_html/assets`);

  await sftp.end();
}

main().catch(async (err) => {
  console.error(`\nProbe failed: ${err.message}`);
  try { await sftp.end(); } catch {}
  process.exit(1);
});
