import React, { useEffect, useState, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { fetchDashboardSummary, DashboardSummary, RecentBooking } from '../api'
import BookingList from './BookingList'

const Container = styled.div`
  display: grid;
  gap: 18px;
`

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`

const StatCard = styled.div<{variant?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'teal' | 'yellow' | 'indigo' | 'pink'}>`
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(16,24,40,0.06);
  border: 1px solid rgba(15,23,42,0.04);
  display:flex;
  flex-direction:column;
  justify-content:center;
  
  ${p => {
    switch(p.variant) {
      case 'blue':
        return `background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border: 1px solid #93c5fd;`
      case 'green':
        return `background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border: 1px solid #86efac;`
      case 'red':
        return `background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); border: 1px solid #fca5a5;`
      case 'purple':
        return `background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border: 1px solid #c4b5fd;`
      case 'orange':
        return `background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%); border: 1px solid #fb923c;`
      case 'teal':
        return `background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%); border: 1px solid #5eead4;`
      case 'yellow':
        return `background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 1px solid #fcd34d;`
      case 'indigo':
        return `background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border: 1px solid #a5b4fc;`
      case 'pink':
        return `background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border: 1px solid #f9a8d4;`
      default:
        return `background: linear-gradient(180deg,#ffffff,#f7fbff); border: 1px solid rgba(15,23,42,0.04);`
    }
  }}
`

const Big = styled.p`
  font-size:26px;margin:8px 0;color:#0b1724;font-weight:700;
`

const Label = styled.h3`
  margin:0;color:#6b7280;font-size:13px;
`

const Realtime = styled.section`
  background: linear-gradient(180deg,#ffffff,#f7fbff);
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(16,24,40,0.06);
`

const ErrorBox = styled.div`
  color: #fb7185;
  padding: 8px;
`

export default function Dashboard(){
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mountedRef = useRef<boolean>(true)
  const summaryRef = useRef<DashboardSummary | null>(null)

  const load = useCallback(async (showLoading = false) => {
    if (!mountedRef.current) return
    if (showLoading) setLoading(true)
    try{
      const data = await fetchDashboardSummary()
      if (!mountedRef.current) return

      // Only update when the data actually changed to avoid flicker
      const prev = summaryRef.current
      const changed = prev === null || JSON.stringify(prev) !== JSON.stringify(data)
      if (changed) {
        setSummary(data)
        summaryRef.current = data
      }

      setError(null)
    }catch(e:any){
      if (!mountedRef.current) return
      setError(e?.message || 'Unknown error')
    }finally{
      if (showLoading) setLoading(false)
    }
  }, [])

  useEffect(()=>{
    mountedRef.current = true
    void load(true)
    const t = setInterval(()=>{ if (mountedRef.current) void load(false) }, 5000)
    return ()=>{ mountedRef.current = false; clearInterval(t) }
  },[load])

  const totalBookings = summary?.totalBookings ?? 0
  const totalRevenue = summary?.totalRevenue ?? 0
  const totalRefunds = summary?.totalRefunds ?? 0
  const netRevenue = summary?.netRevenue ?? 0
  const cancelledBookings = summary?.cancelledBookings ?? 0
  const refundsToday = summary?.refundsToday ?? 0
  const refundAmountToday = summary?.refundAmountToday ?? 0
  
  // GST settings: default to 5% (changeable)
  const GST_RATE = 0.05
  // Assume totalRevenue is gross (includes GST). Extract GST and compute TA_GST as total minus GST.
  // GST = totalRevenue * GST_RATE / (1 + GST_RATE)
  const gstAmount = +(totalRevenue * GST_RATE / (1 + GST_RATE))
  const taGst = +(totalRevenue - gstAmount)
  const thirtyPercent = +(taGst * 0.3)
  const recent = (summary?.recentBookings ?? []) as RecentBooking[]

  return (
    <Container>
      <StatsGrid>
        {/* === BOOKING METRICS === */}
        <StatCard variant="blue">
          <Label>Total Bookings</Label>
          <Big>{totalBookings}</Big>
        </StatCard>
        <StatCard variant="orange">
          <Label>Cancelled Bookings</Label>
          <Big>{cancelledBookings}</Big>
        </StatCard>
        
        {/* === REVENUE METRICS === */}
        <StatCard variant="green">
          <Label>Total Revenue</Label>
          <Big>${totalRevenue.toFixed(2)}</Big>
        </StatCard>
        <StatCard variant="teal">
          <Label>Net Revenue</Label>
          <Big>${netRevenue.toFixed(2)}</Big>
        </StatCard>
        
        {/* === REFUND METRICS === */}
        <StatCard variant="red">
          <Label>Total Refunds</Label>
          <Big>${totalRefunds.toFixed(2)}</Big>
        </StatCard>
        <StatCard variant="purple">
          <Label>Today's Refunds</Label>
          <Big>{refundsToday}</Big>
          <small>${refundAmountToday.toFixed(2)}</small>
        </StatCard>
        
        {/* === TAX METRICS === */}
        <StatCard variant="yellow">
          <Label>GST ({(GST_RATE*100).toFixed(0)}%)</Label>
          <Big>${gstAmount.toFixed(2)}</Big>
        </StatCard>
        <StatCard variant="indigo">
          <Label>Revenue (Ex-GST)</Label>
          <Big>${taGst.toFixed(2)}</Big>
        </StatCard>
        <StatCard variant="pink">
          <Label>Your Share (30%)</Label>
          <Big>${thirtyPercent.toFixed(2)}</Big>
        </StatCard>
      </StatsGrid>

      <Realtime>
        <h2>Realtime bookings</h2>
        {loading && <div>Loading dashboard</div>}
        {!loading && error && (
          <ErrorBox aria-live="polite">
            <p>Failed to load dashboard: {error}</p>
            <button onClick={()=>load(true)}>Retry</button>
          </ErrorBox>
        )}

        {!loading && !error && recent.length === 0 && (
          <div>No recent bookings  try creating a booking from the app or refresh.</div>
        )}

        {!loading && !error && recent.length > 0 && (
          <BookingList bookings={recent} loading={false} onRefresh={() => load(true)} />
        )}
      </Realtime>
    </Container>
  )
}
