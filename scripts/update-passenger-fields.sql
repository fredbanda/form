-- Update database schema to consolidate passenger fields
-- This script renames existing passenger-related columns to use a unified structure

-- Add new total_passengers column
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_passengers INTEGER DEFAULT 1;

-- Copy data from existing columns
UPDATE bookings SET total_passengers = COALESCE(number_of_passengers, transfer_passengers, 1);

-- Update extra_people to be calculated based on total_passengers
UPDATE bookings SET extra_people = GREATEST(0, total_passengers - 1);

-- Drop old columns (uncomment when ready)
-- ALTER TABLE bookings DROP COLUMN IF EXISTS number_of_passengers;
-- ALTER TABLE bookings DROP COLUMN IF EXISTS transfer_passengers;

-- Add constraint to ensure total_passengers is at least 1
ALTER TABLE bookings ADD CONSTRAINT check_total_passengers_positive 
  CHECK (total_passengers >= 1);