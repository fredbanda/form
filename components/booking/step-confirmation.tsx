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
  calculateDualTransferPricing,
  formatZAR,
} from "@/lib/pricing";
import { serviceTypeLabels } from "@/lib/validators";
import type { BookingState } from "@/lib/booking-store";
import { toast } from "sonner";
import Image from "next/image";
import Canvas from "@/assets/capet.jpg";
import ExecutiveLogo from "@/assets/logo-main.jpg";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
}

export function StepConfirmation({ state, update }: Props) {
  const [loading, setLoading] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  // Check if this is a dual transfer (Airport → Lodge + Lodge → Airport next morning)
  const isDualTransfer =
    state.serviceType === "from_airport" &&
    state.requireNextMorningTransfer &&
    state.nextMorningTransferTime &&
    state.nextMorningTransferTime.trim().length > 0 &&
    state.nextMorningPassengers > 0;

  let pricing, dualPricing;

  if (isDualTransfer) {
    // Calculate dual transfer pricing
    dualPricing = calculateDualTransferPricing(
      state.arrivalTime,
      state.numberOfPassengers,
      state.nextMorningTransferTime,
      state.nextMorningPassengers,
      state.selectedExtras
    );

    // If dual pricing calculation failed, fall back to single pricing
    if (!dualPricing) {
      pricing = calculatePricing(
        state.arrivalTime,
        state.numberOfPassengers,
        state.selectedExtras
      );
    } else {
      pricing = null; // We'll use dualPricing instead
    }
  } else {
    // Calculate single transfer pricing
    pricing = calculatePricing(
      state.serviceType === "from_airport"
        ? state.arrivalTime
        : state.transferTime || "00:00",
      state.serviceType === "from_airport"
        ? state.numberOfPassengers
        : state.transferPassengers || 1,
      state.selectedExtras
    );
    dualPricing = null;
  }

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
          pickupDate:
            state.serviceType === "from_airport"
              ? state.arrivalDate
              : state.pickupDate,
          pickupTime:
            state.serviceType === "from_airport"
              ? state.arrivalTime
              : state.transferTime,
          extraPeople: state.extraPeople,
          extras: state.selectedExtras,
          specialRequests: state.specialRequests || null,
          customerName: state.customerName,
          customerPhone: state.customerPhone,
          customerAltPhone: state.customerAltPhone || null,
          customerEmail: state.customerEmail,
          promoCode: state.promoCode || null,
          // Airport to Lodge specific fields
          flightNumber: state.flightNumber || null,
          arrivalDate: state.arrivalDate || null,
          arrivalTime: state.arrivalTime || null,
          numberOfPassengers: state.numberOfPassengers,
          requireNextMorningTransfer: state.requireNextMorningTransfer,
          nextMorningTransferTime: state.nextMorningTransferTime || null,
          nextMorningPassengers: state.nextMorningPassengers,
          // Lodge to Airport specific fields
          roomNumber: state.roomNumber || null,
          transferTime: state.transferTime || null,
          transferPassengers: state.transferPassengers,
          subtotal: dualPricing
            ? dualPricing.combinedSubtotal
            : pricing?.subtotal,
          vatAmount: dualPricing ? dualPricing.vatAmount : pricing?.vatAmount,
          totalAmount: dualPricing ? dualPricing.total : pricing?.total,
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
  <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl">
    
    {/* Background Image */}
    <Image
      src={Canvas}
      alt="Table Mountain"
      fill
      priority
      className="object-cover"
    />

    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/30" />

    {/* Logo in bottom-left corner */}
    <div className="absolute bottom-4 left-4 z-10">
      <Image
        src={ExecutiveLogo}
        alt="Executive Tours"
        width={80}
        height={40}
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
          {pricing?.category === "night" ? (
            <Moon className="h-4 w-4 text-purple-600" />
          ) : pricing?.category === "late-night" ? (
            <Moon className="h-4 w-4 text-red-600" />
          ) : pricing?.category === "evening" ? (
            <Moon className="h-4 w-4 text-blue-600" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-600" />
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {state.serviceType
              ? serviceTypeLabels[state.serviceType].title
              : ""}
          </span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {pricing?.category === "night" && "Night rate"}
            {pricing?.category === "late-night" && "Late night"}
            {pricing?.category === "evening" && "Evening rate"}
            {pricing?.category === "day" && "Day rate"}
          </span>
        </div>

        {/* Date & Time */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {state.serviceType === "from_airport" && state.arrivalDate
                ? new Date(state.arrivalDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : state.serviceType === "from_lodge" && state.pickupDate
                ? new Date(state.pickupDate).toLocaleDateString("en-GB", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : formattedDate}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {state.serviceType === "from_airport"
                ? state.arrivalTime
                : state.transferTime}
            </span>
            {pricing?.category !== "day" && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {pricing?.category === "night" && "Night rate"}
                {pricing?.category === "late-night" && "Late night"}
                {pricing?.category === "evening" && "Evening rate"}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {state.serviceType === "from_airport"
                ? `${state.numberOfPassengers} ${
                    state.numberOfPassengers === 1 ? "passenger" : "passengers"
                  }`
                : state.serviceType === "from_lodge"
                ? `${state.transferPassengers} ${
                    state.transferPassengers === 1 ? "passenger" : "passengers"
                  }`
                : `${totalPeople} ${totalPeople === 1 ? "person" : "people"}`}
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
      {(state.serviceType === "from_airport" ||
        state.serviceType === "from_lodge") && (
        <div className="mt-3 rounded-xl border border-border bg-card p-5">
          <h3 className="mb-3 text-sm font-medium text-foreground">
            Transfer Details
          </h3>
          <div className="flex flex-col gap-2">
            {state.serviceType === "from_airport" && (
              <>
                {state.flightNumber && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">
                      Flight:
                    </span>
                    <span className="text-sm text-foreground">
                      {state.flightNumber}
                    </span>
                  </div>
                )}
                {state.arrivalTime && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">
                      Arrival time:
                    </span>
                    <span className="text-sm text-foreground">
                      {state.arrivalTime}
                    </span>
                  </div>
                )}
                {state.arrivalDate && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">
                      Arrival date:
                    </span>
                    <span className="text-sm text-foreground">
                      {new Date(state.arrivalDate).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">
                    Passengers:
                  </span>
                  <span className="text-sm text-foreground">
                    {state.numberOfPassengers}
                  </span>
                </div>
                {state.requireNextMorningTransfer && (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">
                        Next morning:
                      </span>
                      <span className="text-sm text-foreground">
                        Transfer required
                      </span>
                    </div>
                    {state.nextMorningTransferTime && (
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-20">
                          Morning time:
                        </span>
                        <span className="text-sm text-foreground">
                          {state.nextMorningTransferTime}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-20">
                        Morning passengers:
                      </span>
                      <span className="text-sm text-foreground">
                        {state.nextMorningPassengers}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
            {state.serviceType === "from_lodge" && (
              <>
                {state.roomNumber && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">
                      Room:
                    </span>
                    <span className="text-sm text-foreground">
                      {state.roomNumber}
                    </span>
                  </div>
                )}
                {state.transferTime && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">
                      Transfer time:
                    </span>
                    <span className="text-sm text-foreground">
                      {state.transferTime}
                    </span>
                  </div>
                )}
                {state.pickupDate && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">
                      Transfer date:
                    </span>
                    <span className="text-sm text-foreground">
                      {new Date(state.pickupDate).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">
                    Passengers:
                  </span>
                  <span className="text-sm text-foreground">
                    {state.transferPassengers}
                  </span>
                </div>
              </>
            )}
          </div>
          {state.serviceType === "from_lodge" && (
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <p className="text-sm text-blue-800 font-medium">
                <strong>NB:</strong> Please meet the driver at the reception at
                the time you requested your transfer.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold text-foreground">Summary</h2>

        <div className="flex flex-col gap-2.5">
          {/* Dual Transfer Pricing Display */}
          {isDualTransfer && dualPricing ? (
            <>
              {/* First Transfer: Airport → Lodge */}
              <div className="rounded-lg border border-blue-500 bg-blue-50 p-3">
                <h4 className="font-medium text-blue-800 mb-2">
                  {dualPricing.firstTransfer.description}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">
                    {state.numberOfPassengers} passengers
                  </span>
                  <span className="text-sm font-medium text-blue-800">
                    {formatZAR(dualPricing.firstTransfer.subtotal)}
                  </span>
                </div>
              </div>

              {/* Second Transfer: Lodge → Airport */}
              <div className="rounded-lg border border-green-500 bg-green-50 p-3">
                <h4 className="font-medium text-green-800 mb-2">
                  {dualPricing.secondTransfer.description}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-700">
                    {state.nextMorningPassengers} passengers
                  </span>
                  <span className="text-sm font-medium text-green-800">
                    {formatZAR(dualPricing.secondTransfer.subtotal)}
                  </span>
                </div>
              </div>

              {/* Extras for dual transfer */}
              {state.selectedExtras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-foreground">{extra.name}</span>
                  <span className="text-sm text-foreground">
                    {extra.price === 0 ? "Free" : formatZAR(extra.price)}
                  </span>
                </div>
              ))}
            </>
          ) : (
            <>
              {/* Single Transfer Pricing Display */}
              {/* Base price */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {pricing?.category === "night"
                    ? "Base rate (17:00-22:00)"
                    : "First passenger"}
                </span>
                <span className="text-sm text-foreground">
                  {formatZAR(pricing?.basePrice || 0)}
                </span>
              </div>

              {/* Additional passengers */}
              {pricing && pricing.extraPeopleTotal > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Additional passengers (
                    {Math.max(
                      0,
                      (state.serviceType === "from_airport"
                        ? state.numberOfPassengers
                        : state.transferPassengers) - 1
                    )}{" "}
                    × {formatZAR(pricing.additionalPersonPrice)})
                  </span>
                  <span className="text-sm text-foreground">
                    {formatZAR(pricing.extraPeopleTotal)}
                  </span>
                </div>
              )}

              {/* Late night surcharge */}
              {pricing && pricing.lateNightSurcharge > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    Late night surcharge (After 22:00)
                  </span>
                  <span className="text-sm text-foreground">
                    {formatZAR(pricing.lateNightSurcharge)}
                  </span>
                </div>
              )}

              {/* Extras */}
              {state.selectedExtras.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-foreground">{extra.name}</span>
                  <span className="text-sm text-foreground">
                    {extra.price === 0 ? "Free" : formatZAR(extra.price)}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        <Separator className="my-4" />

        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Subtotal</span>
          <span className="text-sm text-foreground">
            {formatZAR(
              dualPricing
                ? dualPricing.combinedSubtotal
                : pricing?.subtotal || 0
            )}
          </span>
        </div>

        {/* VAT */}
        <div className="mt-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            VAT (15%)
            <Info className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm text-muted-foreground">
            {formatZAR(
              dualPricing ? dualPricing.vatAmount : pricing?.vatAmount || 0
            )}
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
            {formatZAR(dualPricing ? dualPricing.total : pricing?.total || 0)}
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

