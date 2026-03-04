# Fix: "checkout page not found" on frontend

## Root Causes
1. `app/api/bookings/route.ts` destructures `selectedExtras` but frontend sends `extras` → extras always `undefined`
2. `lib/yoco.ts` silently returns `undefined` for `redirectUrl` if Yoco response field is missing
3. `step-confirmation.tsx` has no user-facing error when `checkoutUrl` is missing after a successful API call

## Steps

- [x] Fix `app/api/bookings/route.ts` — rename `selectedExtras` → `extras` in destructuring
- [x] Fix `lib/yoco.ts` — add guard + log if `redirectUrl` missing from Yoco response
- [x] Fix `components/booking/step-confirmation.tsx` — add toast error if `checkoutUrl` missing after successful API call

## Follow-up (manual)

- [ ] Deploy and check server logs for `[Yoco] Checkout response:` to confirm the exact field name returned by Yoco
- [ ] If `redirectUrl` is not the correct field name, update `lib/yoco.ts` and `app/api/bookings/route.ts` accordingly
