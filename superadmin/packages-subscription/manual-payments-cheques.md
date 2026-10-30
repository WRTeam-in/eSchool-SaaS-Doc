---
sidebar_position: 6
title: Manual Payments & Cheques
---

# Manual Payments & Cheques

Schools can pay their subscription by **bank transfer (or any offline method)** and upload the receipt, instead of paying online. The plan or add-on **starts right away**, and the payment waits in **Manual Payments & Cheques** until the Super Admin checks the receipt and approves or rejects it.

The same screen is used for **cheques** the Super Admin records against a bill: the bill stays *Cheque pending* until the cheque is marked **cleared** or **bounced**.

For the school's side of the flow, see [Manual Payment (School Admin)](/schooladmin/subscription/manual-payment).

---

## 1. Who does what

| Actor | Can |
|---|---|
| **School Admin** | Pay a bill, a new plan, a plan change, a renewal or an add-on with **Manual Payment** and upload the proof |
| **Super Admin** (or any user with `subscription-bill-payment`) | Turn Manual Payment on, set the bank details, review receipts, record cash or cheque payments on a bill, and mark cheques cleared or bounced |

---

## 2. Turn on Manual Payment

**System Settings → Payment Settings → Manual Payment**

| Field | What it does |
|---|---|
| **Status** | *Enable* shows the **Manual Payment** option to schools. *Disable* hides it everywhere |
| **Bank Details & Payment Instructions** | Rich text shown to schools in the payment popup: bank name, account name and number, IFSC / SWIFT, UPI ID, or any instructions. You can add a QR code image here |

Manual Payment is **not** an online gateway: it never takes a school to a checkout page, and online payments keep working alongside it.

---

## 3. What schools can pay with Manual Payment

| Paying for | Shown as | Rules |
|---|---|---|
| **Bill** | Bill #id (plan name) | An unpaid bill of the school. Refused if already paid or already under review |
| **New plan** | New plan: *package* | Prepaid packages only. Only when the school has no active plan and no unpaid bill |
| **Plan change** | Plan change: *package* | Prepaid packages only. Starts a different plan now. Refused while the school has an unpaid bill |
| **Renewal** | Renewal: *package* | The upcoming prepaid plan the school has selected. Only one renewal can be under review at a time |
| **Add-on** | Add-on: *feature* | Only on an active **prepaid** plan, and only for a feature not already in the plan or already bought |

The amount is always worked out by the server (including tax), exactly as for an online payment; the school cannot change it. The school separately enters the **amount they actually paid**, which you compare against the amount due.

---

## 4. What happens when a school submits

1. The school uploads the proof (JPG, PNG, WEBP or PDF, up to 5 MB) and optionally a **Transaction ID** and a **note**.
2. The system creates a payment transaction with gateway **Manual** and status **pending**, and **fulfils the purchase immediately**, the same way a successful online payment would:
   - a bill is linked to the payment and shows **Under Review**;
   - a new plan, plan change or renewal is created and active;
   - an add-on is active.
3. A review entry is created with status **Waiting for review**.
4. The Super Admin gets an email: *"New Manual Payment from \[school\]"*.

While the payment is under review:

- **The school is not locked.** A bill with a Manual Payment or a cheque under review is not treated as overdue, even after its due date.
- **The school cannot pay the same thing online.** Trying to do so shows *"A payment for this is already under review."*

---

## 5. Review a payment

**Packages & Subscription → Manual Payments & Cheques** (needs `subscription-bill-payment`)

The list shows every manual payment and cheque, with filters for **status**, **type** (Manual Payment / Cheque) and **school**, and a search over the transaction ID, the entry ID and the school name. For each entry you can see:

- the school, **what it pays for**, the amount due (incl. tax) and the **amount the school says it paid**;
- the transaction ID or cheque number, cheque date and bank;
- the **payment proof** (open receipt), the school's note, who submitted it and when;
- the status, the reason (if rejected), and who reviewed it and when.

Two warnings help you spot problems before approving:

| Warning | Meaning |
|---|---|
| *"The amount paid does not match the amount due. Check the receipt before approving."* | The amount the school entered differs from the amount due |
| *"This transaction ID is also used in another payment"* | The same transaction ID (case and spaces ignored) appears in another manual payment or cheque, in any school |

Open the entry with **Review** and choose:

### Approve

The payment transaction becomes **succeed** and the entry **Approved**. The plan or add-on is already running, so nothing else changes. The school gets the email *"Your payment is approved"*, with what it paid for, the amount and the transaction ID.

### Reject

A **reason is required**. The payment transaction becomes **failed** and the entry **Rejected**. What happens next depends on what was paid for:

| Paying for | After rejection |
|---|---|
| Bill, new plan, plan change, renewal | The plan **keeps running**. The bill is unpaid again and its **due date is reset to today + the grace days** (the *additional billing days* system setting, 7 by default). If it is not paid by then, the normal lock applies |
| Add-on | The add-on **stops immediately**. The school can buy it again, online or with Manual Payment |

The school gets the email *"Your payment receipt was rejected"* with the reason and, for a plan or bill, the new date to pay by. On the school's subscription screens the bill shows as rejected with the reason, so they can pay again.

Each entry can be reviewed **once**. If two people act at the same time, the first decision wins and the second gets *"This payment is already reviewed."*

---

## 6. Record cash or a cheque on a bill

From a school's bill (**Packages & Subscription → Subscription**, open the bill and record its payment), the Super Admin can record a payment received outside the system:

| Method | What happens |
|---|---|
| **Cash** | The bill is **paid immediately** |
| **Cheque** | Needs the **cheque number**; cheque date and bank name are optional. The bill shows **Cheque pending** and an entry appears in Manual Payments & Cheques. The school gets a *"Cheque received"* email |

A cheque is reviewed like a manual payment:

- **Mark cleared**: the bill is paid. The school gets a *"Your cheque cleared"* email.
- **Mark bounced**: a reason is required. The bill is unpaid again and due after the grace days; the school gets an email asking them to pay again by the new date.

The school is not locked while a cheque is pending.

### Paid another way

If a bill already has a manual payment or cheque **waiting for review** and you record **cash** or a **new cheque** on it, the waiting entry is closed as **Cancelled: "Paid another way"** and the school gets an email saying nothing more is needed for that payment.

Deleting a bill's payment entry also cancels any manual payment or cheque still waiting on it (*"Payment entry deleted"*). An earlier manual payment or cheque with review history is never edited in place; recording cash creates a new transaction.

---

## 7. Status reference

| Status | Manual Payment | Cheque |
|---|---|---|
| `pending` | Waiting for review | Cheque pending |
| `approved` | Approved | Cleared |
| `rejected` | Rejected (with reason) | Bounced (with reason) |
| `cancelled` | Closed: paid another way, or payment entry deleted | Same |

---

## 8. Emails

All emails go through the system mail settings. A failed email is logged and does not stop the action.

| Event | To | Subject |
|---|---|---|
| School submits a manual payment | Super Admin | New Manual Payment from \[school\] |
| Manual payment approved | School | Your payment is approved |
| Manual payment rejected | School | Your payment receipt was rejected (plan/bill: pay again by the new date; add-on: it has been stopped) |
| Cheque recorded | School | Cheque received |
| Cheque cleared | School | Your cheque cleared |
| Cheque bounced | School | Your cheque bounced (pay again by the new date) |
| Waiting entry closed (paid another way) | School | Your payment entry was closed |

---

## 9. Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Schools do not see **Manual Payment** | It is disabled in Payment Settings, or the school is paying for something not supported (for example a postpaid plan purchase; only bills, prepaid plans and prepaid add-ons are supported) |
| School gets *"Kindly settle any outstanding payments from before"* | New plan / plan change is refused while the school has an unpaid bill. They should pay the bill first |
| School gets *"A payment for this is already under review."* | A manual payment or cheque for the same bill, renewal or add-on is waiting. Review it first |
| School was not locked although the bill is past due | Expected while a manual payment or cheque is under review |
| Approve / reject fails with *"This payment is already reviewed."* | Someone else already decided it, or it was cancelled because the bill was paid another way |
| Amount mismatch warning | Compare the receipt with the amount due. Reject with a clear reason if it is short |
