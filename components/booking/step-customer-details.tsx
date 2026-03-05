"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  const isAirportToLodge = state.serviceType === "from_airport";
  const isLodgeToAirport = state.serviceType === "from_lodge";

  return (
    <div className="flex flex-col gap-4">
      {/* Image Header */}
      <div className="relative w-full h-40 sm:h-48 mb-4 overflow-hidden rounded-2xl">
        <Image
          src={HeaderImage}
          alt="Table Mountain"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30" />

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

      <h1 className="mb-2 text-2xl font-semibold text-foreground text-balance">
        {"Let's add your details"}
      </h1>

      {/* Common Fields */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="name" className="sr-only">
          Full name
        </Label>
        <Input
          id="name"
          placeholder="Full name"
          value={state.customerName}
          onChange={(e) => update({ customerName: e.target.value })}
          className="h-12 rounded-lg"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="phone" className="sr-only">
          WhatsApp/Contact number
        </Label>
        <div className="flex items-center gap-2">
          <span className="flex h-12 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground">
            <span className="text-base">🇿🇦</span>
            <span>+27</span>
          </span>
          <Input
            id="phone"
            type="tel"
            placeholder="WhatsApp/Contact number"
            value={state.customerPhone}
            onChange={(e) => update({ customerPhone: e.target.value })}
            className="h-12 flex-1 rounded-lg"
          />
        </div>
      </div>

      {/* Airport to Lodge Specific Fields */}
      {isAirportToLodge && (
        <>
          <div className="flex flex-col gap-1">
            <Label htmlFor="flight-number" className="sr-only">
              Flight number
            </Label>
            <Input
              id="flight-number"
              placeholder="Flight number"
              value={state.flightNumber}
              onChange={(e) => update({ flightNumber: e.target.value })}
              className="h-12 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="arrival-date"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Date of arrival
            </Label>
            <Input
              id="arrival-date"
              type="date"
              value={state.arrivalDate}
              onChange={(e) => update({ arrivalDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="h-12 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="passengers"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Number of passengers
            </Label>
            <Input
              id="passengers"
              type="number"
              min="1"
              max="20"
              placeholder="Number of passengers"
              value={state.numberOfPassengers}
              onChange={(e) =>
                update({ numberOfPassengers: parseInt(e.target.value) || 1 })
              }
              className="h-12 rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="next-morning-transfer"
              checked={state.requireNextMorningTransfer}
              onCheckedChange={(checked) =>
                update({ requireNextMorningTransfer: !!checked })
              }
            />
            <Label
              htmlFor="next-morning-transfer"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do you require a transfer the next morning?
            </Label>
          </div>
        </>
      )}

      {/* Lodge to Airport Specific Fields */}
      {isLodgeToAirport && (
        <>
          <div className="flex flex-col gap-1">
            <Label htmlFor="room-number" className="sr-only">
              Room number
            </Label>
            <Input
              id="room-number"
              placeholder="Room number"
              value={state.roomNumber}
              onChange={(e) => update({ roomNumber: e.target.value })}
              className="h-12 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label
              htmlFor="passengers-lodge"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Number of passengers
            </Label>
            <Input
              id="passengers-lodge"
              type="number"
              min="1"
              max="20"
              placeholder="Number of passengers"
              value={state.numberOfPassengers}
              onChange={(e) =>
                update({ numberOfPassengers: parseInt(e.target.value) || 1 })
              }
              className="h-12 rounded-lg"
            />
          </div>
        </>
      )}

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

      <div className="flex flex-col gap-1">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={state.customerEmail}
          onChange={(e) => update({ customerEmail: e.target.value })}
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


