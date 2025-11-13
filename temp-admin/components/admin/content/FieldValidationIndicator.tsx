// components/admin/content/FieldValidationIndicator.tsx
'use client';

import { ContentValidation } from '@/lib/types';
import { formatFieldName } from '@/lib/utils/field-validator';
import StatusBadge from './StatusBadge';

interface FieldValidationIndicatorProps {
  validation: ContentValidation;
  compact?: boolean;
}

export default function FieldValidationIndicator({
  validation,
  compact = false
}: FieldValidationIndicatorProps) {
  if (compact) {
    // Versão compacta para tabelas
    return (
      <div className="flex items-center gap-2">
        <StatusBadge
          status={validation.seo.status}
          label="SEO"
          missingFields={validation.seo.missing.map(formatFieldName)}
        />
        <StatusBadge
          status={validation.openGraph.status}
          label="OG"
          missingFields={validation.openGraph.missing.map(formatFieldName)}
        />
        <StatusBadge
          status={validation.otherFields.status}
          label="Outros"
          missingFields={validation.otherFields.missing.map(formatFieldName)}
        />
      </div>
    );
  }

  // Versão expandida para modais
  return (
    <div className="space-y-4">
      {/* SEO */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Campos de SEO
          </h4>
          <StatusBadge
            status={validation.seo.status}
            label={`${validation.seo.filledCount}/${validation.seo.total}`}
            showTooltip={false}
          />
        </div>

        {validation.seo.missing.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600 font-medium">Campos faltantes:</p>
            <ul className="space-y-1">
              {validation.seo.missing.map((field) => (
                <li key={field} className="text-sm text-red-600 flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  {formatFieldName(field)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validation.seo.status === 'complete' && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <span>✓</span>
            Todos os campos SEO estão preenchidos
          </p>
        )}
      </div>

      {/* OpenGraph */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Campos de OpenGraph
          </h4>
          <StatusBadge
            status={validation.openGraph.status}
            label={`${validation.openGraph.filledCount}/${validation.openGraph.total}`}
            showTooltip={false}
          />
        </div>

        {validation.openGraph.missing.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600 font-medium">Campos faltantes:</p>
            <ul className="space-y-1">
              {validation.openGraph.missing.map((field) => (
                <li key={field} className="text-sm text-red-600 flex items-center gap-2">
                  <span className="text-red-400">✗</span>
                  {formatFieldName(field)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validation.openGraph.status === 'complete' && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <span>✓</span>
            Todos os campos OpenGraph estão preenchidos
          </p>
        )}
      </div>

      {/* Outros Campos */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Outros Campos
          </h4>
          <StatusBadge
            status={validation.otherFields.status}
            label={`${validation.otherFields.filledCount}/${validation.otherFields.total}`}
            showTooltip={false}
          />
        </div>

        {validation.otherFields.missing.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600 font-medium">Campos faltantes:</p>
            <ul className="space-y-1">
              {validation.otherFields.missing.map((field) => (
                <li key={field} className="text-sm text-orange-600 flex items-center gap-2">
                  <span className="text-orange-400">!</span>
                  {formatFieldName(field)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {validation.otherFields.status === 'complete' && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <span>✓</span>
            Todos os outros campos estão preenchidos
          </p>
        )}
      </div>

      {/* Resumo */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Status de Publicação</p>
            <p className="text-sm text-gray-600 mt-1">
              {validation.canPublish
                ? 'Pronto para publicar! Todos os campos obrigatórios estão preenchidos.'
                : `${validation.missingCount} campo(s) obrigatório(s) precisa(m) ser preenchido(s).`}
            </p>
          </div>
          {validation.canPublish ? (
            <div className="text-4xl">✅</div>
          ) : (
            <div className="text-4xl">⚠️</div>
          )}
        </div>
      </div>
    </div>
  );
}
