import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Detail routes are client-rendered, so a spinner-only pending state is a contentful-empty
// 200 if Googlebot's render window expires before Supabase resolves — Search Console files
// those as Soft 404. The name is already in the slug, so derive placeholder copy from it:
// drop the trailing row id and state, then collapse the city repeat that `<name>-<city>-fl-<id>`
// leaves behind. Returns '' for id-only routes, so callers must supply a fallback label.
export function humanizeDetailSlug(slug?: string | null): string {
  if (!slug) return ''
  const parts = slug.split('-').filter(Boolean)
  while (parts.length && /^\d+$/.test(parts[parts.length - 1])) parts.pop()
  if (parts.length > 1 && parts[parts.length - 1].toLowerCase() === 'fl') parts.pop()
  return parts
    .filter((part, i) => i === 0 || part.toLowerCase() !== parts[i - 1].toLowerCase())
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const DAY_MS = 86_400_000
const REVISION_MIN_GAP_DAYS = 14
const REVISION_MAX_AGE_DAYS = 90

// Every row's updated_at drifts a day or two past created_at from routine edits, so a bare
// inequality would badge everything. Requires a real revision gap, and recent enough to still
// mean something to a reader.
export function isRecentlyRevised(createdAt?: string | null, updatedAt?: string | null): boolean {
  if (!createdAt || !updatedAt) return false
  const created = new Date(createdAt).getTime()
  const updated = new Date(updatedAt).getTime()
  if (Number.isNaN(created) || Number.isNaN(updated)) return false
  return (
    updated - created >= REVISION_MIN_GAP_DAYS * DAY_MS &&
    Date.now() - updated <= REVISION_MAX_AGE_DAYS * DAY_MS
  )
}