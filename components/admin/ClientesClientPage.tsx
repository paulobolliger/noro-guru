// components/admin/ClientesClientPage.tsx
'use client';

import { useState } from 'react';
import { UserCheck, Plus, Search, Filter, Download, Mail, Phone } from 'lucide-react';
import type { Database } from '@/types/supabase';

type Cliente = Database['public']['Tables']['nomade_leads']['Row'] & {
  total_pedidos?: number;
  valor_total_gasto?: number;
  ultimo_pedido?: string;
};

interface ClientesClientPageProps {
  clientes: Cliente[];
}

export default function ClientesClientPage({ clientes }: ClientesClientPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  // Filtrar clientes (apenas leads que viraram clientes)
  const clientesFiltrados = clientes
    .filter(c => c.status === 'ganho') // Apenas leads convertidos
    .filter(c => {
      const matchSearch = searchTerm === '' || 
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });

  const estatisticas = {
    total: clientesFiltrados.length,
    ativos: clientesFiltrados.filter(c => c.status === 'ganho').length,
    vip: clientesFiltrados.filter(c => (c.valor_estimado || 0) > 50000).length,
    valorTotal: clientesFiltrados.reduce((acc, c) => acc + (c.valor_estimado || 0), 0)
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <UserCheck size={32} className="text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
            <p className="text-gray-600 mt-1">Base de dados central de todos os seus clientes</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
          <p className="text-3xl font-bold text-gray-900">{estatisticas.total}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Clientes Ativos</p>
          <p className="text-3xl font-bold text-green-600">{estatisticas.ativos}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Clientes VIP</p>
          <p className="text-3xl font-bold text-purple-600">{estatisticas.vip}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Receita Total</p>
          <p className="text-3xl font-bold text-blue-600">
            €{(estatisticas.valorTotal / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
              Filtros
            </button>
            <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={20} />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Viagem
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {cliente.nome[0]?.toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                          {cliente.destino_interesse && (
                            <div className="text-sm text-gray-500">Interesse: {cliente.destino_interesse}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cliente.email && (
                          <div className="flex items-center gap-2 mb-1">
                            <Mail size={14} />
                            {cliente.email}
                          </div>
                        )}
                        {cliente.whatsapp && (
                          <div className="flex items-center gap-2 text-gray-500">
                            <Phone size={14} />
                            {cliente.whatsapp}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {cliente.origem || 'Desconhecida'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      €{(cliente.valor_estimado || 0).toLocaleString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.periodo_viagem || 'N/D'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        Ver Detalhes
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Cliente - TODO */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Adicionar Novo Cliente</h2>
            <p className="text-gray-600 mb-6">Preencha os dados do cliente</p>
            {/* Formulário aqui */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Salvar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}