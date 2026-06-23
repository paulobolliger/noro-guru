'use client';

import { useState } from 'react';
import { Plug, Users, SlidersHorizontal, Building, CreditCard, Check, LifeBuoy, Send, MessageCircle } from 'lucide-react';
import UploadPostConfigCard from './social/UploadPostConfigCard';
import TestPublishCard from './social/TestPublishCard';
import InviteUserModal from './InviteUserModal';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';
import PreferenciasTab from './PreferenciasTab';
import EmpresaTab from './EmpresaTab';
import type { ConfiguracaoSistema, ConfiguracaoUsuario } from '@/app/(protected)/configuracoes/config-actions';
import type { EmpresaDados } from '@/app/(protected)/configuracoes/empresa-actions';
import { ativarBillingAsaasAction } from '@/app/(protected)/configuracoes/billing-actions';
import { Landmark, AlertCircle, Loader2, ShieldCheck, Key } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type User = { id: string; nome: string | null; email: string; role: string; avatar_url?: string | null; };
type Tab = 'utilizadores' | 'preferencias' | 'empresa' | 'integracoes' | 'assinatura' | 'suporte';

interface ConfiguracoesClientProps {
  serverUsers: User[];
  configSistema: ConfiguracaoSistema;
  configUsuario: ConfiguracaoUsuario;
  empresaDados: EmpresaDados;
  currentUserId: string;
  uploadPostStatus: 'connected' | 'disconnected';
  billingAccount: {
    providerAccountId: string | null;
    providerWalletId: string | null;
    onboardingStatus: string;
    status: string;
    metadata: any;
  } | null;
}

export default function ConfiguracoesClient({
  serverUsers,
  configSistema,
  configUsuario,
  empresaDados,
  currentUserId,
  uploadPostStatus,
  billingAccount
}: ConfiguracoesClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('empresa');

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [localBillingAccount, setLocalBillingAccount] = useState(billingAccount);

  const [billingForm, setBillingForm] = useState({
    name: empresaDados.nome_empresa || '',
    email: empresaDados.email_principal || '',
    cpfCnpj: '',
    mobilePhone: empresaDados.telefone_comercial || '',
    incomeValue: 5000,
    address: '',
    addressNumber: '',
    province: '',
    postalCode: '',
    complement: '',
    companyType: 'MEI' as 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION',
  });

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBillingLoading(true);
    setBillingError(null);

    try {
      const result = await ativarBillingAsaasAction(billingForm);
      if (result.success) {
        alert('Integração financeira ativada com sucesso!');
        setLocalBillingAccount({
          providerAccountId: 'approved',
          providerWalletId: result.walletId || null,
          onboardingStatus: 'approved',
          status: 'active',
          metadata: { createdAt: new Date().toISOString() },
        });
      } else {
        setBillingError(result.message || 'Erro ao ativar onboarding.');
      }
    } catch (err: any) {
      setBillingError(err.message || 'Erro inesperado ao conectar ao Asaas.');
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <>
      <InviteUserModal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} />
      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} />
      <DeleteUserModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} user={selectedUser} />

      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
            <p className="text-gray-600 mt-1">Gira a empresa, plano, utilizadores e preferências do sistema.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { id: 'empresa', label: 'Dados da Empresa', icon: Building, color: 'blue' },
            { id: 'utilizadores', label: 'Utilizadores', icon: Users, color: 'emerald' },
            { id: 'assinatura', label: 'Assinatura', icon: CreditCard, color: 'violet' },
            { id: 'preferencias', label: 'Preferências', icon: SlidersHorizontal, color: 'amber' },
            { id: 'integracoes', label: 'Integrações', icon: Plug, color: 'rose' },
            { id: 'suporte', label: 'Suporte', icon: LifeBuoy, color: 'cyan' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;

            const colorClasses = {
              blue: 'bg-blue-50 border-blue-500 text-blue-700',
              emerald: 'bg-emerald-50 border-emerald-500 text-emerald-700',
              violet: 'bg-violet-50 border-violet-500 text-violet-700',
              amber: 'bg-amber-50 border-amber-500 text-amber-700',
              rose: 'bg-rose-50 border-rose-500 text-rose-700',
              cyan: 'bg-cyan-50 border-cyan-500 text-cyan-700',
            };

            const hoverClasses = {
              blue: 'hover:border-blue-200 hover:bg-blue-50/50',
              emerald: 'hover:border-emerald-200 hover:bg-emerald-50/50',
              violet: 'hover:border-violet-200 hover:bg-violet-50/50',
              amber: 'hover:border-amber-200 hover:bg-amber-50/50',
              rose: 'hover:border-rose-200 hover:bg-rose-50/50',
              cyan: 'hover:border-cyan-200 hover:bg-cyan-50/50',
            };

            const iconColorClasses = {
              blue: 'text-blue-600',
              emerald: 'text-emerald-600',
              violet: 'text-violet-600',
              amber: 'text-amber-600',
              rose: 'text-rose-600',
              cyan: 'text-cyan-600',
            };

            const activeClass = isActive
              ? `${colorClasses[tab.color as keyof typeof colorClasses]} shadow-md transform scale-[1.02]`
              : `bg-white border-gray-200 text-gray-500 ${hoverClasses[tab.color as keyof typeof hoverClasses]}`;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 w-full h-full ${activeClass}`}
              >
                <div className={`mb-3 p-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-white shadow-sm' : 'bg-gray-50 group-hover:bg-white group-hover:shadow-sm'}`}>
                  {/* Ícone sempre colorido para dar vida à interface */}
                  <tab.icon size={28} className={iconColorClasses[tab.color as keyof typeof iconColorClasses]} />
                </div>
                {/* Texto com quebra de linha permitida para evitar overflow */}
                <span className="font-bold text-sm text-center leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div>
          {activeTab === 'empresa' && (
            <EmpresaTab empresaDados={empresaDados} />
          )}

          {activeTab === 'utilizadores' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Utilizadores do Sistema</h2>
                  <p className="text-gray-500 mt-1">Gerencie quem tem acesso ao painel administrativo.</p>
                </div>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <Users size={18} />
                  Adicionar Utilizador
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 border-b border-gray-100">Nome</th>
                      <th className="px-6 py-4 border-b border-gray-100">Email</th>
                      <th className="px-6 py-4 border-b border-gray-100">Função</th>
                      <th className="px-6 py-4 border-b border-gray-100 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                    {serverUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                          Nenhum utilizador encontrado.
                        </td>
                      </tr>
                    ) : (
                      serverUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium flex items-center gap-3 text-gray-900">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                              {user.nome ? user.nome.substring(0, 2) : user.email.substring(0, 2)}
                            </div>
                            {user.nome || 'Sem nome'}
                          </td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => { setSelectedUser(user); setIsEditModalOpen(true); }}
                                className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                              >
                                Remover
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assinatura' && (
            <div className="space-y-6">
              {localBillingAccount?.status === 'active' ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Integração Financeira Ativa</h3>
                      <p className="text-sm text-gray-500">A subconta do Asaas está ativa para sua agência.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm">
                    <div>
                      <span className="text-gray-500 font-medium block">ID da Subconta</span>
                      <span className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block mt-1">
                        {localBillingAccount.providerAccountId}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block">ID da Carteira (Wallet ID)</span>
                      <span className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block mt-1">
                        {localBillingAccount.providerWalletId}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block">Status do Onboarding</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1 uppercase">
                        {localBillingAccount.onboardingStatus}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium block">Data de Ativação</span>
                      <span className="text-gray-600 block mt-1">
                        {localBillingAccount.metadata?.createdAt ? new Date(localBillingAccount.metadata.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBillingSubmit} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Landmark className="text-blue-600" size={22} />
                        Ativar Subconta Asaas (Integração Financeira)
                      </h3>
                      <p className="text-sm text-gray-500">Preencha os dados regulatórios da agência para criar a carteira de recebimentos.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={billingLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      {billingLoading ? (
                        <>
                          <Loader2 className="animate-spin h-4 w-4" />
                          Ativando...
                        </>
                      ) : (
                        'Ativar Integração'
                      )}
                    </button>
                  </div>

                  {billingError && (
                    <div className="p-4 mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                      <AlertCircle size={20} className="shrink-0" />
                      <span>{billingError}</span>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Razão Social / Nome da Agência</label>
                        <input
                          type="text"
                          id="name"
                          value={billingForm.name}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail Financeiro</label>
                        <input
                          type="email"
                          id="email"
                          value={billingForm.email}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="cpfCnpj" className="text-sm font-semibold text-gray-700">CPF ou CNPJ (apenas números)</label>
                        <input
                          type="text"
                          id="cpfCnpj"
                          value={billingForm.cpfCnpj}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                          placeholder="ex: 12345678909"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="mobilePhone" className="text-sm font-semibold text-gray-700">Celular / Telefone com DDD</label>
                        <input
                          type="text"
                          id="mobilePhone"
                          value={billingForm.mobilePhone}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, mobilePhone: e.target.value }))}
                          placeholder="ex: 11999998888"
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="companyType" className="text-sm font-semibold text-gray-700">Tipo de Empresa</label>
                        <select
                          id="companyType"
                          value={billingForm.companyType}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, companyType: e.target.value as any }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                          <option value="MEI">MEI (Microempreendedor Individual)</option>
                          <option value="LIMITED">LTDA (Sociedade Limitada)</option>
                          <option value="INDIVIDUAL">EI (Empresa Individual)</option>
                          <option value="ASSOCIATION">Associação / Terceiro Setor</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="incomeValue" className="text-sm font-semibold text-gray-700">Faturamento Mensal Estimado (R$)</label>
                        <input
                          type="number"
                          id="incomeValue"
                          value={billingForm.incomeValue}
                          onChange={(e) => setBillingForm(prev => ({ ...prev, incomeValue: parseFloat(e.target.value) || 0 }))}
                          required
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                      <h4 className="text-sm font-bold text-gray-950 mb-3">Endereço Comercial</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label htmlFor="address" className="text-sm font-semibold text-gray-700">Logradouro / Rua</label>
                          <input
                            type="text"
                            id="address"
                            value={billingForm.address}
                            onChange={(e) => setBillingForm(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="Rua, Avenida, etc."
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="addressNumber" className="text-sm font-semibold text-gray-700">Número</label>
                          <input
                            type="text"
                            id="addressNumber"
                            value={billingForm.addressNumber}
                            onChange={(e) => setBillingForm(prev => ({ ...prev, addressNumber: e.target.value }))}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="province" className="text-sm font-semibold text-gray-700">Bairro</label>
                          <input
                            type="text"
                            id="province"
                            value={billingForm.province}
                            onChange={(e) => setBillingForm(prev => ({ ...prev, province: e.target.value }))}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="postalCode" className="text-sm font-semibold text-gray-700">CEP (apenas números)</label>
                          <input
                            type="text"
                            id="postalCode"
                            value={billingForm.postalCode}
                            onChange={(e) => setBillingForm(prev => ({ ...prev, postalCode: e.target.value }))}
                            placeholder="ex: 01001000"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label htmlFor="complement" className="text-sm font-semibold text-gray-700">Complemento (opcional)</label>
                          <input
                            type="text"
                            id="complement"
                            value={billingForm.complement}
                            onChange={(e) => setBillingForm(prev => ({ ...prev, complement: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
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
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Redes Sociais</h2>
                <UploadPostConfigCard
                  initialStatus={uploadPostStatus}
                  onConfigUpdate={() => {
                    window.location.reload();
                  }}
                />
              </div>

              {uploadPostStatus === 'connected' && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Teste de Publicação</h2>
                  <TestPublishCard />
                </div>
              )}

              {/* Card de Gerenciamento de Chaves de API */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <Key size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Chaves de API (Integrações Externas)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Gerencie credenciais para integrar outros sistemas e consultar dados de vistos.
                    </p>
                  </div>
                </div>
                <Link href="/configuracoes/api-keys">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    Gerenciar Chaves
                  </Button>
                </Link>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Plug className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-700">
                        Mais Integrações
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Disponíveis em breve
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Email marketing, CRM, Analytics e outras integrações serão adicionadas
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suporte' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Abrir um Chamado</h2>
                  <p className="text-gray-500 mb-6">Descreva seu problema ou solicitação. Nossa equipe responderá em breve através do Control Plane.</p>

                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assunto</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Ex: Problema no login" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                          <option>Suporte Técnico</option>
                          <option>Financeiro</option>
                          <option>Sugestão de Melhoria</option>
                          <option>Outro</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="priority" className="text-blue-600 focus:ring-blue-500" />
                          <span className="text-sm text-gray-600">Baixa</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="priority" className="text-yellow-600 focus:ring-yellow-500" />
                          <span className="text-sm text-gray-600">Média</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="priority" className="text-red-600 focus:ring-red-500" />
                          <span className="text-sm text-gray-600">Alta</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                      <textarea rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Descreva os detalhes..."></textarea>
                    </div>

                    <div className="pt-2">
                      <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <Send size={18} />
                        Enviar Solicitação
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <MessageCircle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Contato Direto</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Precisa de uma resposta urgente? Entre em contato com nossa equipe de suporte dedicada.
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">Email:</span> suporte@noro.com
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold">Telefone:</span> +351 912 345 678
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Status dos Chamados</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-blue-600">TECH-1023</span>
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Resolvido</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800">Erro na integração do WhatsApp</p>
                      <p className="text-xs text-gray-500 mt-1">Há 2 dias</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-blue-600">FIN-0092</span>
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">Em Análise</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800">Dúvida sobre fatura pro-rat...</p>
                      <p className="text-xs text-gray-500 mt-1">Há 5 horas</p>
                    </div>
                  </div>
                  <button className="w-full mt-4 text-center text-sm text-blue-600 font-medium hover:underline">
                    Ver todos os chamados
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}