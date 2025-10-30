'use client';

import { useState } from 'react';
import { 
  Settings, Users, Bell, Shield,
  Database, Activity, Webhook, 
  BarChart3
} from 'lucide-react';

import type { ConfiguracaoSistema, ConfiguracaoUsuario } from "@/app/(protected)/configuracoes/config-actions";
import type { ConfiguracaoGlobal } from '@/../../packages/types/control-plane';
import { salvarConfiguracaoGlobal } from '@/app/(protected)/configuracoes/config-global-actions';

// Componentes existentes
import InviteUserModal from './InviteUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import PreferenciasTab from './PreferenciasTab';
import ConfiguracoesGlobais from './ConfiguracoesGlobais';

type User = { 
  id: string; 
  nome: string | null; 
  email: string; 
  role: string; 
  avatar_url?: string | null; 
};

// Expandir tipos de tab
type Tab = 'global' | 'utilizadores' | 'preferencias' | 'integracoes' | 'monitoramento' | 'seguranca' | 'backup' | 'notificacoes';

interface ConfiguracoesClientProps {
  serverUsers: User[];
  configSistema: ConfiguracaoSistema;
  configUsuario: ConfiguracaoUsuario;
  configGlobal: ConfiguracaoGlobal;
  currentUserId: string;
}

export default function ConfiguracoesClient({ 
  serverUsers, 
  configSistema, 
  configUsuario,
  configGlobal,
  currentUserId 
}: ConfiguracoesClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('global');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const tabs = [
    { key: 'global', label: 'Configurações Globais', icon: Settings },
    { key: 'utilizadores', label: 'Utilizadores', icon: Users },
    { key: 'preferencias', label: 'Preferências', icon: Bell },
    { key: 'integracoes', label: 'Integrações', icon: Webhook },
    { key: 'monitoramento', label: 'Monitoramento', icon: Activity },
    { key: 'seguranca', label: 'Segurança', icon: Shield },
    { key: 'backup', label: 'Backup & Manutenção', icon: Database },
    { key: 'notificacoes', label: 'Notificações', icon: BarChart3 },
  ];

  return (
    <>
      <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} user={selectedUser} />

      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Configurações</h1>
            <p className="text-muted mt-1">Gerencie as configurações globais do control plane.</p>
          </div>
        </div>

        <div className="flex border-b border-default mb-8">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${
                activeTab === key 
                  ? 'border-b-2 border-[rgba(29,211,192,0.45)] text-primary' 
                  : 'text-muted hover:text-primary'
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <div>
          {activeTab === 'global' && (
            <ConfiguracoesGlobais
              config={configGlobal}
              onSave={salvarConfiguracaoGlobal}
            />
          )}

          {activeTab === 'utilizadores' && (
            <div className="surface-card p-6 rounded-xl border border-default">
              {/* Conteúdo atual da aba utilizadores */}
            </div>
          )}

          {activeTab === 'preferencias' && (
            <PreferenciasTab 
              configSistema={configSistema}
              configUsuario={configUsuario}
              userId={currentUserId}
            />
          )}

          {activeTab === 'integracoes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lista de integrações disponíveis */}
            </div>
          )}

          {activeTab === 'monitoramento' && (
            <div className="surface-card p-6 rounded-xl border border-default">
              {/* Implementar monitoramento aqui */}
            </div>
          )}

          {activeTab === 'seguranca' && (
            <div className="surface-card p-6 rounded-xl border border-default">
              {/* Implementar configurações de segurança aqui */}
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="surface-card p-6 rounded-xl border border-default">
              {/* Implementar backup & manutenção aqui */}
            </div>
          )}

          {activeTab === 'notificacoes' && (
            <div className="surface-card p-6 rounded-xl border border-default">
              {/* Implementar configurações de notificações aqui */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}