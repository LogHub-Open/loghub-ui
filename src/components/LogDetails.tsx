import type { LogEvent } from '../types/LogEvent';
import { LogLevelBadge } from './data/LogLevelBadge';

interface LogDetailsProps {
  log: LogEvent;
  onClose: () => void;
}

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  } catch {
    return timestamp;
  }
}

function formatJson(obj: unknown): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

const fieldLabelStyle = {
  display: 'block',
  marginBottom: 'var(--space-1)',
  color: 'var(--text-tertiary)',
  font: 'var(--text-label)',
  fontFamily: 'var(--font-sans)',
  letterSpacing: 'var(--tracking-label)',
  textTransform: 'uppercase' as const,
};

export function LogDetails({ log, onClose }: LogDetailsProps) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)', zIndex: 50 }}>
      <div style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-3)', maxWidth: 720, width: '100%', maxHeight: '90vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ color: 'var(--text-primary)', font: 'var(--text-h3)', fontFamily: 'var(--font-sans)' }}>Detalhes do Log</h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', display: 'flex' }}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <LogLevelBadge level={log.level} />
            <span style={{ color: 'var(--text-tertiary)', font: 'var(--text-caption)' }}>{formatTimestamp(log.timestamp)}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={fieldLabelStyle}>Application</label>
              <p style={{ color: 'var(--text-primary)', font: 'var(--text-body-medium)' }}>{log.application}</p>
            </div>
            <div>
              <label style={fieldLabelStyle}>Environment</label>
              <p style={{ color: 'var(--text-secondary)', font: 'var(--text-body)' }}>{log.environment}</p>
            </div>
          </div>

          {log.traceId && (
            <div>
              <label style={fieldLabelStyle}>Trace ID</label>
              <code style={{ display: 'block', background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', font: 'var(--text-code-sm)', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {log.traceId}
              </code>
            </div>
          )}

          <div>
            <label style={fieldLabelStyle}>Mensagem</label>
            <div style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
              <p style={{ color: 'var(--text-primary)', font: 'var(--text-body)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{log.message}</p>
            </div>
          </div>

          {log.sdk && (
            <div>
              <label style={fieldLabelStyle}>SDK</label>
              <p style={{ color: 'var(--text-secondary)', font: 'var(--text-body)' }}>{log.sdk.language} v{log.sdk.version}</p>
            </div>
          )}

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div>
              <label style={fieldLabelStyle}>Metadata</label>
              <pre style={{ background: 'var(--neutral-950)', color: 'var(--log-info)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', overflowX: 'auto', font: 'var(--text-code-sm)', fontFamily: 'var(--font-mono)' }}>
                {formatJson(log.metadata)}
              </pre>
            </div>
          )}
        </div>

        <div style={{ padding: 'var(--space-4) var(--space-6)', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface-raised)' }}>
          <button
            onClick={onClose}
            style={{
              padding: '9px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)', color: 'var(--text-primary)', font: 'var(--text-body-medium)',
              fontFamily: 'var(--font-sans)', fontWeight: 600, cursor: 'pointer',
              transition: 'filter var(--duration-fast) var(--ease-standard)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
