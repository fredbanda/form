export interface Extra {
  id: string
  name: string
  price: number // in ZAR cents (0 = free)
}

// Time-based pricing in cents
export const BASE_PRICE_DAY = 12000 // R120 for first person (06:00 - 18:00)
export const BASE_PRICE_NIGHT = 12000 // R120 for first person (18:00 - 06:00)
export const LATE_NIGHT_SURCHARGE = 10000 // R100 extra for night (18:00 - 06:00)
export const EXTRA_PERSON_PRICE = 6000 // R60 per additional person

export const EXTRAS: Extra[] = [
  { id: "baby-seat", name: "Baby Seat", price: 0 },
  { id: "bottled-water", name: "Bottled water", price: 1500 },
]

export const VAT_RATE = 0.15

export function formatZAR(cents: number): string {
  return `ZAR ${(cents / 100).toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function isNightTime(pickupTime: string): boolean {
  if (!pickupTime) return false
  const [hours] = pickupTime.split(":").map(Number)
  // Night is 18:00 - 05:59 (6pm to 6am)
  return hours >= 18 || hours < 6
}

export function calculatePricing(
  pickupTime: string,
  extraPeople: number,
  selectedExtras: Extra[]
) {
  const isNight = isNightTime(pickupTime)
  
  // Base price for first person
  let subtotal = BASE_PRICE_DAY
  
  // Add late night surcharge if applicable
  if (isNight) {
    subtotal += LATE_NIGHT_SURCHARGE
  }
  
  // Add extra people
  subtotal += extraPeople * EXTRA_PERSON_PRICE

  // Add extras
  for (const extra of selectedExtras) {
    subtotal += extra.price
  }

  // VAT is 0 for now as shown in the screenshot, but we keep the calculation ready
  const vatAmount = 0
  const total = subtotal + vatAmount

  return {
    basePrice: BASE_PRICE_DAY,
    lateNightSurcharge: isNight ? LATE_NIGHT_SURCHARGE : 0,
    extraPeopleTotal: extraPeople * EXTRA_PERSON_PRICE,
    subtotal,
    vatAmount,
    total,
    isNight,
  }
}
