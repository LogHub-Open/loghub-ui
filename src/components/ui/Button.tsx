import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
  onClick?: () => void;
}

const sizes = {
  sm: { padding: '6px 12px', font: 'var(--text-caption)' },
  md: { padding: '9px 16px', font: 'var(--text-body-medium)' },
  lg: { padding: '12px 20px', font: 'var(--text-body-lg)' },
};

const variants = {
  primary: { background: 'var(--primary-gradient)', color: '#fff', border: '1px solid transparent' },
  secondary: { background: 'var(--bg-surface-raised)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' },
  ghost: { background: 'transparent', color: 'var(--text-primary)', border: '1px solid transparent' },
  danger: { background: 'var(--state-danger)', color: '#fff', border: '1px solid transparent' },
};

export function Button({ children, variant = 'primary', size = 'md', icon, disabled = false, type = 'button', onClick }: ButtonProps) {
  const s = sizes[size];
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: 'var(--font-sans)', font: s.font, fontWeight: 600,
        padding: s.padding, borderRadius: 'var(--radius-md)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'filter var(--duration-fast) var(--ease-standard), background var(--duration-fast)',
        ...v,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
    >
      {icon}
      {children}
    </button>
  );
}
