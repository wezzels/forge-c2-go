import React, { useState } from 'react';

interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  value,
  onChange
}) => {
  return (
    <div className="filter-dropdown" style={{ marginBottom: '10px' }}>
      <label style={{
        color: '#888',
        display: 'block',
        marginBottom: '5px',
        fontSize: '12px'
      }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: '#0f0f23',
          color: '#fff',
          border: '1px solid #333',
          borderRadius: '4px'
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
