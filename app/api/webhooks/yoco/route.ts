import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyYocoWebhook } from "@/lib/yoco"
import { sendConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email"
import { generateWhatsAppLink } from "@/lib/whatsapp"
import { formatZAR } from "@/lib/pricing"

export async function POST(request: Request) {
  try {
    const rawBody = await request.text()

    // Get signature headers
    const webhookId = request.headers.get("webhook-id") || ""
    const webhookTimestamp = request.headers.get("webhook-timestamp") || ""
    const webhookSignature = request.headers.get("webhook-signature") || ""

    // Verify the webhook signature
    const isValid = verifyYocoWebhook(rawBody, webhookId, webhookTimestamp, webhookSignature)
    if (!isValid) {
      console.error("Invalid Yoco webhook signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    if (event.type === "payment.succeeded") {
      const checkoutId = event.payload?.metadata?.checkoutId || event.payload?.checkoutId
      const paymentId = event.payload?.paymentId || event.id

      if (!checkoutId) {
        console.error("No checkoutId in webhook payload")
        return NextResponse.json({ error: "Missing checkoutId" }, { status: 400 })
      }

      // Update booking payment status
      const result = await sql`
        UPDATE bookings
        SET payment_status = 'paid', yoco_payment_id = ${paymentId}, updated_at = NOW()
        WHERE yoco_checkout_id = ${checkoutId}
        RETURNING *
      `

      if (result.length > 0) {
        const booking = result[0]

        // Send confirmation emails (fire and forget)
        const emailData = {
          bookingId: booking.id,
          customerName: booking.customer_name,
          customerEmail: booking.customer_email,
          customerPhone: booking.customer_phone,
          serviceType: booking.service_type,
          pickupDate: booking.pickup_date,
          pickupTime: booking.pickup_time,
          extraPeople: booking.extra_people ?? 0,
          totalAmount: booking.total_amount,
          extras: booking.extras || [],
          specialRequests: booking.special_requests,
          promoCode: booking.promo_code,
        }

        sendConfirmationEmail(emailData).catch(console.error)
        sendAdminNotificationEmail(emailData).catch(console.error)

        // Send WhatsApp notification to owner
        const ownerPhone = process.env.OWNER_WHATSAPP_NUMBER // e.g., "27796552077"
        if (ownerPhone) {
          const serviceLabel = booking.service_type === "from_airport" 
            ? "Airport → Lodge" 
            : "Lodge → Airport"
          
          const whatsappMessage = `🚗 NEW BOOKING ALERT\n\n` +
            `📋 Ref: ${booking.id.slice(0, 8).toUpperCase()}\n` +
            `👤 Customer: ${booking.customer_name}\n` +
            `📱 Phone: ${booking.customer_phone}\n` +
            `🚌 Service: ${serviceLabel}\n` +
            `📅 Date: ${booking.pickup_date}\n` +
            `⏰ Time: ${booking.pickup_time}\n` +
            `👥 Passengers: ${(booking.extra_people ?? 0) + 1}\n` +
            `💰 Total: ${formatZAR(booking.total_amount)}\n\n` +
            `Click to contact customer: https://wa.me/${booking.customer_phone.replace(/\D/g, '')}`
          
          const ownerWhatsAppUrl = generateWhatsAppLink(ownerPhone, whatsappMessage)
          console.log(`Owner WhatsApp notification: ${ownerWhatsAppUrl}`)
        }
      }
    } else if (event.type === "payment.failed") {
      const checkoutId = event.payload?.metadata?.checkoutId || event.payload?.checkoutId

      if (checkoutId) {
        await sql`
          UPDATE bookings
          SET payment_status = 'failed', updated_at = NOW()
          WHERE yoco_checkout_id = ${checkoutId}
        `
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
