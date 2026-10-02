# BT Ops Daily Tracker 🩸⏱️

A fast, lightweight, mobile-first web app designed for Blood Test Operations Interns to track daily shifts and operations metrics with 1-tap speed.

## 🚀 Core Principles

- **1-Second Interaction**: Increment standard operational counts with a single tap on massive, touch-friendly buttons.
- **Zero Forms & Clutter**: No individual call logging, no CRM database, no complex multi-step wizards.
- **Mobile-First 2-Column Grid**: Thumb-friendly layout designed for fast operation on mobile screens during active shifts.
- **100% Local & Private**: Shift metrics and optional customer escalation details remain strictly inside `localStorage`. No analytics or external tracking. Escalation customer PII is never included in the shared summary.
- **Instant Daily Update**: Formats the end-of-day summary with one-click copy/share for WhatsApp/Slack updates.

---

## 📱 Features

1. **Shift Management**:
   - `▶ Start Shift`: Records login time and starts a live elapsed timer with a `🟢 Working` badge.
   - `🔴 End Shift`: Records logout time, calculates total duration, and marks `🟢 Shift Completed`.
   - `Resume`: Allows resuming an active shift if ended by mistake.

2. **Quick Counters (1 Tap [+] / [-])**:
   - 📞 **Total Calls**
   - ✅ **Picked**
   - ❌ **DNP**
   - 🩸 **Blood Tests Booked** *(Optional quick lab selection: Orange Labs, Redcliffe, Thyrocare, Healthians, Tata 1mg, Ekincare, Labstack or Skip)*
   - ❌ **Cancellations** *(Optional lab selection or Skip)*
   - 🔄 **Follow-ups**
   - 🚨 **Escalations** *(Quick Customer Name + Phone Number capture with a modal list view to check/delete records)*
   - 🎫 **Freshdesk Tickets**

3. **Lab Breakdown Display**:
   - Secondary badges show lab breakdowns (e.g. `Orange 8 · Redcliffe 6`) automatically only when lab data exists.

4. **Daily Task Update Formatter**:
   - Exact text output with emoji markers ready for WhatsApp/Slack:
     ```text
     📌 Daily Task Update

     🕘 Login: 9:05 AM
     🕕 Logout: 6:12 PM
     ⏱ Duration: 9h 07m

     📞 Total Calls: 50
     ✅ Picked: 40
     ❌ DNP: 15
     🩸 Blood Test Booked: 30
     ❌ Cancellations: 4
     🔄 Follow-up: 10
     🚨 Escalations: 2
     🎫 Freshdesk Tickets: 12

     🧪 Blood Test Labs:
     Orange Labs: 8
     Redcliffe: 6
     Thyrocare: 5
     Healthians: 4
     Tata 1mg: 3
     Ekincare: 2
     Labstack: 2
     ```
   - **📋 Copy Update**: Instant copy to clipboard with feedback badge.
   - **↗ Share**: Native Web Share API integration with automatic fallback to clipboard copy.

5. **Shift History & Daily Reset**:
   - Automatic separation by calendar date (`YYYY-MM-DD`).
   - Compact "History" view to review or copy previous daily summaries.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Storage**: Browser `localStorage`

---

## 📦 Setup & Development

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally in development mode
```bash
npm run dev
```

### 3. Build for production
```bash
npm run build
```

---

## 🚀 Deployment to Vercel

1. Push this repository to GitHub/GitLab.
2. Import the project in [Vercel Dashboard](https://vercel.com).
3. Framework preset will automatically be detected as **Vite**.
4. Click **Deploy**.

Alternatively using the Vercel CLI:
```bash
npm install -g vercel
vercel
```
