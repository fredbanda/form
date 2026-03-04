// Test the booking API endpoint
async function testBookingAPI() {
  try {
    const response = await fetch("http://localhost:3000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        serviceType: "from_airport", // Fixed: use valid service type
        pickupDate: "2024-03-10T10:00",
        pickupTime: "10:00",
        extraPeople: 1,
        extras: [
          {
            name: "Child Seat",
            price: 5000, // R50.00 in cents
            id: "child-seat",
          },
        ],
        specialRequests: "Test booking",
        customerName: "Test Customer",
        customerPhone: "+27123456789",
        customerAltPhone: "",
        customerEmail: "test@example.com",
        promoCode: "",
        subtotal: 10000, // These will be recalculated anyway
        vatAmount: 1500,
        totalAmount: 11500,
      }),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));

    if (data.checkoutUrl) {
      console.log("✅ SUCCESS: checkoutUrl received:", data.checkoutUrl);
    } else {
      console.log("❌ ERROR: No checkoutUrl in response");
    }
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testBookingAPI();
