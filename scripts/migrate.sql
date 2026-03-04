-- Migration: Align bookings table with actual application data model
-- Run this against your Neon DB to fix the schema mismatch

-- 1. Add missing columns that the app actually uses
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pickup_time TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS extra_people INTEGER NOT NULL DEFAULT 0;

-- 2. Make old columns nullable (they are not collected by the current form)
ALTER TABLE bookings ALTER COLUMN pickup_address DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN destination_address DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN passengers DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN bags DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN meet_on_arrival DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN vehicle_type DROP NOT NULL;
ALTER TABLE bookings ALTER COLUMN vehicle_price DROP NOT NULL;
