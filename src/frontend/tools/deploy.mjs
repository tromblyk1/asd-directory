import { Client } from "basic-ftp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Load .env
const envPath = resolve(root, ".env");
const envLines = readFileSync(envPath, "utf-8").split("\n");
const env = {};
for (const line of envLines) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
}

const REMOTE_BASE = "/public_html";
const LOCAL_DIST = resolve(root, "dist");

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    console.log("Connecting to FTP...");
    await client.access({
      host: env.FTP_HOST,
      port: parseInt(env.FTP_PORT) || 21,
      user: env.FTP_USER,
      password: env.FTP_PASS,
      secure: false,
    });
    console.log("Connected!\n");

    // 1. Clear remote assets directory
    console.log("Clearing remote assets...");
    try {
      await client.removeDir(`${REMOTE_BASE}/assets`);
      console.log("Removed old assets directory.");
    } catch {
      console.log("No existing assets directory to remove (or already empty).");
    }
    await client.ensureDir(`${REMOTE_BASE}/assets`);
    console.log("Created fresh assets directory.\n");

    // 2. Upload dist/assets/ to public_html/assets/
    console.log("Uploading new assets...");
    await client.cd("/"); // reset position
    await client.uploadFromDir(resolve(LOCAL_DIST, "assets"), `${REMOTE_BASE}/assets`);
    console.log("Assets uploaded!\n");

    // 3. Upload index.html
    console.log("Uploading index.html...");
    await client.uploadFrom(resolve(LOCAL_DIST, "index.html"), `${REMOTE_BASE}/index.html`);
    console.log("index.html uploaded!\n");

    console.log("Deploy complete!");
  } catch (err) {
    console.error("Deploy failed:", err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
