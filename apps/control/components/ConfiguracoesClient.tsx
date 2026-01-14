// components/admin/ConfiguracoesClient.tsx
'use client';

import { useState } from 'react';
import { Plug, Users, SlidersHorizontal, CreditCard, Settings } from 'lucide-react';
import InviteUserModal from './InviteUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import PreferenciasTab from './PreferenciasTab';
import UtilizadoresTab from './UtilizadoresTab';
import IntegracoesTab from './IntegracoesTab';
import type { ConfiguracaoSistema, ConfiguracaoUsuario } from "@/app/(protected)/configuracoes/config-actions";
import type { NoroUser } from "@/../../packages/types/noro-users";
import Link from 'next/link';

type Tab = 'utilizadores' | 'preferencias' | 'integracoes';

interface EnvVariable {
  key: string;
  value: string;
  category: 'database' | 'auth' | 'email' | 'api' | 'other';
  description?: string;
  isSecret?: boolean;
}

interface ConfiguracoesClientProps {
  serverUsers: NoroUser[];
  configSistema: ConfiguracaoSistema;
  configUsuario: ConfiguracaoUsuario;
  currentUserId: string;
  envVariables: EnvVariable[];
}

export default function ConfiguracoesClient({ serverUsers, configSistema, configUsuario, currentUserId, envVariables }: ConfiguracoesClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('utilizadores');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NoroUser | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} user={selectedUser} />

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-heading flex items-center gap-2">
          <Settings className="text-primary" size={24} />
          Configurações
        </h2>
        <p className="text-sm text-secondary mt-1">Gerencie utilizadores, integrações e preferências do sistema.</p>
      </div>

      {/* Modern Tabs */}
      <div>
        <div className="flex border-b border-default overflow-x-auto">
          <button
            onClick={() => setActiveTab('utilizadores')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'utilizadores'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-heading hover:border-default'
              }`}
          >
            <Users size={18} />
            Utilizadores
          </button>
          <button
            onClick={() => setActiveTab('preferencias')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'preferencias'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-heading hover:border-default'
              }`}
          >
            <SlidersHorizontal size={18} />
            Preferências
          </button>
          <button
            onClick={() => setActiveTab('integracoes')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === 'integracoes'
                ? 'border-primary text-primary'
                : 'border-transparent text-secondary hover:text-heading hover:border-default'
              }`}
          >
            <Plug size={18} />
            Integrações
          </button>
          <Link
            href="/configuracoes/planos"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 border-transparent text-secondary hover:text-heading hover:border-default whitespace-nowrap ml-auto"
          >
            <CreditCard size={18} />
            Planos
          </Link>
        </div>

        <div className="py-6">
          {activeTab === 'utilizadores' && (
            <UtilizadoresTab
              users={serverUsers}
              currentUserId={currentUserId}
              refetchUsers={async () => {
                window.location.reload();
              }}
            />
          )}

          {activeTab === 'preferencias' && (
            <PreferenciasTab
              configSistema={configSistema}
              configUsuario={configUsuario}
              userId={currentUserId}
            />
          )}

          {activeTab === 'integracoes' && (
            <IntegracoesTab envVariables={envVariables} />
          )}
        </div>
      </div>
    </div>
  );
}

