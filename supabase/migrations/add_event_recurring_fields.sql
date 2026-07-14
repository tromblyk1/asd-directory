-- Add recurring-program support to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS recurrence_pattern text;
