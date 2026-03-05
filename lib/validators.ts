import { z } from "zod"

export const serviceTypes = [
  "from_airport",
  "from_lodge",
] as const

export type ServiceType = (typeof serviceTypes)[number]

export const serviceTypeLabels: Record<
  ServiceType,
  { title: string; description: string }
> = {
  from_airport: {
    title: "Pickup from Airport to Road Lodge",
    description:
      "Private transfer from the airport to the Road Lodge",
  },
  from_lodge: {
    title: "Pickup from Road Lodge to Airport",
    description:
      "Private transfer from Lodge to Airport",
  },
};

export const bookingSchema = z.object({
  serviceType: z.enum(serviceTypes),
  pickupDate: z.string().min(1, "Date is required"),
  pickupHour: z.string().min(1, "Hour is required"),
  pickupMinute: z.string().min(1, "Minute is required"),
  extraPeople: z.number().min(0).max(50),
  selectedExtras: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
    })
  ),
  specialRequests: z.string().optional(),
  customerName: z.string().min(1, "Full name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerAltPhone: z.string().optional(),
  customerEmail: z.string().email("Valid email is required"),
  promoCode: z.string().optional(),
  // Airport to Lodge specific fields
  flightNumber: z.string().optional(),
  arrivalDate: z.string().optional(),
  numberOfPassengers: z.number().optional(),
  requireNextMorningTransfer: z.boolean().optional(),
  // Lodge to Airport specific fields
  roomNumber: z.string().optional(),
})

export type BookingFormData = z.infer<typeof bookingSchema>

export const customerDetailsSchema = z.object({
  customerName: z.string().min(1, "Full name is required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  customerAltPhone: z.string().optional(),
  customerEmail: z.string().email("Valid email is required"),
})


