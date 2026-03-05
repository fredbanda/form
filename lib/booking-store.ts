import type { Extra } from "./pricing"
import type { ServiceType } from "./validators"

export interface BookingState {
  step: number
  serviceType: ServiceType | null
  pickupDate: string
  pickupHour: string
  pickupMinute: string
  extraPeople: number
  selectedExtras: Extra[]
  specialRequests: string
  customerName: string
  customerPhone: string
  customerAltPhone: string
  customerEmail: string
  promoCode: string
  // Airport to Lodge specific fields
  flightNumber: string
  arrivalDate: string
  numberOfPassengers: number
  requireNextMorningTransfer: boolean
  // Lodge to Airport specific fields
  roomNumber: string
}

export const initialBookingState: BookingState = {
  step: 0,
  serviceType: null,
  pickupDate: "",
  pickupHour: "",
  pickupMinute: "",
  extraPeople: 0,
  selectedExtras: [],
  specialRequests: "",
  customerName: "",
  customerPhone: "",
  customerAltPhone: "",
  customerEmail: "",
  promoCode: "",
  // Airport to Lodge specific fields
  flightNumber: "",
  arrivalDate: "",
  numberOfPassengers: 1,
  requireNextMorningTransfer: false,
  // Lodge to Airport specific fields
  roomNumber: "",
}

export const STEP_TITLES = [
  "Choose Service",
  "Extras",
  "Your details",
  "Confirm your booking",
]
