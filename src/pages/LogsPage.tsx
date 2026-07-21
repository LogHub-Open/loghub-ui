import { useState, useEffect, useCallback, useRef } from 'react';
import { LogFiltersComponent } from '../components/LogFilters';
import { LogTable } from '../components/LogTable';
import { LogDetails } from '../components/LogDetails';
import { loghubApi } from '../api/loghubApi';
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LogHub</h1>
              <p className="text-sm text-gray-500">Visualização e diagnóstico de logs</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Filters */}
        <LogFiltersComponent onFilter={handleFilter} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Results count */}
        {!isLoading && !error && (
          <div className="mb-4 text-sm text-gray-600">
            {pagination.totalElements} {pagination.totalElements === 1 ? 'log encontrado' : 'logs encontrados'}
            {pagination.totalPages > 1 && (
              <span className="ml-2">
                (Página {pagination.page + 1} de {pagination.totalPages})
              </span>
            )}
          </div>
        )}

        {/* Logs Table */}
        <LogTable logs={logs} onSelectLog={handleSelectLog} isLoading={isLoading} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0 || isLoading}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum: number;
                if (pagination.totalPages <= 5) {
                  pageNum = i;
                } else if (pagination.page < 3) {
                  pageNum = i;
                } else if (pagination.page > pagination.totalPages - 4) {
                  pageNum = pagination.totalPages - 5 + i;
                } else {
                  pageNum = pagination.page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      pagination.page === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1 || isLoading}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        )}
      </main>

      {/* Log Details Modal */}
      {selectedLog && <LogDetails log={selectedLog} onClose={handleCloseDetails} />}
    </div>
  );
}
