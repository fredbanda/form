import type { Extra } from "./pricing";
import type { ServiceType } from "./validators";

export interface BookingState {
  step: number;
  serviceType: ServiceType | null;
  pickupDate: string;
  pickupHour: string;
  pickupMinute: string;
  totalPassengers: number; // Main passenger count for all services
  extraPeople: number; // Additional people beyond first person
  selectedExtras: Extra[];
  specialRequests: string;
  customerName: string;
  customerPhone: string;
  customerAltPhone: string;
  customerEmail: string;
  promoCode: string;
  // Airport to Lodge specific fields
  flightNumber: string;
  arrivalDate: string;
  arrivalTime: string;
  requireNextMorningTransfer: boolean;
  nextMorningTransferTime: string;
  nextMorningPassengers: number;
  // Lodge to Airport specific fields
  roomNumber: string;
  transferTime: string;
}

export const initialBookingState: BookingState = {
  step: 0,
  serviceType: null,
  pickupDate: "",
  pickupHour: "",
  pickupMinute: "",
  totalPassengers: 1,
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
  arrivalTime: "",
  requireNextMorningTransfer: false,
  nextMorningTransferTime: "",
  nextMorningPassengers: 1,
  // Lodge to Airport specific fields
  roomNumber: "",
  transferTime: "",
};

export const STEP_TITLES = [
  "Choose Service",
  "Extras",
  "Your details",
  "Confirm your booking",
];

