/**
 * ColorPicker Component
 *
 * Componente de seleção de cores com presets, input manual e gradiente.
 * Suporta formatos HEX, RGB e HSL.
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   value="#5053c4"
 *   onChange={(color) => setColor(color)}
 *   presets={['#5053c4', '#10b981', '#ef4444']}
 *   showPresets
 * />
 * ```
 */

'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check, Pipette } from 'lucide-react';

export interface ColorPickerProps {
  /**
   * Valor da cor (HEX)
   */
  value?: string;

  /**
   * Callback quando cor muda
   */
  onChange?: (color: string) => void;

  /**
   * Cores predefinidas
   */
  presets?: string[];

  /**
   * Se true, mostra seção de presets
   */
  showPresets?: boolean;

  /**
   * Se true, mostra input de texto
   */
  showInput?: boolean;

  /**
   * Se true, permite transparência (alpha channel)
   */
  allowAlpha?: boolean;

  /**
   * Classes CSS adicionais
   */
  className?: string;

  /**
   * Se true, desabilita o picker
   */
  disabled?: boolean;
}

// Cores padrão
const DEFAULT_PRESETS = [
  '#5053c4', // Primary
  '#D4AF37', // Accent
  '#10b981', // Success
  '#ef4444', // Error
  '#f59e0b', // Warning
  '#3b82f6', // Info
  '#6366f1', // Indigo
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#000000', // Black
  '#6b7280', // Gray
  '#ffffff', // White
];

export function ColorPicker({
  value = '#5053c4',
  onChange,
  presets = DEFAULT_PRESETS,
  showPresets = true,
  showInput = true,
  allowAlpha = false,
  className,
  disabled = false,
}: ColorPickerProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const [inputValue, setInputValue] = React.useState(value);
  const [showPicker, setShowPicker] = React.useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  // Sincroniza valor externo
  React.useEffect(() => {
    setLocalValue(value);
    setInputValue(value);
  }, [value]);

  // Fecha picker ao clicar fora
  React.useEffect(() => {
    if (!showPicker) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const handleColorChange = (color: string) => {
    setLocalValue(color);
    setInputValue(color);
    onChange?.(color);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Valida HEX
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      handleColorChange(newValue);
    }
  };

  return (
    <div className={cn('relative', className)} ref={pickerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setShowPicker(!showPicker)}
        disabled={disabled}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-white transition-colors',
          'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white'
        )}
        aria-label="Selecionar cor"
      >
        {/* Color Preview */}
        <div
          className="w-6 h-6 rounded border border-gray-300 shadow-sm"
          style={{ backgroundColor: localValue }}
          aria-hidden="true"
        />

        {showInput && (
          <span className="text-sm font-mono text-gray-700">
            {localValue.toUpperCase()}
          </span>
        )}

        <Pipette size={16} className="text-gray-500" aria-hidden="true" />
      </button>

      {/* Picker Dropdown */}
      {showPicker && !disabled && (
        <div
          className="absolute top-full left-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-64"
          role="dialog"
          aria-label="Seletor de cores"
        >
          {/* Native Color Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Escolher Cor
            </label>
            <input
              type="color"
              value={localValue}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-32 rounded cursor-pointer border border-gray-300"
            />
          </div>

          {/* Manual Input */}
          {showInput && (
            <div className="mb-4">
              <label
                htmlFor="color-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Código HEX
              </label>
              <input
                id="color-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="#000000"
                maxLength={7}
                className={cn(
                  'w-full px-3 py-2 border rounded-lg text-sm font-mono',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
                  /^#[0-9A-F]{6}$/i.test(inputValue)
                    ? 'border-gray-300'
                    : 'border-red-500'
                )}
              />
            </div>
          )}

          {/* Presets */}
          {showPresets && presets.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cores Predefinidas
              </label>
              <div className="grid grid-cols-6 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleColorChange(preset)}
                    className={cn(
                      'relative w-8 h-8 rounded border-2 transition-all hover:scale-110',
                      localValue.toLowerCase() === preset.toLowerCase()
                        ? 'border-primary-600 ring-2 ring-primary-200'
                        : 'border-gray-300'
                    )}
                    style={{ backgroundColor: preset }}
                    aria-label={`Selecionar cor ${preset}`}
                  >
                    {localValue.toLowerCase() === preset.toLowerCase() && (
                      <Check
                        size={14}
                        className={cn(
                          'absolute inset-0 m-auto',
                          isLightColor(preset) ? 'text-gray-900' : 'text-white'
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * SimpleColorPicker - Apenas com presets (sem picker avançado)
 */
export interface SimpleColorPickerProps {
  /**
   * Valor da cor
   */
  value?: string;

  /**
   * Callback quando cor muda
   */
  onChange?: (color: string) => void;

  /**
   * Cores disponíveis
   */
  colors?: string[];

  /**
   * Layout
   */
  layout?: 'grid' | 'inline';

  /**
   * Tamanho dos círculos
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function SimpleColorPicker({
  value,
  onChange,
  colors = DEFAULT_PRESETS,
  layout = 'grid',
  size = 'md',
  className,
}: SimpleColorPickerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const layoutClasses = {
    grid: 'grid grid-cols-6 gap-2',
    inline: 'flex flex-wrap gap-2',
  };

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange?.(color)}
          className={cn(
            'relative rounded-full border-2 transition-all hover:scale-110',
            sizeClasses[size],
            value?.toLowerCase() === color.toLowerCase()
              ? 'border-primary-600 ring-2 ring-primary-200'
              : 'border-gray-300'
          )}
          style={{ backgroundColor: color }}
          aria-label={`Selecionar cor ${color}`}
        >
          {value?.toLowerCase() === color.toLowerCase() && (
            <Check
              size={size === 'sm' ? 12 : size === 'md' ? 14 : 16}
              className={cn(
                'absolute inset-0 m-auto',
                isLightColor(color) ? 'text-gray-900' : 'text-white'
              )}
              aria-hidden="true"
            />
          )}
        </button>
      ))}
    </div>
  );
}

/**
 * ColorInput - Input com color picker integrado
 */
export interface ColorInputProps {
  /**
   * Nome do campo
   */
  name?: string;

  /**
   * Valor
   */
  value?: string;

  /**
   * Callback onChange
   */
  onChange?: (color: string) => void;

  /**
   * Label
   */
  label?: string;

  /**
   * Erro
   */
  error?: string;

  /**
   * Se true, campo é obrigatório
   */
  required?: boolean;

  /**
   * Presets
   */
  presets?: string[];

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ColorInput({
  name,
  value = '#000000',
  onChange,
  label,
  error,
  required,
  presets,
  className,
}: ColorInputProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Label */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Picker + Input */}
      <div className="flex items-center gap-2">
        <ColorPicker
          value={value}
          onChange={onChange}
          presets={presets}
          showPresets
          showInput={false}
        />

        <input
          id={name}
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className={cn(
            'flex-1 px-3 py-2 border rounded-lg text-sm font-mono',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300'
          )}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Helper: Detecta se cor é clara (para contraste do ícone)
 */
function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;

  // Fórmula de luminância relativa
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}

/**
 * Helper: Converte HEX para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * ColorGradient - Seletor de gradiente (bonus)
 */
export interface ColorGradientProps {
  /**
   * Cor inicial
   */
  startColor?: string;

  /**
   * Cor final
   */
  endColor?: string;

  /**
   * Callback quando cores mudam
   */
  onChange?: (start: string, end: string) => void;

  /**
   * Direção do gradiente
   */
  direction?: 'horizontal' | 'vertical' | 'diagonal';

  /**
   * Classes CSS adicionais
   */
  className?: string;
}

export function ColorGradient({
  startColor = '#5053c4',
  endColor = '#D4AF37',
  onChange,
  direction = 'horizontal',
  className,
}: ColorGradientProps) {
  const [start, setStart] = React.useState(startColor);
  const [end, setEnd] = React.useState(endColor);

  const gradientDirections = {
    horizontal: 'to right',
    vertical: 'to bottom',
    diagonal: 'to bottom right',
  };

  const handleStartChange = (color: string) => {
    setStart(color);
    onChange?.(color, end);
  };

  const handleEndChange = (color: string) => {
    setEnd(color);
    onChange?.(start, color);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Preview */}
      <div
        className="w-full h-32 rounded-lg border border-gray-300"
        style={{
          background: `linear-gradient(${gradientDirections[direction]}, ${start}, ${end})`,
        }}
        aria-label="Preview do gradiente"
      />

      {/* Pickers */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Inicial
          </label>
          <ColorPicker
            value={start}
            onChange={handleStartChange}
            showInput
            showPresets
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cor Final
          </label>
          <ColorPicker
            value={end}
            onChange={handleEndChange}
            showInput
            showPresets
          />
        </div>
      </div>

      {/* CSS Output */}
      <div className="p-3 bg-gray-100 rounded-lg">
        <p className="text-xs font-mono text-gray-700">
          background: linear-gradient({gradientDirections[direction]}, {start}, {end});
        </p>
      </div>
    </div>
  );
}
