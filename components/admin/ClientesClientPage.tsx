'use client';

import { useState } from 'react';
import { UserCheck, Plus, Search, Mail, Phone, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Cliente {
  id: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  status?: string;
  tipo?: string;
  segmento?: string | null;
  nivel?: string;
  total_viagens?: number;
  total_gasto?: number;
  ticket_medio?: number;
  data_ultimo_contato?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ClientesClientPageProps {
  clientes: Cliente[];
}

export default function ClientesClientPage({ clientes }: ClientesClientPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'pessoa_fisica' | 'pessoa_juridica'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'vip' | 'inativo'>('todos');

  const clientesFiltrados = clientes.filter(c => {
    const matchSearch = searchTerm === '' || c.nome.toLowerCase().includes(searchTerm.toLowerCase()) || c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipo = tipoFilter === 'todos' || (c.tipo || 'pessoa_fisica') === tipoFilter;
    const matchStatus = statusFilter === 'todos' || (c.status || 'ativo') === statusFilter;
    return matchSearch && matchTipo && matchStatus;
  });

  const estatisticas = {
    total: clientes.length,
    ativos: clientes.filter(c => (c.status || 'ativo') === 'ativo').length,
    vip: clientes.filter(c => c.status === 'vip').length,
    valorTotal: clientes.reduce((acc, c) => acc + (c.total_gasto || 0), 0)
  };

  const handleVerDetalhes = (clienteId: string) => router.push(`/core/clientes/${clienteId}`);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <UserCheck size={32} className="text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Clientes</h1>
            <p className="text-gray-600 mt-1">Base de dados central de todos os seus clientes</p>
          </div>
        </div>
        <button onClick={() => router.push('/core/clientes/novo')} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
          <Plus size={20} />
          Novo Cliente
        </button>
      </div>

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
          <p className="text-3xl font-bold text-blue-600">R${(estatisticas.valorTotal / 1000).toFixed(1)}k</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por nome ou email..." className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value as any)} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="todos">Todos os Tipos</option>
            <option value="pessoa_fisica">Pessoa Física</option>
            <option value="pessoa_juridica">Pessoa Jurídica</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="vip">VIP</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Segmento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor / Viagens</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Contato</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleVerDetalhes(cliente.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                          (cliente.status || 'ativo') === 'vip' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                          (cliente.status || 'ativo') === 'ativo' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                          'bg-gray-400'
                        }`}>
                          {cliente.nome?.[0]?.toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                          {(cliente.status || 'ativo') === 'vip' && (
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">VIP</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(cliente.tipo || 'pessoa_fisica') === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'} • {(cliente.nivel || 'bronze').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {cliente.email && (
                        <div className="flex items-center gap-2 mb-1"><Mail size={14} className="text-gray-400" /><span className="truncate max-w-[200px]">{cliente.email}</span></div>
                      )}
                      {cliente.whatsapp && (
                        <div className="flex items-center gap-2 text-gray-500"><Phone size={14} className="text-gray-400" />{cliente.whatsapp}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (cliente.segmento || 'geral') === 'luxo' ? 'bg-purple-100 text-purple-800' :
                      (cliente.segmento || 'geral') === 'familia' ? 'bg-blue-100 text-blue-800' :
                      (cliente.segmento || 'geral') === 'aventura' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cliente.segmento || 'Geral'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">R${(cliente.total_gasto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <div className="text-xs text-gray-500">{(cliente.total_viagens || 0)} viagens</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cliente.data_ultimo_contato ? new Date(cliente.data_ultimo_contato).toLocaleDateString('pt-BR') : 'N/D'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={(e) => { e.stopPropagation(); handleVerDetalhes(cliente.id); }} className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center gap-1">
                      <Eye size={16} /> Ver
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-6 py-12 text-center"><p className="text-gray-500">Nenhum cliente encontrado.</p></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

