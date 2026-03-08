"use client";

import { Plus, Minus, Users, User, Moon, Sun } from "lucide-react";
import {
  formatZAR,
  calculatePricing,
  calculateDualTransferPricing,
  calculateLodgeToAirportPricing,
  getTimeCategory,
  type Extra,
} from "@/lib/pricing";
import { Textarea } from "@/components/ui/textarea";
import type { BookingState } from "@/lib/booking-store";
import Image from "next/image";
import Carpet from "@/assets/capet.jpg";
import ExecutiveLogo from "@/assets/logo-main.jpg";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
}

export function StepExtras({ state, update }: Props) {
  const toggleExtra = (extra: Extra) => {
    const isSelected = state.selectedExtras.some((e) => e.id === extra.id);
    if (isSelected) {
      update({
        selectedExtras: state.selectedExtras.filter((e) => e.id !== extra.id),
      });
    } else {
      update({
        selectedExtras: [...state.selectedExtras, extra],
      });
    }
  };

  const incrementPeople = () => {
    const newTotalPassengers = state.totalPassengers + 1;
    update({
      totalPassengers: newTotalPassengers,
      extraPeople: newTotalPassengers - 1,
    });
  };

  const decrementPeople = () => {
    if (state.totalPassengers > 1) {
      const newTotalPassengers = state.totalPassengers - 1;
      update({
        totalPassengers: newTotalPassengers,
        extraPeople: newTotalPassengers - 1,
      });
    }
  };

  // Get the relevant time and calculate pricing
  const relevantTime =
    state.serviceType === "from_airport"
      ? state.arrivalTime
      : state.transferTime || "00:00";

  const totalPassengers = state.totalPassengers;

  // Check if this is a dual transfer (Airport → Lodge + Lodge → Airport next morning)
  const isDualTransfer =
    state.serviceType === "from_airport" &&
    state.requireNextMorningTransfer &&
    state.nextMorningTransferTime &&
    state.nextMorningTransferTime.trim().length > 0 &&
    state.nextMorningPassengers > 0;

  let pricing, dualPricing, timeCategory;

  if (isDualTransfer) {
    // Calculate dual transfer pricing
    dualPricing = calculateDualTransferPricing(
      state.arrivalTime,
      totalPassengers,
      state.nextMorningTransferTime,
      state.nextMorningPassengers,
      state.selectedExtras
    );

    // If dual pricing calculation failed, fall back to single pricing
    if (!dualPricing) {
      if (state.serviceType === "from_lodge") {
        pricing = calculateLodgeToAirportPricing(
          totalPassengers,
          state.selectedExtras
        );
      } else {
        pricing = calculatePricing(
          relevantTime,
          totalPassengers,
          state.selectedExtras
        );
      }
      timeCategory = getTimeCategory(relevantTime);
    } else {
      pricing = null; // We'll use dualPricing instead
      timeCategory = null;
    }
  } else {
    // Calculate single transfer pricing
    if (state.serviceType === "from_lodge") {
      pricing = calculateLodgeToAirportPricing(
        totalPassengers,
        state.selectedExtras
      );
      timeCategory = "evening"; // Always evening rate for lodge to airport
    } else {
      pricing = calculatePricing(
        relevantTime,
        totalPassengers,
        state.selectedExtras
      );
      timeCategory = getTimeCategory(relevantTime);
    }
    dualPricing = null;
  }

  return (
    <div className="flex flex-col">
      {/* Image Header */}
      <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl">
        {/* Background Image */}
        <Image
          src={Carpet}
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

      <div className="flex flex-col gap-6">
        {/* Passenger Selection Section */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Number of Passengers
          </h2>

          <div className="flex items-center justify-between rounded-xl border-2 border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  Total Passengers
                </p>
                <p className="text-sm text-muted-foreground">
                  Including yourself
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrementPeople}
                disabled={state.totalPassengers === 1}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove person"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-lg font-semibold text-foreground">
                {state.totalPassengers}
              </span>
              <button
                type="button"
                onClick={incrementPeople}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
                aria-label="Add person"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown Section */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Pricing
          </h2>

          <div className="flex flex-col gap-3">
            {/* Dual Transfer Pricing Display */}
            {isDualTransfer && dualPricing ? (
              <>
                {/* First Transfer: Airport → Lodge */}
                <div className="rounded-xl border-2 border-blue-500 bg-blue-50 p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    {dualPricing.firstTransfer.description}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
                        <User className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          {totalPassengers} passengers
                        </p>
                        <p className="text-xs text-blue-600">
                          {dualPricing.firstTransfer.category === "evening" &&
                            "Evening rate"}
                          {dualPricing.firstTransfer.category === "night" &&
                            "Night rate"}
                          {dualPricing.firstTransfer.category ===
                            "late-night" && "Late night"}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-blue-800">
                      {formatZAR(dualPricing.firstTransfer.subtotal)}
                    </p>
                  </div>
                </div>

                {/* Second Transfer: Lodge → Airport */}
                <div className="rounded-xl border-2 border-green-500 bg-green-50 p-4">
                  <h3 className="font-semibold text-green-800 mb-2">
                    {dualPricing.secondTransfer.description}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-500 text-white">
                        <User className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {state.nextMorningPassengers} passengers
                        </p>
                        <p className="text-xs text-green-600">
                          {dualPricing.secondTransfer.category === "evening" &&
                            "Evening rate"}
                          {dualPricing.secondTransfer.category === "night" &&
                            "Night rate"}
                          {dualPricing.secondTransfer.category ===
                            "late-night" && "Late night"}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-green-800">
                      {formatZAR(dualPricing.secondTransfer.subtotal)}
                    </p>
                  </div>
                </div>

                {/* Extras for dual transfer */}
                {dualPricing.extrasTotal > 0 && (
                  <div className="rounded-xl border-2 border-purple-500 bg-purple-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500 text-white">
                          <Plus className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium text-purple-800">
                            Extras
                          </p>
                          <p className="text-xs text-purple-600">
                            Additional services
                          </p>
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-purple-800">
                        {formatZAR(dualPricing.extrasTotal)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Total for dual transfer */}
                <div className="rounded-xl border-2 border-foreground bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                        <Users className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">
                          Total for Both Transfers
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Airport → Lodge + Lodge → Airport
                        </p>
                      </div>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {formatZAR(dualPricing.total)}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Single Transfer Pricing Display */}
                <div className="flex items-center justify-between rounded-xl border-2 border-foreground bg-card p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">
                        {timeCategory === "night"
                          ? "Base Rate (17:00-22:00)"
                          : "First Passenger"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {timeCategory === "evening" &&
                          "Evening rate (17:01-06:00)"}
                        {timeCategory === "night" && "Night rate (17:00-22:00)"}
                        {timeCategory === "late-night" && "Late night rate"}
                        {timeCategory === "day" &&
                          "Day rate (Contact for quote)"}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-foreground">
                    {formatZAR(pricing?.basePrice || 0)}
                  </p>
                </div>

                {/* Additional Passengers for single transfer */}
                {pricing && totalPassengers > 1 && (
                  <div className="flex items-center justify-between rounded-xl border-2 border-blue-500 bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
                        <Users className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">
                          Additional Passengers
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {totalPassengers - 1} ×{" "}
                          {formatZAR(pricing.additionalPersonPrice)}
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-blue-600">
                      {formatZAR(pricing.extraPeopleTotal)}
                    </p>
                  </div>
                )}

                {/* Late Night Surcharge for single transfer */}
                {pricing && pricing.lateNightSurcharge > 0 && (
                  <div className="flex items-center justify-between rounded-xl border-2 border-red-500 bg-red-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
                        <Moon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground">
                          Late Night Surcharge
                        </p>
                        <p className="text-sm text-muted-foreground">
                          After 22:00
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-red-600">
                      {formatZAR(pricing.lateNightSurcharge)}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

