// components/admin/content/ContentListTable.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Edit, Trash2, Eye, Search } from 'lucide-react';
import { RoteiroWithValidation, BlogPostWithValidation } from '@/lib/types';
import { formatCost } from '@/lib/utils/cost-calculator';
import { formatFieldName } from '@/lib/utils/field-validator';
import StatusBadge from './StatusBadge';
import PublishValidationModal from './PublishValidationModal';
import QuickEditModal from './QuickEditModal';

interface ContentListTableProps {
  contentType: 'roteiro' | 'artigo';
  status: 'draft' | 'published';
}

export default function ContentListTable({ contentType, status }: ContentListTableProps) {
  const [items, setItems] = useState<(RoteiroWithValidation | BlogPostWithValidation)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [contentType, status, searchTerm, categoryFilter]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const endpoint = contentType === 'roteiro'
        ? '/api/admin/content/roteiros'
        : '/api/admin/content/artigos';

      const params = new URLSearchParams({
        status,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { categoria: categoryFilter }),
      });

      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = (item: any) => {
    setSelectedItem(item);
    setShowPublishModal(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleUnpublish = async (item: any) => {
    if (!confirm('Tem certeza que deseja despublicar este item?')) return;

    try {
      const response = await fetch('/api/admin/content/publish', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          type: contentType,
          status: 'draft',
        }),
      });

      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Erro ao despublicar:', error);
    }
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Tem certeza que deseja deletar "${item.titulo}"?`)) return;

    try {
      const endpoint = contentType === 'roteiro'
        ? '/api/admin/content/roteiros'
        : '/api/admin/content/artigos';

      const response = await fetch(`${endpoint}?id=${item.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filtro de Categoria */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Todas as categorias</option>
            {/* Categorias serão carregadas dinamicamente */}
          </select>
        </div>
      </div>

      {/* Tabela */}
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Nenhum item encontrado</p>
          <p className="text-gray-500 text-sm mt-1">
            {status === 'draft'
              ? 'Ainda não há conteúdo em rascunho.'
              : 'Ainda não há conteúdo publicado.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Categoria</th>
                  {status === 'draft' && (
                    <>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">SEO</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">OpenGraph</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Outros</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Custo</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Data</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{item.titulo}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {contentType === 'roteiro'
                          ? (item as RoteiroWithValidation).descricao_curta
                          : (item as BlogPostWithValidation).resumo}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.categoria || '-'}
                    </td>
                    {status === 'draft' && item.validation && (
                      <>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge
                            status={item.validation.seo.status}
                            label=""
                            missingFields={item.validation.seo.missing.map(formatFieldName)}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge
                            status={item.validation.openGraph.status}
                            label=""
                            missingFields={item.validation.openGraph.missing.map(formatFieldName)}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge
                            status={item.validation.otherFields.status}
                            label=""
                            missingFields={item.validation.otherFields.missing.map(formatFieldName)}
                          />
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 text-right text-sm font-mono text-gray-900">
                      {item.total_cost ? formatCost(item.total_cost) : '-'}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {status === 'draft' ? (
                          <>
                            <button
                              onClick={() => handlePublish(item)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Publicar"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleUnpublish(item)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Despublicar"
                            >
                              <XCircle size={18} />
                            </button>
                            <button
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Visualizar"
                            >
                              <Eye size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Publicação */}
      {selectedItem && (
        <PublishValidationModal
          content={selectedItem}
          contentType={contentType}
          isOpen={showPublishModal}
          onClose={() => {
            setShowPublishModal(false);
            setSelectedItem(null);
          }}
          onPublish={() => {
            fetchContent();
            setShowPublishModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Modal de Edição Rápida */}
      {selectedItem && (
        <QuickEditModal
          content={selectedItem}
          contentType={contentType}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSave={() => {
            fetchContent();
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
