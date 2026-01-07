import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 32px 24px;
  border: 1px solid #e5e7eb;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
`

const Th = styled.th`
  background: #f3f4f6;
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
`

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #e5e7eb;
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

  const fetchLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      // This should call your backend API endpoint that proxies Twilio logs
      const res = await fetch('/api/call/twilio-logs')
      if (!res.ok) throw new Error('Failed to fetch call logs')
      const data = await res.json()
      setLogs(data.calls || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
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
                <Td>{call.from}</Td>
                <Td>{call.to}</Td>
                <Td>{call.status}</Td>
                <Td>{call.start_time || '-'}</Td>
                <Td>{call.duration || '-'}</Td>
                <Td>{call.sid}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  )
}
