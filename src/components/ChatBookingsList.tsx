import React, { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { fetchChatBookings, ChatBooking, ChatBookingsResponse } from '../api'

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

const StatusBadge = styled.span<{status?: string | null}>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${props => {
    switch(props.status?.toLowerCase()) {
      case 'new':
        return `background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;`
      case 'contacted':
        return `background: #fef3c7; color: #92400e; border: 1px solid #fde68a;`
      case 'converted':
        return `background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;`
      case 'cancelled':
        return `background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;`
      case 'spam':
        return `background: #f3f4f6; color: #374151; border: 1px solid #d1d5db;`
      default:
        return `background: #f3f4f6; color: #374151; border: 1px solid #d1d5db;`
    }
  }}
`

const SourceBadge = styled.span<{source?: string | null}>`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  ${props => {
    switch(props.source?.toLowerCase()) {
      case 'website-chat':
        return `background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe;`
      case 'mobile-app':
        return `background: #fef3c7; color: #92400e; border: 1px solid #fde68a;`
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

const ActionButton = styled.button<{variant?: 'primary' | 'secondary' | 'success' | 'danger'}>`
  padding: 6px 12px;
  margin-right: 6px;
  margin-bottom: 4px;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      transform: translateY(-1px);
    }
  ` : props.variant === 'success' ? `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: translateY(-1px);
    }
  ` : props.variant === 'danger' ? `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
    
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: translateY(-1px);
    }
  ` : `
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
    
    &:hover {
      background: #e5e7eb;
    }
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`

const ModalHeader = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #1f2937;
`

const InfoField = styled.div`
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
`

const InfoLabel = styled.div`
  font-weight: 600;
  color: #374151;
  font-size: 12px;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`

const ConversationBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #374151;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`

const PaginationInfo = styled.span`
  color: #6b7280;
  font-size: 14px;
`

const PaginationButtons = styled.div`
  display: flex;
  gap: 8px;
`

export default function ChatBookingsList() {
  const [chatBookings, setChatBookings] = useState<ChatBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBooking, setSelectedBooking] = useState<ChatBooking | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const mountedRef = useRef(true)
  const pageSize = 25

  const loadChatBookings = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const response: ChatBookingsResponse = await fetchChatBookings(page, pageSize)
      if (!mountedRef.current) return

      setChatBookings(response.data)
      setCurrentPage(response.page)
      setTotalPages(response.totalPages)
      setTotalCount(response.totalCount)
      setError(null)
    } catch (err: any) {
      if (!mountedRef.current) return
      setError(err?.message || 'Failed to load chat bookings')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [pageSize])

  useEffect(() => {
    mountedRef.current = true
    loadChatBookings(1)
    return () => { mountedRef.current = false }
  }, [loadChatBookings])

  const handleViewDetails = (booking: ChatBooking) => {
    setSelectedBooking(booking)
    setShowDetailsModal(true)
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadChatBookings(page)
    }
  }

  const renderAddress = (addr?: string | null) => {
    if (!addr) return '—'
    const short = addr.length > 40 ? addr.slice(0, 40) + '…' : addr
    return (
      <AddrWrapper tabIndex={0} aria-label={addr}>
        <Addr>{short}</Addr>
        <AddrPopup role="tooltip">{addr}</AddrPopup>
      </AddrWrapper>
    )
  }

  if (loading) return <LoadingState>Loading chat bookings...</LoadingState>
  if (error) return <EmptyState>❌ {error}</EmptyState>
  if (!chatBookings || chatBookings.length === 0) return <EmptyState>💬 No chat bookings found</EmptyState>

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Th>Created</Th>
            <Th>ID</Th>
            <Th>Status</Th>
            <Th>Name</Th>
            <Th>Phone</Th>
            <Th>Pickup</Th>
            <Th>Dropoff</Th>
            <Th>Service</Th>
            <Th>Scheduled</Th>
            <Th>Source</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {chatBookings.map(booking => (
            <tr key={booking.id}>
              <Td>{new Date(booking.createdAt).toLocaleString()}</Td>
              <Td><Mono>{booking.id.substring(0, 8)}</Mono></Td>
              <Td><StatusBadge status={booking.status}>{booking.status || 'new'}</StatusBadge></Td>
              <Td>{booking.name || '—'}</Td>
              <Td>{booking.phone || '—'}</Td>
              <Td>{renderAddress(booking.pickupLocation)}</Td>
              <Td>{renderAddress(booking.dropoffLocation)}</Td>
              <Td>{booking.serviceType || '—'}</Td>
              <Td>{booking.scheduledAtUtc ? new Date(booking.scheduledAtUtc).toLocaleString() : '—'}</Td>
              <Td><SourceBadge source={booking.source}>{booking.source || 'unknown'}</SourceBadge></Td>
              <Td>
                <ActionButton variant="primary" onClick={() => handleViewDetails(booking)}>
                  👁️ View
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PaginationContainer>
        <PaginationInfo>
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} chat bookings
        </PaginationInfo>
        <PaginationButtons>
          <ActionButton 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </ActionButton>
          <span style={{ padding: '6px 12px', color: '#6b7280' }}>
            Page {currentPage} of {totalPages}
          </span>
          <ActionButton 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </ActionButton>
        </PaginationButtons>
      </PaginationContainer>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <Modal onClick={() => setShowDetailsModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>Chat Booking Details</ModalHeader>
            
            <InfoLabel>Booking ID</InfoLabel>
            <InfoField><Mono>{selectedBooking.id}</Mono></InfoField>

            <InfoLabel>Created At</InfoLabel>
            <InfoField>{new Date(selectedBooking.createdAt).toLocaleString()}</InfoField>

            <InfoLabel>Status</InfoLabel>
            <InfoField><StatusBadge status={selectedBooking.status}>{selectedBooking.status || 'new'}</StatusBadge></InfoField>

            <InfoLabel>Customer Name</InfoLabel>
            <InfoField>{selectedBooking.name || 'Not provided'}</InfoField>

            <InfoLabel>Phone Number</InfoLabel>
            <InfoField>{selectedBooking.phone || 'Not provided'}</InfoField>

            <InfoLabel>Pickup Location</InfoLabel>
            <InfoField>{selectedBooking.pickupLocation || 'Not provided'}</InfoField>

            <InfoLabel>Dropoff Location</InfoLabel>
            <InfoField>{selectedBooking.dropoffLocation || 'Not provided'}</InfoField>

            <InfoLabel>Service Type</InfoLabel>
            <InfoField>{selectedBooking.serviceType || 'Not specified'}</InfoField>

            <InfoLabel>Scheduled Time</InfoLabel>
            <InfoField>
              {selectedBooking.scheduledAtUtc ? new Date(selectedBooking.scheduledAtUtc).toLocaleString() : 'Not scheduled'}
            </InfoField>

            <InfoLabel>Source</InfoLabel>
            <InfoField><SourceBadge source={selectedBooking.source}>{selectedBooking.source || 'unknown'}</SourceBadge></InfoField>

            {selectedBooking.notes && (
              <>
                <InfoLabel>Notes</InfoLabel>
                <InfoField>{selectedBooking.notes}</InfoField>
              </>
            )}

            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <ActionButton onClick={() => setShowDetailsModal(false)}>
                Close
              </ActionButton>
            </div>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}