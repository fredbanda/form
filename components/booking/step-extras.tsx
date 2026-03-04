"use client"

import { Plus, Minus, Users, User, Moon } from "lucide-react"
import { EXTRAS, formatZAR, EXTRA_PERSON_PRICE, BASE_PRICE_DAY, LATE_NIGHT_SURCHARGE, isNightTime, type Extra } from "@/lib/pricing"
import { Textarea } from "@/components/ui/textarea"
import type { BookingState } from "@/lib/booking-store"

interface Props {
  state: BookingState
  update: (p: Partial<BookingState>) => void
}

export function StepExtras({ state, update }: Props) {
  const toggleExtra = (extra: Extra) => {
    const isSelected = state.selectedExtras.some((e) => e.id === extra.id)
    if (isSelected) {
      update({
        selectedExtras: state.selectedExtras.filter((e) => e.id !== extra.id),
      })
    } else {
      update({
        selectedExtras: [...state.selectedExtras, extra],
      })
    }
  }

  const incrementPeople = () => {
    update({ extraPeople: state.extraPeople + 1 })
  }

  const decrementPeople = () => {
    if (state.extraPeople > 0) {
      update({ extraPeople: state.extraPeople - 1 })
    }
  }

  const isNight = isNightTime(state.pickupTime)

  return (
    <div className="flex flex-col gap-6">
      {/* Pricing Breakdown Section */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Pricing</h2>
        
        <div className="flex flex-col gap-3">
          {/* First Person - Base Price */}
          <div className="flex items-center justify-between rounded-xl border-2 border-foreground bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
                <User className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-foreground">First Person</p>
                <p className="text-sm text-muted-foreground">Included in base fare</p>
              </div>
            </div>
            <p className="text-lg font-semibold text-foreground">{formatZAR(BASE_PRICE_DAY)}</p>
          </div>

          {/* Late Night Surcharge - only show if night time */}
          {isNight && (
            <div className="flex items-center justify-between rounded-xl border-2 border-amber-500 bg-amber-50 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Moon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">Late Night Surcharge</p>
                  <p className="text-sm text-muted-foreground">Pickup between 18:00 - 06:00</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-amber-600">{formatZAR(LATE_NIGHT_SURCHARGE)}</p>
            </div>
          )}

          {/* Extra People */}
          <div className="flex items-center justify-between rounded-xl border-2 border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-foreground">Extra People</p>
                <p className="text-sm text-muted-foreground">
                  {formatZAR(EXTRA_PERSON_PRICE)} per person
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decrementPeople}
                disabled={state.extraPeople === 0}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Remove person"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-lg font-semibold text-foreground">
                {state.extraPeople}
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
      </div>

      {/* Other Extras */}
      {EXTRAS.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Other Extras</h2>
          <div className="grid grid-cols-2 gap-3">
            {EXTRAS.map((extra) => {
              const selected = state.selectedExtras.some((e) => e.id === extra.id)
              return (
                <button
                  key={extra.id}
                  type="button"
                  onClick={() => toggleExtra(extra)}
                  className={`flex flex-col items-start rounded-xl border-2 px-4 py-4 text-left transition-all ${
                    selected
                      ? "border-foreground bg-card shadow-sm"
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                >
                  <p className="font-semibold text-foreground">{extra.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {extra.price === 0 ? "Free" : formatZAR(extra.price)}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Special Requests */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Special Requests</h2>
        <Textarea
          placeholder="Any special requests or notes?"
          value={state.specialRequests}
          onChange={(e) => update({ specialRequests: e.target.value })}
          className="min-h-24 resize-none rounded-xl bg-muted/50"
        />
      </div>
    </div>
  )
}
