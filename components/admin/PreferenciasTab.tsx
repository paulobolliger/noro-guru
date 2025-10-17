// components/admin/PreferenciasTab.tsx
'use client';

import { useState, useTransition } from 'react';
import { Globe, Clock, Calendar, DollarSign, Moon, Sun, Laptop, Grid, List, Bell, BellOff, Mail, Smartphone, CheckCircle2, AlertTriangle, Loader2, Image as ImageIcon, Palette } from 'lucide-react';
import { saveConfiguracaoSistema, saveConfiguracaoUsuario, type ConfiguracaoSistema, type ConfiguracaoUsuario } from '@/app/admin/(protected)/configuracoes/config-actions';

interface PreferenciasTabProps {
  configSistema: ConfiguracaoSistema;
  configUsuario: ConfiguracaoUsuario;
  userId: string;
}

export default function PreferenciasTab({ configSistema, configUsuario, userId }: PreferenciasTabProps) {
  const [sistema, setSistema] = useState<ConfiguracaoSistema>(configSistema);
  const [usuario, setUsuario] = useState<ConfiguracaoUsuario>(configUsuario);

  const [isSavingSistema, startSavingSistema] = useTransition();
  const [isSavingUsuario, startSavingUsuario] = useTransition();
  const [statusSistema, setStatusSistema] = useState<{success: boolean, message: string} | null>(null);
  const [statusUsuario, setStatusUsuario] = useState<{success: boolean, message: string} | null>(null);

  const handleSaveSistema = () => {
    setStatusSistema(null);
    startSavingSistema(async () => {
      const result = await saveConfiguracaoSistema(sistema);
      setStatusSistema(result);
      if (result.success) {
        // Recarrega a página para ver as mudanças de tema/logo
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setTimeout(() => setStatusSistema(null), 3000);
      }
    });
  };

  const handleSaveUsuario = () => {
    setStatusUsuario(null);
    startSavingUsuario(async () => {
      const result = await saveConfiguracaoUsuario(userId, usuario);
      setStatusUsuario(result);
      setTimeout(() => setStatusUsuario(null), 3000);
    });
  };

  return (
    <div className="space-y-8">
      {/* Configurações do Sistema */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações do Sistema</h2>
        <p className="text-gray-600 mb-6">Defina as configurações globais da aplicação</p>

        {/* SEÇÃO DE APARÊNCIA ADICIONADA */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Aparência do Painel</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <ImageIcon size={18} />
                URL do Logo (Barra Superior)
              </label>
              <input
                type="text"
                placeholder="https://exemplo.com/logo-branco.png"
                value={sistema.logo_url_admin || ''}
                onChange={(e) => setSistema({ ...sistema, logo_url_admin: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Palette size={18} />
                Cor da Barra Superior
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={sistema.topbar_color || '#232452'}
                  onChange={(e) => setSistema({ ...sistema, topbar_color: e.target.value })}
                  className="h-12 w-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  value={sistema.topbar_color || '#232452'}
                  onChange={(e) => setSistema({ ...sistema, topbar_color: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Moeda Padrão */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign size={18} />
              Moeda Padrão
            </label>
            <select
              value={sistema.moeda_padrao}
              onChange={(e) => setSistema({ ...sistema, moeda_padrao: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EUR">EUR (€) - Euro</option>
              <option value="USD">USD ($) - Dólar Americano</option>
              <option value="BRL">BRL (R$) - Real Brasileiro</option>
            </select>
          </div>
          {/* Outros campos (Fuso, Idioma, Data) permanecem aqui... */}
          {/* Fuso Horário */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock size={18} />
              Fuso Horário
            </label>
            <select
              value={sistema.fuso_horario}
              onChange={(e) => setSistema({ ...sistema, fuso_horario: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/New_York">Nova York (GMT-5)</option>
              <option value="Europe/London">Londres (GMT+0)</option>
              <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
            </select>
          </div>

          {/* Idioma */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Globe size={18} />
              Idioma da Interface
            </label>
            <select
              value={sistema.idioma}
              onChange={(e) => setSistema({ ...sistema, idioma: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>

          {/* Formato de Data */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar size={18} />
              Formato de Data
            </label>
            <select
              value={sistema.formato_data}
              onChange={(e) => setSistema({ ...sistema, formato_data: e.target.value as any })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (16/10/2025)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (10/16/2025)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-10-16)</option>
            </select>
          </div>
        </div>

        {/* Feedback e Botão Salvar Sistema */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          {statusSistema && (
            <div className={`flex items-center gap-2 text-sm ${statusSistema.success ? 'text-green-600' : 'text-red-600'}`}>
              {statusSistema.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {statusSistema.message}
            </div>
          )}
          <button
            onClick={handleSaveSistema}
            disabled={isSavingSistema}
            className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSavingSistema && <Loader2 className="animate-spin" size={18} />}
            {isSavingSistema ? 'Salvando...' : 'Salvar Configurações do Sistema'}
          </button>
        </div>
      </div>

      {/* Preferências do Usuário (sem alterações) */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Minhas Preferências</h2>
        <p className="text-gray-600 mb-6">Personalize sua experiência de uso</p>
        {/* ... conteúdo das preferências do usuário permanece o mesmo ... */}
        {/* Feedback e Botão Salvar Usuário */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          {statusUsuario && (
            <div className={`flex items-center gap-2 text-sm ${statusUsuario.success ? 'text-green-600' : 'text-red-600'}`}>
              {statusUsuario.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              {statusUsuario.message}
            </div>
          )}
          <button
            onClick={handleSaveUsuario}
            disabled={isSavingUsuario}
            className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSavingUsuario && <Loader2 className="animate-spin" size={18} />}
            {isSavingUsuario ? 'Salvando...' : 'Salvar Minhas Preferências'}
          </button>
        </div>
      </div>
    </div>
  );
}