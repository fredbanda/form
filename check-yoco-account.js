// Test Yoco account status
async function checkYocoAccount() {
  const YOCO_SECRET_KEY = "sk_test_960bfde0VBrLlpK098e4ffeb53e1";
  
  try {
    // Test 1: Check if we can create a checkout
    console.log("=== Testing Yoco Account Status ===");
    
    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${YOCO_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: 5000, // R50.00
        currency: "ZAR",
        successUrl: "https://executivesa.vercel.app/success",
        cancelUrl: "https://executivesa.vercel.app/cancel",
        failureUrl: "https://executivesa.vercel.app/failure",
        metadata: { test: "account-check" },
      }),
    });

    const data = await response.json();
    
    console.log("Checkout creation response:", {
      status: response.status,
      id: data.id,
      redirectUrl: data.redirectUrl,
      processingMode: data.processingMode,
      merchantId: data.merchantId
    });
    
    if (data.processingMode !== "test") {
      console.log("⚠️  WARNING: Not in test mode!");
    }
    
    if (data.merchantId === "thrive-docs-uuid") {
      console.log("⚠️  WARNING: Using demo merchant ID - this might be the issue!");
      console.log("You may need to:");
      console.log("1. Complete Yoco account setup");
      console.log("2. Verify your business details");
      console.log("3. Get a proper merchant ID");
    }
    
    // Test 2: Try to access the checkout URL immediately
    if (data.redirectUrl) {
      console.log("\n=== Testing Checkout URL Access ===");
      
      const checkoutResponse = await fetch(data.redirectUrl, {
        method: "GET",
        redirect: "manual" // Don't follow redirects
      });
      
      console.log("Checkout URL status:", checkoutResponse.status);
      console.log("Checkout URL headers:", Object.fromEntries(checkoutResponse.headers.entries()));
    }
    
  } catch (error) {
    console.error("Error:", error);
  }
}




checkYocoAccount();