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
import AirportLogo from "@/assets/airport.jpeg";
import LodgeLogo from "@/assets/roadlodge.jpeg";
import ExecutiveLogo from "@/assets/logo-main.jpg";

interface Props {
  state: BookingState;
  update: (p: Partial<BookingState>) => void;
  onNext: () => void;
}

const serviceIcons: Record<ServiceType, React.ReactNode> = {
  from_airport: <PlaneLanding className="h-5 w-5" />,
  from_lodge: <Building className="h-5 w-5" />,
};

const serviceLogos: Record<ServiceType, any> = {
  from_airport: AirportLogo,
  from_lodge: LodgeLogo,
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning our dear valued client. Please complete the following booking form";
  if (hour < 17) return "Good afternoon our dear valued client. Please complete the following booking form";
  return "Good evening our dear valued client. Please complete the following booking form ";
}

function useGreeting() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return greeting;
}

// Generate hour options (00-23)
function generateHourOptions() {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = h.toString().padStart(2, "0");
    options.push(hh);
  }
  return options;
}

// Generate minute options (00, 05, 10, 15, ..., 55)
function generateMinuteOptions() {
  const options: string[] = [];
  for (let m = 0; m < 60; m += 5) {
    options.push(m.toString().padStart(2, "0"));
  }
  return options;
}

const HOUR_OPTIONS = generateHourOptions();
const MINUTE_OPTIONS = generateMinuteOptions();

export function StepServiceType({ state, update, onNext }: Props) {
  const greeting = useGreeting();

  const handleSelect = (type: ServiceType) => {
    update({ serviceType: type });
  };

  const canProceed =
    state.serviceType !== null &&
    state.pickupDate.trim().length > 0 &&
    state.pickupHour.trim().length > 0 &&
    state.pickupMinute.trim().length > 0;

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

      <p className="mb-1 font-semibold text-foreground text-center">
        {greeting},
      </p>
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
              <div className="flex items-center gap-3">
                <Image
                  src={serviceLogos[type]}
                  alt="location logo"
                  width={60}
                  height={60}
                  className="rounded-md object-contain"
                />

                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  {serviceIcons[type]}
                </span>
              </div>
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
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Label
              htmlFor="pickup-hour"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Hour
            </Label>
            <select
              id="pickup-hour"
              value={state.pickupHour}
              onChange={(e) => update({ pickupHour: e.target.value })}
              className="flex h-12 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Hour</option>
              {HOUR_OPTIONS.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <Label
              htmlFor="pickup-minute"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Minutes
            </Label>
            <select
              id="pickup-minute"
              value={state.pickupMinute}
              onChange={(e) => update({ pickupMinute: e.target.value })}
              className="flex h-12 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Minutes</option>
              {MINUTE_OPTIONS.map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
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





