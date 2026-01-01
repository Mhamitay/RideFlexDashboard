RideFlex Admin Dashboard
========================

Complete admin dashboard for RideFlex ride booking system with refund management.

## 🎯 Features

### 📊 Dashboard Analytics
- **Booking Metrics**: Total bookings, cancelled bookings
- **Revenue Metrics**: Total revenue, net revenue (after refunds)
- **Refund Metrics**: Total refunds, today's refunds with amounts
- **Tax Metrics**: GST calculation, revenue ex-GST, your 30% share
- **Real-time Updates**: Auto-refresh every 5 seconds

### 🔧 Admin Refund Management
- **Process Refunds**: Full or partial refunds with Stripe integration
- **Cancel Bookings**: Cancel with optional automatic refunds
- **Reason Tracking**: Required reasons for all admin actions
- **Audit Trail**: All refunds logged with admin details
- **Business Logic**: Time-based refund calculations

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API (Optional)
Create a `.env` file with:
```
VITE_API_BASE_URL="https://your-api-url.com"
```
*Defaults to Azure production API if not specified*

### 3. Run Dashboard
```bash
npm run dev
```

## 🔧 Admin Refund Process

### How to Process Refunds:
1. Open the dashboard in your browser
2. Scroll to "Realtime bookings" section
3. Find the booking you want to refund
4. Click "💰 Refund" in the Admin Actions column
5. Choose full refund or enter partial amount
6. Add a reason for the refund
7. Click "Issue Refund" to process via Stripe

### How to Cancel Bookings:
1. Find the booking in the table
2. Click "❌ Cancel" in the Admin Actions column  
3. Choose whether to issue automatic refund
4. Add cancellation reason
5. Click "Cancel Booking" to complete

## 📋 Admin Actions Availability

**Refunds Available For:**
- Confirmed bookings
- Driver assigned bookings
- In progress bookings
- Completed bookings
*(Must have valid PaymentIntentId)*

**Cancellations Available For:**
- Any booking except already cancelled or completed

## 🎨 Dashboard Layout

The dashboard is organized into logical sections:
1. **Stats Cards**: 9 colored cards showing key metrics
2. **Admin Panel**: Instructions and guidance
3. **Realtime Bookings**: Live table with admin actions

## 🔒 Security Notes

- This dashboard is intended for admin use only
- All refund actions require admin authentication
- Reasons are mandatory for audit compliance
- All actions are logged with timestamps

---

*Built with Vite + React + TypeScript + Styled Components*
