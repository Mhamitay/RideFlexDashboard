export async function listPayments() {
  const res = await fetch('/api/payments/list')
  if (!res.ok) throw new Error('Failed to fetch payments')
  return res.json()
}

export async function listWebhooks() {
  const res = await fetch('/api/payments/webhooks/list')
  if (!res.ok) throw new Error('Failed to fetch webhooks')
  return res.json() ///
}
