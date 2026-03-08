-- Update all pending bookings to paid status
-- This is a one-time migration since all bookings are actually paid

UPDATE bookings 
SET payment_status = 'paid', updated_at = NOW() 
WHERE payment_status = 'pending';

-- Show the count of updated records
SELECT COUNT(*) as updated_bookings_count FROM bookings WHERE payment_status = 'paid';