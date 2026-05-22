# ASD-Directory Deploy

Standalone script that uploads `src/frontend/dist/` to Hostinger via SFTP.

## One-time setup

1. **Install the SFTP library:**
   ```
   cd deploy
   npm install
   ```

2. **Create your `.env`:**
   ```
   cp .env.example .env
   ```

3. **Fill in `.env`** with your Hostinger SFTP credentials. See comments in `.env.example` for where to find each value in the Hostinger hPanel.

## To deploy

1. **Build the site** (from project root):
   ```
   cd src/frontend
   npm run build
   ```

2. **Run the deploy** (from this folder):
   ```
   cd deploy
   npm run deploy
   ```

## What it does

- Connects to your Hostinger SFTP server using the credentials in `.env`.
- Uploads every file from `src/frontend/dist/` to the `REMOTE_PATH` configured in `.env`.
- Preserves the directory structure (so `src/frontend/dist/assets/foo.js` lands at `REMOTE_PATH/assets/foo.js`).
- **Only overwrites — never deletes remote files.** Old hashed JS/CSS bundles will linger on the server. That's safe but consumes disk; clean them manually via Hostinger's File Manager if needed.

## When something seems off

If a deploy looks like it succeeded but the live site doesn't change, run:
```
npm run probe
```
This lists the candidate remote paths on Hostinger so you can confirm where files actually landed. Almost always the cause is that `REMOTE_PATH` is pointing at the legacy `/home/<user>/public_html/` instead of `/home/<user>/domains/floridaautismservices.com/public_html/` — see the trap warning in `.env.example`.

## Why it lives outside `src/frontend/`

The deploy credentials must never end up in the client bundle. Keeping the script and `.env` in a sibling folder (not inside the Vite project) makes that impossible by construction — Vite has no reason to read this folder.

## Security

- `.env` is gitignored.
- `node_modules/` is gitignored.
- Uses SFTP (encrypted) — not plain FTP.
