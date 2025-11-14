/**
 * DatePicker Component
 *
 * Componente de seleção de data com calendário, navegação por teclado e validação.
 * Formato brasileiro (DD/MM/YYYY) e acessibilidade completa.
 *
 * @example
 * ```tsx
 * <DatePicker
 *   value={selectedDate}
 *   onChange={(date) => setSelectedDate(date)}
 *   label="Data de nascimento"
 *   minDate={new Date('1900-01-01')}
 *   maxDate={new Date()}
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface DatePickerProps {
  /**
   * Data selecionada
   */
  value?: Date | null;

  /**
   * Callback quando data muda
   */
  onChange?: (date: Date | null) => void;

  /**
   * Label
   */
  label?: string;

  /**
   * Placeholder
   */
  placeholder?: string;

  /**
   * Erro
   */
  error?: string;

  /**
   * Data mínima permitida
   */
  minDate?: Date;

  /**
   * Data máxima permitida
   */
  maxDate?: Date;

  /**
   * Datas desabilitadas
   */
  disabledDates?: Date[];

  /**
   * Função para desabilitar datas
   */
  isDateDisabled?: (date: Date) => boolean;

  /**
   * Se true, mostra botão "Hoje"
   */
  showTodayButton?: boolean;

  /**
   * Se true, permite limpar
   */
  clearable?: boolean;

  /**
   * Se true, desabilita
   */
  disabled?: boolean;

  /**
   * Se true, campo é obrigatório
   */
  required?: boolean;

  /**
   * Formato de exibição
   */
  format?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'DD/MM/AAAA',
  error,
  minDate,
  maxDate,
  disabledDates = [],
  isDateDisabled,
  showTodayButton = true,
  clearable = true,
  disabled = false,
  required = false,
  format = 'DD/MM/YYYY',
  className,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [viewDate, setViewDate] = React.useState(value || new Date());
  const [focusedDate, setFocusedDate] = React.useState<Date | null>(null);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Formata data para exibição
  const formatDate = (date: Date | null): string => {
    if (!date) return '';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    switch (format) {
      case 'MM/DD/YYYY':
        return `${month}/${day}/${year}`;
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${day}/${month}/${year}`;
    }
  };

  // Parse input para data
  const parseDate = (input: string): Date | null => {
    const parts = input.split(/[-/]/);
    if (parts.length !== 3) return null;

    let day: number, month: number, year: number;

    switch (format) {
      case 'MM/DD/YYYY':
        [month, day, year] = parts.map(Number);
        break;
      case 'YYYY-MM-DD':
        [year, month, day] = parts.map(Number);
        break;
      default:
        [day, month, year] = parts.map(Number);
    }

    if (!day || !month || !year) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  // Sincroniza input com value
  React.useEffect(() => {
    setInputValue(formatDate(value || null));
  }, [value, format]);

  // Fecha ao clicar fora
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Tenta fazer parse da data
    const parsed = parseDate(newValue);
    if (parsed && isValidDate(parsed)) {
      onChange?.(parsed);
      setViewDate(parsed);
    }
  };

  const handleSelectDate = (date: Date) => {
    if (!isValidDate(date)) return;

    onChange?.(date);
    setInputValue(formatDate(date));
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    onChange?.(null);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleToday = () => {
    const today = new Date();
    handleSelectDate(today);
  };

  const isValidDate = (date: Date): boolean => {
    // Verifica min/max
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;

    // Verifica datas desabilitadas
    if (
      disabledDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      )
    ) {
      return false;
    }

    // Função customizada
    if (isDateDisabled?.(date)) return false;

    return true;
  };

  const isSameDay = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <div className={cn('relative', className)} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2 pr-20 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-50'
          )}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? 'date-error' : undefined}
        />

        {/* Ícones */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              aria-label="Limpar data"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}

          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Abrir calendário"
          >
            <Calendar size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p id="date-error" className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 w-80">
          <CalendarGrid
            viewDate={viewDate}
            selectedDate={value}
            focusedDate={focusedDate}
            onSelectDate={handleSelectDate}
            onViewDateChange={setViewDate}
            onFocusedDateChange={setFocusedDate}
            isDateValid={isValidDate}
            isSameDay={isSameDay}
          />

          {/* Footer */}
          {showTodayButton && (
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-end">
              <button
                type="button"
                onClick={handleToday}
                disabled={!isValidDate(new Date())}
                className="px-3 py-1.5 text-sm font-medium text-primary-700 hover:bg-primary-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hoje
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * CalendarGrid - Grade de calendário
 */
interface CalendarGridProps {
  viewDate: Date;
  selectedDate: Date | null;
  focusedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onViewDateChange: (date: Date) => void;
  onFocusedDateChange: (date: Date | null) => void;
  isDateValid: (date: Date) => boolean;
  isSameDay: (date1: Date | null, date2: Date | null) => boolean;
}

function CalendarGrid({
  viewDate,
  selectedDate,
  focusedDate,
  onSelectDate,
  onViewDateChange,
  onFocusedDateChange,
  isDateValid,
  isSameDay,
}: CalendarGridProps) {
  const today = new Date();

  // Navega para mês anterior
  const handlePrevMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onViewDateChange(newDate);
  };

  // Navega para próximo mês
  const handleNextMonth = () => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onViewDateChange(newDate);
  };

  // Gera dias do mês
  const generateCalendarDays = (): Date[] => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Dias para preencher antes do primeiro dia
    const startPadding = firstDayOfMonth.getDay();

    // Dias para preencher depois do último dia
    const endPadding = 6 - lastDayOfMonth.getDay();

    const days: Date[] = [];

    // Dias do mês anterior
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push(date);
    }

    // Dias do mês atual
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Dias do próximo mês
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div>
      {/* Header - Navegação de mês/ano */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Mês anterior"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>

        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-900">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h3>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          aria-label="Próximo mês"
        >
          <ChevronRight size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === viewDate.getMonth();
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const isFocused = isSameDay(date, focusedDate);
          const isValid = isDateValid(date);

          return (
            <button
              key={index}
              type="button"
              onClick={() => isValid && onSelectDate(date)}
              onFocus={() => onFocusedDateChange(date)}
              disabled={!isValid}
              className={cn(
                'aspect-square flex items-center justify-center text-sm rounded transition-colors',
                'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
                isSelected && 'bg-primary-600 text-white hover:bg-primary-700',
                !isSelected && isToday && 'font-bold text-primary-600',
                !isCurrentMonth && 'text-gray-400',
                !isValid && 'opacity-30 cursor-not-allowed hover:bg-transparent',
                isFocused &&
                  !isSelected &&
                  'ring-2 ring-primary-500 ring-offset-2'
              )}
              aria-label={`${date.getDate()} de ${
                monthNames[date.getMonth()]
              } de ${date.getFullYear()}`}
              aria-selected={isSelected}
              aria-disabled={!isValid}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * SimpleDatePicker - Variante compacta (apenas input nativo)
 */
export interface SimpleDatePickerProps {
  /**
   * Data selecionada
   */
  value?: Date | null;

  /**
   * Callback quando muda
   */
  onChange?: (date: Date | null) => void;

  /**
   * Label
   */
  label?: string;

  /**
   * Erro
   */
  error?: string;

  /**
   * Data mínima
   */
  min?: string; // YYYY-MM-DD

  /**
   * Data máxima
   */
  max?: string; // YYYY-MM-DD

  /**
   * Se true, desabilita
   */
  disabled?: boolean;

  /**
   * Se true, campo é obrigatório
   */
  required?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SimpleDatePicker({
  value,
  onChange,
  label,
  error,
  min,
  max,
  disabled = false,
  required = false,
  className,
}: SimpleDatePickerProps) {
  const formatToInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    if (!dateString) {
      onChange?.(null);
      return;
    }

    const date = new Date(dateString + 'T00:00:00');
    onChange?.(date);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type="date"
        value={formatToInput(value || null)}
        onChange={handleChange}
        min={min}
        max={max}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full px-4 py-2 border rounded-lg transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error ? 'border-red-500' : 'border-gray-300',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-50'
        )}
      />

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * useDatePicker - Hook para gerenciar estado
 */
export interface UseDatePickerOptions {
  /**
   * Data inicial
   */
  initialDate?: Date | null;

  /**
   * Callback onChange
   */
  onChange?: (date: Date | null) => void;

  /**
   * Data mínima
   */
  minDate?: Date;

  /**
   * Data máxima
   */
  maxDate?: Date;
}

export function useDatePicker(options: UseDatePickerOptions = {}) {
  const { initialDate = null, onChange, minDate, maxDate } = options;

  const [date, setDate] = React.useState<Date | null>(initialDate);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = React.useCallback(
    (newDate: Date | null) => {
      // Validação
      if (newDate) {
        if (minDate && newDate < minDate) {
          setError('Data anterior à data mínima permitida');
          return;
        }
        if (maxDate && newDate > maxDate) {
          setError('Data posterior à data máxima permitida');
          return;
        }
      }

      setError(null);
      setDate(newDate);
      onChange?.(newDate);
    },
    [onChange, minDate, maxDate]
  );

  const clear = React.useCallback(() => {
    setDate(null);
    setError(null);
    onChange?.(null);
  }, [onChange]);

  const setToday = React.useCallback(() => {
    handleChange(new Date());
  }, [handleChange]);

  return {
    date,
    setDate: handleChange,
    clear,
    setToday,
    error,
  };
}
