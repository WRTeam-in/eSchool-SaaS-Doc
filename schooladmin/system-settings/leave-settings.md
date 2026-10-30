---
sidebar_position: 2
title: Leave Settings
---

# Leave Settings

**System Settings → Leave Settings** (needs `school-setting-manage` and the **Staff Leave Management** feature).

These settings decide how much **CL (Casual Leave)** staff get and how it is used, and which weekdays are off. There is **one set of settings per session year**; saving again updates it. Staff cannot apply for leave until the settings for the current session year are saved.

For the full leave flow, see [Staff Leave Management](../staff-leave/staff-leave.md).

---

## Staff and students

| Field | What it does |
|---|---|
| **Weekly Off Days** | Optional. The weekdays the school is closed (for example Sunday). They are not counted as leave days, and staff attendance cannot be marked on them. Applies to staff and students |

## Staff leave (CL)

These fields apply to staff only. Student leave has no CL and is not affected.

| Field | Options | What it does |
|---|---|---|
| **Yearly CL** | 0–366 | Casual leave each staff member gets in this session year. Enter **0** if staff get no paid leave (every leave day is then LWP) |
| **How CL is given** | *Every month* / *All at the start of the year* | *Every month* spreads the yearly CL evenly over the months of the session year. *All at the start of the year* gives the whole amount in the first month |
| **Unused monthly CL expires** | Yes / No | Only for *Every month*. **Yes**: CL not used in a month lapses at month end. **No**: it adds up month to month |
| **Maximum CL in one month** | Optional, up to 31 | Leave beyond this in one month is LWP even if CL is left. Leave empty for no limit |
| **Carry forward to next session year** | Yes / No | **Yes**: CL left at year end moves to the next session year. Not available when unused monthly CL expires, because nothing is left to carry |
| **When attendance marks staff absent** | *Use CL if available, rest LWP* / *Always LWP* | How absences recorded by staff attendance are counted |

The page has a **How this works** guide and a live example that update as you change the fields, for example: *"Example: a staff member with 1 CL available takes 3 days in a month → 1 days CL and 2 days LWP."*

### Validation

| Rule | Message |
|---|---|
| *Every month* with a Yearly CL above 0 but below the number of months in the session year | "Less than 1 day per month. Give CL all at the start of the year." |
| With monthly expiry, the monthly maximum is at or above the monthly CL | "With monthly expiry, the maximum must be less than the monthly CL (…), otherwise it has no effect." |

---

## What happens when you save

- Every staff member's CL passbook for the session year is recalculated.
- The change applies **from the current month on**. Months that have ended keep the CL and rules they were given.
- Months whose payroll is already paid never change. If some staff could not be updated, the message reads *"Settings saved. Leave balances of N staff could not be updated; please contact support."*
- If staff carried CL forward from the previous year and you turn on monthly expiry, the page warns you, because the carried-in days would lapse at the end of the first month.

:::tip
Staff who join during the year get a CL prorated from their **joining date**, so make sure joining dates are filled in under Staff Management → Staff.
:::
