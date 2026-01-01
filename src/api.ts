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
