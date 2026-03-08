#!/usr/bin/env node

/**
 * Migration script to update all pending bookings to paid status
 * Since all bookings are actually paid, this ensures the admin dashboard shows correct status
 */

import { neon } from "@neondatabase/serverless";

// Use DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function updatePendingBookingsToPaid() {
  try {
    console.log("🔄 Starting migration: Update pending bookings to paid...");

    // First, check how many pending bookings exist
    const pendingCount = await sql`
      SELECT COUNT(*) as count FROM bookings WHERE payment_status = 'pending'
    `;

    console.log(`📊 Found ${pendingCount[0].count} pending bookings`);

    if (pendingCount[0].count === 0) {
      console.log("✅ No pending bookings to update");
      return;
    }

    // Update all pending bookings to paid
    const result = await sql`
      UPDATE bookings 
      SET payment_status = 'paid', updated_at = NOW() 
      WHERE payment_status = 'pending'
      RETURNING id, customer_name, created_at
    `;

    console.log(
      `✅ Successfully updated ${result.length} bookings to paid status:`
    );

    result.forEach((booking, index) => {
      console.log(
        `   ${index + 1}. Booking ${booking.id.slice(0, 8)} - ${
          booking.customer_name
        } (${new Date(booking.created_at).toLocaleDateString()})`
      );
    });

    // Verify the update
    const finalCount = await sql`
      SELECT COUNT(*) as count FROM bookings WHERE payment_status = 'paid'
    `;

    console.log(`\n📈 Total paid bookings: ${finalCount[0].count}`);
    console.log("🎉 Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run the migration
updatePendingBookingsToPaid()
  .then(() => {
    console.log("✨ Migration finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Migration error:", error);
    process.exit(1);
  });
