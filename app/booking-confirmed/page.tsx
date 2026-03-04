import { sql } from "@/lib/db"
import { formatZAR } from "@/lib/pricing"
import { generateWhatsAppLink, generateCustomerWhatsAppMessage } from "@/lib/whatsapp"
import { BookingConfirmedClient } from "@/components/booking/booking-confirmed-client"

interface Props {
  searchParams: Promise<{ id?: string }>
}

export default async function BookingConfirmedPage({ searchParams }: Props) {
  const params = await searchParams
  const bookingId = params.id

  if (!bookingId) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-5">
        <div className="text-center">
          <p className="text-muted-foreground">Booking not found.</p>
        </div>
      </main>
    )
  }

  const result = await sql`SELECT * FROM bookings WHERE id = ${bookingId} LIMIT 1`
  const booking = result[0]

  if (!booking) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-5">
        <div className="text-center">
          <p className="text-muted-foreground">Booking not found.</p>
        </div>
      </main>
    )
  }

  const ref = booking.id.slice(0, 8).toUpperCase()
  const whatsappLink = generateWhatsAppLink(
    process.env.ADMIN_WHATSAPP_NUMBER || "27796553555",
    generateCustomerWhatsAppMessage(ref)
  )

  return (
    <BookingConfirmedClient
      ref_={ref}
      customerName={booking.customer_name}
      serviceType={booking.service_type}
      pickupDate={booking.pickup_date}
      pickupTime={booking.pickup_time}
      extraPeople={booking.extra_people}
      totalAmount={formatZAR(booking.total_amount)}
      whatsappLink={whatsappLink}
    />
  )
}
