import React, { useState } from 'react'
import Modal from 'styled-components/dist/components/Modal'
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
  th {
    font-size: 13px;
  }

  @media (max-width: 600px) {
    border-radius: 0;
    box-shadow: none;
    th, td {
      padding: 7px 4px;
      font-size: 12px;
      min-width: 80px;
    }
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
`

const Td = styled.td`
  padding: 13px 18px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
  vertical-align: middle;
  background: transparent;
`

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
      <Title>Twilio Call Logs</Title>
      <ActionButton onClick={fetchLogs} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Call Logs'}
      </ActionButton>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {logs.length > 0 && (
        <div style={{overflowX: 'auto', width: '100%'}}>
          <Table>
            <thead>
              <tr>
                <Th>Direction</Th>
                <Th>From</Th>
                <Th>To</Th>
                <Th>Status</Th>
                <Th>Start Time</Th>
                <Th>Duration (s)</Th>
                <Th>SID</Th>
              </tr>
            </thead>
            <tbody>
              {logs.map((call, idx) => (
                <tr key={call.sid || idx}>
                  <Td><Status incoming={call.direction === 'inbound'}>{call.direction === 'inbound' ? 'Incoming' : 'Outgoing'}</Status></Td>
                  <Td>
                    <PhoneLink onClick={() => openModal(call.from)}>{call.from}</PhoneLink>
                  </Td>
                  <Td>
                    <PhoneLink onClick={() => openModal(call.to)}>{call.to}</PhoneLink>
                  </Td>
                  <Td>{call.status}</Td>
                  <Td>{call.start_time ? new Date(call.start_time).toLocaleString('en-CA', { timeZone: 'America/Edmonton', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}</Td>
                  <Td>{call.duration || '-'}</Td>
                  <Td>{call.sid}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {modalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ModalClose onClick={closeModal} title="Close">×</ModalClose>
            <ModalTitle>Call This Number</ModalTitle>
            <div style={{marginBottom: 12, fontWeight: 500, color: '#374151'}}>Number to call: <span style={{color:'#2563eb'}}>{modalNumber}</span></div>
            <label style={{marginBottom: 6, fontWeight: 500}}>Your Phone Number (E.164 format)</label>
            <input
              type="tel"
              value={myPhone}
              onChange={e => setMyPhone(e.target.value)}
              placeholder="+14155551234"
              style={{padding:'10px', border:'1px solid #d1d5db', borderRadius:6, marginBottom:10, fontSize:16}}
              disabled={isCalling}
            />
            <button
              onClick={handleCall}
              disabled={isCalling || !myPhone.trim()}
              style={{background:'#667eea',color:'#fff',border:'none',borderRadius:6,padding:'12px 24px',fontSize:16,fontWeight:600,cursor:'pointer',marginTop:8,marginBottom:8}}
            >
              {isCalling ? '📞 Initiating Call...' : '📞 Call Now'}
            </button>
            {callStatus && <div style={{marginTop:8, color:callStatus.startsWith('✅')?'#059669':'#dc2626',fontWeight:500}}>{callStatus}</div>}
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}
