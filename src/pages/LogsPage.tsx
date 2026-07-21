import { useState, useEffect, useCallback, useRef } from 'react';
import { LogFiltersComponent } from '../components/LogFilters';
import { LogTable } from '../components/LogTable';
import { LogDetails } from '../components/LogDetails';
import { loghubApi } from '../api/loghubApi';
import logoMark from '../assets/logo-mark.svg';
import type { LogEvent, LogFilters, PageResponse } from '../types/LogEvent';

const PAGE_SIZE = 20;

export function LogsPage() {
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<LogFilters>({});
  const [pagination, setPagination] = useState<Omit<PageResponse<LogEvent>, 'content'>>({
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
  });

  const latestRequestId = useRef(0);

  const fetchLogs = useCallback(async (filters?: LogFilters, page = 0) => {
    const requestId = ++latestRequestId.current;
    setIsLoading(true);
    setError(null);

    try {
      const response = await loghubApi.getLogs(filters, page, PAGE_SIZE);
      if (requestId !== latestRequestId.current) return; // stale response, a newer request is in flight

      setLogs(response.content);
      setPagination({
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      });
    } catch (err) {
      if (requestId !== latestRequestId.current) return;

      console.error('Erro ao buscar logs:', err);
      setError('Erro ao carregar logs. Verifique sua conexão e tente novamente.');
      setLogs([]);
    } finally {
      if (requestId === latestRequestId.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilter = (filters: LogFilters) => {
    setCurrentFilters(filters);
    fetchLogs(filters, 0);
  };

  const handlePageChange = (newPage: number) => {
    fetchLogs(currentFilters, newPage);
  };

  const handleSelectLog = (log: LogEvent) => {
    setSelectedLog(log);
  };

  const handleCloseDetails = () => {
    setSelectedLog(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <img src={logoMark} alt="LogHub" style={{ width: 36, height: 36 }} />
          <div>
            <h1 style={{ color: 'var(--text-primary)', font: 'var(--text-h2)', fontFamily: 'var(--font-sans)' }}>LogHub</h1>
            <p style={{ color: 'var(--text-tertiary)', font: 'var(--text-caption)', fontFamily: 'var(--font-sans)' }}>Visualização e diagnóstico de logs</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--space-6)' }}>
        {/* Filters */}
        <LogFiltersComponent onFilter={handleFilter} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: 'var(--space-6)', background: 'var(--state-danger-bg)', border: '1px solid var(--state-danger)',
            color: 'var(--state-danger)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)', font: 'var(--text-body)',
          }}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !error && (
          <div style={{ marginBottom: 'var(--space-4)', color: 'var(--text-secondary)', font: 'var(--text-body)', fontFamily: 'var(--font-sans)' }}>
            {pagination.totalElements} {pagination.totalElements === 1 ? 'log encontrado' : 'logs encontrados'}
          </div>
        )}

        {/* Logs Table */}
        <LogTable
          logs={logs}
          onSelectLog={handleSelectLog}
          isLoading={isLoading}
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      {/* Log Details Modal */}
      {selectedLog && <LogDetails log={selectedLog} onClose={handleCloseDetails} />}
    </div>
  );
}
