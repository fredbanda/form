-- Add processing fee column to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS processing_fee INTEGER DEFAULT 0;

-- Add index for processing fee if needed for reporting
CREATE INDEX IF NOT EXISTS idx_bookings_processing_fee ON bookings(processing_fee);