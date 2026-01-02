import React, { useState } from 'react'
import styled from 'styled-components'
import type { RecentBooking, RefundRequest, CancellationRequest, CallCustomerRequest } from '../api'
import { processRefund, cancelBooking, callCustomer } from '../api'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`

const Th = styled.th`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  text-align: left;
  padding: 16px 20px;
  border-bottom: 2px solid #e2e8f0;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  
  &:first-child {
    border-top-left-radius: 12px;
  }
  
  &:last-child {
    border-top-right-radius: 12px;
  }
`

const Td = styled.td`
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.5;
  vertical-align: top;
  
  tr:hover & {
    background-color: #f8fafc;
  }
  
  tr:last-child & {
    border-bottom: none;
  }
`

const Mono = styled.span`
  font-family: 'JetBrains Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
  font-size: 12px;
  color: #6366f1;
  background: #eef2ff;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 500;
`

// Allow status to be null (API returns string | null) to satisfy TS strictness
const StatusBadge = styled.span<{status?: string | null}>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${props => {
    switch(props.status?.toLowerCase()) {
      case 'confirmed':
        return `background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;`
      case 'pending':
      case 'draft':
        return `background: #fef3c7; color: #92400e; border: 1px solid #fde68a;`
      case 'cancelled':
        return `background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;`
      case 'completed':
        return `background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;`
      case 'inprogress':
        return `background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;`
      default:
        return `background: #f3f4f6; color: #374151; border: 1px solid #d1d5db;`
    }
  }}
`

const Addr = styled.span`
  position: relative;
  display: inline-block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #374151;
  font-size: 13px;
  line-height: 1.4;
`

const AddrPopup = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  background: #ffffff;
  border: 1px solid #d1d5db;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: none;
  z-index: 50;
  min-width: 250px;
  max-width: 350px;
  font-size: 13px;
  line-height: 1.5;
  color: #374151;
  white-space: normal;
  word-wrap: break-word;
`

const AddrWrapper = styled.span`
  &:hover ${AddrPopup} {
    display: block;
  }
  
  &:focus-within ${AddrPopup} {
    display: block;
  }
`

const ActionButton = styled.button<{variant?: 'refund' | 'cancel' | 'info'}>`
  padding: 8px 12px;
  margin-bottom: 4px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  
  ${props => props.variant === 'refund' ? `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  ` : props.variant === 'cancel' ? `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  ` : props.variant === 'info' ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  ` : props.variant === 'call' ? `
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(34, 197, 94, 0.2);
    width: 100%;
    margin-top: 8px;
    
    &:hover {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      box-shadow: 0 4px 8px rgba(34, 197, 94, 0.3);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    
    &:hover {
      background: #e5e7eb;
    }
  `}
`

const InfoField = styled.div`
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
`

const SignatureImage = styled.img`
  width: 100%;
  max-width: 200px;
  max-height: 80px;
  object-fit: contain;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
`

// Call Customer Section Styles
const CallSection = styled.div`
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #86efac;
  border-radius: 8px;
`

const CallSectionHeader = styled.h4`
  margin: 0 0 8px 0;
  color: #166534;
  font-size: 16px;
  font-weight: 600;
`

const CallSectionDescription = styled.p`
  margin: 0 0 16px 0;
  color: #15803d;
  font-size: 13px;
  line-height: 1.5;
`

const CallStatusMessage = styled.div<{ success?: boolean }>`
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 6px;
  font-size: 14px;
  ${props => props.success ? `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #86efac;
  ` : `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #1f2937;
`

const FormGroup = styled.div`
  margin-bottom: 16px;
`

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  color: #374151;
`

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 24px;
`

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  input[type="radio"], input[type="checkbox"] {
    margin: 0;
  }
`

const BookingInfo = styled.div`
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
`

const NoActionsText = styled.span`
  color: #9ca3af;
  font-size: 12px;
  font-style: italic;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`

const LoadingState = styled.div`
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  
  &::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export default function BookingList({ bookings, loading, onRefresh }:{
  bookings: RecentBooking[], 
  loading?: boolean,
  onRefresh?: () => void
}){
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCustomerModal, setShowCustomerModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<RecentBooking | null>(null)
  const [refundType, setRefundType] = useState<'full' | 'partial'>('full')
  const [partialAmount, setPartialAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [cancelReason, setCancelReason] = useState('')
  const [issueRefundOnCancel, setIssueRefundOnCancel] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Call customer state
  const [myPhoneNumber, setMyPhoneNumber] = useState('')
  const [isCallingCustomer, setIsCallingCustomer] = useState(false)
  const [callStatus, setCallStatus] = useState<string | null>(null)

  if(loading) return <LoadingState>Loading bookings...</LoadingState>
  if(!bookings || bookings.length===0) return <EmptyState>📋 No recent bookings found</EmptyState>

  const renderAddress = (addr?: string | null) => {
    if (!addr) return ''
    const short = addr.length > 40 ? addr.slice(0,40) + '\u2026' : addr
    return (
      <AddrWrapper tabIndex={0} aria-label={addr}>
        <Addr>{short}</Addr>
        <AddrPopup role="tooltip">{addr}</AddrPopup>
      </AddrWrapper>
    )
  }

  const handleRefund = (booking: RecentBooking) => {
    setSelectedBooking(booking)
    setRefundType('full')
    setPartialAmount('')
    setRefundReason('')
    setShowRefundModal(true)
  }

  const handleCancel = (booking: RecentBooking) => {
    setSelectedBooking(booking)
    setCancelReason('')
    setIssueRefundOnCancel(true)
    setShowCancelModal(true)
  }

  const handleViewCustomer = (booking: RecentBooking) => {
    console.log('Opening customer modal for booking:', booking);
    console.log('Customer data:', {
      name: booking.clientName,
      phone: booking.clientPhone,
      email: booking.clientEmail,
      signature: booking.digitalSignature ? 'Present' : 'Missing'
    });
    setSelectedBooking(booking)
    setShowCustomerModal(true)
  }

  const processRefundRequest = async () => {
    if (!selectedBooking) return
    
    setIsProcessing(true)
    try {
      const request: RefundRequest = {
        bookingId: selectedBooking.id,
        amount: refundType === 'partial' ? parseFloat(partialAmount) : null,
        reason: refundReason,
        adminUserId: 'admin',
        adminComment: `${refundType} refund processed via dashboard`
      }

      await processRefund(request)
      alert('Refund processed successfully!')
      setShowRefundModal(false)
      onRefresh?.()
    } catch (error: any) {
      alert(`Error processing refund: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const processCancellation = async () => {
    if (!selectedBooking) return
    
    setIsProcessing(true)
    try {
      const request: CancellationRequest = {
        bookingId: selectedBooking.id,
        reason: cancelReason,
        issueRefund: issueRefundOnCancel,
        adminUserId: 'admin'
      }

      await cancelBooking(request)
      alert('Booking cancelled successfully!')
      setShowCancelModal(false)
      onRefresh?.()
    } catch (error: any) {
      alert(`Error cancelling booking: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Initiates a call to the customer via Twilio.
   * 
   * Flow:
   * 1. Twilio calls YOUR phone (myPhoneNumber) first
   * 2. When you answer, you hear "Connecting you to the customer now"
   * 3. Twilio then dials the customer's phone
   * 4. Customer sees only the RideFlex Twilio number (your real number is hidden)
   */
  const handleCallCustomer = async () => {
    if (!selectedBooking?.clientPhone) {
      alert('Customer phone number not available')
      return
    }

    if (!myPhoneNumber.trim()) {
      alert('Please enter your phone number')
      return
    }

    setIsCallingCustomer(true)
    setCallStatus(null)

    try {
      const request: CallCustomerRequest = {
        customerPhone: selectedBooking.clientPhone,
        myPhone: myPhoneNumber
      }

      const result = await callCustomer(request)
      
      if (result.success) {
        setCallStatus(`✅ ${result.message}`)
      } else {
        setCallStatus(`❌ ${result.message}`)
      }
    } catch (error: any) {
      setCallStatus(`❌ Error: ${error.message}`)
    } finally {
      setIsCallingCustomer(false)
    }
  }

  // Debug: Log first booking to see what data we're receiving
  if (bookings && bookings.length > 0) {
    console.log('First booking data:', bookings[0]);
  }

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Th>Booked At</Th>
            <Th>Scheduled For</Th>
            <Th>ID</Th>
            <Th>Status</Th>
            <Th>Distance</Th>
            <Th>Amount</Th>
            <Th>Pickup</Th>
            <Th>Dropoff</Th>
            <Th>🔧 Admin Actions</Th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b=> (
            <tr key={b.id}>
              <Td>{b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}</Td>
              <Td>{b.scheduledStart ? new Date(b.scheduledStart).toLocaleString() : '—'}</Td>
              <Td><Mono>{b.bookingRef ?? b.id}</Mono></Td>
              <Td><StatusBadge status={b.status}>{b.status}</StatusBadge></Td>
              <Td>{b.distance != null ? `${b.distance.toFixed(1)} km` : '—'}</Td>
              <Td><strong>${(b.totalAmount||0).toFixed(2)}</strong></Td>
              <Td>{renderAddress(b.pickupLocation ?? b.clientName ?? '')}</Td>
              <Td>{renderAddress(b.dropoffLocation ?? '')}</Td>
              <Td>
                <ActionButton variant="info" onClick={() => handleViewCustomer(b)}>
                  👤 Info
                </ActionButton>
                {b.canRefund && (
                  <ActionButton variant="refund" onClick={() => handleRefund(b)}>
                    💰 Refund
                  </ActionButton>
                )}
                {b.canCancel && (
                  <ActionButton variant="cancel" onClick={() => handleCancel(b)}>
                    ❌ Cancel
                  </ActionButton>
                )}
                {!b.canRefund && !b.canCancel && (
                  <NoActionsText>No actions</NoActionsText>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Refund Modal */}
      {showRefundModal && selectedBooking && (
        <Modal onClick={() => setShowRefundModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>Issue Refund</ModalHeader>
            
            <BookingInfo>
              <strong>Booking #{selectedBooking.bookingRef}</strong><br/>
              Client: {selectedBooking.clientName}<br/>
              Amount: ${(selectedBooking.totalAmount || 0).toFixed(2)}
            </BookingInfo>

            <RadioGroup>
              <RadioOption>
                <input 
                  type="radio" 
                  checked={refundType === 'full'} 
                  onChange={() => setRefundType('full')}
                  aria-label="Full refund option"
                />
                Full Refund (${(selectedBooking.totalAmount || 0).toFixed(2)})
              </RadioOption>
              <RadioOption>
                <input 
                  type="radio" 
                  checked={refundType === 'partial'} 
                  onChange={() => setRefundType('partial')}
                  aria-label="Partial refund option"
                />
                Partial Refund
              </RadioOption>
            </RadioGroup>

            {refundType === 'partial' && (
              <FormGroup>
                <Label>Refund Amount</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  max={selectedBooking.totalAmount || 0}
                  value={partialAmount}
                  onChange={e => setPartialAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </FormGroup>
            )}

            <FormGroup>
              <Label>Reason for Refund</Label>
              <TextArea 
                rows={3}
                value={refundReason}
                onChange={e => setRefundReason(e.target.value)}
                placeholder="Enter reason for refund"
              />
            </FormGroup>

            <ButtonGroup>
              <ActionButton onClick={() => setShowRefundModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton 
                variant="refund" 
                onClick={processRefundRequest}
                disabled={isProcessing || !refundReason.trim()}
              >
                {isProcessing ? 'Processing...' : 'Issue Refund'}
              </ActionButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <Modal onClick={() => setShowCancelModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>Cancel Booking</ModalHeader>
            
            <BookingInfo>
              <strong>Booking #{selectedBooking.bookingRef}</strong><br/>
              Client: {selectedBooking.clientName}<br/>
              Amount: ${(selectedBooking.totalAmount || 0).toFixed(2)}
            </BookingInfo>

            <FormGroup>
              <RadioOption>
                <input 
                  type="checkbox" 
                  checked={issueRefundOnCancel}
                  onChange={e => setIssueRefundOnCancel(e.target.checked)}
                  aria-label="Issue refund automatically"
                />
                Issue refund automatically
              </RadioOption>
            </FormGroup>

            <FormGroup>
              <Label>Cancellation Reason</Label>
              <TextArea 
                rows={3}
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation"
              />
            </FormGroup>

            <ButtonGroup>
              <ActionButton onClick={() => setShowCancelModal(false)}>
                Cancel
              </ActionButton>
              <ActionButton 
                variant="cancel" 
                onClick={processCancellation}
                disabled={isProcessing || !cancelReason.trim()}
              >
                {isProcessing ? 'Processing...' : 'Cancel Booking'}
              </ActionButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {/* Customer Info Modal */}
      {showCustomerModal && selectedBooking && (
        <Modal onClick={() => setShowCustomerModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>Customer Information</ModalHeader>
            
            <BookingInfo>
              <strong>Booking #{selectedBooking.bookingRef || selectedBooking.id}</strong>
            </BookingInfo>

            <FormGroup>
              <Label>Name</Label>
              <InfoField>
                {selectedBooking.clientName || '—'}
              </InfoField>
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <InfoField>
                {selectedBooking.clientPhone || '—'}
              </InfoField>
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <InfoField>
                {selectedBooking.clientEmail || '—'}
              </InfoField>
            </FormGroup>

            <FormGroup>
              <Label>Pickup Location</Label>
              <InfoField>
                {selectedBooking.pickupLocation || '—'}
              </InfoField>
            </FormGroup>

            <FormGroup>
              <Label>Dropoff Location</Label>
              <InfoField>
                {selectedBooking.dropoffLocation || '—'}
              </InfoField>
            </FormGroup>

            <FormGroup>
              <Label>Scheduled For</Label>
              <InfoField>
                {selectedBooking.scheduledStart 
                  ? new Date(selectedBooking.scheduledStart).toLocaleString()
                  : '—'}
              </InfoField>
            </FormGroup>

            <FormGroup>
              <Label>Booking Created</Label>
              <InfoField>
                {selectedBooking.createdAt 
                  ? new Date(selectedBooking.createdAt).toLocaleString()
                  : '—'}
              </InfoField>
            </FormGroup>

            {selectedBooking.digitalSignature && (
              <FormGroup>
                <Label>Digital Signature</Label>
                <SignatureImage 
                  src={selectedBooking.digitalSignature} 
                  alt="Customer Signature"
                />
              </FormGroup>
            )}

            {/* Call Customer Section */}
            {selectedBooking.clientPhone && (
              <CallSection>
                <CallSectionHeader>📞 Call Customer</CallSectionHeader>
                <CallSectionDescription>
                  Enter your phone number below. Twilio will call YOU first, 
                  then connect you to the customer. The customer will only see 
                  our business number, not your personal number.
                </CallSectionDescription>
                
                <FormGroup>
                  <Label>Your Phone Number (E.164 format)</Label>
                  <Input
                    type="tel"
                    value={myPhoneNumber}
                    onChange={e => setMyPhoneNumber(e.target.value)}
                    placeholder="+14155551234"
                    disabled={isCallingCustomer}
                  />
                </FormGroup>

                {callStatus && (
                  <CallStatusMessage success={callStatus.startsWith('✅')}>
                    {callStatus}
                  </CallStatusMessage>
                )}

                <ActionButton
                  variant="call"
                  onClick={handleCallCustomer}
                  disabled={isCallingCustomer || !myPhoneNumber.trim()}
                >
                  {isCallingCustomer ? '📞 Initiating Call...' : '📞 Call Customer'}
                </ActionButton>
              </CallSection>
            )}

            <ButtonGroup>
              <ActionButton onClick={() => {
                setShowCustomerModal(false)
                setCallStatus(null)
              }}>
                Close
              </ActionButton>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}
