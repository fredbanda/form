// Test if we can access the success page with a real booking ID
import { sql } from "@/lib/db";

async function testSuccessPage() {
  try {
    // Get the most recent booking
    const result = await sql`SELECT id FROM bookings ORDER BY created_at DESC LIMIT 1`;
    
    if (result.length > 0) {
      const bookingId = result[0].id;
      console.log("Latest booking ID:", bookingId);
      console.log("Test success page URL:", `http://localhost:3000/booking-confirmed?id=${bookingId}`);
    } else {
      console.log("No bookings found in database");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

testSuccessPage();