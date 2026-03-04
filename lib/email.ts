import { formatZAR } from "./pricing"

export interface BookingEmailData {
  bookingId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  pickupDate: string
  pickupTime: string
  extraPeople: number
  totalAmount: number
  extras: Array<{ name: string; price: number }>
  specialRequests?: string | null
  promoCode?: string | null
}

export async function sendConfirmationEmail(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set, skipping confirmation email")
    return
  }

  const extrasText =
    data.extras.length > 0
      ? data.extras.map((e) => `- ${e.name}: ${formatZAR(e.price)}`).join("<br/>")
      : "None"

  const serviceLabel =
    data.serviceType === "from_airport" ? "Transfer from Airport" : "Transfer from Lodge"

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Centurion Tours <bookings@centuriontours.co.za>",
      to: [data.customerEmail],
      subject: `Booking Confirmed - ${data.bookingId.slice(0, 8).toUpperCase()}`,
      html: `
        <h2>Your booking is confirmed!</h2>
        <p>Thank you, ${data.customerName}. Here are your booking details:</p>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:8px;font-weight:bold;">Ref</td><td style="padding:8px;">${data.bookingId.slice(0, 8).toUpperCase()}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Service</td><td style="padding:8px;">${serviceLabel}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Date</td><td style="padding:8px;">${data.pickupDate}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Time</td><td style="padding:8px;">${data.pickupTime}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Passengers</td><td style="padding:8px;">${data.extraPeople + 1} (incl. 1 base)</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Extras</td><td style="padding:8px;">${extrasText}</td></tr>
          ${data.specialRequests ? `<tr><td style="padding:8px;font-weight:bold;">Special Requests</td><td style="padding:8px;">${data.specialRequests}</td></tr>` : ""}
          <tr><td style="padding:8px;font-weight:bold;">Total</td><td style="padding:8px;font-size:18px;font-weight:bold;">${formatZAR(data.totalAmount)}</td></tr>
        </table>
        <p style="margin-top:24px;">A driver will be in contact with you before your pickup. If you have any questions, reply to this email or contact us on WhatsApp.</p>
        <p>Transport provided by <strong>Centurion Tours</strong></p>
      `,
    }),
  })
}

export async function sendAdminNotificationEmail(data: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
  if (!apiKey || !adminEmail) {
    console.warn("RESEND_API_KEY or ADMIN_NOTIFICATION_EMAIL not set, skipping admin email")
    return
  }

  const serviceLabel =
    data.serviceType === "from_airport" ? "Transfer from Airport" : "Transfer from Lodge"

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Centurion Tours Bookings <bookings@centuriontours.co.za>",
      to: [adminEmail],
      subject: `New Booking - ${data.customerName} - ${formatZAR(data.totalAmount)}`,
      html: `
        <h2>New Booking Received</h2>
        <table style="border-collapse:collapse;width:100%;">
          <tr><td style="padding:8px;font-weight:bold;">Ref</td><td style="padding:8px;">${data.bookingId.slice(0, 8).toUpperCase()}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Customer</td><td style="padding:8px;">${data.customerName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Phone</td><td style="padding:8px;">${data.customerPhone}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Email</td><td style="padding:8px;">${data.customerEmail}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Service</td><td style="padding:8px;">${serviceLabel}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Date</td><td style="padding:8px;">${data.pickupDate}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Time</td><td style="padding:8px;">${data.pickupTime}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;">Passengers</td><td style="padding:8px;">${data.extraPeople + 1} (incl. 1 base)</td></tr>
          ${data.specialRequests ? `<tr><td style="padding:8px;font-weight:bold;">Special Requests</td><td style="padding:8px;">${data.specialRequests}</td></tr>` : ""}
          <tr><td style="padding:8px;font-weight:bold;">Total</td><td style="padding:8px;font-size:18px;font-weight:bold;">${formatZAR(data.totalAmount)}</td></tr>
        </table>
      `,
    }),
  })
}
