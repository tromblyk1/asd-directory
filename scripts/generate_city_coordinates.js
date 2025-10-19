const { createClient } = require('../src/frontend/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const zipcodes = require('../src/frontend/node_modules/zipcodes');

const envPath = path.resolve('src/frontend/.env.local');
const envLines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).filter(Boolean);
const env = Object.fromEntries(envLines.map((line) => {
  const idx = line.indexOf('=');
  if (idx === -1) return [line, ''];
  return [line.slice(0, idx), line.slice(idx + 1)];
}));

const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

(async () => {
  const pageSize = 1000;
  let pageStart = 0;
  const cityStats = new Map();

  while (true) {
    const { data, error } = await client
      .from('providers')
      .select('city, zip, latitude, longitude')
      .not('city', 'is', null)
      .range(pageStart, pageStart + pageSize - 1);

    if (error) {
      console.error('Failed to fetch providers:', error);
      process.exit(1);
    }

    if (!data || data.length === 0) {
      break;
    }

    data.forEach((row) => {
      const cityRaw = row.city;
      if (!cityRaw) {
        return;
      }
      const cityKey = cityRaw.trim().toLowerCase();
      let entry = cityStats.get(cityKey);
      if (!entry) {
        entry = { city: cityRaw.trim(), latSum: 0, lonSum: 0, count: 0 };
        cityStats.set(cityKey, entry);
      }

      let lat = typeof row.latitude === 'number' ? row.latitude : null;
      let lon = typeof row.longitude === 'number' ? row.longitude : null;

      if (lat == null || lon == null) {
        const zip = row.zip ? String(row.zip).replace(/[^0-9]/g, '').slice(0, 5) : '';
        if (zip.length === 5) {
          const lookup = zipcodes.lookup(zip);
          if (lookup && typeof lookup.latitude === 'number' && typeof lookup.longitude === 'number') {
            lat = lookup.latitude;
            lon = lookup.longitude;
          }
        }
      }

      if (lat != null && lon != null) {
        entry.latSum += lat;
        entry.lonSum += lon;
        entry.count += 1;
      }
    });

    if (data.length < pageSize) {
      break;
    }
    pageStart += pageSize;
  }

  const cityCoordinates = {};
  for (const [key, entry] of cityStats) {
    if (entry.count > 0) {
      cityCoordinates[entry.city] = {
        latitude: entry.latSum / entry.count,
        longitude: entry.lonSum / entry.count,
      };
    }
  }

  const outputPath = path.resolve('src/frontend/src/data/cityCoordinates.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(cityCoordinates, null, 2));
  console.log(`Wrote ${Object.keys(cityCoordinates).length} city coordinates to ${outputPath}`);
})();
