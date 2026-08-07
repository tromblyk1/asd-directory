import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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