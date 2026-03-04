// Run with: node --env-file=.env scripts/run-migrate.mjs
import { neon } from "@neondatabase/serverless"

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set.")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function runMigration() {
  console.log("🚀 Running migration against Neon DB...\n")

  try {
    // 1. Add pickup_time column
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pickup_time TEXT`
    console.log("✅ Added column: pickup_time")

    // 2. Add extra_people column
    await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS extra_people INTEGER NOT NULL DEFAULT 0`
    console.log("✅ Added column: extra_people")

    // 3. Drop NOT NULL from legacy columns
    await sql`ALTER TABLE bookings ALTER COLUMN pickup_address DROP NOT NULL`
    console.log("✅ Dropped NOT NULL: pickup_address")

    await sql`ALTER TABLE bookings ALTER COLUMN destination_address DROP NOT NULL`
    console.log("✅ Dropped NOT NULL: destination_address")

    await sql`ALTER TABLE bookings ALTER COLUMN passengers DROP NOT NULL`
    console.log("✅ Dropped NOT NULL: passengers")

    await sql`ALTER TABLE bookings ALTER COLUMN bags DROP NOT NULL`
    console.log("✅ Dropped NOT NULL: bags")

    await sql`ALTER TABLE bookings ALTER COLUMN meet_on_arrival DROP NOT NULL`
    console.log("✅ Dropped NOT NULL: meet_on_arrival")

    await sql`ALTER TABLE bookings ALTER COLUMN vehicle_type DROP NOT NULL`
    console.log("✅ Dropped NOT NULL: vehicle_type")

    await sql`ALTER TABLE bookings ALTER COLUMN vehicle_price DROP NOT NULL`
    console.log("✅ Dropped NOT NULL: vehicle_price")

    console.log("\n✅ Migration completed successfully!")
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message)
    process.exit(1)
  }
}

runMigration()
