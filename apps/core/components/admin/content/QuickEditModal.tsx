// components/admin/content/QuickEditModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2, Sparkles } from 'lucide-react';
import { Roteiro, BlogPost } from '@/lib/types';
import { formatFieldName } from '@/lib/utils/field-validator';

interface QuickEditModalProps {
  content: Roteiro | BlogPost;
  contentType: 'roteiro' | 'artigo';
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function QuickEditModal({
  content,
  contentType,
  isOpen,
  onClose,
  onSave
}: QuickEditModalProps) {
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [ogImageSource, setOgImageSource] = useState<'same' | 'custom'>('same');

  useEffect(() => {
    if (isOpen) {
      // Inicializar formulário com dados atuais
      const currentImageUrl = contentType === 'roteiro'
        ? (content as Roteiro).imagem_url
        : (content as BlogPost).imagem_capa_url;

      // Determinar se og_image_url é igual à imagem principal
      const hasCustomOgImage = content.og_image_url && content.og_image_url !== currentImageUrl;

      setFormData({
        titulo: content.titulo || '',
        categoria: content.categoria || '',
        descricao_curta: contentType === 'roteiro' ? (content as Roteiro).descricao_curta : '',
        resumo: contentType === 'artigo' ? (content as BlogPost).resumo : '',
        meta_title: content.meta_title || '',
        meta_description: content.meta_description || '',
        keywords: Array.isArray(content.keywords) ? content.keywords.join(', ') : '',
        og_title: content.og_title || '',
        og_description: content.og_description || '',
        og_image_url: content.og_image_url || '',
        imagem_alt_text: content.imagem_alt_text || '',
        og_image_alt_text: content.og_image_alt_text || '',
        canonical_url: content.canonical_url || '',
        destaque: content.destaque || false,
      });

      setOgImageSource(hasCustomOgImage ? 'custom' : 'same');
    }
  }, [isOpen, content, contentType]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleDestaque = () => {
    setFormData((prev: any) => ({
      ...prev,
      destaque: !prev.destaque,
    }));
  };

  const handleGenerateMissing = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/admin/content/generate-seo-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: content.id,
          type: contentType,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar campos');
      }

      const data = await response.json();

      // Atualizar apenas campos vazios
      setFormData((prev: any) => ({
        ...prev,
        meta_title: prev.meta_title || data.fields.meta_title || '',
        meta_description: prev.meta_description || data.fields.meta_description || '',
        keywords: prev.keywords || (data.fields.keywords || []).join(', ') || '',
        og_title: prev.og_title || data.fields.og_title || '',
        og_description: prev.og_description || data.fields.og_description || '',
        imagem_alt_text: prev.imagem_alt_text || data.fields.imagem_alt_text || '',
        og_image_alt_text: prev.og_image_alt_text || data.fields.og_image_alt_text || '',
        canonical_url: prev.canonical_url || data.fields.canonical_url || '',
      }));
    } catch (error) {
      console.error('Erro ao gerar campos:', error);
      alert('Erro ao gerar campos com IA. Tente novamente.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determinar og_image_url baseado na fonte selecionada
      const currentImageUrl = contentType === 'roteiro'
        ? (content as Roteiro).imagem_url
        : (content as BlogPost).imagem_capa_url;

      const finalOgImageUrl = ogImageSource === 'same'
        ? currentImageUrl
        : formData.og_image_url;

      const updates: any = {
        titulo: formData.titulo,
        categoria: formData.categoria,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        keywords: formData.keywords.split(',').map((k: string) => k.trim()).filter(Boolean),
        og_title: formData.og_title,
        og_description: formData.og_description,
        og_image_url: finalOgImageUrl,
        imagem_alt_text: formData.imagem_alt_text,
        og_image_alt_text: formData.og_image_alt_text,
        canonical_url: formData.canonical_url,
        destaque: formData.destaque,
      };

      if (contentType === 'roteiro') {
        updates.descricao_curta = formData.descricao_curta;
      } else {
        updates.resumo = formData.resumo;
      }

      const endpoint = contentType === 'roteiro'
        ? '/api/admin/content/roteiros'
        : '/api/admin/content/artigos';

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: content.id,
          updates,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar');
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-2xl font-bold">Edição Rápida</h2>
            <p className="text-blue-100 mt-1 text-sm">{content.titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {/* Botão Gerar com IA */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-purple-900">Campos Faltantes?</h3>
                <p className="text-sm text-purple-700 mt-1">
                  Use IA para preencher automaticamente campos vazios
                </p>
              </div>
              <button
                onClick={handleGenerateMissing}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Gerar com IA
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Campos Básicos */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-2">Informações Básicas</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={formData.titulo || ''}
                onChange={(e) => handleChange('titulo', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <input
                type="text"
                value={formData.categoria || ''}
                onChange={(e) => handleChange('categoria', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {contentType === 'roteiro' ? 'Descrição Curta' : 'Resumo'}
              </label>
              <textarea
                value={contentType === 'roteiro' ? formData.descricao_curta || '' : formData.resumo || ''}
                onChange={(e) => handleChange(contentType === 'roteiro' ? 'descricao_curta' : 'resumo', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Toggle Destaque */}
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="font-medium text-gray-900">Marcar como Destaque</p>
                <p className="text-sm text-gray-600">Aparecerá na página inicial do site</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleDestaque}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                formData.destaque ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  formData.destaque ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Campos SEO */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-2 flex items-center gap-2">
              <span className="text-blue-600">📊</span> Campos de SEO
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title <span className="text-gray-500">(máx 60 caracteres)</span>
              </label>
              <input
                type="text"
                maxLength={60}
                value={formData.meta_title || ''}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.meta_title || '').length}/60</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description <span className="text-gray-500">(máx 160 caracteres)</span>
              </label>
              <textarea
                maxLength={160}
                value={formData.meta_description || ''}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.meta_description || '').length}/160</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords <span className="text-gray-500">(separadas por vírgula)</span>
              </label>
              <input
                type="text"
                value={formData.keywords || ''}
                onChange={(e) => handleChange('keywords', e.target.value)}
                placeholder="viagem, destino, turismo, aventura"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Canônica
              </label>
              <input
                type="text"
                value={formData.canonical_url || ''}
                onChange={(e) => handleChange('canonical_url', e.target.value)}
                placeholder="https://nomade.guru/..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Campos OpenGraph */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-2 flex items-center gap-2">
              <span className="text-purple-600">🌐</span> Campos OpenGraph
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Title <span className="text-gray-500">(máx 60 caracteres)</span>
              </label>
              <input
                type="text"
                maxLength={60}
                value={formData.og_title || ''}
                onChange={(e) => handleChange('og_title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.og_title || '').length}/60</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OG Description <span className="text-gray-500">(máx 65 caracteres)</span>
              </label>
              <textarea
                maxLength={65}
                value={formData.og_description || ''}
                onChange={(e) => handleChange('og_description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.og_description || '').length}/65</p>
            </div>
          </div>

          {/* Campos de Imagem */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-900 border-b pb-2 flex items-center gap-2">
              <span className="text-orange-600">🖼️</span> Textos Alt de Imagem
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto Alt da Imagem Principal <span className="text-gray-500">(máx 125 caracteres)</span>
              </label>
              <input
                type="text"
                maxLength={125}
                value={formData.imagem_alt_text || ''}
                onChange={(e) => handleChange('imagem_alt_text', e.target.value)}
                placeholder="Descrição acessível da imagem"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.imagem_alt_text || '').length}/125</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto Alt OG Image <span className="text-gray-500">(máx 100 caracteres)</span>
              </label>
              <input
                type="text"
                maxLength={100}
                value={formData.og_image_alt_text || ''}
                onChange={(e) => handleChange('og_image_alt_text', e.target.value)}
                placeholder="Descrição para redes sociais"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{(formData.og_image_alt_text || '').length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL da Imagem OpenGraph
              </label>
              <div className="space-y-3">
                <select
                  value={ogImageSource}
                  onChange={(e) => setOgImageSource(e.target.value as 'same' | 'custom')}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="same">📸 Mesma imagem do post</option>
                  <option value="custom">🔗 URL personalizada</option>
                </select>

                {ogImageSource === 'same' ? (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-1">Usando URL:</p>
                    <p className="text-sm text-gray-900 break-all">
                      {contentType === 'roteiro'
                        ? ((content as Roteiro).imagem_url || 'Nenhuma imagem definida')
                        : ((content as BlogPost).imagem_capa_url || 'Nenhuma imagem definida')
                      }
                    </p>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={formData.og_image_url || ''}
                    onChange={(e) => handleChange('og_image_url', e.target.value)}
                    placeholder="https://cloudinary.com/..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Salvando...
              </>
            ) : (
              <>
                <Save size={18} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
