'use client';

import { useState } from 'react';
import { UserCheck, Plus, Search, Filter, Download, Mail, Phone, Eye, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeader from './layout/PageHeader';

interface Cliente {
  id: string;
  nome: string;
  email?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  status: string;
  tipo: string;
  segmento?: string | null;
  nivel: string;
  total_viagens: number;
  total_gasto: number;
  ticket_medio: number;
  data_ultimo_contato?: string | null;
  created_at: string;
  updated_at: string;
}

interface ClientesClientPageProps {
  clientes: Cliente[];
}

export default function ClientesClientPage({ clientes }: ClientesClientPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'todos' | 'pessoa_fisica' | 'pessoa_juridica'>('todos');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'vip' | 'inativo'>('todos');

  // Filtrar clientes
  const clientesFiltrados = clientes.filter(c => {
    const matchSearch = searchTerm === '' || 
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchTipo = tipoFilter === 'todos' || c.tipo === tipoFilter;
    const matchStatus = statusFilter === 'todos' || c.status === statusFilter;
    
    return matchSearch && matchTipo && matchStatus;
  });

  // Estatísticas
  const estatisticas = {
    total: clientes.length,
    ativos: clientes.filter(c => c.status === 'ativo').length,
    vip: clientes.filter(c => c.status === 'vip').length,
    valorTotal: clientes.reduce((acc, c) => acc + c.total_gasto, 0)
  };

  const handleVerDetalhes = (clienteId: string) => {
    router.push(`/admin/clientes/${clienteId}`);
  };

  return (
    <div>
      <PageHeader title="Gestão de Clientes" subtitle="Base de dados central de todos os seus clientes" actions={(
        <button onClick={() => router.push('/admin/clientes/novo')} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
          <Plus size={20} /> Novo Cliente
        </button>
      )} />
      {/* Header */}

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
          <p className="text-xs text-muted mb-1">Total de Clientes</p>
          <p className="text-3xl font-semibold text-primary">{estatisticas.total}</p>
        </div>
        <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
          <p className="text-xs text-muted mb-1">Clientes Ativos</p>
          <p className="text-3xl font-bold text-green-600">{estatisticas.ativos}</p>
        </div>
        <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
          <p className="text-xs text-muted mb-1">Clientes VIP</p>
          <p className="text-3xl font-bold text-purple-600">{estatisticas.vip}</p>
        </div>
        <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
          <p className="text-xs text-muted mb-1">Receita Total</p>
          <p className="text-3xl font-bold text-blue-600">
            €{(estatisticas.valorTotal / 1000).toFixed(1)}k
          </p>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)] mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary0" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-white/5 text-primary placeholder:text-primary0 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            />
          </div>
          
          {/* Filtro Tipo */}
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value as any)}
            className="px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-primary placeholder:text-primary0 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="pessoa_fisica">Pessoa Física</option>
            <option value="pessoa_juridica">Pessoa Jurídica</option>
          </select>
          
          {/* Filtro Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-3 border border-white/10 rounded-lg bg-white/5 text-primary placeholder:text-primary0 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="vip">VIP</option>
            <option value="inativo">Inativo</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-3 border border-default rounded-lg hover:bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20">
            <Download size={20} />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="surface-card rounded-xl shadow-sm border border-default overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  Última Viagem
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#0B1220] divide-y divide-white/5">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map((cliente) => (
                  <tr 
                    key={cliente.id} 
                    className="hover:bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20 cursor-pointer"
                    onClick={() => handleVerDetalhes(cliente.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                            cliente.status === 'vip' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                            cliente.status === 'ativo' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                            'bg-gray-400'
                          }`}>
                            {cliente.nome[0]?.toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-primary">{cliente.nome}</div>
                            {cliente.status === 'vip' && (
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full border border-white/10 bg-white/5 text-indigo-300">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted">
                            {cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'} • {cliente.nivel.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-primary">
                        {cliente.email && (
                          <div className="flex items-center gap-2 mb-1">
                            <Mail size={14} className="text-primary0" />
                            <span className="truncate max-w-[200px]">{cliente.email}</span>
                          </div>
                        )}
                        {cliente.whatsapp && (
                          <div className="flex items-center gap-2 text-muted">
                            <Phone size={14} className="text-primary0" />
                            {cliente.whatsapp}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        cliente.segmento === 'luxo' ? 'border border-white/10 bg-white/5 text-indigo-300' :
                        cliente.segmento === 'familia' ? 'border border-white/10 bg-white/5 text-indigo-300' :
                        cliente.segmento === 'aventura' ? 'border border-white/10 bg-white/5 text-emerald-300' :
                        'border border-white/10 bg-white/5 text-slate-300'
                      }`}>
                        {cliente.segmento || 'Geral'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-primary">
                        €{cliente.total_gasto.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-muted">
                        {cliente.total_viagens} viagens
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {cliente.data_ultimo_contato 
                        ? new Date(cliente.data_ultimo_contato).toLocaleDateString('pt-PT')
                        : 'N/D'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerDetalhes(cliente.id);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center gap-1"
                      >
                        <Eye size={16} />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-muted">
                      <UserCheck size={48} className="mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Nenhum cliente encontrado</p>
                      <p className="text-sm mt-2">Comece adicionando seu primeiro cliente</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
