// components/admin/ConfiguracoesClient.tsx
'use client';

import { useState, useTransition, useRef } from 'react';
import { Plug, Users, SlidersHorizontal, Trash2, Edit, Mail, Lock, Server, Bot, Phone, MessageSquare, CreditCard, Palette, Send, Cog, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import InviteUserModal from './InviteUserModal';
import { saveSecretAction } from '../../app/admin/(protected)/configuracoes/actions';

type Tab = 'integracoes' | 'utilizadores' | 'preferencias';

const servicosApi = [
    { name: 'Supabase URL', key: 'NEXT_PUBLIC_SUPABASE_URL', icon: Server, category: 'Base' },
    { name: 'Supabase Anon Key', key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', icon: Lock, category: 'Base' },
    { name: 'Supabase Service Role', key: 'SUPABASE_SERVICE_ROLE_KEY', icon: Lock, category: 'Base' },
    { name: 'OpenAI API Key', key: 'OPENAI_API_KEY', icon: Bot, category: 'Inteligência Artificial' },
    { name: 'Resend API Key', key: 'RESEND_API_KEY', icon: Send, category: 'Comunicação' },
    { name: 'Amazon SES Access Key', key: 'AWS_ACCESS_KEY_ID', icon: Mail, category: 'Comunicação' },
    { name: 'Amazon SES Secret Key', key: 'AWS_SECRET_ACCESS_KEY', icon: Mail, category: 'Comunicação' },
    { name: 'Twilio Account SID', key: 'TWILIO_ACCOUNT_SID', icon: Phone, category: 'Comunicação' },
    { name: 'Twilio Auth Token', key: 'TWILIO_AUTH_TOKEN', icon: Phone, category: 'Comunicação' },
    { name: 'ManyChat API Key', key: 'MANYCHAT_API_KEY', icon: MessageSquare, category: 'Comunicação' },
    { name: 'Stripe Publishable Key', key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', icon: CreditCard, category: 'Pagamentos' },
    { name: 'Stripe Secret Key', key: 'STRIPE_SECRET_KEY', icon: CreditCard, category: 'Pagamentos' },
    { name: 'Cielo Merchant ID', key: 'CIELO_MERCHANT_ID', icon: CreditCard, category: 'Pagamentos' },
    { name: 'Cielo Merchant Key', key: 'CIELO_MERCHANT_KEY', icon: CreditCard, category: 'Pagamentos' },
    { name: 'Cloudinary Cloud Name', key: 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', icon: Palette, category: 'Mídia' },
    { name: 'Cloudinary API Key', key: 'CLOUDINARY_API_KEY', icon: Palette, category: 'Mídia' },
    { name: 'Cloudinary API Secret', key: 'CLOUDINARY_API_SECRET', icon: Palette, category: 'Mídia' },
    { name: 'Admin Session Secret', key: 'ADMIN_SESSION_SECRET', icon: Cog, category: 'Sistema' },
];

export default function ConfiguracoesClient({ serverUsers }: { serverUsers: any[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('integracoes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, startSavingTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<{[key: string]: {success: boolean, message: string} | null}>({});

  const handleSaveSecret = (secretName: string) => {
    const input = document.getElementById(`api-key-${secretName}`) as HTMLInputElement;
    const secretValue = input.value;
    
    // Limpa o estado anterior
    setSaveStatus(prev => ({...prev, [secretName]: null}));

    if (!secretValue) {
        setSaveStatus(prev => ({...prev, [secretName]: {success: false, message: "A chave não pode estar vazia."}}));
        return;
    }

    startSavingTransition(async () => {
        const result = await saveSecretAction(secretName, secretValue);
        setSaveStatus(prev => ({...prev, [secretName]: result}));
        // Limpa a mensagem após 3 segundos
        setTimeout(() => setSaveStatus(prev => ({...prev, [secretName]: null})), 3000);
    });
  };

  return (
    <>
      <InviteUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
            <p className="text-gray-600 mt-1">Gira as integrações, utilizadores e preferências do sistema.</p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-8">
          <button onClick={() => setActiveTab('integracoes')} className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'integracoes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <Plug size={18} /> Integrações (APIs)
          </button>
          <button onClick={() => setActiveTab('utilizadores')} className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'utilizadores' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <Users size={18} /> Utilizadores e Permissões
          </button>
          <button onClick={() => setActiveTab('preferencias')} className={`flex items-center gap-2 px-4 py-3 font-semibold transition-colors ${activeTab === 'preferencias' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <SlidersHorizontal size={18} /> Preferências
          </button>
        </div>

        <div>
          {activeTab === 'integracoes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicosApi.map((servico) => (
                <div key={servico.key} className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <servico.icon className="text-gray-500" size={24} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{servico.name}</h3>
                      <p className="text-xs text-gray-500">{servico.category}</p>
                    </div>
                  </div>
                  <input id={`api-key-${servico.key}`} type="password" placeholder="Insira a sua chave de API" className="w-full p-2 border border-gray-300 rounded-lg text-gray-900" />
                  <div className="flex items-center justify-between mt-4 h-6">
                    {saveStatus[servico.key] && (
                      <div className={`flex items-center gap-2 text-sm ${saveStatus[servico.key]?.success ? 'text-green-600' : 'text-red-600'}`}>
                        {saveStatus[servico.key]?.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                        {saveStatus[servico.key]?.message}
                      </div>
                    )}
                    <button 
                        onClick={() => handleSaveSecret(servico.key)}
                        disabled={isSaving}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 flex items-center gap-2 disabled:bg-gray-400 ml-auto"
                    >
                      {isSaving && saveStatus[servico.key] === null && <Loader2 className="animate-spin" size={16}/>}
                      Guardar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'utilizadores' && (
             <div className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Gerir Equipa</h2>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    + Convidar Utilizador
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função (Role)</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {serverUsers.map((user) => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=random`} alt="" />
                                </div>
                                <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.nome || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'super_admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user.role}
                            </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={18} /></button>
                            <button className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
          )}

          {activeTab === 'preferencias' && (
             <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Em Construção</h2>
                <p className="text-gray-500 mt-2">A área de preferências do sistema está a ser desenvolvida.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

