// Test Yoco sandbox API
async function testYocoSandbox() {
  const YOCO_SECRET_KEY = "sk_test_960bfde0VBrLlpK098e4ffeb53e1";
  
  console.log("=== Testing Yoco Sandbox API ===");
  
  try {
    const response = await fetch("https://api.yocosandbox.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: 5000, // R50.00
        currency: "ZAR",
        successUrl: "http://localhost:3000/booking-confirmed?test=sandbox",
        cancelUrl: "http://localhost:3000",
        failureUrl: "http://localhost:3000/booking-failed?test=sandbox",
        metadata: {
          test: "sandbox-checkout"
        }
      }),
    });

    console.log("Response status:", response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ SUCCESS - Sandbox checkout created:");
      console.log("ID:", data.id);
      console.log("Redirect URL:", data.redirectUrl);
      console.log("Processing Mode:", data.processingMode);
      console.log("Merchant ID:", data.merchantId);
      
      // Test the checkout URL immediately
      if (data.redirectUrl) {
        console.log("\n=== Testing Sandbox Checkout URL ===");
        try {
          const checkoutTest = await fetch(data.redirectUrl, {
            method: "GET",
            redirect: "manual"
          });
          console.log("Checkout URL status:", checkoutTest.status);
          if (checkoutTest.status === 200) {
            console.log("✅ Checkout URL is accessible!");
          }
        } catch (e) {
          console.log("Checkout URL test error:", e.message);
        }
      }
      
    } else {
      const error = await response.text();
      console.log("❌ FAILED - Sandbox API Error:");
      console.log("Status:", response.status);
      console.log("Error:", error);
    }
    
  } catch (error) {
    console.error("❌ NETWORK ERROR:", error.message);
  }
}

testYocoSandbox();