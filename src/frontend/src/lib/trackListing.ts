import { supabase } from '@/lib/supabase';

const SESSION_KEY = 'fas_session';
const DEDUP_KEY = 'fas_session_tracked';
const DEDUPED_EVENTS = new Set(['impression', 'detail_view']);

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// Returns true if this event was already tracked this session; records it otherwise.
function alreadyTracked(key: string): boolean {
  const raw = sessionStorage.getItem(DEDUP_KEY);
  const seen: string[] = raw ? JSON.parse(raw) : [];
  if (seen.includes(key)) return true;
  seen.push(key);
  sessionStorage.setItem(DEDUP_KEY, JSON.stringify(seen));
  return false;
}

export function trackListingEvent(
  resourceId: string | number,
  eventType: string,
  source: string
): void {
  try {
    if (typeof navigator !== 'undefined' && navigator.webdriver) return;
    if (DEDUPED_EVENTS.has(eventType) && alreadyTracked(`${eventType}:${resourceId}`)) return;
    void supabase
      .from('listing_events')
      .insert({
        resource_id: Number(resourceId),
        event_type: eventType,
        source,
        session_id: getSessionId(),
      })
      .then(
        () => undefined,
        () => undefined
      );
  } catch {
    // Tracking must never break the UI.
  }
}

export function appendFeaturedUtm(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'floridaautismservices.com');
    u.searchParams.set('utm_medium', 'referral');
    u.searchParams.set('utm_campaign', 'featured-listing');
    return u.toString();
  } catch {
    return url;
  }
}
