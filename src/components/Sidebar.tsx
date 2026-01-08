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

  @media (max-width: 720px) {
    width: 100vw !important;
    height: 64px;
    left: 0;
    top: auto;
    bottom: 0;
    border-right: none;
    border-top: 1.5px solid #334155;
    box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: visible;
    background: #1e293b;
    padding: 0;
    /* Always show horizontal scrollbar for discoverability */
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      height: 8px;
      background: #1e293b;
    }
    &::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }
  }
`

const SidebarHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 12px;
  @media (max-width: 720px) {
    display: none;
  }
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
  @media (max-width: 720px) {
    display: none;
  }
  &:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
`

const Nav = styled.nav`
  padding: 20px 0;
  @media (max-width: 720px) {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0;
    width: 100vw;
    overflow-x: auto;
    gap: 0;
    height: 64px;
    min-width: 100vw;
    pointer-events: auto;
    z-index: 2000;
    /* Always show horizontal scrollbar for discoverability */
    scrollbar-width: thin;
    &::-webkit-scrollbar {
      height: 8px;
      background: #1e293b;
    }
    &::-webkit-scrollbar-thumb {
      background: #334155;
      border-radius: 4px;
    }
  }
`

const NavItem = styled.button<{active?: boolean, isOpen: boolean}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: ${props => props.active ? '#3b82f6' : '#cbd5e1'};
  background: ${props => props.active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  border: none;
  border-right: ${props => props.active ? '3px solid #3b82f6' : '3px solid transparent'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 64px;
  justify-content: center;
  outline: none;
  font: inherit;
  background-clip: padding-box;
  -webkit-tap-highlight-color: rgba(59,130,246,0.15);
  pointer-events: auto;
  z-index: 2100;
  
  &:hover, &:focus-visible {
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

  @media (max-width: 720px) {
    padding: 12px 18px;
    border-right: none;
    border-bottom: ${props => props.active ? '3px solid #3b82f6' : '3px solid transparent'};
    flex-direction: column;
    gap: 2px;
    min-width: 90px;
    max-width: 120px;
    pointer-events: auto;
    z-index: 2100;
    .label {
      opacity: 1;
      font-size: 12px;
      font-weight: 500;
      margin-top: 2px;
      text-align: center;
    }
    .icon {
      font-size: 20px;
    }
    .badge {
      opacity: 1;
      font-size: 10px;
      margin-left: 0;
      margin-top: 2px;
    }
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
            type="button"
            active={activeSection === section.id}
            isOpen={isOpen}
            tabIndex={0}
            aria-current={activeSection === section.id ? 'page' : undefined}
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
