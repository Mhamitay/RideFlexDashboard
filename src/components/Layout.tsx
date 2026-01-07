import React, { useState } from 'react'
import styled from 'styled-components'
import Sidebar, { SidebarSection } from './Sidebar'
import Dashboard from './Dashboard'
import PaymentsList from './PaymentsList'
import WebhooksList from './WebhooksList'
import ChatBookingsList from './ChatBookingsList'
import Settings from './Settings'
import CallTwoNumbersPage from './CallTwoNumbersPage'
import TwilioCallLogsPage from './TwilioCallLogsPage'
import { useAuth } from '../contexts/AuthContext'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8fafc;

  @media (max-width: 720px) {
    flex-direction: column;
  }
`

const MainContent = styled.main<{sidebarOpen: boolean}>`
  flex: 1;
  margin-left: ${props => props.sidebarOpen ? '280px' : '70px'};
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-x: auto;

  @media (max-width: 720px) {
    margin-left: 0;
    width: 100vw;
    min-width: 0;
  }
`

const TopBar = styled.div`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

const UserName = styled.span`
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
`

const UserRole = styled.span`
  color: #6b7280;
  font-size: 12px;
`

const LogoutButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
`

const ContentArea = styled.div`
  flex: 1;
  padding: 24px;
  min-width: 0;

  @media (max-width: 600px) {
    padding: 8px 2px;
  }
`

const PageHeader = styled.div`
  margin-bottom: 32px;
`

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
`

const PageSubtitle = styled.p`
  color: #6b7280;
  font-size: 16px;
  margin: 0;
`

const SectionContent = styled.div`
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

// Future sections can be added here
const RefundsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`

const SettingsSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
`

const ComingSoonText = styled.p`
  color: #6b7280;
  font-style: italic;
`

const sections: SidebarSection[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '📊'
  },
  {
    id: 'bookings',
    label: 'All Bookings',
    icon: '📋'
  },
  {
    id: 'chat-bookings',
    label: 'Chat Bookings',
    icon: '💬'
  },
  {
    id: 'call-two-numbers',
    label: 'Call Two Numbers',
    icon: '📞'
  },
  {
    id: 'call-logs',
    label: 'Twilio Call Logs',
    icon: '📑'
  },
  {
    id: 'refunds',
    label: 'Refund History',
    icon: '💰',
    badge: 'New'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📈'
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: '💳'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️'
  }
]

const sectionConfig = {
    'call-logs': {
      title: 'Twilio Call Logs',
      subtitle: 'View all incoming and outgoing calls for your Twilio number'
    },
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Overview of your ride booking business'
  },
  bookings: {
    title: 'All Bookings',
    subtitle: 'Manage and view all ride bookings'
  },
  'chat-bookings': {
    title: 'Chat Bookings',
    subtitle: 'Bookings created through the AI chatbot'
  },
  'call-two-numbers': {
    title: 'Call Two Numbers',
    subtitle: 'Call two numbers and bridge them together'
  },
  refunds: {
    title: 'Refund History',
    subtitle: 'Track all refund transactions and admin actions'
  },
  analytics: {
    title: 'Analytics',
    subtitle: 'Detailed insights and reports'
  },
  settings: {
    title: 'Settings',
    subtitle: 'Configure your dashboard preferences'
  }
}

export default function Layout() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, logout } = useAuth()

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
  }

  const handleLogout = () => {
    logout()
  }

  const getUserInitials = (user: any) => {
    if (!user) return 'U'
    const firstName = user.firstName || ''
    const lastName = user.lastName || ''
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U'
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />
      case 'bookings':
        return (
          <RefundsSection>
            <h3>All Bookings</h3>
            <p>This section will show a comprehensive list of all bookings with advanced filtering and search capabilities.</p>
            <ComingSoonText>Coming soon...</ComingSoonText>
          </RefundsSection>
        )
      case 'refunds':
        return (
          <RefundsSection>
            <h3>Refund History</h3>
            <p>This section will show all refund transactions, admin actions, and refund analytics.</p>
            <ComingSoonText>Coming soon...</ComingSoonText>
          </RefundsSection>
        )
      case 'analytics':
        return (
          <SettingsSection>
            <h3>Analytics & Reports</h3>
            <p>This section will contain detailed charts, graphs, and business intelligence reports.</p>
            <ComingSoonText>Coming soon...</ComingSoonText>
          </SettingsSection>
        )
      case 'payments':
        return (
          <SettingsSection>
            <PaymentsList />
            <Spacer />
            <WebhooksList />
          </SettingsSection>
        )
      case 'chat-bookings':
        return (
          <SettingsSection>
            <ChatBookingsList />
          </SettingsSection>
        )
      case 'call-two-numbers':
        return (
          <SettingsSection>
            <CallTwoNumbersPage />
          </SettingsSection>
        )
      case 'call-logs':
        return (
          <SettingsSection>
            <TwilioCallLogsPage />
          </SettingsSection>
        )
      case 'settings':
        return (
          <SettingsSection>
            <Settings />
          </SettingsSection>
        )
      default:
        return <Dashboard />
    }
  }

  const currentSection = sectionConfig[activeSection as keyof typeof sectionConfig]

  return (
    <LayoutContainer>
      <Sidebar
        sections={sections}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onToggle={setSidebarOpen}
      />
      
      <MainContent sidebarOpen={sidebarOpen}>
        <TopBar>
          <TopBarLeft>
            <div>
              <PageTitleSmall>{currentSection.title}</PageTitleSmall>
              <PageSubtitleSmall>{currentSection.subtitle}</PageSubtitleSmall>
            </div>
          </TopBarLeft>
          
          <TopBarRight>
            <UserInfo>
              <UserAvatar>
                {getUserInitials(user)}
              </UserAvatar>
              <UserDetails>
                <UserName>
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </UserName>
                <UserRole>
                  {user?.roles?.join(', ') || 'User'}
                </UserRole>
              </UserDetails>
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              Sign Out
            </LogoutButton>
          </TopBarRight>
        </TopBar>
        
        <ContentArea>
          <SectionContent>
            {renderSectionContent()}
          </SectionContent>
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  )
}

const Spacer = styled.div`
  height: 24px;
`

const PageTitleSmall = styled(PageTitle)`
  margin: 0;
  font-size: 24px;
`

const PageSubtitleSmall = styled(PageSubtitle)`
  margin: 0;
  font-size: 14px;
`
