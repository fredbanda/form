CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL,
  pickup_date TEXT NOT NULL,
  pickup_time TEXT NOT NULL,
  extra_people INTEGER NOT NULL DEFAULT 0,
  extras JSONB DEFAULT '[]'::jsonb,
  special_requests TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_alt_phone TEXT,
  customer_email TEXT NOT NULL,
  subtotal INTEGER NOT NULL,
  vat_amount INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  promo_code TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  yoco_checkout_id TEXT,
  yoco_payment_id TEXT,
  -- Legacy columns (nullable, kept for backwards compatibility)
  pickup_address TEXT,
  pickup_lat DECIMAL,
  pickup_lng DECIMAL,
  destination_address TEXT,
  destination_lat DECIMAL,
  destination_lng DECIMAL,
  stop_address TEXT,
  passengers INTEGER,
  bags INTEGER,
  flight_number TEXT,
  meet_on_arrival BOOLEAN,
  vehicle_type TEXT,
  vehicle_price INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_yoco_checkout_id ON bookings(yoco_checkout_id);
