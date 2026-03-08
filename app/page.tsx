"use client";

import { useState, useCallback } from "react";
import {
  BookingState,
  initialBookingState,
  STEP_TITLES,
} from "@/lib/booking-store";
import { StepServiceType } from "@/components/booking/step-service-type";
import { StepExtras } from "@/components/booking/step-extras";
import { StepCustomerDetails } from "@/components/booking/step-customer-details";
import { StepConfirmation } from "@/components/booking/step-confirmation";
import { BookingFooter } from "@/components/booking/booking-footer";

// Booking form with 4 steps: Service -> Extras -> Details -> Confirmation
export default function BookingPage() {
  const [state, setState] = useState<BookingState>(initialBookingState);

  const update = useCallback(
    (partial: Partial<BookingState>) =>
      setState((prev) => ({ ...prev, ...partial })),
    []
  );

  const goNext = useCallback(() => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => ({ ...prev, step: Math.max(0, prev.step - 1) }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const skipStep = useCallback(() => {
    // Skip current step (used for optional customer details step)
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const steps = [
    <StepServiceType
      key="service"
      state={state}
      update={update}
      onNext={goNext}
    />,
    <StepExtras key="extras" state={state} update={update} />,
    <StepCustomerDetails key="details" state={state} update={update} />,
    <StepConfirmation key="confirm" state={state} update={update} />,
  ];

  return (
    <main className="flex min-h-dvh flex-col items-center bg-background">
      <div className="flex w-full max-w-lg flex-col px-5 pb-32 pt-8">
        {state.step > 0 && state.step < STEP_TITLES.length - 1 && (
          <h1 className="mb-6 text-2xl font-semibold text-foreground text-balance">
            {STEP_TITLES[state.step]}
          </h1>
        )}

        {steps[state.step]}
      </div>

      {state.step > 0 && state.step < STEP_TITLES.length - 1 && (
        <BookingFooter
          onBack={goBack}
          onNext={goNext}
          onSkip={state.step === 2 ? skipStep : undefined} // Only provide skip for customer details step
          state={state}
        />
      )}
    </main>
  );
}

