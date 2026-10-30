---
sidebar_position: 2
title: Leave Report
---

# Leave Report (CL Balance)

The **Leave Report** is the staff member's CL **passbook** for the session year: the leave rules that apply to them, their totals so far, and one line per month. For how the numbers are worked out, see [Staff Leave Management](./staff-leave.md).

---

## Where to find it

| Who | Menu | Sees |
|---|---|---|
| Staff with `leave-create` | **Leave → Leave Report** | Their own balance |
| Users with `approve-leave` (School Admin) | **Staff Leave → Leave Report** | Any staff member, picked from the **Staff** drop-down. An admin who is not staff starts on the first staff member |

The page shows the current session year.

---

## What the page shows

### Leave rules

The settings that apply to this staff member, in plain words. Only the lines that matter are shown, for example:

- the yearly CL and how it is given (every month, or all at the start of the year);
- the prorated CL when the staff member joined during the year;
- whether unused monthly CL expires or adds up;
- the maximum CL in one month, if set;
- whether the year-end balance carries forward, and how much was carried in from last year;
- *"Leave beyond the available CL is LWP (deducted from salary)."*

### This year so far

| Figure | Meaning |
|---|---|
| **CL available now** | CL that can be used today without turning approved leave in later months into LWP |
| CL given | CL credited so far (grows month by month when CL is given every month), including any carried in |
| CL used | CL used by approved leave, including approved leave in later months |
| CL lapsed | CL that expired |
| LWP | Leave without pay days |

### Month by month

| Column | Meaning |
|---|---|
| Month | The passbook month |
| Brought forward | Balance carried in from the previous month. Shown only when CL is given monthly and does not expire |
| CL given | CL credited that month. Shown only when CL is given monthly |
| CL used | Approved leave paid from CL |
| LWP | Approved leave not covered by CL |
| CL lapsed | CL that expired at the end of the month or year |
| Balance | CL left at the end of the month. Hidden when monthly CL expires |

A month marked **Paid** has its payroll paid: *"Payroll for this month is paid; these numbers are final."*

:::note
Only months that have started are listed, plus later months that already have approved leave. **Pending leave is not counted** until it is approved.
:::

Opening the report also brings the staff member's passbook up to date, so ended months show their lapsed CL even if the monthly refresh has not run yet.

---

## Related

- **Reports → Teacher Reports / Staff Reports** include a monthly leave view per staff member.
- The staff app shows the same data through `GET /api/leave-balance`.
