import React from 'react'
import styled from 'styled-components'

const UsersContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  min-height: 200px;
`

export default function Users() {
  return (
    <UsersContainer>
      <h2>Users</h2>
      <p>Manage users and roles here. (Coming soon...)</p>
    </UsersContainer>
  )
}
