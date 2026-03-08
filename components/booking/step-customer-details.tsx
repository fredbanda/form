"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BookingState } from "@/lib/booking-store";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-brand";
import Image from "next/image";
import HeaderImage from "@/assets/tablem.jpg";
import ExecutiveLogo from "@/assets/logo-main.jpg";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
}

export function StepCustomerDetails({ state, update }: Props) {
  return (
    <div className="flex flex-col">
      {/* Image Header */}
      <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl">
        {/* Background Image */}
        <Image
          src={HeaderImage}
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

      <h1 className="mb-2 text-2xl font-semibold text-foreground text-balance">
        {"Additional details (Optional)"}
      </h1>

      <p className="mb-6 text-sm text-muted-foreground">
        These details are completely optional. You can skip this step and
        proceed to confirm your booking.
      </p>

      <div className="flex flex-col gap-1">
        <Label htmlFor="alt-phone" className="sr-only">
          Alternative mobile (optional)
        </Label>
        <Input
          id="alt-phone"
          type="tel"
          placeholder="Alternative mobile (optional)"
          value={state.customerAltPhone}
          onChange={(e) => update({ customerAltPhone: e.target.value })}
          className="h-12 rounded-lg"
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        By proceeding, you consent to get calls, WhatsApp or SMS messages,
        including by automated means, from Executive Tours & Transfers and its
        affiliates.
      </p>
      <ExecutiveToursFooterBrand />
    </div>
  );
}

