import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { calculatePricing, type Extra } from "@/lib/pricing";
import { createYocoCheckout } from "@/lib/yoco";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[DEBUG] Request body:", JSON.stringify(body, null, 2));

    const {
      serviceType,
      pickupDate,
      pickupTime,
      extraPeople,
      extras: selectedExtras,
      specialRequests,
      customerName,
      customerPhone,
      customerAltPhone,
      customerEmail,
      promoCode,
    } = body;

    console.log("[DEBUG] Parsed data:", {
      serviceType,
      pickupDate,
      pickupTime,
      extraPeople,
      selectedExtras,
      customerName,
      customerPhone,
      customerEmail,
    });

    // Validate required fields
    if (
      !serviceType ||
      !pickupDate ||
      !pickupTime ||
      !customerName ||
      !customerPhone ||
      !customerEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Calculate pricing
    const extras: Extra[] = selectedExtras || [];
    const pricing = calculatePricing(pickupTime, extraPeople || 0, extras);

    // Create booking in database
    const result = await sql`
      INSERT INTO bookings (
        service_type,
        pickup_date,
        pickup_time,
        extra_people,
        extras,
        special_requests,
        customer_name,
        customer_phone,
        customer_alt_phone,
        customer_email,
        subtotal,
        vat_amount,
        total_amount,
        promo_code,
        payment_status
      ) VALUES (
        ${serviceType},
        ${pickupDate},
        ${pickupTime},
        ${extraPeople || 0},
        ${JSON.stringify(extras)},
        ${specialRequests || null},
        ${customerName},
        ${customerPhone},
        ${customerAltPhone || null},
        ${customerEmail},
        ${pricing.subtotal},
        ${pricing.vatAmount},
        ${pricing.total},
        ${promoCode || null},
        'pending'
      )
      RETURNING id
    `;

    const bookingId = result[0].id;

    // Create Yoco checkout (simplified - no line items to avoid API issues)
    console.log("[DEBUG] Creating simplified Yoco checkout with:", {
      amountInCents: pricing.total,
      bookingId,
      customerEmail,
      customerName,
    });

    const checkout = await createYocoCheckout({
      amountInCents: pricing.total,
      bookingId,
      customerEmail,
      customerName,
    });

    console.log("[DEBUG] Yoco checkout created:", {
      id: checkout.id,
      redirectUrl: checkout.redirectUrl,
    });

    // Update booking with Yoco checkout ID
    await sql`
      UPDATE bookings
      SET yoco_checkout_id = ${checkout.id}, updated_at = NOW()
      WHERE id = ${bookingId}
    `;

    console.log("[DEBUG] Returning response:", {
      bookingId,
      checkoutUrl: checkout.redirectUrl,
    });

    return NextResponse.json({
      bookingId,
      checkoutUrl: checkout.redirectUrl,
    });
  } catch (error) {
    console.error("Booking creation error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Failed to create booking";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

