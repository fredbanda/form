"use client";

import { useState, useEffect } from "react";
import { PlaneLanding, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BookingState } from "@/lib/booking-store";
import type { ServiceType } from "@/lib/validators";
import { serviceTypeLabels } from "@/lib/validators";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-brand";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import HeaderImage from "@/assets/tablem.jpg";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
  onNext: () => void;
}

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  from_airport: <PlaneLanding className="h-5 w-5" />,
  from_lodge: <Building className="h-5 w-5" />,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function useGreeting() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return greeting;
}

// Generate time options from 00:00 to 23:30 in 30-minute increments
function generateTimeOptions() {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hh = h.toString().padStart(2, "0");
      const mm = m.toString().padStart(2, "0");
      options.push(`${hh}:${mm}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export function StepServiceType({ state, update, onNext }: Props) {
  const greeting = useGreeting();

  const handleSelect = (type: ServiceType) => {
    update({ serviceType: type });
  };

  const canProceed =
    state.serviceType !== null &&
    state.pickupDate.trim().length > 0 &&
    state.pickupTime.trim().length > 0;

  return (
 <div className="flex flex-col">
    {/* Image Header */}
    <div className="relative w-full h-48 mb-6 overflow-hidden rounded-2xl">
      <Image
        src={HeaderImage}
        alt="Table Mountain"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" /> {/* subtle overlay */}
    </div>

    <h1 className="mb-1 text-2xl font-semibold text-foreground text-balance">
      {greeting},
    </h1>
      <h2 className="mb-8 text-2xl font-semibold text-muted-foreground text-balance">
        what would you like to book?
      </h2>

      {/* Service Type Selection */}
      <div className="flex flex-col gap-3 mb-8">
        {(Object.keys(serviceTypeLabels) as ServiceType[]).map((type) => {
          const label = serviceTypeLabels[type];
          const selected = state.serviceType === type;

          return (
            <button
              key={type}
              type="button"
              onClick={() => handleSelect(type)}
              className={`flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                selected
                  ? "border-foreground bg-card"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                {serviceIcons[type]}
              </span>
              <div>
                <p className="font-semibold text-foreground">{label.title}</p>
                <p className="text-sm text-muted-foreground">
                  {label.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Date & Time Selection */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label
              htmlFor="pickup-date"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Date
            </Label>
            <Input
              id="pickup-date"
              type="date"
              value={state.pickupDate}
              onChange={(e) => update({ pickupDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="h-12 rounded-xl bg-card"
            />
          </div>
          <div className="flex-1">
            <Label
              htmlFor="pickup-time"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Time
            </Label>
            <select
              id="pickup-time"
              value={state.pickupTime}
              onChange={(e) => update({ pickupTime: e.target.value })}
              className="flex h-12 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select time</option>
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="mt-8 h-12 w-full rounded-xl text-base font-semibold"
      >
        Continue
      </Button>

      <ExecutiveToursFooterBrand />
    </div>
  );
}

