import type { ChangeEvent } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  value?: string;
  options: SelectOption[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  size?: 'sm' | 'md';
}

export function Select({ id, value, options, onChange, size = 'md' }: SelectProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', width: '100%' }}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        style={{
          appearance: 'none', width: '100%', background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', font: 'var(--text-body)', fontFamily: 'var(--font-sans)',
          padding: size === 'sm' ? '6px 30px 6px 10px' : '9px 34px 9px 12px', cursor: 'pointer', outline: 'none',
        }}
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none', fontSize: 10 }}>▾</span>
    </div>
  );
}
