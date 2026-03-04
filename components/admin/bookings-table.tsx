"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Phone, Mail, Users, Clock } from "lucide-react"
import { isNightTime } from "@/lib/pricing"

interface Booking {
  id: string
  service_type: string
  pickup_date: string
  pickup_time: string
  extra_people: number
  customer_name: string
  customer_phone: string
  customer_email: string
  total_amount: number
  payment_status: string
  created_at: string
  extras: Array<{ name: string; price: number }>
  special_requests: string | null
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    paid: "default",
    pending: "secondary",
    failed: "destructive",
  }
  return (
    <Badge variant={variants[status] || "outline"} className="capitalize">
      {status}
    </Badge>
  )
}

function BookingDetail({ booking }: { booking: Booking }) {
  const isNight = isNightTime(booking.pickup_time)
  
  return (
    <div className="grid gap-4 rounded-lg bg-muted/50 p-4 md:grid-cols-2">
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Trip Details</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground">
              {new Date(booking.pickup_date).toLocaleDateString("en-ZA", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })} at {booking.pickup_time}
              {isNight && <Badge variant="outline" className="ml-2 text-xs">Night Rate</Badge>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-foreground">
              1 + {booking.extra_people} extra {booking.extra_people === 1 ? "person" : "people"}
            </span>
          </div>
          <p className="text-muted-foreground capitalize">
            {booking.service_type.replace(/_/g, " ")}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Customer</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            <a href={`tel:${booking.customer_phone}`} className="text-foreground hover:underline">
              {booking.customer_phone}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <a href={`mailto:${booking.customer_email}`} className="text-foreground hover:underline">
              {booking.customer_email}
            </a>
          </div>
        </div>

        {booking.extras && booking.extras.length > 0 && (
          <>
            <h4 className="text-sm font-medium text-foreground">Extras</h4>
            <ul className="space-y-1 text-sm">
              {booking.extras.map((extra, i) => (
                <li key={i} className="text-foreground">
                  {extra.name} {extra.price > 0 && `- ZAR ${(extra.price / 100).toFixed(2)}`}
                </li>
              ))}
            </ul>
          </>
        )}

        {booking.special_requests && (
          <>
            <h4 className="text-sm font-medium text-foreground">Special Requests</h4>
            <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
          </>
        )}
      </div>
    </div>
  )
}

export function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8" />
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Service</TableHead>
            <TableHead className="hidden md:table-cell">People</TableHead>
            <TableHead className="hidden lg:table-cell">Pickup</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => {
            const isExpanded = expandedId === booking.id
            return (
              <TableRow
                key={booking.id}
                className="cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : booking.id)}
              >
                <TableCell colSpan={7} className="p-0">
                  <div className="flex items-center px-4 py-3">
                    <div className="mr-3 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="grid flex-1 grid-cols-3 items-center gap-4 md:grid-cols-6 lg:grid-cols-7">
                      <div>
                        <p className="font-medium text-foreground">{booking.customer_name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {booking.pickup_time}
                        </p>
                      </div>
                      <div className="hidden text-sm text-foreground capitalize md:block">
                        {booking.service_type.replace(/_/g, " ")}
                      </div>
                      <div className="hidden text-sm text-foreground md:block">
                        1 + {booking.extra_people}
                      </div>
                      <div className="hidden text-sm text-foreground lg:block">
                        {new Date(booking.pickup_date).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                        })} {booking.pickup_time}
                      </div>
                      <div className="text-right text-sm font-medium text-foreground md:text-left">
                        ZAR {(booking.total_amount / 100).toFixed(2)}
                      </div>
                      <div className="text-right md:text-left">
                        <StatusBadge status={booking.payment_status} />
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-border px-4 py-4">
                      <BookingDetail booking={booking} />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
