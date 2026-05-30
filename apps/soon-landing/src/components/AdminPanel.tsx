import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Trash2, 
  Download, 
  Search, 
  X, 
  Database, 
  FileSpreadsheet, 
  AlertCircle, 
  Calendar,
  Filter,
  UserPlus
} from 'lucide-react';
import { WaitlistLead } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  leads: WaitlistLead[];
  onReset: () => void;
  onAddSampleLead: () => void;
}

export default function AdminPanel({ onClose, leads, onReset, onAddSampleLead }: AdminPanelProps) {
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.whatsapp.includes(search);
    
    const matchesFilter = filterTeam === 'all' || lead.teamSize === filterTeam;

    return matchesSearch && matchesFilter;
  });

  const exportCSV = () => {
    if (leads.length === 0) return;
    
    // Create CSV headers
    const headers = ['ID', 'Email', 'WhatsApp', 'Equipe', 'Data Cadastro'];
    const rows = leads.map((lead) => [
      lead.id,
      lead.email,
      lead.whatsapp,
      lead.teamSize,
      lead.timestamp
    ]);

    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'noroguru_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const teamDistribution = {
    '1': leads.filter(l => l.teamSize === '1').length,
    '2-5': leads.filter(l => l.teamSize === '2-5').length,
    '6-15': leads.filter(l => l.teamSize === '6-15').length,
    '15+': leads.filter(l => l.teamSize === '15+').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-noro-dark/80 backdrop-blur-md" id="admin-panel-overlay">
      {/* Drawer Container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-4xl bg-noro-dark-elevated border-l border-noro-border h-full flex flex-col shadow-2xl relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-noro-purple/20 flex items-center justify-between bg-noro-dark-card/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-noro-teal/10 border border-noro-teal/30 flex items-center justify-center">
              <Database className="w-5 h-5 text-noro-teal animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Leads Capturados • Noro Guru</h2>
              <p className="text-xs text-gray-400">Ambiente de homologação do banco de dados local do seu SaaS.</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-noro-dark hover:bg-noro-purple-deep border border-noro-purple/20 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Cards */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-5 gap-4 border-b border-noro-purple/10 bg-noro-dark/40">
          <div className="bg-noro-dark-card/50 p-4 rounded-xl border border-noro-purple/10">
            <p className="text-[10px] font-mono uppercase text-gray-500 font-bold">Total Leads</p>
            <p className="text-2xl font-black text-white font-mono mt-1">{leads.length}</p>
          </div>
          <div className="bg-noro-dark-card/50 p-4 rounded-xl border border-noro-purple/10">
            <p className="text-[10px] font-mono uppercase text-gray-500 font-bold">Só Eu (Autônomo)</p>
            <p className="text-2xl font-black text-noro-teal font-mono mt-1">{teamDistribution['1']}</p>
          </div>
          <div className="bg-noro-dark-card/50 p-4 rounded-xl border border-noro-purple/10">
            <p className="text-[10px] font-mono uppercase text-gray-500 font-bold">Pequena (2-5)</p>
            <p className="text-2xl font-black text-purple-300 font-mono mt-1">{teamDistribution['2-5']}</p>
          </div>
          <div className="bg-noro-dark-card/50 p-4 rounded-xl border border-noro-purple/10">
            <p className="text-[10px] font-mono uppercase text-gray-500 font-bold">Média (6-15)</p>
            <p className="text-2xl font-black text-purple-400 font-mono mt-1">{teamDistribution['6-15']}</p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-noro-dark-card/50 p-4 rounded-xl border border-noro-purple/10">
            <p className="text-[10px] font-mono uppercase text-gray-500 font-bold">Grandes (15+)</p>
            <p className="text-2xl font-black text-pink-400 font-mono mt-1">{teamDistribution['15+']}</p>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-noro-purple/10 bg-noro-dark-card/10">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por e-mail ou WhatsApp..."
              className="w-full bg-noro-dark border border-noro-purple/20 focus:border-noro-teal rounded-lg pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder-gray-500 transition-all font-mono"
            />
          </div>

          {/* Filters & Sample Generators */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter */}
            <div className="flex items-center gap-1 bg-noro-dark border border-noro-purple/20 rounded-lg px-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="bg-transparent text-gray-300 py-2 outline-none border-0 focus:ring-0 text-[11px] font-mono font-bold uppercase"
              >
                <option value="all">TODAS EQUIPES</option>
                <option value="1">SÓ MEI / AUTÔNOMO</option>
                <option value="2-5">2 A 5 AGENTES</option>
                <option value="6-15">6 A 15 AGENTES</option>
                <option value="15+">MAIS DE 15</option>
              </select>
            </div>

            {/* Quick Demo lead */}
            <button
              onClick={onAddSampleLead}
              className="flex items-center gap-1 text-[11px] font-bold font-mono uppercase bg-noro-teal/15 hover:bg-noro-teal text-noro-teal hover:text-noro-dark border border-noro-teal/30 hover:border-noro-teal px-3 py-2 rounded-lg transition-all"
              title="Gerar lead fictício para visualização imediata"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Simular Lead</span>
            </button>

            {/* Reset Database */}
            <button
              onClick={onReset}
              className="p-2 border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg text-red-400 transition-all cursor-pointer"
              title="Limpar todos os registros locais"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Export CSV */}
            <button
              disabled={leads.length === 0}
              onClick={exportCSV}
              className="flex items-center gap-1.5 text-[11px] font-bold font-mono uppercase bg-noro-purple-light hover:bg-noro-purple-hover disabled:bg-gray-800 disabled:text-gray-500 disabled:border-transparent text-white border border-noro-purple-light/20 px-3 py-2 rounded-lg transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Leads Table Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredLeads.length > 0 ? (
            <div className="border border-noro-purple/10 rounded-xl overflow-hidden bg-noro-dark-card/25 shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-noro-dark border-b border-noro-purple/15 text-[10px] font-mono uppercase text-gray-400 font-bold">
                    <th className="py-4 px-4.5">Pioneiro / Contato</th>
                    <th className="py-4 px-4.5">Equipe / Tamanho</th>
                    <th className="py-4 px-4.5">Data Registro</th>
                    <th className="py-4 px-4.5 text-right">Acesso Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-noro-purple/10 text-xs font-mono">
                  {filteredLeads.map((lead, idx) => (
                    <tr key={lead.id} className="hover:bg-noro-purple-deep/10 transition-colors">
                      <td className="py-4 px-4.5">
                        <div className="font-bold text-white mb-0.5">{lead.email}</div>
                        <div className="text-[10px] text-gray-500 flex items-center gap-1">
                          <span>Whats: {lead.whatsapp}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                          lead.teamSize === '1' 
                            ? 'bg-noro-teal/5 border-noro-teal/20 text-noro-teal' 
                            : lead.teamSize === '2-5' 
                            ? 'bg-purple-300/5 border-purple-300/20 text-purple-300' 
                            : lead.teamSize === '6-15'
                            ? 'bg-purple-400/5 border-purple-400/20 text-purple-400'
                            : 'bg-pink-400/5 border-pink-400/20 text-pink-400'
                        }`}>
                          {lead.teamSize === '1' ? 'Solo MEI' : lead.teamSize === '2-5' ? '2 a 5 agentes' : lead.teamSize === '6-15' ? '6 a 15 agentes' : '15+ agentes'}
                        </span>
                      </td>
                      <td className="py-4 px-4.5 text-gray-400 flex items-center gap-1 mt-1.5 border-0">
                        <Calendar className="w-3.5 h-3.5 text-gray-600" />
                        {new Date(lead.timestamp).toLocaleDateString('pt-BR')} {new Date(lead.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="py-4 px-4.5 text-right">
                        <span className="text-[10px] font-mono bg-noro-teal/10 text-noro-teal px-2 py-0.5 rounded border border-noro-teal/25 font-bold">
                          FILA #0{idx + 38}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-noro-purple/20 rounded-xl">
              <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-300 mb-1">Nenhum lead encontrado</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">Tente ajustar seus termos de busca/filtros ou clique em "Simular Lead" para carregar amostras fictícias.</p>
            </div>
          )}
        </div>

        {/* Footer info code */}
        <div className="p-4 bg-noro-dark border-t border-noro-purple/15 text-center text-[10px] font-mono text-gray-600">
          * Os dados capturados acima são gerenciados de forma persistente no localStorage do seu navegador (client-side db).
        </div>
      </motion.div>
    </div>
  );
}
