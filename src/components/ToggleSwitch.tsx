import React from 'react';
import styled from 'styled-components';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleInput = styled.input`
  width: 40px;
  height: 24px;
`;

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, disabled }) => (
  <ToggleLabel>
    <ToggleInput
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
      disabled={disabled}
    />
    <span>{label}</span>
  </ToggleLabel>
);

export default ToggleSwitch;
