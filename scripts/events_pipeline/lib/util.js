// Shared helpers for the events pipeline.

export const FL_CITIES = new Set([
  // The 60 largest FL cities + every county seat. Lowercase.
  'jacksonville', 'miami', 'tampa', 'orlando', 'st petersburg', 'saint petersburg',
  'hialeah', 'port st lucie', 'port saint lucie', 'cape coral', 'tallahassee',
  'fort lauderdale', 'pembroke pines', 'hollywood', 'gainesville', 'miramar',
  'coral springs', 'lehigh acres', 'palm bay', 'west palm beach', 'clearwater',
  'brandon', 'spring hill', 'lakeland', 'pompano beach', 'davie', 'miami gardens',
  'sunrise', 'boca raton', 'deltona', 'plantation', 'palm coast', 'fort myers',
  'largo', 'melbourne', 'deerfield beach', 'boynton beach', 'lauderhill',
  'weston', 'fort pierce', 'kissimmee', 'homestead', 'tamarac', 'delray beach',
  'daytona beach', 'wellington', 'north port', 'jupiter', 'north miami',
  'palm beach gardens', 'st cloud', 'saint cloud', 'doral', 'sarasota',
  'pensacola', 'bradenton', 'pinellas park', 'coconut creek', 'sanford',
  'margate', 'ocala', 'apopka', 'bonita springs', 'sebastian', 'titusville',
  'kendall', 'fountainbleau', 'university', 'the villages', 'aventura',
  'naples', 'estero', 'venice', 'punta gorda', 'key west', 'marathon',
  'panama city', 'panama city beach', 'destin', 'fort walton beach',
  'crestview', 'navarre', 'milton', 'gulf breeze', 'lake city', 'live oak',
  'perry', 'monticello', 'quincy', 'marianna', 'chipley', 'bonifay',
  'bunnell', 'palatka', 'green cove springs', 'macclenny', 'starke',
  'lake butler', 'gainesville', 'bronson', 'chiefland', 'trenton', 'cross city',
  'mayo', 'jasper', 'madison', 'inverness', 'crystal river', 'brooksville',
  'dade city', 'new port richey', 'tarpon springs', 'plant city', 'wesley chapel',
  'riverview', 'bartow', 'winter haven', 'haines city', 'lake wales', 'sebring',
  'avon park', 'wauchula', 'arcadia', 'okeechobee', 'lake placid', 'clewiston',
  'belle glade', 'pahokee', 'immokalee', 'labelle', 'fort meade', 'fort denaud',
  'cocoa', 'rockledge', 'merritt island', 'satellite beach', 'cape canaveral',
  'palm bay', 'vero beach', 'stuart', 'hobe sound', 'tequesta',
  'winter park', 'altamonte springs', 'casselberry', 'maitland', 'oviedo',
  'longwood', 'lake mary', 'debary', 'orange city', 'deland', 'new smyrna beach',
  'edgewater', 'ormond beach', 'port orange', 'flagler beach', 'st augustine',
  'saint augustine', 'ponte vedra beach', 'jacksonville beach', 'atlantic beach',
  'neptune beach', 'orange park', 'fleming island', 'middleburg', 'lake city',
  'fernandina beach', 'amelia island', 'yulee', 'callahan', 'hilliard',
  'leesburg', 'eustis', 'mount dora', 'tavares', 'clermont', 'minneola',
  'groveland', 'mascotte', 'umatilla', 'bushnell', 'wildwood', 'sumterville',
  'tampa palms', 'town n country', 'carrollwood', 'westchase', 'apollo beach',
  'ruskin', 'gibsonton', 'sun city center', 'parrish', 'palmetto', 'ellenton',
  'anna maria', 'bradenton beach', 'longboat key', 'siesta key', 'osprey',
  'nokomis', 'englewood', 'rotonda west', 'port charlotte', 'cape haze',
  'sanibel', 'captiva', 'pine island', 'matlacha', 'lehigh acres',
  'fort myers beach', 'marco island', 'golden gate',
]);

const FL_ABBR = /\b(fl|florida)\b/i;

export function looksLikeFlorida({ state, city, address, description, location }) {
  if (state && /^fl(orida)?$/i.test(state.trim())) return true;
  const haystacks = [city, address, description, location].filter(Boolean).map(String);
  for (const h of haystacks) {
    if (FL_ABBR.test(h)) return true;
    const lower = h.toLowerCase();
    for (const c of FL_CITIES) {
      // word-boundary match
      if (new RegExp(`(^|[^a-z])${c}([^a-z]|$)`, 'i').test(lower)) return true;
    }
  }
  return false;
}

export const AUTISM_KEYWORDS = [
  'autism', 'autistic', 'asd', 'aspergers', 'asperger',
  'neurodivergent', 'neurodiverse', 'neurodiversity',
  'sensory friendly', 'sensory-friendly', 'sensory inclusive', 'sensory-inclusive',
  'special needs', 'special-needs', 'developmental disabilit',
  'iep', 'aba ', ' aba', 'applied behavior analysis',
  'down syndrome', 'adhd', 'spd', 'sensory processing',
  'inclusion', 'inclusive recreation',
];

export function looksLikeAutism({ title, description, category }) {
  const hay = [title, description, category].filter(Boolean).join(' ').toLowerCase();
  return AUTISM_KEYWORDS.some((k) => hay.includes(k));
}

export function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

// Stable slug for upsert: title + ISO date + city. Two pipeline runs that find
// the same event must produce the same slug.
export function eventSlug({ title, date, city }) {
  return [slugify(title), date || '', slugify(city || 'fl')]
    .filter(Boolean)
    .join('-')
    .slice(0, 180);
}

export function normalizeTitle(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// YYYY-MM-DD in local time (events.date is a DATE, not timestamptz).
export function toIsoDate(d) {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function toTimeString(d) {
  if (!d) return null;
  const date = d instanceof Date ? d : new Date(d);
  if (isNaN(date.getTime())) return null;
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export function todayIso() {
  return toIsoDate(new Date());
}

export function clampText(s, n) {
  if (!s) return s;
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// HEAD a URL with a sane timeout. Returns true for 2xx/3xx.
export async function headOk(url, { timeoutMs = 8000 } = {}) {
  if (!url) return false;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
    if (res.status === 405 || res.status === 501) {
      // Some servers reject HEAD — fall back to a tiny GET.
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
    }
    return res.ok || (res.status >= 300 && res.status < 400);
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}
