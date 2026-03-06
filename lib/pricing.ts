export interface Extra {
  id: string;
  name: string;
  price: number; // in ZAR cents (0 = free)
}

// Time-based pricing in cents
export const PRICING_EVENING_BASE = 16000; // R160 for first person (17:01 - 06:00)
export const PRICING_EVENING_ADDITIONAL = 6000; // R60 for additional person (17:01 - 06:00)

export const PRICING_NIGHT_BASE = 25000; // R250 per person (17:00 - 22:00)
export const PRICING_NIGHT_ADDITIONAL = 5000; // R50 for additional person (17:00 - 22:00)

export const LATE_NIGHT_SURCHARGE = 15000; // R150 extra after 22:00
export const VAT_RATE = 0.15;

export function formatZAR(cents: number): string {
  return `ZAR ${(cents / 100).toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getTimeCategory(
  pickupTime: string
): "day" | "evening" | "night" | "late-night" {
  if (!pickupTime) return "evening";
  const [hours, minutes] = pickupTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  // Day: 06:00 - 17:00 (360 - 1020 minutes)
  if (totalMinutes >= 360 && totalMinutes <= 1020) {
    return "day";
  }

  // Night: 17:00 - 22:00 (1020 - 1320 minutes)
  if (totalMinutes > 1020 && totalMinutes <= 1320) {
    return "night";
  }

  // Late night: 22:01 - 05:59 (after 1320 minutes or before 360 minutes)
  if (totalMinutes > 1320 || totalMinutes < 360) {
    return "late-night";
  }

  // Evening: 17:01 - 16:59 (next day) - This covers the overnight period with R160 base rate
  return "evening";
}

export function isNightTime(pickupTime: string): boolean {
  const category = getTimeCategory(pickupTime);
  return category === "night" || category === "late-night";
}

export function isBookingAvailable(pickupTime: string): boolean {
  const category = getTimeCategory(pickupTime);
  // Booking not available during day hours (06:00 - 17:00) - users must WhatsApp
  return category !== "day";
}

export function calculatePricing(
  pickupTime: string,
  totalPassengers: number,
  selectedExtras: Extra[]
) {
  const category = getTimeCategory(pickupTime);
  let subtotal = 0;
  let basePrice = 0;
  let additionalPersonPrice = 0;
  let lateNightSurcharge = 0;

  if (category === "day") {
    // Day booking - should direct to WhatsApp
    return {
      basePrice: 0,
      additionalPersonPrice: 0,
      lateNightSurcharge: 0,
      extraPeopleTotal: 0,
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      category,
      bookingAvailable: false,
    };
  }

  if (category === "evening" || category === "late-night") {
    // 17:01 - 06:00: R160 first person, R60 additional
    basePrice = PRICING_EVENING_BASE;
    additionalPersonPrice = PRICING_EVENING_ADDITIONAL;
    subtotal =
      basePrice + Math.max(0, totalPassengers - 1) * additionalPersonPrice;

    // Add late night surcharge after 22:00
    if (category === "late-night") {
      lateNightSurcharge = LATE_NIGHT_SURCHARGE;
      subtotal += lateNightSurcharge;
    }
  } else if (category === "night") {
    // 17:00 - 22:00: R250 per person, R50 additional
    basePrice = PRICING_NIGHT_BASE;
    additionalPersonPrice = PRICING_NIGHT_ADDITIONAL;
    subtotal =
      basePrice + Math.max(0, totalPassengers - 1) * additionalPersonPrice;
  }

  // Add extras
  let extrasTotal = 0;
  for (const extra of selectedExtras) {
    extrasTotal += extra.price;
    subtotal += extra.price;
  }

  // VAT is 0 for now as shown in the screenshot, but we keep the calculation ready
  const vatAmount = 0;
  const total = subtotal + vatAmount;

  return {
    basePrice,
    additionalPersonPrice,
    lateNightSurcharge,
    extraPeopleTotal: Math.max(0, totalPassengers - 1) * additionalPersonPrice,
    extrasTotal,
    subtotal,
    vatAmount,
    total,
    category,
    bookingAvailable: true,
  };
}

// New function for calculating dual transfer pricing (Airport → Lodge + Lodge → Airport)
export function calculateDualTransferPricing(
  arrivalTime: string,
  arrivalPassengers: number,
  nextMorningTime: string,
  nextMorningPassengers: number,
  selectedExtras: Extra[]
): any | null {
  // Validate inputs
  if (
    !arrivalTime ||
    !nextMorningTime ||
    arrivalPassengers < 1 ||
    nextMorningPassengers < 1
  ) {
    return null;
  }

  // Calculate first transfer: Airport → Lodge
  const firstTransfer = calculatePricing(arrivalTime, arrivalPassengers, []);

  // Calculate second transfer: Lodge → Airport
  const secondTransfer = calculatePricing(
    nextMorningTime,
    nextMorningPassengers,
    []
  );

  // Add extras only once to the total
  let extrasTotal = 0;
  for (const extra of selectedExtras) {
    extrasTotal += extra.price;
  }

  const combinedSubtotal =
    firstTransfer.subtotal + secondTransfer.subtotal + extrasTotal;
  const vatAmount = 0; // VAT is 0 for now
  const total = combinedSubtotal + vatAmount;

  return {
    firstTransfer: {
      ...firstTransfer,
      description: `Airport → Lodge (${arrivalTime})`,
    },
    secondTransfer: {
      ...secondTransfer,
      description: `Lodge → Airport (${nextMorningTime})`,
    },
    extrasTotal,
    combinedSubtotal,
    vatAmount,
    total,
    bothBookingsAvailable:
      firstTransfer.bookingAvailable && secondTransfer.bookingAvailable,
  };
}

