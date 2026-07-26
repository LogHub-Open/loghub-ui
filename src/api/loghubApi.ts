import axios from 'axios';
import type { LogEvent, LogFilters, PageResponse } from '../types/LogEvent';

declare global {
  interface Window {
    __ENV__?: {
      LOGHUB_API_URL?: string;
      LOGHUB_API_KEY?: string;
    };
  }
}

// window.__ENV__ é populado em runtime pelo container Docker (ver public/env-config.js);
// import.meta.env é o fallback pro dev local (npm run dev), sem Docker.
const apiUrl = window.__ENV__?.LOGHUB_API_URL || import.meta.env.VITE_LOGHUB_API_URL;
const apiKey = window.__ENV__?.LOGHUB_API_KEY || import.meta.env.VITE_LOGHUB_API_KEY;

const apiClient = axios.create({
  baseURL: apiUrl || 'http://localhost:8080/api/logs',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': apiKey || '',
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
    return { ...response.data, content: response.data.content ?? [] };
  },
};

export default apiClient;
