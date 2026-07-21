import { useState, type FormEvent } from 'react';
import type { LogFilters, LogLevel } from '../types/LogEvent';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';

interface LogFiltersProps {
  onFilter: (filters: LogFilters) => void;
  isLoading?: boolean;
}

const LOG_LEVELS: LogLevel[] = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

const EMPTY_FILTERS: LogFilters = {
  application: '',
  environment: '',
  level: '',
  from: '',
  to: '',
};

const labelStyle = {
  display: 'block',
  marginBottom: 'var(--space-1)',
  color: 'var(--text-secondary)',
  font: 'var(--text-caption)',
  fontFamily: 'var(--font-sans)',
};

export function LogFiltersComponent({ onFilter, isLoading }: LogFiltersProps) {
  const [filters, setFilters] = useState<LogFilters>(EMPTY_FILTERS);

  const handleChange = (field: keyof LogFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleClear = () => {
    setFilters(EMPTY_FILTERS);
    onFilter(EMPTY_FILTERS);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)', marginBottom: 'var(--space-6)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-4)' }}>
        <div>
          <label htmlFor="application" style={labelStyle}>Application</label>
          <Input
            id="application"
            value={filters.application}
            onChange={(e) => handleChange('application', e.target.value)}
            placeholder="Nome da aplicação"
          />
        </div>

        <div>
          <label htmlFor="environment" style={labelStyle}>Environment</label>
          <Input
            id="environment"
            value={filters.environment}
            onChange={(e) => handleChange('environment', e.target.value)}
            placeholder="Ex: production, staging"
          />
        </div>

        <div>
          <label htmlFor="level" style={labelStyle}>Level</label>
          <Select
            id="level"
            value={filters.level}
            onChange={(e) => handleChange('level', e.target.value)}
            options={[
              { value: '', label: 'Todos os níveis' },
              ...LOG_LEVELS.map((level) => ({ value: level, label: level })),
            ]}
          />
        </div>

        <div>
          <label htmlFor="from" style={labelStyle}>De</label>
          <Input
            id="from"
            type="datetime-local"
            value={filters.from}
            onChange={(e) => handleChange('from', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="to" style={labelStyle}>Até</label>
          <Input
            id="to"
            type="datetime-local"
            value={filters.to}
            onChange={(e) => handleChange('to', e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleClear} disabled={isLoading}>
          Limpar
        </Button>
      </div>
    </form>
  );
}
