export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEvent {
  id?: string;
  application: string;
  environment: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
  sdk?: {
    language: string;
    version: string;
  };
}

export interface LogFilters {
  application?: string;
  environment?: string;
  level?: LogLevel | '';
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}

// Corresponde ao PageResponse<LogEventResponse> do backend
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
