// Orchestrator. Run with:
//   node pipeline.js --tier1            # operator-curated feeds only (cheap, daily)
//   node pipeline.js --tier2            # web research only (paid, weekly)
//   node pipeline.js --tier1 --tier2    # both
//   node pipeline.js --dry-run          # validate + dedupe + log, do NOT publish
//
// Logs append to events_pipeline.log next to this file.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { runTier1 } from './tier1_feeds.js';
import { runTier2 } from './tier2_research.js';
import { validate } from './validator.js';
import { dedupe } from './deduper.js';
import { publish } from './publisher.js';
import { log } from './lib/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

function parseArgs(argv) {
  const flags = new Set(argv.slice(2));
  return {
    tier1: flags.has('--tier1'),
    tier2: flags.has('--tier2'),
    dryRun: flags.has('--dry-run'),
    // If neither --tier1 nor --tier2 specified, run both.
    runBoth: !flags.has('--tier1') && !flags.has('--tier2'),
  };
}

async function main() {
  const args = parseArgs(process.argv);
  const runT1 = args.runBoth || args.tier1;
  const runT2 = args.runBoth || args.tier2;

  log.info('pipeline: start', { runT1, runT2, dryRun: args.dryRun });

  const tier1Events = runT1 ? await runTier1() : [];
  const tier2Events = runT2 ? await runTier2() : [];

  const combined = [...tier1Events, ...tier2Events];
  log.info('pipeline: collected', {
    tier1: tier1Events.length, tier2: tier2Events.length, combined: combined.length,
  });

  const validated = validate(combined);
  const deduped = dedupe(validated);

  if (args.dryRun) {
    log.info('pipeline: dry-run — skipping publish', { wouldPublish: deduped.length });
    console.log(JSON.stringify(deduped, null, 2));
    return;
  }

  const result = await publish(deduped);
  log.info('pipeline: end', result);
}

main().catch((err) => {
  log.error('pipeline: fatal', { err: String(err && err.stack || err) });
  process.exit(1);
});
