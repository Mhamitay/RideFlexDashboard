import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { API_BASE } from '../api';
import authService from '../services/authService';

interface AzureKeyVaultSecret {
  name: string;
  description: string;
  currentValue: string | number | boolean;
}


const SettingsContainer = styled.div`
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  padding: 32px;
`;


const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
`;


const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
`;


const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
`;


const PageTitle = styled.h2`
  margin-bottom: 16px;
`;


const ErrorMsg = styled.div`
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
`;

const Settings: React.FC = () => {
  const [secrets, setSecrets] = useState<AzureKeyVaultSecret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecrets = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await authService.authenticatedFetch(`${API_BASE}/api/settings/azure-keyvault-info`);
        if (!res.ok) throw new Error('Failed to fetch secrets');
        const data = await res.json();
        setSecrets(data.secrets || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load secrets');
      } finally {
        setLoading(false);
      }
    };
    fetchSecrets();
  }, []);

  return (
    <SettingsContainer>
      <PageTitle>Azure Key Vault Secrets</PageTitle>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {loading ? (
        <div>Loading...</div>
      ) : secrets.length > 0 ? (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Value</Th>
            </tr>
          </thead>
          <tbody>
            {secrets.map(secret => (
              <tr key={secret.name}>
                <Td>{secret.name}</Td>
                <Td>{secret.description}</Td>
                <Td>{String(secret.currentValue)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <div>No secrets found.</div>
      )}
    </SettingsContainer>
  );
};

export default Settings;


