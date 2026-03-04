"use client";

import { CheckCircle, Users, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExecutiveToursFooterBrand } from "@/components/booking/executive-brand";
import { isNightTime } from "@/lib/pricing";
import { Badge } from "@/components/ui/badge";

interface Props {
  ref_: string;
  customerName: string;
  serviceType: string;
  pickupDate: string;
  pickupTime: string;
  extraPeople: number;
  totalAmount: string;
  whatsappLink: string;
}

export function BookingConfirmedClient({
  ref_,
  customerName,
  serviceType,
  pickupDate,
  pickupTime,
  extraPeople,
  totalAmount,
  whatsappLink,
}: Props) {
  const formattedDate = new Date(pickupDate).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isNight = isNightTime(pickupTime);

  return (
    <main className="flex min-h-dvh flex-col items-center bg-background px-5 py-10">
      <div className="flex w-full max-w-lg flex-col items-center">
        {/* Success icon */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>

        <h1 className="mb-1 text-2xl font-bold text-foreground">
          Booking confirmed!
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">Reference: {ref_}</p>

        {/* Booking summary card */}
        <div className="w-full rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground capitalize">
              {serviceType.replace(/_/g, " ")}
            </p>
            {isNight && <Badge variant="outline">Night Rate</Badge>}
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="text-sm text-foreground">
                  {formattedDate} at {pickupTime}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Passengers</p>
                <p className="text-sm text-foreground">
                  1 + {extraPeople} extra
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-medium text-foreground">
              Total Paid
            </span>
            <span className="font-bold text-foreground">{totalAmount}</span>
          </div>
        </div>

        <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
          Thank you, {customerName}. A driver will contact you before your
          pickup. If you have questions, reach out on WhatsApp.
        </p>

        {/* WhatsApp CTA */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full"
        >
          <Button
            variant="outline"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg text-base"
          >
            <MessageCircle className="h-5 w-5" />
            Contact us on WhatsApp
          </Button>
        </a>

        {/* Book another */}
        <Link href="/" className="mt-3 w-full">
          <Button className="h-12 w-full rounded-lg text-base font-semibold">
            Book another transfer
          </Button>
        </Link>

        <ExecutiveToursFooterBrand />
      </div>
    </main>
  );
}

