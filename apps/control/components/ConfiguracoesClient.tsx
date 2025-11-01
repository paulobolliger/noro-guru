// components/admin/ConfiguracoesClient.tsx
'use client';

import { useState } from 'react';
import { Plug, Users, SlidersHorizontal, CreditCard } from 'lucide-react';
import InviteUserModal from './InviteUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import PreferenciasTab from './PreferenciasTab';
import UtilizadoresTab from './UtilizadoresTab';
import IntegracoesTab from './IntegracoesTab';
import PageContainer from './layout/PageContainer';
import SectionHeader from './layout/SectionHeader';
import type { ConfiguracaoSistema, ConfiguracaoUsuario } from "@/app/(protected)/configuracoes/config-actions";
import type { NoroUser } from "@/../../packages/types/noro-users";

type Tab = 'utilizadores' | 'preferencias' | 'integracoes' | 'planos';

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
  const [activeTab, setActiveTab] = useState<Tab>('utilizadores'); // Define 'utilizadores' como aba inicial
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<NoroUser | null>(null);

  // ... (funções handleOpenEditModal, handleOpenDeleteModal, handleSaveSecret permanecem as mesmas)

  return (
    <>
      <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} user={selectedUser} />

      <PageContainer>
        <SectionHeader
          title="Configurações"
          subtitle="Gira as integrações, utilizadores e preferências do sistema."
        />

        <div className="flex border-b-2 border-[#4aede5]/20 mb-8">
          <button onClick={() => window.location.href = '/configuracoes/planos'} className="flex items-center gap-2 px-4 py-3 font-semibold transition-colors text-secondary hover:text-primary hover:border-b-2 hover:border-[#4aede5] -mb-[2px]">
            <CreditCard size={18} /> Planos
          </button>
          <button 
            onClick={() => setActiveTab('utilizadores')} 
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors -mb-[2px] ${
              activeTab === 'utilizadores' 
                ? 'border-b-2 border-[#D4AF37] text-primary' 
                : 'text-secondary hover:text-primary hover:border-b-2 hover:border-[#4aede5]'
            }`}
          >
            <Users size={18} /> Utilizadores
          </button>
          <button 
            onClick={() => setActiveTab('preferencias')} 
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors -mb-[2px] ${
              activeTab === 'preferencias' 
                ? 'border-b-2 border-[#D4AF37] text-primary' 
                : 'text-secondary hover:text-primary hover:border-b-2 hover:border-[#4aede5]'
            }`}
          >
            <SlidersHorizontal size={18} /> Preferências
          </button>
          <button 
            onClick={() => setActiveTab('integracoes')} 
            className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors -mb-[2px] ${
              activeTab === 'integracoes' 
                ? 'border-b-2 border-[#D4AF37] text-primary' 
                : 'text-secondary hover:text-primary hover:border-b-2 hover:border-[#4aede5]'
            }`}
          >
            <Plug size={18} /> Integrações
          </button>
        </div>

        <div>
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
      </PageContainer>
    </>
  );
}

