import type { Extra } from "./pricing"
import type { ServiceType } from "./validators"

export interface BookingState {
  step: number
  serviceType: ServiceType | null
  pickupDate: string
  pickupTime: string
  extraPeople: number
  selectedExtras: Extra[]
  specialRequests: string
  customerName: string
  customerPhone: string
  customerAltPhone: string
  customerEmail: string
  promoCode: string
}

export const initialBookingState: BookingState = {
  step: 0,
  serviceType: null,
  pickupDate: "",
  pickupTime: "",
  extraPeople: 0,
  selectedExtras: [],
  specialRequests: "",
  customerName: "",
  customerPhone: "",
  customerAltPhone: "",
  customerEmail: "",
  promoCode: "",
}

export const STEP_TITLES = [
  "Choose Service",
  "Extras",
  "Your details",
  "Confirm your booking",
]
