"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  User,
  Phone,
  Mail,
  Info,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  calculatePricing,
  formatZAR,
  BASE_PRICE_DAY,
  LATE_NIGHT_SURCHARGE,
  EXTRA_PERSON_PRICE,
} from "@/lib/pricing";
import { serviceTypeLabels } from "@/lib/validators";
import type { BookingState } from "@/lib/booking-store";
import { toast } from "sonner";
import Image from "next/image"
import Canvas from "@/assets/capet.jpg"
import ExecutiveLogo from "@/assets/logo-main.jpg";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
}

export function StepConfirmation({ state, update }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  const pricing = calculatePricing(
    state.pickupHour && state.pickupMinute ? `${state.pickupHour}:${state.pickupMinute}` : "00:00",
    state.extraPeople,
    state.selectedExtras
  );

  const formattedDate = state.pickupDate
    ? new Date(state.pickupDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleConfirmAndPay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: state.serviceType,
          pickupDate: `${state.pickupDate}T${state.pickupHour}:${state.pickupMinute || "00"}`,
          pickupTime: `${state.pickupHour}:${state.pickupMinute}`,
          extraPeople: state.extraPeople,
          extras: state.selectedExtras,
          specialRequests: state.specialRequests || null,
          customerName: state.customerName,
          customerPhone: state.customerPhone,
          customerAltPhone: state.customerAltPhone || null,
          customerEmail: state.customerEmail,
          promoCode: state.promoCode || null,
          // Service-specific fields
          flightNumber: state.flightNumber || null,
          arrivalDate: state.arrivalDate || null,
          numberOfPassengers: state.numberOfPassengers,
          requireNextMorningTransfer: state.requireNextMorningTransfer,
          roomNumber: state.roomNumber || null,
          subtotal: pricing.subtotal,
          vatAmount: pricing.vatAmount,
          totalAmount: pricing.total,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create booking");
      }

      const data = await res.json();
      console.log("[DEBUG] API Response:", data);

      if (data.checkoutUrl) {
        console.log("[DEBUG] Redirecting to checkout:", data.checkoutUrl);
        window.location.href = data.checkoutUrl;
      } else {
        console.error("[DEBUG] No checkoutUrl in response:", data);
        throw new Error(
          "Payment page unavailable. Please try again or contact support."
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const totalPeople = 1 + state.extraPeople;

  return (
    <div className="flex flex-col">
      {/* Image Header */}
      <div className="relative w-full h-40 sm:h-48 mb-6 overflow-hidden rounded-2xl">
        <Image
          src={Canvas}
          alt="Table Mountain"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Logo in top-left corner */}
                <div className="absolute top-4 left-4 z-10 ">
                  <Image
                    src={ExecutiveLogo}
                    alt="Executive Tours"
                    width={120}
                    height={60}
                    className="object-contain rounded-full"
                  />
                </div>
      </div>

      <h1 className="mb-6 text-2xl font-semibold text-foreground text-balance">
        Confirm your booking
      </h1>

      {/* Trip Details Card */}
      <div className="rounded-xl border border-border bg-card p-5">
        {/* Service Type */}
        <div className="mb-4 flex items-center justify-center gap-2">
          {pricing.isNight ? (
            <Moon className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {state.serviceType
              ? serviceTypeLabels[state.serviceType].title
              : ""}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{state.pickupHour}:{state.pickupMinute}</span>
            {pricing.isNight && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Night rate
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {totalPeople} {totalPeople === 1 ? "person" : "people"}
            </span>
          </div>
        </div>
      </div>

      {/* Customer details card */}
      <div className="mt-3 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {state.customerName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {state.customerPhone}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {state.customerEmail}
            </span>
          </div>
        </div>
      </div>

      {/* Service-specific details */}
      {(state.serviceType === "from_airport" || state.serviceType === "from_lodge") && (
        <div className="mt-3 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-medium text-foreground">Additional Details</h3>
          <div className="flex flex-col gap-2">
            {state.serviceType === "from_airport" && (
              <>
                {state.flightNumber && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">Flight:</span>
                    <span className="text-sm text-foreground">{state.flightNumber}</span>
                  </div>
                )}
                {state.arrivalDate && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">Arrival:</span>
                    <span className="text-sm text-foreground">
                      {new Date(state.arrivalDate).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">Passengers:</span>
                  <span className="text-sm text-foreground">{state.numberOfPassengers}</span>
                </div>
                {state.requireNextMorningTransfer && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">Next morning:</span>
                    <span className="text-sm text-foreground">Transfer required</span>
                  </div>
                )}
              </>
            )}
            {state.serviceType === "from_lodge" && (
              <>
                {state.roomNumber && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">Room:</span>
                    <span className="text-sm text-foreground">{state.roomNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">Passengers:</span>
                  <span className="text-sm text-foreground">{state.numberOfPassengers}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Summary</h2>

        <div className="flex flex-col gap-2.5">
          {/* Base price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">First person</span>
            <span className="text-sm text-foreground">
              {formatZAR(BASE_PRICE_DAY)}
            </span>
          </div>

          {/* Late night surcharge */}
          {pricing.isNight && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                Late night charge (18:00-06:00)
              </span>
              <span className="text-sm text-foreground">
                {formatZAR(LATE_NIGHT_SURCHARGE)}
              </span>
            </div>
          )}

          {/* Extra people */}
          {state.extraPeople > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">
                Extra people ({state.extraPeople} x{" "}
                {formatZAR(EXTRA_PERSON_PRICE)})
              </span>
              <span className="text-sm text-foreground">
                {formatZAR(pricing.extraPeopleTotal)}
              </span>
            </div>
          )}

          {/* Extras */}
          {state.selectedExtras.map((extra) => (
            <div key={extra.id} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{extra.name}</span>
              <span className="text-sm text-foreground">
                {extra.price === 0 ? "Free" : formatZAR(extra.price)}
              </span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Subtotal</span>
          <span className="text-sm text-foreground">
            {formatZAR(pricing.subtotal)}
          </span>
        </div>

        {/* VAT */}
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            VAT (15%)
            <Info className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm text-muted-foreground">
            {formatZAR(pricing.vatAmount)}
          </span>
        </div>

        {/* Promo code */}
        {showPromo ? (
          <div className="mt-3">
            <Input
              placeholder="Enter promo code"
              value={state.promoCode}
              onChange={(e) => update({ promoCode: e.target.value })}
              className="h-10 rounded-lg"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPromo(true)}
            className="mt-3 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            Add promo code
          </button>
        )}

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">Total</span>
          <span className="text-xl font-bold text-foreground">
            {formatZAR(pricing.total)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => update({ step: state.step - 1 })}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Button
          onClick={handleConfirmAndPay}
          disabled={loading}
          className="h-12 flex-1 rounded-lg text-base font-semibold"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </Button>
      </div>
    </div>
  );
}


