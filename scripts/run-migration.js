const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function runMigration() {
  try {
    console.log('Running migration to add transfer booking fields...');
    
    // Add missing columns for transfer booking details
    await sql`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS arrival_date TEXT,
      ADD COLUMN IF NOT EXISTS arrival_time TEXT,
      ADD COLUMN IF NOT EXISTS number_of_passengers INTEGER,
      ADD COLUMN IF NOT EXISTS require_next_morning_transfer BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS next_morning_transfer_time TEXT,
      ADD COLUMN IF NOT EXISTS next_morning_passengers INTEGER,
      ADD COLUMN IF NOT EXISTS room_number TEXT,
      ADD COLUMN IF NOT EXISTS transfer_time TEXT,
      ADD COLUMN IF NOT EXISTS transfer_passengers INTEGER
    `;
    
    console.log('Added new columns successfully');
    
    // Create indexes for commonly queried fields
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_arrival_date ON bookings(arrival_date)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_service_type ON bookings(service_type)`;
    
    console.log('Created indexes successfully');
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();