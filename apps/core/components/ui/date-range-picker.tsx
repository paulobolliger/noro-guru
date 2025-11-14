/**
 * DateRangePicker Component
 *
 * Componente de seleção de intervalo de datas com calendário duplo e presets.
 * Formato brasileiro (DD/MM/YYYY) e acessibilidade completa.
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   startDate={startDate}
 *   endDate={endDate}
 *   onChange={(start, end) => {
 *     setStartDate(start);
 *     setEndDate(end);
 *   }}
 *   label="Período"
 *   showPresets
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

export interface DateRangePickerProps {
  /**
   * Data inicial
   */
  startDate?: Date | null;

  /**
   * Data final
   */
  endDate?: Date | null;

  /**
   * Callback quando range muda
   */
  onChange?: (startDate: Date | null, endDate: Date | null) => void;

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
   * Se true, mostra presets
   */
  showPresets?: boolean;

  /**
   * Presets customizados
   */
  presets?: DateRangePreset[];

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
   * Número de meses exibidos
   */
  monthsShown?: 1 | 2;

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

// Presets padrão
const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: 'Hoje',
    getValue: () => {
      const today = new Date();
      return { startDate: today, endDate: today };
    },
  },
  {
    label: 'Ontem',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return { startDate: yesterday, endDate: yesterday };
    },
  },
  {
    label: 'Últimos 7 dias',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'Últimos 30 dias',
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'Este mês',
    getValue: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: 'Mês passado',
    getValue: () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { startDate: start, endDate: end };
    },
  },
];

export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  label,
  placeholder = 'Selecione um período',
  error,
  minDate,
  maxDate,
  showPresets = true,
  presets = DEFAULT_PRESETS,
  clearable = true,
  disabled = false,
  required = false,
  monthsShown = 2,
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const [viewDate, setViewDate] = React.useState(startDate || new Date());
  const [selectionMode, setSelectionMode] = React.useState<'start' | 'end'>('start');

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Formata data
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Formata range
  const formatRange = (): string => {
    if (!startDate && !endDate) return '';
    if (startDate && !endDate) return formatDate(startDate);
    if (!startDate && endDate) return formatDate(endDate);
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

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

  const handleSelectDate = (date: Date) => {
    if (!isValidDate(date)) return;

    if (selectionMode === 'start') {
      // Selecionando data inicial
      if (endDate && date > endDate) {
        // Se data inicial > data final, reseta range
        onChange?.(date, null);
        setSelectionMode('end');
      } else {
        onChange?.(date, endDate || null);
        setSelectionMode('end');
      }
    } else {
      // Selecionando data final
      if (startDate && date < startDate) {
        // Se data final < data inicial, inverte
        onChange?.(date, startDate);
        setIsOpen(false);
        setSelectionMode('start');
      } else {
        onChange?.(startDate || null, date);
        setIsOpen(false);
        setSelectionMode('start');
      }
    }
  };

  const handleClear = () => {
    onChange?.(null, null);
    setSelectionMode('start');
  };

  const handlePreset = (preset: DateRangePreset) => {
    const range = preset.getValue();
    onChange?.(range.startDate, range.endDate);
    setIsOpen(false);
    setSelectionMode('start');
  };

  const isValidDate = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
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

  const isInRange = (date: Date): boolean => {
    if (!startDate) return false;

    const compareDate = hoverDate && selectionMode === 'end' ? hoverDate : endDate;
    if (!compareDate) return false;

    const start = startDate < compareDate ? startDate : compareDate;
    const end = startDate < compareDate ? compareDate : startDate;

    return date >= start && date <= end;
  };

  const isRangeStart = (date: Date): boolean => {
    if (!startDate) return false;
    if (!endDate && !hoverDate) return isSameDay(date, startDate);

    const compareDate = hoverDate && selectionMode === 'end' ? hoverDate : endDate;
    if (!compareDate) return isSameDay(date, startDate);

    return isSameDay(date, startDate < compareDate ? startDate : compareDate);
  };

  const isRangeEnd = (date: Date): boolean => {
    if (!startDate) return false;

    const compareDate = hoverDate && selectionMode === 'end' ? hoverDate : endDate;
    if (!compareDate) return false;

    return isSameDay(date, startDate < compareDate ? compareDate : startDate);
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
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between gap-2 px-4 py-2 text-left',
            'border rounded-lg bg-white transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : isOpen ? 'border-primary-500' : 'border-gray-300',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-50'
          )}
        >
          <span
            className={cn(
              'flex-1 truncate',
              startDate || endDate ? 'text-gray-900' : 'text-gray-500'
            )}
          >
            {formatRange() || placeholder}
          </span>

          <div className="flex items-center gap-1 flex-shrink-0">
            {clearable && (startDate || endDate) && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Limpar período"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
            <Calendar size={18} className="text-gray-500" />
          </div>
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4">
          <div className="flex gap-4">
            {/* Presets */}
            {showPresets && presets.length > 0 && (
              <div className="flex flex-col gap-1 pr-4 border-r border-gray-200 min-w-[150px]">
                <p className="text-xs font-medium text-gray-700 mb-2">Períodos</p>
                {presets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className="px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {/* Calendars */}
            <div className="flex gap-4">
              {Array.from({ length: monthsShown }).map((_, index) => {
                const monthDate = new Date(viewDate);
                monthDate.setMonth(monthDate.getMonth() + index);

                return (
                  <RangeCalendarGrid
                    key={index}
                    viewDate={monthDate}
                    startDate={startDate}
                    endDate={endDate}
                    hoverDate={hoverDate}
                    onSelectDate={handleSelectDate}
                    onHoverDate={setHoverDate}
                    onViewDateChange={index === 0 ? setViewDate : undefined}
                    isDateValid={isValidDate}
                    isSameDay={isSameDay}
                    isInRange={isInRange}
                    isRangeStart={isRangeStart}
                    isRangeEnd={isRangeEnd}
                    showNavigation={index === 0 || index === monthsShown - 1}
                    navigationSide={index === 0 ? 'left' : 'right'}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * RangeCalendarGrid - Grade de calendário para range
 */
interface RangeCalendarGridProps {
  viewDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  hoverDate: Date | null;
  onSelectDate: (date: Date) => void;
  onHoverDate: (date: Date | null) => void;
  onViewDateChange?: (date: Date) => void;
  isDateValid: (date: Date) => boolean;
  isSameDay: (date1: Date | null, date2: Date | null) => boolean;
  isInRange: (date: Date) => boolean;
  isRangeStart: (date: Date) => boolean;
  isRangeEnd: (date: Date) => boolean;
  showNavigation?: boolean;
  navigationSide?: 'left' | 'right';
}

function RangeCalendarGrid({
  viewDate,
  startDate,
  endDate,
  hoverDate,
  onSelectDate,
  onHoverDate,
  onViewDateChange,
  isDateValid,
  isSameDay,
  isInRange,
  isRangeStart,
  isRangeEnd,
  showNavigation = true,
  navigationSide = 'left',
}: RangeCalendarGridProps) {
  const today = new Date();

  const handlePrevMonth = () => {
    if (!onViewDateChange) return;
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onViewDateChange(newDate);
  };

  const handleNextMonth = () => {
    if (!onViewDateChange) return;
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onViewDateChange(newDate);
  };

  const generateCalendarDays = (): Date[] => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startPadding = firstDayOfMonth.getDay();
    const endPadding = 6 - lastDayOfMonth.getDay();

    const days: Date[] = [];

    for (let i = startPadding - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

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
    <div className="w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {showNavigation && navigationSide === 'left' && (
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Mês anterior"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
        )}

        <div className={cn('text-center', !showNavigation && 'mx-auto')}>
          <h3 className="text-base font-semibold text-gray-900">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </h3>
        </div>

        {showNavigation && navigationSide === 'right' && (
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
            aria-label="Próximo mês"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        )}

        {!showNavigation && <div className="w-9" />}
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
          const isToday = isSameDay(date, today);
          const isValid = isDateValid(date);
          const inRange = isInRange(date);
          const isStart = isRangeStart(date);
          const isEnd = isRangeEnd(date);

          return (
            <button
              key={index}
              type="button"
              onClick={() => isValid && onSelectDate(date)}
              onMouseEnter={() => isValid && onHoverDate(date)}
              onMouseLeave={() => onHoverDate(null)}
              disabled={!isValid}
              className={cn(
                'aspect-square flex items-center justify-center text-sm transition-colors relative',
                'hover:bg-gray-100 focus:outline-none',
                (isStart || isEnd) &&
                  'bg-primary-600 text-white hover:bg-primary-700 font-semibold z-10',
                inRange &&
                  !isStart &&
                  !isEnd &&
                  'bg-primary-100 text-primary-900',
                !isCurrentMonth && 'text-gray-400',
                !isValid && 'opacity-30 cursor-not-allowed hover:bg-transparent',
                isToday && !isStart && !isEnd && 'font-bold',
                // Rounded corners para extremidades do range
                isStart && 'rounded-l-full',
                isEnd && 'rounded-r-full'
              )}
              aria-label={`${date.getDate()} de ${
                monthNames[date.getMonth()]
              } de ${date.getFullYear()}`}
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
 * SimpleDateRangePicker - Variante com dois inputs
 */
export interface SimpleDateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  onChange?: (startDate: Date | null, endDate: Date | null) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function SimpleDateRangePicker({
  startDate,
  endDate,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  className,
}: SimpleDateRangePickerProps) {
  const formatToInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    const date = dateString ? new Date(dateString + 'T00:00:00') : null;
    onChange?.(date, endDate || null);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = e.target.value;
    const date = dateString ? new Date(dateString + 'T00:00:00') : null;
    onChange?.(startDate || null, date);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={formatToInput(startDate || null)}
          onChange={handleStartChange}
          max={endDate ? formatToInput(endDate) : undefined}
          disabled={disabled}
          className={cn(
            'flex-1 px-4 py-2 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-50'
          )}
        />

        <span className="text-gray-500 flex-shrink-0">até</span>

        <input
          type="date"
          value={formatToInput(endDate || null)}
          onChange={handleEndChange}
          min={startDate ? formatToInput(startDate) : undefined}
          disabled={disabled}
          className={cn(
            'flex-1 px-4 py-2 border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            disabled && 'bg-gray-100 cursor-not-allowed opacity-50'
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * useDateRangePicker - Hook para gerenciar estado
 */
export interface UseDateRangePickerOptions {
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  onChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export function useDateRangePicker(options: UseDateRangePickerOptions = {}) {
  const { initialStartDate = null, initialEndDate = null, onChange } = options;

  const [startDate, setStartDate] = React.useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = React.useState<Date | null>(initialEndDate);
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = React.useCallback(
    (newStartDate: Date | null, newEndDate: Date | null) => {
      // Validação
      if (newStartDate && newEndDate && newStartDate > newEndDate) {
        setError('Data inicial não pode ser posterior à data final');
        return;
      }

      setError(null);
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      onChange?.(newStartDate, newEndDate);
    },
    [onChange]
  );

  const clear = React.useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setError(null);
    onChange?.(null, null);
  }, [onChange]);

  const setToday = React.useCallback(() => {
    const today = new Date();
    handleChange(today, today);
  }, [handleChange]);

  const setLastDays = React.useCallback(
    (days: number) => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - (days - 1));
      handleChange(start, end);
    },
    [handleChange]
  );

  return {
    startDate,
    endDate,
    setRange: handleChange,
    clear,
    setToday,
    setLastDays,
    error,
  };
}
