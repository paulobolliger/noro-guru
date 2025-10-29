// components/admin/ConfiguracoesClient.tsx
'use client';

import { useState } from 'react';
import { Plug, Users, SlidersHorizontal, Building } from 'lucide-react'; // NOVO: Ícone Building
import InviteUserModal from './InviteUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import PreferenciasTab from './PreferenciasTab';
import EmpresaTab from './EmpresaTab'; // NOVO: Importa o novo componente
import type { ConfiguracaoSistema, ConfiguracaoUsuario } from "@/app/(protected)/configuracoes/config-actions";
import type { EmpresaDados } from "@/app/(protected)/configuracoes/empresa-actions"; // NOVO: Importa o tipo

type User = { id: string; nome: string | null; email: string; role: string; avatar_url?: string | null; };
type Tab = 'utilizadores' | 'preferencias' | 'empresa' | 'integracoes'; // NOVO: Adiciona 'empresa'

interface ConfiguracoesClientProps {
  serverUsers: User[];
  configSistema: ConfiguracaoSistema;
  configUsuario: ConfiguracaoUsuario;
  empresaDados: EmpresaDados; // NOVO: Recebe os dados da empresa
  currentUserId: string;
}

export default function ConfiguracoesClient({ serverUsers, configSistema, configUsuario, empresaDados, currentUserId }: ConfiguracoesClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('empresa'); // NOVO: Define 'empresa' como aba inicial
  
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // ... (funções handleOpenEditModal, handleOpenDeleteModal, handleSaveSecret permanecem as mesmas)

  return (
    <>
      <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} user={selectedUser} />

      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Configurações</h1>
            <p className="text-muted mt-1">Gira as integrações, utilizadores e preferências do sistema.</p>
          </div>
        </div>

        <div className="flex border-b border-default border-default border-default mb-8">
          {/* NOVO: Botão para a aba Dados da Empresa */}
          <button onClick={() => setActiveTab('empresa')} className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'empresa' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-muted hover:text-primary'}`}>
            <Building size={18} /> Dados da Empresa
          </button>
          <button onClick={() => setActiveTab('utilizadores')} className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'utilizadores' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-muted hover:text-primary'}`}>
            <Users size={18} /> Utilizadores
          </button>
          <button onClick={() => setActiveTab('preferencias')} className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'preferencias' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-muted hover:text-primary'}`}>
            <SlidersHorizontal size={18} /> Preferências
          </button>
          <button onClick={() => setActiveTab('integracoes')} className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'integracoes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-muted hover:text-primary'}`}>
            <Plug size={18} /> Integrações
          </button>
        </div>

        <div>
          {/* NOVO: Renderização condicional para a nova aba */}
          {activeTab === 'empresa' && (
            <EmpresaTab empresaDados={empresaDados} />
          )}

          {activeTab === 'utilizadores' && (
             <div className="surface-card p-6 rounded-xl border border-default">
                {/* ... conteúdo da aba utilizadores ... */}
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
              {/* ... conteúdo da aba integrações ... */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
