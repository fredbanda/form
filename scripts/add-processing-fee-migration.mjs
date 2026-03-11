import { sql } from "../lib/db.ts";

async function runMigration() {
  try {
    console.log("Running migration to add processing fee column...");

    // Add processing fee column
    await sql`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS processing_fee INTEGER DEFAULT 0
    `;

    console.log("Added processing_fee column successfully");

    // Create index for processing fee
    await sql`CREATE INDEX IF NOT EXISTS idx_bookings_processing_fee ON bookings(processing_fee)`;

    console.log("Created index successfully");
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
