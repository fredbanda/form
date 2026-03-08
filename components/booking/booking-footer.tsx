"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingState } from "@/lib/booking-store";

interface BookingFooterProps {
  onBack: () => void;
  onNext: () => void;
  onSkip?: () => void; // Optional skip function
  state: BookingState;
}

function canProceed(state: BookingState): boolean {
  switch (state.step) {
    case 1: // extras (always can proceed)
      return true;
    case 2: // customer details (now optional - can always proceed)
      return true; // Since email is already collected in step 0, this step is optional
    default:
      return true;
  }
}

export function BookingFooter({
  onBack,
  onNext,
  onSkip,
  state,
}: BookingFooterProps) {
  const valid = canProceed(state);
  const isCustomerDetailsStep = state.step === 2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background px-5 py-4">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {isCustomerDetailsStep && onSkip ? (
          // Customer details step - show both Skip and Continue
          <>
            <Button
              onClick={onSkip}
              variant="outline"
              className="h-12 flex-1 rounded-lg text-base font-medium"
            >
              Skip
            </Button>
            <Button
              onClick={onNext}
              disabled={!valid}
              className="h-12 flex-1 rounded-lg text-base font-semibold"
            >
              Continue
            </Button>
          </>
        ) : (
          // Other steps - show only Continue
          <Button
            onClick={onNext}
            disabled={!valid}
            className="h-12 flex-1 rounded-lg text-base font-semibold"
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}

