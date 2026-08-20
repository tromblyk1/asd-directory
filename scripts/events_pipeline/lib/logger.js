import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_PATH = path.resolve(__dirname, '..', 'events_pipeline.log');

function stamp() {
  return new Date().toISOString();
}

function write(level, msg, extra) {
  const line = `[${stamp()}] [${level}] ${msg}` + (extra ? ` ${JSON.stringify(extra)}` : '') + '\n';
  // Best-effort: never let logging crash the pipeline.
  try { fs.appendFileSync(LOG_PATH, line); } catch {}
  const out = level === 'ERROR' ? process.stderr : process.stdout;
  out.write(line);
}

export const log = {
  info: (msg, extra) => write('INFO', msg, extra),
  warn: (msg, extra) => write('WARN', msg, extra),
  error: (msg, extra) => write('ERROR', msg, extra),
  path: LOG_PATH,
};
