import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { listWebhooks } from '../services/adminApi'

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`

export default function WebhooksList(){
  const [hooks, setHooks] = useState<any[]>([])

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await listWebhooks()
        setHooks(res || [])
      }catch(e){
        console.error(e)
      }
    })()
  },[])

  return (
    <div>
      <h3>Recent Stripe Webhooks</h3>
      <Table>
        <thead>
          <tr>
            <th>EventId</th>
            <th>Type</th>
            <th>Processed</th>
            <th>ReceivedAt</th>
          </tr>
        </thead>
        <tbody>
          {hooks.map(h => (
            <tr key={h.id}>
              <MonoTd>{h.eventId}</MonoTd>
              <td>{h.type}</td>
              <td>{h.processed ? 'yes' : 'no'}</td>
              <td>{new Date(h.receivedAt).toLocaleString()}</td>
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
