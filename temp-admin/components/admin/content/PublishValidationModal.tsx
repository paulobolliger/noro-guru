// components/admin/content/PublishValidationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle } from 'lucide-react';
import { Roteiro, BlogPost, ContentValidation } from '@/lib/types';
import { validateRoteiro, validateBlogPost, formatFieldName } from '@/lib/utils/field-validator';
import FieldValidationIndicator from './FieldValidationIndicator';
import AIFieldGenerator from './AIFieldGenerator';
import { formatCost } from '@/lib/utils/cost-calculator';

interface PublishValidationModalProps {
  content: Roteiro | BlogPost;
  contentType: 'roteiro' | 'artigo';
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
}

export default function PublishValidationModal({
  content,
  contentType,
  isOpen,
  onClose,
  onPublish
}: PublishValidationModalProps) {
  const [validation, setValidation] = useState<ContentValidation | null>(null);
  const [editedFields, setEditedFields] = useState<any>({});
  const [publishing, setPublishing] = useState(false);
  const [generatedCost, setGeneratedCost] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Validar conteúdo ao abrir modal
      const result = contentType === 'roteiro'
        ? validateRoteiro(content as Roteiro)
        : validateBlogPost(content as BlogPost);
      setValidation(result);
      setEditedFields({});
      setGeneratedCost(0);
    }
  }, [isOpen, content, contentType]);

  const handleFieldChange = (field: string, value: any) => {
    setEditedFields((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAIGenerated = (fields: any, cost: number) => {
    setEditedFields((prev: any) => ({
      ...prev,
      ...fields,
    }));
    setGeneratedCost(cost);

    // Revalidar com novos campos
    const updatedContent = { ...content, ...editedFields, ...fields };
    const result = contentType === 'roteiro'
      ? validateRoteiro(updatedContent as Roteiro)
      : validateBlogPost(updatedContent as BlogPost);
    setValidation(result);
  };

  const handlePublish = async () => {
    if (!validation) return;

    // Se ainda tiver campos obrigatórios faltando, não permite publicar
    if (!validation.canPublish && Object.keys(editedFields).length === 0) {
      alert('Por favor, preencha os campos obrigatórios antes de publicar.');
      return;
    }

    setPublishing(true);

    try {
      const response = await fetch('/api/admin/content/publish', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: content.id,
          type: contentType,
          updates: editedFields,
          generation_cost: generatedCost,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao publicar conteúdo');
      }

      onPublish();
      onClose();
    } catch (error) {
      console.error('Erro ao publicar:', error);
      alert('Erro ao publicar. Por favor, tente novamente.');
    } finally {
      setPublishing(false);
    }
  };

  if (!isOpen || !validation) return null;

  const canPublishNow = validation.canPublish ||
    (validation.seo.missing.every(f => editedFields[f]) &&
     validation.openGraph.missing.every(f => editedFields[f]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Validação para Publicação</h2>
            <p className="text-purple-100 mt-1">
              {content.titulo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status de Validação */}
          {!canPublishNow && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <p className="font-semibold text-yellow-900">
                  Campos obrigatórios faltando
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Preencha os campos SEO e OpenGraph antes de publicar, ou use a IA para gerar automaticamente.
                </p>
              </div>
            </div>
          )}

          {canPublishNow && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <div className="text-green-600 text-2xl">✅</div>
              <div>
                <p className="font-semibold text-green-900">
                  Pronto para publicar!
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Todos os campos obrigatórios estão preenchidos.
                </p>
              </div>
            </div>
          )}

          {/* Gerador de IA */}
          {!canPublishNow && validation.missingCount > 0 && (
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 bg-purple-50">
              <h3 className="font-bold text-lg text-purple-900 mb-2">
                Gerar Campos Automaticamente
              </h3>
              <p className="text-sm text-purple-700 mb-4">
                Use IA para preencher todos os campos faltantes de SEO e OpenGraph automaticamente com base no conteúdo.
              </p>
              <AIFieldGenerator
                contentId={content.id}
                contentType={contentType}
                onGenerated={handleAIGenerated}
              />
              {generatedCost > 0 && (
                <p className="text-sm text-purple-600 mt-2">
                  Custo da geração: {formatCost(generatedCost)}
                </p>
              )}
            </div>
          )}

          {/* Indicador de Validação */}
          <FieldValidationIndicator validation={validation} />

          {/* Campos Editáveis (se houver campos gerados pela IA) */}
          {Object.keys(editedFields).length > 0 && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="font-bold text-lg text-blue-900 mb-4">
                Campos Gerados pela IA (Editáveis)
              </h3>
              <div className="space-y-4">
                {Object.entries(editedFields).map(([field, value]: [string, any]) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {formatFieldName(field)}
                    </label>
                    {field === 'keywords' ? (
                      <input
                        type="text"
                        value={Array.isArray(value) ? value.join(', ') : value}
                        onChange={(e) => handleFieldChange(field, e.target.value.split(',').map(k => k.trim()))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    ) : (
                      <textarea
                        value={value}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        rows={field.includes('description') ? 3 : 1}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {typeof value === 'string' ? value.length : 0} caracteres
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={publishing}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handlePublish}
            disabled={!canPublishNow || publishing}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {publishing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Publicando...
              </>
            ) : (
              'Publicar Agora'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
