import React, { useState } from 'react'
import styled from 'styled-components'

const SidebarContainer = styled.div<{isOpen: boolean}>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '280px' : '70px'};
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  transition: width 0.3s ease;
  z-index: 1000;
  overflow: hidden;
  border-right: 1px solid #334155;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
`

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 12px;
`

const Logo = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
`

const AppName = styled.h1<{isOpen: boolean}>`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
  white-space: nowrap;
`

const ToggleButton = styled.button`
  position: absolute;
  right: -15px;
  top: 30px;
  width: 30px;
  height: 30px;
  background: #3b82f6;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  
  &:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
`

const Nav = styled.nav`
  padding: 20px 0;
`

const NavItem = styled.div<{active?: boolean, isOpen: boolean}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: ${props => props.active ? '#3b82f6' : '#cbd5e1'};
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  border-right: ${props => props.active ? '3px solid #3b82f6' : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
  
  .icon {
    font-size: 20px;
    flex-shrink: 0;
    width: 20px;
    display: flex;
    justify-content: center;
  }
  
  .label {
    font-size: 14px;
    font-weight: 500;
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
  
  .badge {
    background: #ef4444;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    margin-left: auto;
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity 0.3s ease;
  }
`

const SidebarFooter = styled.div<{isOpen: boolean}>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid #334155;
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.3s ease;
`

const UserInfo = styled.div`
  color: #cbd5e1;
  font-size: 12px;
  text-align: center;
`

export type SidebarSection = {
  id: string
  label: string
  icon: string
  badge?: string | number
}

interface SidebarProps {
  sections: SidebarSection[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
  onToggle?: (isOpen: boolean) => void
}

export default function Sidebar({ sections, activeSection, onSectionChange, onToggle }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onToggle?.(newState)
  }

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <Logo>RF</Logo>
        <AppName isOpen={isOpen}>RideFlex</AppName>
      </SidebarHeader>
      
      <ToggleButton onClick={handleToggle}>
        {isOpen ? '←' : '→'}
      </ToggleButton>
      
      <Nav>
        {sections.map(section => (
          <NavItem
            key={section.id}
            active={activeSection === section.id}
            isOpen={isOpen}
            onClick={() => onSectionChange(section.id)}
          >
            <span className="icon">{section.icon}</span>
            <span className="label">{section.label}</span>
            {section.badge && <span className="badge">{section.badge}</span>}
          </NavItem>
        ))}
      </Nav>
      
      <SidebarFooter isOpen={isOpen}>
        <UserInfo>
          Admin Dashboard<br/>
          v1.0.0
        </UserInfo>
      </SidebarFooter>
    </SidebarContainer>
  )
}
