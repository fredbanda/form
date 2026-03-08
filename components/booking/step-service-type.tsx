"use client";

import { useState, useEffect } from "react";
import { PlaneLanding, Building, MessageCircle, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { BookingState } from "@/lib/booking-store";
import type { ServiceType } from "@/lib/validators";
import { serviceTypeLabels } from "@/lib/validators";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-brand";
import { Button } from "@/components/ui/button";
import { isBookingAvailable, getTimeCategory } from "@/lib/pricing";
import Image from "next/image";
import HeaderImage from "@/assets/tablem.jpg";
import AirportLogo from "@/assets/airport.jpeg";
import LodgeLogo from "@/assets/roadlodge.jpeg";
import ExecutiveLogo from "@/assets/logo-main.jpg";
import PhoneField from "./calling-code";

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
  if (hour < 12)
    return "Good morning our dear valued client. Please complete the following booking form";
  if (hour < 17)
    return "Good afternoon our dear valued client. Please complete the following booking form";
  return "Good evening our dear valued client. Please complete the following booking form ";
}

function useGreeting() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return greeting;
}

export function StepServiceType({ state, update, onNext }: Props) {
  const greeting = useGreeting();

  const handleSelect = (type: ServiceType) => {
    update({ serviceType: type });
  };

  const canProceed = state.serviceType !== null && validateRequiredFields();

  function validateRequiredFields(): boolean {
    if (!state.serviceType) return false;

    if (state.serviceType === "from_airport") {
      const basicFieldsValid =
        state.customerName.trim().length > 0 &&
        state.customerPhone.trim().length > 0 &&
        state.flightNumber.trim().length > 0 &&
        state.arrivalTime.trim().length > 0 &&
        state.arrivalDate.trim().length > 0 &&
        state.totalPassengers > 0;

      const nextMorningValid =
        !state.requireNextMorningTransfer ||
        (state.nextMorningTransferTime.trim().length > 0 &&
          state.nextMorningPassengers > 0);

      return (
        basicFieldsValid &&
        nextMorningValid &&
        isBookingAvailable(state.arrivalTime)
      );
    }

    if (state.serviceType === "from_lodge") {
      return (
        state.customerName.trim().length > 0 &&
        state.customerPhone.trim().length > 0 &&
        state.roomNumber.trim().length > 0 &&
        state.pickupDate.trim().length > 0 &&
        state.transferTime.trim().length > 0 &&
        state.totalPassengers > 0 &&
        isBookingAvailable(state.transferTime)
      );
    }

    return false;
  }

  // Helper function to get the relevant time for booking availability check
  function getRelevantTime(): string {
    if (state.serviceType === "from_airport") {
      return state.arrivalTime;
    }
    if (state.serviceType === "from_lodge") {
      return state.transferTime;
    }
    return "";
  }

  function handleWhatsAppRedirect() {
    const message = encodeURIComponent(
      `Hi! I'd like to book a transfer ${
        state.serviceType === "from_airport"
          ? "from Airport to Road Lodge"
          : "from Road Lodge to Airport"
      } during day hours (06:00-17:00). Please send me a quote.`
    );
    // Replace this with your actual WhatsApp business number
    window.open(`https://wa.me/27796552077?text=${message}`, "_blank");
  }

  const relevantTime = getRelevantTime();
  const timeCategory = relevantTime ? getTimeCategory(relevantTime) : null;
  const bookingAvailable = relevantTime
    ? isBookingAvailable(relevantTime)
    : true;

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

      <p className="mb-4 bold text-foreground">
        Dear valued client, please complete the booking form below.
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

      {/* Service-Specific Form Fields */}
      {state.serviceType === "from_airport" && (
        <div className="flex flex-col gap-4 mb-6 p-4 border rounded-xl bg-card">
          <h3 className="font-semibold text-lg text-foreground mb-2">
            Airport to Road Lodge - Transfer Details
          </h3>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-foreground"
            >
              Name *
            </Label>
            <Input
              id="name"
              placeholder="Full name"
              value={state.customerName}
              onChange={(e) => update({ customerName: e.target.value })}
              className="h-12 rounded-lg"
            />
          </div>

          {/* WhatsApp/Contact Number */}
          <PhoneField
            value={state.customerPhone}
            onChange={(value) => update({ customerPhone: value })}
          />
          {/* Flight Number */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="flight-number"
              className="text-sm font-medium text-foreground"
            >
              Flight Number *
            </Label>
            <Input
              id="flight-number"
              placeholder="Flight number (e.g. BA123)"
              value={state.flightNumber}
              onChange={(e) => update({ flightNumber: e.target.value })}
              className="h-12 rounded-lg"
            />
          </div>

          {/* Time of Arrival */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="arrival-time"
              className="text-sm font-medium text-foreground"
            >
              Time of Arrival *
            </Label>
            <Input
              id="arrival-time"
              type="time"
              value={state.arrivalTime}
              onChange={(e) => update({ arrivalTime: e.target.value })}
              className="h-12 rounded-lg"
            />

            {/* Time-based notification */}
            {state.arrivalTime && (
              <div className="mt-2">
                {getTimeCategory(state.arrivalTime) === "day" && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Day Hours (06:00 - 17:00):</strong> Online booking
                      is not available during these hours. Please contact us via
                      WhatsApp for a quote.
                    </p>
                  </div>
                )}
                {getTimeCategory(state.arrivalTime) === "evening" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Evening Rate:</strong> R160 for first passenger,
                      R60 for additional passengers.
                    </p>
                  </div>
                )}
                {getTimeCategory(state.arrivalTime) === "night" && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Night Rate (17:00 - 22:00):</strong> R250 per
                      passenger, R50 for additional passengers.
                    </p>
                  </div>
                )}
                {getTimeCategory(state.arrivalTime) === "late-night" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Late Night (After 22:00):</strong> R160 for first
                      passenger + R60 for additional + R150 late night
                      surcharge.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date of Arrival */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="arrival-date"
              className="text-sm font-medium text-foreground"
            >
              Date of Arrival *
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

          {/* Next Morning Transfer Checkbox */}
          <div className="flex items-start space-x-2 mt-2">
            <Checkbox
              id="next-morning-transfer"
              checked={state.requireNextMorningTransfer}
              onCheckedChange={(checked) =>
                update({
                  requireNextMorningTransfer: !!checked,
                  // Reset/initialize values when toggling
                  nextMorningTransferTime: checked
                    ? state.nextMorningTransferTime
                    : "",
                  nextMorningPassengers: checked
                    ? state.nextMorningPassengers || 1
                    : 1,
                })
              }
            />
            <Label
              htmlFor="next-morning-transfer"
              className="text-sm font-medium leading-relaxed"
            >
              Do you require a transfer the next morning?
            </Label>
          </div>

          {/* Next Morning Transfer Details */}
          {state.requireNextMorningTransfer && (
            <div className="ml-6 flex flex-col gap-4 p-4 border-l-2 border-muted-foreground/20 bg-muted/30 rounded-r-lg">
              <h4 className="font-medium text-foreground">
                Next Morning Transfer Details
              </h4>

              {/* Time of Transfer */}
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="next-transfer-time"
                  className="text-sm font-medium text-foreground"
                >
                  Time of Transfer *
                </Label>
                <Input
                  id="next-transfer-time"
                  type="time"
                  value={state.nextMorningTransferTime}
                  onChange={(e) =>
                    update({ nextMorningTransferTime: e.target.value })
                  }
                  className="h-12 rounded-lg"
                />
              </div>

              {/* Amount of Passengers */}
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor="next-passengers"
                  className="text-sm font-medium text-foreground"
                >
                  Amount of Passengers *
                </Label>
                <div className="flex items-center justify-center gap-4 rounded-xl border-2 border-border bg-card p-4">
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.max(1, state.nextMorningPassengers - 1);
                      update({ nextMorningPassengers: newValue });
                    }}
                    disabled={state.nextMorningPassengers === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-all duration-200 hover:bg-muted active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation select-none"
                    aria-label="Remove person"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center text-xl font-bold text-foreground">
                    {state.nextMorningPassengers}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newValue = Math.min(20, state.nextMorningPassengers + 1);
                      update({ nextMorningPassengers: newValue });
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card text-foreground transition-all duration-200 hover:bg-muted active:scale-95 touch-manipulation select-none"
                    aria-label="Add person"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {state.serviceType === "from_lodge" && (
        <div className="flex flex-col gap-4 mb-6 p-4 border rounded-xl bg-card">
          <h3 className="font-semibold text-lg text-foreground mb-2">
            Road Lodge to Airport - Transfer Details
          </h3>

          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="name-lodge"
              className="text-sm font-medium text-foreground"
            >
              Name *
            </Label>
            <Input
              id="name-lodge"
              placeholder="Full name"
              value={state.customerName}
              onChange={(e) => update({ customerName: e.target.value })}
              className="h-12 rounded-lg"
            />
          </div>

          {/* WhatsApp/Contact Number */}
          <PhoneField
            value={state.customerPhone}
            onChange={(value) => update({ customerPhone: value })}
          />

          {/* Room Number */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="room-number"
              className="text-sm font-medium text-foreground"
            >
              Room Number *
            </Label>
            <Input
              id="room-number"
              placeholder="Room number"
              value={state.roomNumber}
              onChange={(e) => update({ roomNumber: e.target.value })}
              className="h-12 rounded-lg"
            />
          </div>

          {/* Date of Transfer */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="transfer-date"
              className="text-sm font-medium text-foreground"
            >
              Date of Transfer *
            </Label>
            <Input
              id="transfer-date"
              type="date"
              value={state.pickupDate}
              onChange={(e) => update({ pickupDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="h-12 rounded-lg"
            />
          </div>

          {/* Time of Transfer */}
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="transfer-time"
              className="text-sm font-medium text-foreground"
            >
              Time of Transfer *
            </Label>
            <Input
              id="transfer-time"
              type="time"
              value={state.transferTime}
              onChange={(e) => update({ transferTime: e.target.value })}
              className="h-12 rounded-lg"
            />

            {/* Time-based notification */}
            {state.transferTime && (
              <div className="mt-2">
                {getTimeCategory(state.transferTime) === "day" && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Day Hours (06:00 - 17:00):</strong> Online booking
                      is not available during these hours. Please contact us via
                      WhatsApp for a quote.
                    </p>
                  </div>
                )}
                {getTimeCategory(state.transferTime) === "evening" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Evening Rate:</strong> R160 for first passenger,
                      R60 for additional passengers.
                    </p>
                  </div>
                )}
                {getTimeCategory(state.transferTime) === "night" && (
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>Night Rate (17:00 - 22:00):</strong> R250 per
                      passenger, R50 for additional passengers.
                    </p>
                  </div>
                )}
                {getTimeCategory(state.transferTime) === "late-night" && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>Late Night (After 22:00):</strong> R160 for first
                      passenger + R60 for additional + R150 late night
                      surcharge.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Note for Lodge to Airport */}
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
            <p className="text-sm text-blue-800 font-medium">
              <strong>NB:</strong> Please meet the driver at the reception at
              the time you requested your transfer. Lodge to airport transfers
              are priced at our standard morning rate.
            </p>
          </div>
        </div>
      )}

      {/* Continue Button or WhatsApp Button */}
      <div className="mt-8">
        {!bookingAvailable && relevantTime ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 mb-3">
                <strong>Day Hours Booking:</strong> For transfers between 06:00
                - 17:00, please contact us directly for a personalized quote.
              </p>
              <Button
                onClick={handleWhatsAppRedirect}
                className="w-full h-12 rounded-xl text-base font-semibold bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact us on WhatsApp for Quote
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="h-12 w-full rounded-xl text-base font-semibold"
          >
            Continue
          </Button>
        )}
      </div>

      <ExecutiveToursFooterBrand />
    </div>
  );
}

