import React, { useState } from 'react'
import { DateTime } from 'luxon';
// Removed date-fns-tz import
// Removed broken Modal import
const PhoneLink = styled.span`
  color: #2563eb;
  text-decoration: underline;
  cursor: pointer;
  &:hover {
    color: #1d4ed8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 32px 28px;
  min-width: 340px;
  max-width: 95vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  @media (max-width: 480px) {
    min-width: unset;
    padding: 16px 6px;
    border-radius: 6px;
  }
`;

const ModalLabel = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
`;

const ModalNumber = styled.div`
  margin-bottom: 12px;
  font-weight: 500;
  color: #374151;
  span {
    color: #2563eb;
  }
`;

const ModalInput = styled.input`
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-bottom: 10px;
  font-size: 16px;
`;

const ModalButton = styled.button`
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 8px;
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const ModalCallStatus = styled.div<{success?: boolean}>`
  margin-top: 8px;
  font-weight: 500;
  color: ${props => props.success ? '#059669' : '#dc2626'};
`;
import { callCustomer } from '../api'
const ModalTitle = styled.h3`
  margin: 0 0 18px 0;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
`;

const ModalClose = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 22px;
  color: #6b7280;
  cursor: pointer;
  margin-bottom: 8px;
  &:hover { color: #ef4444; }
`
import styled from 'styled-components'
import { API_BASE } from '../api'
import authService from '../services/authService'

const Container = styled.div`
  width: 100%;
  margin: 0;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 32px 24px;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 10px 2px;
    border-radius: 0;
    box-shadow: none;
    border: none;
  }
`

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
`

const ActionButton = styled.button`
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #5a67d8;
  }
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: 24px;
  @media (max-width: 600px) {
    margin-top: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  border-radius: 8px;
  overflow: hidden;
  font-family: inherit;

  thead tr {
    background: #e0e7ef;
  }
  tbody tr:nth-child(even) {
    background: #f8fafc;
  }
  tbody tr:hover {
    background: #e0e7ef;
    transition: background 0.2s;
  }

  th, td {
    padding: 14px 8px;
    font-size: 13px;
    word-break: break-all;
    min-width: 80px;
  }
`;

const Th = styled.th`
  background: #e0e7ef;
  padding: 14px 18px;
  border-bottom: 2px solid #cbd5e1;
  text-align: left;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
`;
// Robust Calgary time formatter for UTC ISO strings (uses real timezone, handles DST)
function formatCalgaryTime(utcString: string) {
  if (!utcString) return '-';
  let dt = DateTime.fromISO(utcString, { zone: 'utc' });
  if (!dt.isValid) {
    // Try parsing as 'yyyy-MM-dd HH:mm:ss' in UTC
    dt = DateTime.fromFormat(utcString, 'yyyy-MM-dd HH:mm:ss', { zone: 'utc' });
  }
  if (!dt.isValid) {
    dt = DateTime.fromJSDate(new Date(utcString), { zone: 'utc' });
  }
  if (!dt.isValid) {
    return 'Invalid Date';
  }
  return dt.setZone('America/Edmonton').toFormat('yyyy-MM-dd hh:mm:ss a');
}

const Td = styled.td`
  padding: 13px 18px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
  vertical-align: middle;
  background: transparent;
`;

const Status = styled.span<{incoming: boolean}>`
  color: ${props => props.incoming ? '#059669' : '#2563eb'};
  font-weight: 500;
`

const ErrorMsg = styled.div`
  color: #dc2626;
  margin-top: 16px;
  font-weight: 500;
`

export default function TwilioCallLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalNumber, setModalNumber] = useState<string|null>(null)
  const [myPhone, setMyPhone] = useState('')
  const [callStatus, setCallStatus] = useState<string|null>(null)
  const [isCalling, setIsCalling] = useState(false)
    const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing'>('all');
    const [hide14388339093, setHide14388339093] = useState(false);

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      // Use authenticatedFetch and API_BASE to ensure correct backend
      const res = await authService.authenticatedFetch(`${API_BASE}/api/calllogs/twilio-logs`)
      if (!res.ok) throw new Error('Failed to fetch call logs')
      const data = await res.json()
      setLogs(data.calls || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter controls
  const FilterBar = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 18px;
  `;

  const FilterButton = styled.button<{active: boolean}>`
    padding: 6px 16px;
    border-radius: 6px;
    border: none;
    background: ${({active}) => active ? '#6366f1' : '#e5e7eb'};
    color: ${({active}) => active ? 'white' : '#1e293b'};
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;

  const openModal = (number: string) => {
    setModalNumber(number)
    setModalOpen(true)
    setCallStatus(null)
    setMyPhone('')
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalNumber(null)
    setCallStatus(null)
    setMyPhone('')
    setIsCalling(false)
  }

  const handleCall = async () => {
    if (!modalNumber || !myPhone.trim()) {
      setCallStatus('Please enter your phone number')
      return
    }
    setIsCalling(true)
    setCallStatus(null)
    try {
      const result = await callCustomer({ customerPhone: modalNumber, myPhone })
      setCallStatus(result.success ? `✅ ${result.message}` : `❌ ${result.message}`)
    } catch (error: any) {
      setCallStatus(`❌ Error: ${error.message}`)
    } finally {
      setIsCalling(false)
    }
  }

  return (
    <Container>
      <Title>Call Logs</Title>
      <FilterBar>
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
        <FilterButton active={filter === 'incoming'} onClick={() => setFilter('incoming')}>Incoming</FilterButton>
        <FilterButton active={filter === 'outgoing'} onClick={() => setFilter('outgoing')}>Outgoing</FilterButton>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 16 }}>
            <input
              type="checkbox"
              checked={hide14388339093}
              onChange={e => setHide14388339093(e.target.checked)}
              style={{ marginRight: 4 }}
            />
            Hide calls from +14388339093
          </label>
      </FilterBar>
      <ActionButton onClick={fetchLogs} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Call Logs'}
      </ActionButton>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {logs.length > 0 && (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Direction</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Status</Th>
                <Th>Start Time (Calgary)</Th>
                <Th>Original Time (UTC)</Th>
                <Th>Duration (s)</Th>
                <Th>SID</Th>
              </tr>
            </thead>
            <tbody>
              {logs
                .filter(call => {
                  if (filter === 'all') return true;
                  if (filter === 'incoming') return call.direction === 'inbound';
                  if (filter === 'outgoing') return call.direction !== 'inbound';
                  return true;
                })
                  .filter(call => {
                    if (!hide14388339093) return true;
                    // Hide if from or to is +14388339093
                    return call.from !== '+14388339093' && call.to !== '+14388339093';
                  })
                .map((call, idx) => (
                <tr key={call.sid || idx}>
                  <Td><Status incoming={call.direction === 'inbound'}>{call.direction === 'inbound' ? 'Incoming' : 'Outgoing'}</Status></Td>
                  <Td>
                    <PhoneLink onClick={() => openModal(call.from)}>{call.from}</PhoneLink>
                  </Td>
                  <Td>
                    <PhoneLink onClick={() => openModal(call.to)}>{call.to}</PhoneLink>
                  </Td>
                  <Td>{call.status}</Td>
                   <Td>
                     {call.start_time ? formatCalgaryTime(call.start_time) : '-'}
                   </Td>
                  <Td>{call.start_time || '-'}</Td>
                  <Td>{call.duration || '-'}</Td>
                  <Td>{call.sid}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}
      {modalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalClose onClick={closeModal} title="Close">×</ModalClose>
            <ModalTitle>Call This Number</ModalTitle>
            <ModalNumber>Number to call: <span>{modalNumber}</span></ModalNumber>
            <ModalLabel>Your Phone Number (E.164 format)</ModalLabel>
            <ModalInput
              type="tel"
              value={myPhone}
              onChange={e => setMyPhone(e.target.value)}
              placeholder="+14155551234"
              disabled={isCalling}
            />
            <ModalButton
              onClick={handleCall}
              disabled={isCalling || !myPhone.trim()}
            >
              {isCalling ? '📞 Initiating Call...' : '📞 Call Now'}
            </ModalButton>
            {callStatus && (
              <ModalCallStatus success={callStatus.startsWith('✅')}>
                {callStatus}
              </ModalCallStatus>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}
