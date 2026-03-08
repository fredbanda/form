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
      // Use validated amounts from frontend
      subtotal,
      vatAmount,
      totalAmount,
      // Additional fields for proper booking record
      flightNumber,
      arrivalDate,
      arrivalTime,
      numberOfPassengers,
      requireNextMorningTransfer,
      nextMorningTransferTime,
      nextMorningPassengers,
      roomNumber,
      transferTime,
      transferPassengers,
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
      !customerEmail ||
      typeof totalAmount !== 'number' ||
      totalAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields or invalid amount" },
        { status: 400 }
      );
    }

    // Use validated amounts from frontend instead of recalculating
    const extras: Extra[] = selectedExtras || [];
    console.log("[DEBUG] Using validated amounts from frontend:", {
      subtotal,
      vatAmount,
      totalAmount
    });

    // Create booking in database with all fields
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
        payment_status,
        flight_number,
        arrival_date,
        arrival_time,
        number_of_passengers,
        require_next_morning_transfer,
        next_morning_transfer_time,
        next_morning_passengers,
        room_number,
        transfer_time,
        transfer_passengers
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
        ${subtotal},
        ${vatAmount},
        ${totalAmount},
        ${promoCode || null},
        'pending',
        ${flightNumber || null},
        ${arrivalDate || null},
        ${arrivalTime || null},
        ${numberOfPassengers || null},
        ${requireNextMorningTransfer || false},
        ${nextMorningTransferTime || null},
        ${nextMorningPassengers || null},
        ${roomNumber || null},
        ${transferTime || null},
        ${transferPassengers || null}
      )
      RETURNING id
    `;

    const bookingId = result[0].id;

    // Create Yoco checkout with validated amount from frontend
    console.log("[DEBUG] Creating Yoco checkout with validated amount:", {
      amountInCents: totalAmount,
      bookingId,
      customerEmail,
      customerName,
    });

    const checkout = await createYocoCheckout({
      amountInCents: totalAmount,
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

