import axios from 'axios';
import type { LogEvent, LogFilters, PageResponse } from '../types/LogEvent';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_LOGHUB_API_URL || 'http://localhost:8080/api/logs',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': import.meta.env.VITE_LOGHUB_API_KEY || '',
  },
});

// Converte datetime-local para ISO Instant string
function toInstant(dateTimeLocal: string): string {
  if (!dateTimeLocal) return '';
  const date = new Date(dateTimeLocal);
  return date.toISOString();
}

export const loghubApi = {
  async getLogs(filters?: LogFilters, page = 0, size = 20): Promise<PageResponse<LogEvent>> {
    const params = new URLSearchParams();

    if (filters?.application) {
      params.append('application', filters.application);
    }
    if (filters?.environment) {
      params.append('environment', filters.environment);
    }
    if (filters?.level) {
      params.append('level', filters.level);
    }
    if (filters?.from) {
      params.append('from', toInstant(filters.from));
    }
    if (filters?.to) {
      params.append('to', toInstant(filters.to));
    }
    
    params.append('page', page.toString());
    params.append('size', size.toString());

    const response = await apiClient.get<PageResponse<LogEvent>>('', { params });
    return response.data;
  },
};

export default apiClient;
