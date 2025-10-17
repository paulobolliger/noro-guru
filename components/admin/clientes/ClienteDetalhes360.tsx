'use client';

import { useState } from 'react';
import { Cliente } from '@/types/clientes';
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
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark flex items-center gap-2">
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
                  onClick={() => setActiveTab(tab.id)}
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
            <DadosPessoaisTab cliente={cliente} />
        )}
          
          {activeTab === 'documentos' && (
            <div className="text-center py-12 text-gray-500">
             <DocumentosTab clienteId={cliente.id} />
            </div>
          )}
          
          {activeTab === 'preferencias' && (
            <PreferenciasTab clienteId={cliente.id} />
        )}
          
          {activeTab === 'enderecos' && (
            <div className="text-center py-12 text-gray-500">
              <EnderecosTab clienteId={cliente.id} />
            </div>
          )}
          
          {activeTab === 'contatos-emergencia' && (
            <div className="text-center py-12 text-gray-500">
              <ContatosTab clienteId={cliente.id} />
            </div>
          )}
          
          {activeTab === 'milhas' && (
            <div className="text-center py-12 text-gray-500">
              <MilhasTab clienteId={cliente.id} />
            </div>
          )}
          
          {activeTab === 'historico' && (
            <div className="text-center py-12 text-gray-500">
              <HistoricoTab clienteId={cliente.id} />
            </div>
          )}
          
          {activeTab === 'timeline' && (
            <div className="text-center py-12 text-gray-500">
              <TimelineTab clienteId={cliente.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}