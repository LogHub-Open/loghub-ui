import type { LogLevel } from '../../types/LogEvent';

const LEVELS: Record<LogLevel, { color: string; bg: string; border: string }> = {
  ERROR: { color: 'var(--log-error)', bg: 'var(--log-error-bg)', border: 'oklch(60% 0.21 23 / 0.4)' },
  WARN: { color: 'var(--log-warn)', bg: 'var(--log-warn-bg)', border: 'oklch(78% 0.16 88 / 0.4)' },
  INFO: { color: 'var(--log-info)', bg: 'var(--log-info-bg)', border: 'oklch(68% 0.13 224 / 0.4)' },
  DEBUG: { color: 'var(--log-debug)', bg: 'var(--log-debug-bg)', border: 'oklch(64% 0.18 300 / 0.4)' },
  TRACE: { color: 'var(--log-trace)', bg: 'var(--log-trace-bg)', border: 'oklch(62% 0.014 266 / 0.4)' },
};

export function LogLevelBadge({ level }: { level: LogLevel }) {
  const t = LEVELS[level] ?? LEVELS.INFO;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', minWidth: 52, justifyContent: 'center',
      padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: t.bg, color: t.color, border: '1px solid ' + t.border,
      font: 'var(--text-label)', fontFamily: 'var(--font-mono)', letterSpacing: 'var(--tracking-label)',
    }}>{level}</span>
  );
}
