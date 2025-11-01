'use client';

import { useState } from 'react';
import { Bot, Save, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

type AutoResponse = {
  id: string;
  trigger: string;
  response: string;
  enabled: boolean;
};

const initialAutoResponses: AutoResponse[] = [
  {
    id: '1',
    trigger: 'horário de atendimento',
    response: 'Nosso horário de atendimento é de segunda a sexta, das 9h às 18h. Finais de semana e feriados não atendemos.',
    enabled: true,
  },
  {
    id: '2',
    trigger: 'preço|valor|quanto custa',
    response: 'Temos 3 planos disponíveis: Free (gratuito), Professional (R$ 197/mês) e Enterprise (sob consulta). Gostaria de conhecer os detalhes de algum plano específico?',
    enabled: true,
  },
  {
    id: '3',
    trigger: 'teste grátis|trial|período de teste',
    response: 'Sim! Oferecemos 14 dias de teste gratuito do plano Professional, com acesso completo a todos os recursos. Não pedimos cartão de crédito para começar.',
    enabled: true,
  },
  {
    id: '4',
    trigger: 'oi|olá|bom dia|boa tarde|boa noite',
    response: 'Olá! 👋 Bem-vindo ao suporte Noro.guru. Como posso ajudar você hoje?',
    enabled: true,
  },
];

export default function ChatbotConfigClient() {
  const [autoResponses, setAutoResponses] = useState<AutoResponse[]>(initialAutoResponses);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [botEnabled, setBotEnabled] = useState(true);
  const [transferToHuman, setTransferToHuman] = useState(true);

  const handleAddResponse = () => {
    const newResponse: AutoResponse = {
      id: Date.now().toString(),
      trigger: '',
      response: '',
      enabled: true,
    };
    setAutoResponses([...autoResponses, newResponse]);
  };

  const handleDeleteResponse = (id: string) => {
    setAutoResponses(autoResponses.filter(r => r.id !== id));
  };

  const handleUpdateResponse = (id: string, field: keyof AutoResponse, value: any) => {
    setAutoResponses(autoResponses.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // TODO: Implementar save real no Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Bot size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Configuração do Chatbot</h1>
            <p className="text-muted mt-1">Configure respostas automáticas e comportamento do bot</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar Configurações
            </>
          )}
        </button>
      </div>

      {/* Save Status */}
      {saveStatus === 'success' && (
        <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <CheckCircle className="text-green-500" size={24} />
          <p className="text-green-500 font-semibold">Configurações salvas com sucesso!</p>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <AlertCircle className="text-red-500" size={24} />
          <p className="text-red-500 font-semibold">Erro ao salvar. Tente novamente.</p>
        </div>
      )}

      {/* General Settings */}
      <div className="surface-card rounded-xl p-6 border border-default">
        <h2 className="text-xl font-bold text-primary mb-6">Configurações Gerais</h2>
        
        <div className="space-y-4">
          {/* Bot Enabled */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <h3 className="font-semibold text-primary mb-1">Ativar Chatbot</h3>
              <p className="text-muted text-sm">Responde automaticamente às mensagens dos clientes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={botEnabled}
                onChange={(e) => setBotEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Transfer to Human */}
          <div className="flex items-center justify-between p-4 bg-background rounded-lg">
            <div>
              <h3 className="font-semibold text-primary mb-1">Transferir para Humano</h3>
              <p className="text-muted text-sm">Permite que o bot transfira conversas para atendentes quando não souber responder</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={transferToHuman}
                onChange={(e) => setTransferToHuman(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Auto Responses */}
      <div className="surface-card rounded-xl p-6 border border-default">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-primary">Respostas Automáticas</h2>
            <p className="text-muted text-sm mt-1">
              Configure palavras-chave (triggers) e respostas automáticas. Use | para múltiplos triggers.
            </p>
          </div>
          <button
            onClick={handleAddResponse}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            Nova Resposta
          </button>
        </div>

        <div className="space-y-4">
          {autoResponses.map((response) => (
            <div
              key={response.id}
              className="p-4 bg-background rounded-lg border-2 border-default hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Enable Toggle */}
                <label className="relative inline-flex items-center cursor-pointer mt-8">
                  <input
                    type="checkbox"
                    checked={response.enabled}
                    onChange={(e) => handleUpdateResponse(response.id, 'enabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>

                {/* Fields */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Palavras-chave (Triggers)
                    </label>
                    <input
                      type="text"
                      value={response.trigger}
                      onChange={(e) => handleUpdateResponse(response.id, 'trigger', e.target.value)}
                      placeholder="Ex: preço|valor|quanto custa"
                      className="w-full px-4 py-2 bg-surface-card border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-muted text-xs mt-1">
                      Use | para separar múltiplas palavras-chave. Aceita regex.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-primary mb-2">
                      Resposta Automática
                    </label>
                    <textarea
                      value={response.response}
                      onChange={(e) => handleUpdateResponse(response.id, 'response', e.target.value)}
                      placeholder="Digite a resposta que o bot deve enviar..."
                      rows={3}
                      className="w-full px-4 py-2 bg-surface-card border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteResponse(response.id)}
                  className="text-red-500 hover:text-red-600 transition-colors p-2 mt-6"
                  title="Remover resposta"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-6">
        <div className="flex gap-4">
          <AlertCircle className="text-blue-500 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-blue-500 mb-2">Como funciona?</h3>
            <ul className="text-blue-400 text-sm space-y-1 list-disc list-inside">
              <li>O bot procura por palavras-chave (triggers) nas mensagens dos clientes</li>
              <li>Quando encontra uma correspondência, envia a resposta automática configurada</li>
              <li>Use regex para padrões mais complexos: <code className="bg-blue-500/20 px-1 rounded">preço|valor|quanto.*custa</code></li>
              <li>Se nenhum trigger corresponder e "Transferir para Humano" estiver ativo, a conversa é encaminhada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
