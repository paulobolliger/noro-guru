// components/admin/clientes/ClienteDetalhes360.tsx
'use client';

import { useState, useCallback, useTransition } from 'react';
import { Cliente } from "@types/clientes";
import { createClientUpdateToken } from "@/app/(protected)/clientes/[id]/actions";
import DadosPessoaisTab from './tabs/DadosPessoaisTab';
import DocumentosTab from './tabs/DocumentosTab';
import PreferenciasTab from './tabs/PreferenciasTab';
import EnderecosTab from './tabs/EnderecosTab';
import ContatosTab from './tabs/ContatosTab';
import MilhasTab from './tabs/MilhasTab';
import HistoricoTab from './tabs/HistoricoTab';
import TimelineTab from './tabs/TimelineTab';
import { 
  User, 
  FileText, 
  Heart, 
  MapPin, 
  Phone, 
  Plane,
  History,
  Clock,
  Mail,
  MessageSquare,
  Edit,
  Send,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';

interface ClienteDetalhes360Props {
  cliente: Cliente;
}

type TabId = 
  | 'dados-pessoais' 
  | 'documentos' 
  | 'preferencias' 
  | 'enderecos' 
  | 'contatos-emergencia' 
  | 'milhas'
  | 'historico'
  | 'timeline';

const tabs = [
  { id: 'dados-pessoais' as TabId, label: 'Dados Pessoais', icon: User },
  { id: 'documentos' as TabId, label: 'Documentos', icon: FileText },
  { id: 'preferencias' as TabId, label: 'Preferências', icon: Heart },
  { id: 'enderecos' as TabId, label: 'Endereços', icon: MapPin },
  { id: 'contatos-emergencia' as TabId, label: 'Contatos', icon: Phone },
  { id: 'milhas' as TabId, label: 'Milhas', icon: Plane },
  { id: 'historico' as TabId, label: 'Histórico', icon: History },
  { id: 'timeline' as TabId, label: 'Timeline', icon: Clock },
];

export default function ClienteDetalhes360({ cliente }: ClienteDetalhes360Props) {
  const [activeTab, setActiveTab] = useState<TabId>('dados-pessoais');
  const [isDadosPessoaisEditing, setIsDadosPessoaisEditing] = useState(false);
  
  // Estados para o link de atualização
  const [isGeneratingLink, startLinkGeneration] = useTransition();
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  
  const handleQuickEdit = useCallback(() => {
    setActiveTab('dados-pessoais');
    setIsDadosPessoaisEditing(true);
  }, []);
  
  const handleToggleEdit = useCallback((isEditing: boolean) => {
    setIsDadosPessoaisEditing(isEditing);
  }, []);

  // Função para gerar e exibir o link de atualização
  const handleGenerateUpdateLink = () => {
    startLinkGeneration(async () => {
      const result = await createClientUpdateToken(cliente.id);
      if (result.success && result.data?.url) {
        setGeneratedLink(result.data.url);
      } else {
        alert(result.message || 'Erro ao gerar o link.');
      }
    });
  };

  const copyToClipboard = () => {
    if (generatedLink) {
        navigator.clipboard.writeText(generatedLink);
        setHasCopied(true);
        setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold">
              {cliente.nome.charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {cliente.nome}
                </h1>
                
                {/* Badge de Status */}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  cliente.status === 'ativo' ? 'bg-green-100 text-green-800' :
                  cliente.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                  cliente.status === 'inativo' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {cliente.status.toUpperCase()}
                </span>
                
                {/* Badge de Nível */}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  cliente.nivel === 'bronze' ? 'bg-orange-100 text-orange-800' :
                  cliente.nivel === 'prata' ? 'bg-gray-100 text-gray-800' :
                  cliente.nivel === 'ouro' ? 'bg-yellow-100 text-yellow-800' :
                  cliente.nivel === 'platina' ? 'bg-blue-100 text-blue-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {cliente.nivel.toUpperCase()}
                </span>
              </div>
              
              <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                {cliente.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {cliente.email}
                  </span>
                )}
                {cliente.telefone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {cliente.telefone}
                  </span>
                )}
              </div>
              
              {/* Métricas Rápidas */}
              <div className="mt-3 flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Viagens:</span>
                  <span className="ml-1 font-semibold text-gray-900">
                    {cliente.total_viagens}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Ticket Médio:</span>
                  <span className="ml-1 font-semibold text-gray-900">
                    {cliente.moeda_preferida} {cliente.ticket_medio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Total Gasto:</span>
                  <span className="ml-1 font-semibold text-gray-900">
                    {cliente.moeda_preferida} {cliente.total_gasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Input para exibir o link gerado */}
              {generatedLink && (
                <div className="mt-4 flex items-center gap-2 max-w-md">
                    <input type="text" readOnly value={generatedLink} className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"/>
                    <button onClick={copyToClipboard} className={`p-2 rounded-lg transition-colors ${hasCopied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                       {hasCopied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button onClick={handleGenerateUpdateLink} disabled={isGeneratingLink} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50">
              {isGeneratingLink ? <Loader2 className="w-4 h-4 animate-spin"/> : <Send className="w-4 h-4" />}
              Enviar Formulário
            </button>
            <button 
              onClick={handleQuickEdit} 
              className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex gap-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id !== 'dados-pessoais') {
                          setIsDadosPessoaisEditing(false);
                      }
                  }}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                    ${isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === 'dados-pessoais' && (
            <DadosPessoaisTab 
                cliente={cliente} 
                initialEditMode={isDadosPessoaisEditing}
                onToggleEdit={handleToggleEdit}
            />
        )}
          
          {activeTab === 'documentos' && (
             <DocumentosTab clienteId={cliente.id} />
          )}
          
          {activeTab === 'preferencias' && (
            <PreferenciasTab clienteId={cliente.id} />
        )}
          
          {activeTab === 'enderecos' && (
              <EnderecosTab clienteId={cliente.id} />
          )}
          
          {activeTab === 'contatos-emergencia' && (
              <ContatosTab clienteId={cliente.id} />
          )}
          
          {activeTab === 'milhas' && (
              <MilhasTab clienteId={cliente.id} />
          )}
          
          {activeTab === 'historico' && (
              <HistoricoTab clienteId={cliente.id} />
          )}
          
          {activeTab === 'timeline' && (
              <TimelineTab clienteId={cliente.id} />
          )}
        </div>
      </div>
    </div>
  );
}