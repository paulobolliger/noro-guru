// components/admin/content/StatusBadge.tsx
'use client';

import { ValidationStatus } from '@/lib/types';
import { getStatusColor, getStatusEmoji } from '@/lib/utils/field-validator';

interface StatusBadgeProps {
  status: ValidationStatus;
  label: string;
  missingFields?: string[];
  showTooltip?: boolean;
}

export default function StatusBadge({
  status,
  label,
  missingFields = [],
  showTooltip = true
}: StatusBadgeProps) {
  const emoji = getStatusEmoji(status);
  const color = getStatusColor(status);

  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    red: 'bg-red-100 text-red-800 border-red-300',
  };

  const tooltipColorClasses = {
    green: 'bg-green-800',
    yellow: 'bg-yellow-800',
    red: 'bg-red-800',
  };

  return (
    <div className="relative group inline-block">
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colorClasses[color]}`}
      >
        <span>{emoji}</span>
        <span>{label}</span>
      </div>

      {/* Tooltip com campos faltantes */}
      {showTooltip && missingFields.length > 0 && (
        <div
          className={`absolute z-50 invisible group-hover:visible ${tooltipColorClasses[color]} text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap -top-2 left-full ml-2 shadow-lg`}
        >
          <div className="font-semibold mb-1">Campos faltantes:</div>
          <ul className="space-y-0.5">
            {missingFields.map((field) => (
              <li key={field} className="flex items-start gap-1">
                <span>•</span>
                <span>{field}</span>
              </li>
            ))}
          </ul>
          {/* Seta do tooltip */}
          <div
            className={`absolute top-3 -left-1 w-2 h-2 ${tooltipColorClasses[color]} transform rotate-45`}
          ></div>
        </div>
      )}

      {/* Tooltip de sucesso */}
      {showTooltip && status === 'complete' && (
        <div
          className={`absolute z-50 invisible group-hover:visible ${tooltipColorClasses[color]} text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap -top-2 left-full ml-2 shadow-lg`}
        >
          ✓ Todos os campos preenchidos
          <div
            className={`absolute top-3 -left-1 w-2 h-2 ${tooltipColorClasses[color]} transform rotate-45`}
          ></div>
        </div>
      )}
    </div>
  );
}
