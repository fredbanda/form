// Test different Yoco checkout approaches
async function testYocoCheckoutVariations() {
  const YOCO_SECRET_KEY = "sk_test_960bfde0VBrLlpK098e4ffeb53e1";
  
  console.log("=== Testing Yoco Checkout Variations ===");
  
  try {
    // Test 1: Minimal checkout payload
    console.log("\n1. Testing minimal checkout...");
    const response1 = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: 1000, // R10.00 - minimal amount
        currency: "ZAR"
      }),
    });
    
    const data1 = await response1.json();
    console.log("Minimal checkout:", {
      status: response1.status,
      id: data1.id,
      redirectUrl: data1.redirectUrl,
      error: data1.error
    });
    
    // Test 2: With required URLs
    console.log("\n2. Testing with URLs...");
    const response2 = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: 1000,
        currency: "ZAR",
        successUrl: "https://httpbin.org/get?success=true",
        cancelUrl: "https://httpbin.org/get?cancel=true",
        failureUrl: "https://httpbin.org/get?failure=true"
      }),
    });
    
    const data2 = await response2.json();
    console.log("With URLs:", {
      status: response2.status,
      id: data2.id,
      redirectUrl: data2.redirectUrl,
      error: data2.error
    });
    
    // Test 3: Check if we can access a known working Yoco demo
    console.log("\n3. Testing Yoco demo page access...");
    try {
      const demoResponse = await fetch("https://c.yoco.com/", {
        method: "GET",
        redirect: "manual"
      });
      console.log("Yoco demo site status:", demoResponse.status);
    } catch (e) {
      console.log("Yoco demo site error:", e.message);
    }
    
  } catch (error) {
    console.error("Test error:", error);
  }
}

testYocoCheckoutVariations();