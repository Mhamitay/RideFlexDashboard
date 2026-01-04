import React, { useState, useEffect } from 'react';
// Edit state for Azure Key Vault secrets
// Add after other useState hooks
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editPassword, setEditPassword] = useState<string>("");
  const [updatingSecret, setUpdatingSecret] = useState(false);
  // Start editing a secret
  const startEdit = (index: number, value: any) => {
    setEditingIndex(index);
    setEditValue(String(value));
    setEditPassword("");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
    setEditPassword("");
  };

  // Handle update submit
  const handleSecretUpdate = async (
    e: React.FormEvent,
    secretName: string,
    index: number
  ) => {
    e.preventDefault();
    setUpdatingSecret(true);
    setError(null);
    try {
      const res = await authService.authenticatedFetch(
        `${API_BASE}/api/settings/update-azure-secret`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: secretName,
            value: editValue,
            password: editPassword,
          }),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update secret");
      }
      await fetchSettings();
      cancelEdit();
    } catch (err: any) {
      setError(err.message || "Failed to update secret");
    } finally {
      setUpdatingSecret(false);
    }
  };
import styled from 'styled-components';
import { API_BASE } from '../api';
import authService from '../services/authService';

// Types
interface NotificationSettings {
  enabled: boolean;
  operationsNumbers: string[];
}

interface BookingSettings {
  minimumBookingAdvanceMinutes: number;
  maxBookingDaysInAdvance: number;
  maxDistanceKm: number;
}

interface AllSettings {
  booking: BookingSettings;
  notifications: NotificationSettings;
}

interface AzureKeyVaultSecret {
  name: string;
  description: string;
  currentValue: string | number | boolean;
}

interface AzureKeyVaultInfo {
  message: string;
  secrets: AzureKeyVaultSecret[];
  note: string;
}

// Styled Components
const SettingsContainer = styled.div`
  padding: 0;
`;

const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SectionDescription = styled.p`
  margin: 0 0 20px 0;
  font-size: 14px;
  color: #6b7280;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const SettingLabel = styled.div`
  flex: 1;
`;

const SettingName = styled.div`
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 4px;
`;

const SettingDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const SettingValue = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Badge = styled.span<{ variant: 'success' | 'warning' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;

  ${({ variant }) => {
    switch (variant) {
      case 'success':
        return `
          background: #dcfce7;
          color: #166534;
        `;
      case 'warning':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'info':
        return `
          background: #e0e7ff;
          color: #3730a3;
        `;
    }
  }}
`;

const PhoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const PhoneItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const PhoneNumber = styled.span`
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
  font-size: 14px;
  color: #1a1a2e;
`;

const PhoneIndex = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #6366f1;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: #1e40af;
  line-height: 1.5;
`;

const InfoTextWarning = styled(InfoText)`
  color: #92400e;
`;

const InfoBoxWarning = styled(InfoBox)`
  background: #fef3c7;
  border-color: #fcd34d;
  margin-top: 20px;
`;

const InfoTitleWarning = styled(InfoTitle)`
  color: #92400e;
`;

const PageTitle = styled.h2`
  margin: 0;
  margin-bottom: 4px;
`;

const PageDescription = styled.p`
  margin: 0;
  color: #6b7280;
  font-size: 14px;
`;

const EmptyPhoneText = styled.span`
  color: #9ca3af;
`;

const SecretTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 13px;
`;

const SecretTableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
`;

const SecretTableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  color: #4b5563;
`;

const SecretName = styled.code`
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #6366f1;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #6b7280;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 16px;
  color: #dc2626;
  margin-bottom: 16px;
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #4f46e5;
  }

  &:disabled {
    background: #a5b4fc;
    cursor: not-allowed;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export default function Settings() {
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const [azureInfo, setAzureInfo] = useState<AzureKeyVaultInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsRes, azureRes] = await Promise.all([
        authService.authenticatedFetch(`${API_BASE}/api/settings`),
        authService.authenticatedFetch(`${API_BASE}/api/settings/azure-keyvault-info`)
      ]);

      if (!settingsRes.ok) {
        throw new Error('Failed to fetch settings');
      }

      const settingsData = await settingsRes.json();
      setSettings(settingsData);

      if (azureRes.ok) {
        const azureData = await azureRes.json();
        setAzureInfo(azureData);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <SettingsContainer>
        <LoadingSpinner>Loading settings...</LoadingSpinner>
      </SettingsContainer>
    );
  }

  if (error) {
    return (
      <SettingsContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <RefreshButton onClick={fetchSettings}>Try Again</RefreshButton>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <HeaderRow>
        <div>
          <PageTitle>System Settings</PageTitle>
          <PageDescription>
            View current configuration values. Settings are managed via Azure Key Vault.
          </PageDescription>
        </div>
        <RefreshButton onClick={fetchSettings} disabled={loading}>
          🔄 Refresh
        </RefreshButton>
      </HeaderRow>

      {/* Booking Settings */}
      <Section>
        <SectionTitle>
          📅 Booking Settings
        </SectionTitle>
        <SectionDescription>
          Configure booking time restrictions and limits
        </SectionDescription>

        <SettingRow>
          <SettingLabel>
            <SettingName>Minimum Booking Advance Time</SettingName>
            <SettingDescription>
              How far in advance customers must book for same-day rides
            </SettingDescription>
          </SettingLabel>
          <SettingValue>
            <Badge variant="info">
              {settings?.booking.minimumBookingAdvanceMinutes} minutes
            </Badge>
          </SettingValue>
        </SettingRow>

        <SettingRow>
          <SettingLabel>
            <SettingName>Maximum Booking Days in Advance</SettingName>
            <SettingDescription>
              How many days ahead customers can schedule a ride
            </SettingDescription>
          </SettingLabel>
          <SettingValue>
            <Badge variant="info">
              {settings?.booking.maxBookingDaysInAdvance} days
            </Badge>
          </SettingValue>
        </SettingRow>

        <SettingRow>
          <SettingLabel>
            <SettingName>Maximum Distance</SettingName>
            <SettingDescription>
              Maximum allowed distance for a single ride
            </SettingDescription>
          </SettingLabel>
          <SettingValue>
            <Badge variant="info">
              {settings?.booking.maxDistanceKm} km
            </Badge>
          </SettingValue>
        </SettingRow>
      </Section>

      {/* Notification Settings */}
      <Section>
        <SectionTitle>
          📱 SMS Notification Settings
        </SectionTitle>
        <SectionDescription>
          Configure SMS notifications for new bookings and payments
        </SectionDescription>

        <SettingRow>
          <SettingLabel>
            <SettingName>SMS Notifications</SettingName>
            <SettingDescription>
              Send SMS alerts when new bookings are created or paid
            </SettingDescription>
          </SettingLabel>
          <SettingValue>
            <Badge variant={settings?.notifications.enabled ? 'success' : 'warning'}>
              {settings?.notifications.enabled ? '✓ Enabled' : '✗ Disabled'}
            </Badge>
          </SettingValue>
        </SettingRow>

        <SettingRow>
          <SettingLabel>
            <SettingName>Operations Phone Numbers</SettingName>
            <SettingDescription>
              Phone numbers that receive booking notifications
            </SettingDescription>
          </SettingLabel>
        </SettingRow>

        <PhoneList>
          {settings?.notifications.operationsNumbers && settings.notifications.operationsNumbers.length > 0 ? (
            settings.notifications.operationsNumbers.map((phone, index) => (
              <PhoneItem key={index}>
                <PhoneIndex>{index + 1}</PhoneIndex>
                <PhoneNumber>{phone}</PhoneNumber>
              </PhoneItem>
            ))
          ) : (
            <PhoneItem>
              <EmptyPhoneText>No phone numbers configured</EmptyPhoneText>
            </PhoneItem>
          )}
        </PhoneList>
      </Section>

      {/* Azure Key Vault Info */}
      <Section>
        <SectionTitle>
          ☁️ Azure Key Vault Configuration
        </SectionTitle>
        <SectionDescription>
          Settings are stored securely in Azure Key Vault. Use the following secret names to update values.
        </SectionDescription>

        <InfoBox>
          <InfoTitle>
            ℹ️ How to Update Settings
          </InfoTitle>
          <InfoText>
            To modify these settings, update the corresponding secrets in Azure Key Vault. 
            Changes will take effect after the application restarts or the configuration cache expires.
            <br /><br />
            <strong>Azure Portal Path:</strong> Key Vault → Secrets → Create/Update Secret
          </InfoText>
        </InfoBox>

        {azureInfo && (
          <SecretTable>
            <thead>
              <tr>
                <SecretTableHeader>Secret Name</SecretTableHeader>
                <SecretTableHeader>Description</SecretTableHeader>
                <SecretTableHeader>Current Value</SecretTableHeader>
              </tr>
            </thead>
            <tbody>
              {azureInfo.secrets.map((secret, index) => (
                <tr key={index}>
                  <SecretTableCell>
                    <SecretName>{secret.name}</SecretName>
                  </SecretTableCell>
                  <SecretTableCell>{secret.description}</SecretTableCell>
                  <SecretTableCell>
                    {editingIndex === index ? (
                      <form
                        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                        onSubmit={e => handleSecretUpdate(e, secret.name, index)}
                      >
                        <input
                          type="text"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          style={{ minWidth: 80 }}
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={editPassword}
                          onChange={e => setEditPassword(e.target.value)}
                          style={{ minWidth: 80 }}
                        />
                        <button type="submit" disabled={updatingSecret}>
                          {updatingSecret ? 'Saving...' : 'Save'}
                        </button>
                        <button type="button" onClick={() => cancelEdit()} disabled={updatingSecret}>
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        {typeof secret.currentValue === 'boolean'
                          ? (secret.currentValue ? 'true' : 'false')
                          : secret.currentValue}
                        <button style={{ marginLeft: 8 }} onClick={() => startEdit(index, secret.currentValue)}>
                          Edit
                        </button>
                      </>
                    )}
                  </SecretTableCell>
                </tr>
              ))}
            </tbody>
          </SecretTable>
        )}

        <InfoBoxWarning>
          <InfoTitleWarning>
            💡 Adding More Phone Numbers
          </InfoTitleWarning>
          <InfoTextWarning>
            {azureInfo?.note || 'To add more phone numbers, create additional secrets with incrementing indices (e.g., BookingNotifications--OperationsNumbers--3, BookingNotifications--OperationsNumbers--4, etc.)'}
          </InfoTextWarning>
        </InfoBoxWarning>
      </Section>
    </SettingsContainer>
  );
}
