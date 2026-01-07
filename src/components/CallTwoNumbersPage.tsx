import React, { useState } from 'react'
import styled from 'styled-components'
import { callCustomer } from '../api'

const Container = styled.div`
  max-width: 480px;
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

const FormGroup = styled.div`
  margin-bottom: 18px;
`

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
`

const ActionButton = styled.button`
  background: #667eea;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 24px;
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

const CallStatus = styled.div<{success: boolean}>`
  margin-top: 16px;
  color: ${props => props.success ? '#059669' : '#dc2626'};
  font-weight: 500;
`

export default function CallTwoNumbersPage() {
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
  const [isCalling, setIsCalling] = useState(false)
  const [callStatus, setCallStatus] = useState<string|null>(null)
  const [callSuccess, setCallSuccess] = useState<boolean>(false)

  const handleCall = async () => {
    if (!number1.trim() || !number2.trim()) {
      setCallStatus('Please enter both numbers')
      setCallSuccess(false)
      return
    }
    setIsCalling(true)
    setCallStatus(null)
    try {
      // Call number1 and then number2, bridging them
      const result = await callCustomer({ customerPhone: number2, myPhone: number1 })
      setCallStatus(result.success ? `✅ ${result.message}` : `❌ ${result.message}`)
      setCallSuccess(result.success)
    } catch (error: any) {
      setCallStatus(`❌ Error: ${error.message}`)
      setCallSuccess(false)
    } finally {
      setIsCalling(false)
    }
  }

  return (
    <Container>
      <Title>Call Two Numbers</Title>
      <FormGroup>
        <Label>First Number (Your Phone)</Label>
        <Input
          type="tel"
          value={number1}
          onChange={e => setNumber1(e.target.value)}
          placeholder="+14155551234"
          disabled={isCalling}
        />
      </FormGroup>
      <FormGroup>
        <Label>Second Number (Other Party)</Label>
        <Input
          type="tel"
          value={number2}
          onChange={e => setNumber2(e.target.value)}
          placeholder="+14155559876"
          disabled={isCalling}
        />
      </FormGroup>
      <ActionButton onClick={handleCall} disabled={isCalling || !number1.trim() || !number2.trim()}>
        {isCalling ? '📞 Initiating Call...' : '📞 Call Both Numbers'}
      </ActionButton>
      {callStatus && <CallStatus success={callSuccess}>{callStatus}</CallStatus>}
    </Container>
  )
}
