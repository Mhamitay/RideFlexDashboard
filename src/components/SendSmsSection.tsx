import React, { useState } from 'react'
import styled from 'styled-components'
import { API_BASE } from '../api'
import authService from '../services/authService'

const SmsSection = styled.div`
  margin-top: 32px;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  max-width: 480px;
`

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 15px;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 15px;
  resize: vertical;
`

const Button = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`

const StatusMsg = styled.div`
  margin-top: 10px;
  font-weight: 500;
  color: #059669;
`

export default function SendSmsSection() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      const res = await authService.authenticatedFetch(`${API_BASE}/api/communication/send-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message })
      })
      if (!res.ok) {
        const errorText = await res.text().catch(() => 'Unknown error')
        throw new Error(errorText)
      }
      setStatus('SMS sent successfully!')
    } catch (err: any) {
      setStatus('Failed to send SMS: ' + (err?.message || 'Unknown error'))
    } finally {
      setSending(false)
    }
  }

  return (
    <SmsSection>
      <h3>Send SMS</h3>
      <form onSubmit={handleSend}>
        <Label htmlFor="sms-phone">Phone Number</Label>
        <Input id="sms-phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+14155551234" required />
        <Label htmlFor="sms-message">Message</Label>
        <TextArea id="sms-message" rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..." required />
        <Button type="submit" disabled={sending || !phone || !message}>Send SMS</Button>
      </form>
      {status && <StatusMsg>{status}</StatusMsg>}
    </SmsSection>
  )
}
