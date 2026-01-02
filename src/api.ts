// Prefer Vite env var, fall back to the Azure API you provided so the UI works4
// even if the dev server wasn't restarted after adding .env
export const API_BASE = (import.meta as any).VITE_API_BASE_URL ?? 'https://rfex-dtgtecbsd2fmfbhc.canadacentral-01.azurewebsites.net'

import authService from './services/authService';

export type RecentBooking = {
  id: string;
  bookingRef?: string | null;
  clientName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  digitalSignature?: string | null;
  status?: string | null;
  totalAmount?: number | null;
  paidAmount?: number | null;
  createdAt?: string | null;
  scheduledStart?: string | null;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  distance?: number | null;
  canRefund?: boolean;
  canCancel?: boolean;
  paymentIntentId?: string | null;
}

export type DashboardSummary = {
  totalBookings: number;
  pendingPayments: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalPaid: number;
  totalRefunds: number;
  netRevenue: number;
  refundsToday: number;
  refundAmountToday: number;
  recentBookings: RecentBooking[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  let res: Response
  try{
    res = await authService.authenticatedFetch(`${API_BASE}/api/dashboard/summary`, { 
      cache: 'no-store' 
    })
  }catch(err:any){
    throw new Error('Network error fetching dashboard: ' + (err?.message ?? String(err)))
  }

  if (!res.ok) {
    const txt = await res.text().catch(()=>'<no-body>')
    throw new Error(`Failed to fetch dashboard summary: ${res.status} ${res.statusText} - ${txt}`)
  }

  try{
    return await res.json()
  }catch(err:any){
    throw new Error('Invalid JSON from dashboard endpoint: ' + (err?.message ?? String(err)))
  }
}

// Admin refund functionality
export type RefundRequest = {
  bookingId: string;
  amount?: number | null;
  reason: string;
  adminUserId: string;
  adminComment: string;
}

export type RefundResponse = {
  success: boolean;
  refundId: string;
  refundAmount: number;
  status: string;
  message: string;
  processedAt: string;
}

export type CancellationRequest = {
  bookingId: string;
  reason: string;
  issueRefund: boolean;
  refundAmount?: number | null;
  adminUserId: string;
}

export type ChatBooking = {
  id: string;
  createdAt: string;
  name?: string | null;
  phone?: string | null;
  pickupLocation?: string | null;
  dropoffLocation?: string | null;
  serviceType?: string | null;
  scheduledAtUtc?: string | null;
  notes?: string | null;
  source?: string | null;
  status?: string | null;
}

export type ChatBookingsResponse = {
  data: ChatBooking[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function processRefund(request: RefundRequest): Promise<RefundResponse> {
  const res = await authService.authenticatedFetch(`${API_BASE}/api/admin/refunds/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')
    throw new Error(`Refund failed: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return await res.json()
}

export async function cancelBooking(request: CancellationRequest): Promise<RefundResponse> {
  const res = await authService.authenticatedFetch(`${API_BASE}/api/admin/refunds/cancel-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')
    throw new Error(`Cancellation failed: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return await res.json()
}

export async function fetchChatBookings(page = 1, pageSize = 50): Promise<ChatBookingsResponse> {
  const res = await authService.authenticatedFetch(`${API_BASE}/api/chat-bookings?page=${page}&pageSize=${pageSize}`, {
    cache: 'no-store'
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')
    throw new Error(`Failed to fetch chat bookings: ${res.status} ${res.statusText} - ${errorText}`)
  }

  return await res.json()
}

// ============================================
// Twilio Call Customer API
// ============================================

/**
 * Request to initiate a call to a customer.
 * Both phone numbers must be in E.164 format (e.g., +14155551234).
 */
export type CallCustomerRequest = {
  /** Customer's phone number in E.164 format */
  customerPhone: string;
  /** Your phone number in E.164 format - Twilio will call YOU first */
  myPhone: string;
}

/**
 * Response from initiating a customer call.
 */
export type CallCustomerResponse = {
  /** Whether the call was successfully initiated */
  success: boolean;
  /** Twilio's unique call identifier */
  callSid?: string;
  /** Current call status (queued, ringing, in-progress, etc.) */
  status?: string;
  /** Human-readable message about the result */
  message: string;
  /** Error details if the call failed */
  error?: string;
}

/**
 * Initiates a bridged call to a customer via Twilio.
 * 
 * Call flow:
 * 1. Twilio calls YOUR phone (myPhone) first
 * 2. When you answer, you hear "Connecting you to the customer now"
 * 3. Twilio then dials the customer's phone
 * 4. Customer sees only the RideFlex Twilio number (your personal number is hidden)
 * 5. Both parties are connected for conversation
 * 
 * @param request - Contains customerPhone and myPhone in E.164 format
 * @returns Call result with callSid and status
 */
export async function callCustomer(request: CallCustomerRequest): Promise<CallCustomerResponse> {
  const res = await authService.authenticatedFetch(`${API_BASE}/api/call/call-customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(errorData.message || `Call failed: ${res.status} ${res.statusText}`)
  }

  return await res.json()
}

/**
 * Complete a booking (mark as completed)
 * @param bookingId - The booking GUID to complete
 */
export async function completeBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
  const res = await authService.authenticatedFetch(`${API_BASE}/api/dashboard/bookings/${bookingId}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(errorData.message || `Complete booking failed: ${res.status} ${res.statusText}`)
  }

  return await res.json()
}

