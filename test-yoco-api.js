// Test Yoco API key directly
async function testYocoAPI() {
  const YOCO_SECRET_KEY = "sk_test_960bfde0VBrLlpK098e4ffeb53e1";
  
  try {
    console.log("Testing Yoco API with key:", YOCO_SECRET_KEY);
    
    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: 10000, // R100.00 in cents
        currency: "ZAR",
        successUrl: "http://localhost:3000/success",
        cancelUrl: "http://localhost:3000/cancel",
        failureUrl: "http://localhost:3000/failure",
        metadata: {
          test: "true"
        },
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log("Response body:", responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log("✅ SUCCESS - Checkout created:", data.id);
      console.log("Redirect URL:", data.redirectUrl);
    } else {
      console.log("❌ FAILED - API Error");
      console.log("Error details:", responseText);
    }
    
  } catch (error) {
    console.error("❌ NETWORK ERROR:", error);
  }
}

testYocoAPI();