import { useState, type ChangeEvent, type ReactNode } from 'react';

interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  size?: 'sm' | 'md';
  error?: boolean;
}

export function Input({ id, type = 'text', placeholder, value, onChange, icon, size = 'md', error }: InputProps) {
  const [focused, setFocused] = useState(false);
  const pad = size === 'sm' ? '6px 10px' : '9px 12px';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg-surface-raised)',
      border: '1px solid ' + (error ? 'var(--state-danger)' : focused ? 'var(--primary-400)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)', padding: pad,
      boxShadow: focused ? 'var(--shadow-focus)' : 'none',
      transition: 'border-color var(--duration-fast), box-shadow var(--duration-fast)',
    }}>
      {icon && <span style={{ color: 'var(--text-tertiary)', display: 'flex' }}>{icon}</span>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ flex: 1, width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', font: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}
      />
    </div>
  );
}
