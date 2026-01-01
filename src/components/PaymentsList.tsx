import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { listPayments } from '../services/adminApi'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`

export default function PaymentsList(){
  const [payments, setPayments] = useState<any[]>([])

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await listPayments()
        setPayments(res || [])
      }catch(e){
        console.error(e)
      }
    })()
  },[])

  return (
    <div>
      <h3>Recent Payments</h3>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>BookingId</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>CreatedAt</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <MonoTd>{p.id}</MonoTd>
              <MonoTd>{p.bookingId}</MonoTd>
              <td>{(p.amountCents/100).toFixed(2)}</td>
              <td>{p.currency}</td>
              <td>{p.status}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

const MonoTd = styled.td`
  font-family: monospace;
`
