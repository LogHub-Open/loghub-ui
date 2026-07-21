import type { LogEvent } from '../types/LogEvent';
import { LogLevelBadge } from './data/LogLevelBadge';

interface LogTableProps {
  logs: LogEvent[];
  onSelectLog: (log: LogEvent) => void;
  isLoading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
    });
  } catch {
    return timestamp;
  }
}

function truncateMessage(message: string, maxLength: number = 80): string {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + '...';
}

const cellStyle = { padding: '9px 16px', font: 'var(--text-code-sm)', fontFamily: 'var(--font-mono)' };
const gridColumns = '160px 80px 140px 120px 1fr';

export function LogTable({ logs, onSelectLog, isLoading, page, totalPages, onPageChange }: LogTableProps) {
  if (isLoading) {
    return (
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'center' }}>
        <div style={{ width: 32, height: 32, margin: '0 auto', borderRadius: '50%', border: '2px solid var(--border-default)', borderBottomColor: 'var(--primary-500)', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-secondary)', font: 'var(--text-body)' }}>Carregando logs...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', font: 'var(--text-body)' }}>Nenhum log encontrado.</p>
        <p style={{ marginTop: 'var(--space-2)', color: 'var(--text-tertiary)', font: 'var(--text-caption)' }}>Tente ajustar os filtros ou aguarde novos logs.</p>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 720 }}>
          <div style={{ display: 'grid', gridTemplateColumns: gridColumns, padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-raised)' }}>
            {['Timestamp', 'Level', 'Application', 'Environment', 'Message'].map((h) => (
              <div key={h} style={{ color: 'var(--text-tertiary)', font: 'var(--text-label)', fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>
          {logs.map((log, index) => (
            <div
              key={log.id ?? `${log.timestamp}-${index}`}
              onClick={() => onSelectLog(log)}
              style={{
                display: 'grid', gridTemplateColumns: gridColumns, alignItems: 'center', cursor: 'pointer',
                borderBottom: index < logs.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                transition: 'background var(--duration-fast) var(--ease-standard)',
                ...cellStyle,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ color: 'var(--text-tertiary)' }}>{formatTimestamp(log.timestamp)}</div>
              <div><LogLevelBadge level={log.level} /></div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.application}</div>
              <div style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.environment}</div>
              <div style={{ color: 'var(--text-primary)', font: 'var(--text-code)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{truncateMessage(log.message)}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderTop: '1px solid var(--border-subtle)' }}>
        <span style={{ color: 'var(--text-tertiary)', font: 'var(--text-caption)', fontFamily: 'var(--font-sans)' }}>Page {page + 1} of {Math.max(totalPages, 1)}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 0}
            style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', cursor: page <= 0 ? 'not-allowed' : 'pointer', opacity: page <= 0 ? 0.5 : 1 }}
          >
            Prev
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages - 1}
            style={{ background: 'var(--bg-surface-raised)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.5 : 1 }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
