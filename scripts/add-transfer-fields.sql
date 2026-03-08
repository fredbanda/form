-- Add missing columns for transfer booking details
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS arrival_date TEXT,
ADD COLUMN IF NOT EXISTS arrival_time TEXT,
ADD COLUMN IF NOT EXISTS number_of_passengers INTEGER,
ADD COLUMN IF NOT EXISTS require_next_morning_transfer BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS next_morning_transfer_time TEXT,
ADD COLUMN IF NOT EXISTS next_morning_passengers INTEGER,
ADD COLUMN IF NOT EXISTS room_number TEXT,
ADD COLUMN IF NOT EXISTS transfer_time TEXT,
ADD COLUMN IF NOT EXISTS transfer_passengers INTEGER;

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_bookings_arrival_date ON bookings(arrival_date);
CREATE INDEX IF NOT EXISTS idx_bookings_service_type ON bookings(service_type);