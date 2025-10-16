// components/admin/PreferenciasTab.tsx
'use client';

import { useState, useTransition } from 'react';
import { Globe, Clock, Calendar, DollarSign, Moon, Sun, Laptop, Grid, List, Bell, BellOff, Mail, Smartphone, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { saveConfiguracaoSistema, saveConfiguracaoUsuario, type ConfiguracaoSistema, type ConfiguracaoUsuario } from '@/app/admin/(protected)/configuracoes/config-actions';

interface PreferenciasTabProps {
  configSistema: ConfiguracaoSistema;
  configUsuario: ConfiguracaoUsuario;
  userId: string;
}

export default function PreferenciasTab({ configSistema, configUsuario, userId }: PreferenciasTabProps) {
  // Estados para configurações de sistema
  const [sistema, setSistema] = useState<ConfiguracaoSistema>(configSistema);
  
  // Estados para configurações de usuário
  const [usuario, setUsuario] = useState<ConfiguracaoUsuario>(configUsuario);

  // Estados de loading e feedback
  const [isSavingSistema, startSavingSistema] = useTransition();
  const [isSavingUsuario, startSavingUsuario] = useTransition();
  const [statusSistema, setStatusSistema] = useState<{success: boolean, message: string} | null>(null);
  const [statusUsuario, setStatusUsuario] = useState<{success: boolean, message: string} | null>(null);

  // Handler para salvar configurações de sistema
  const handleSaveSistema = () => {
    setStatusSistema(null);
    startSavingSistema(async () => {
      const result = await saveConfiguracaoSistema(sistema);
      setStatusSistema(result);
      setTimeout(() => setStatusSistema(null), 3000);
    });
  };

  // Handler para salvar configurações de usuário
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

      {/* Preferências do Usuário */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Minhas Preferências</h2>
        <p className="text-gray-600 mb-6">Personalize sua experiência de uso</p>

        <div className="space-y-6">
          {/* Tema */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Moon size={18} />
              Tema da Interface
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setUsuario({ ...usuario, tema: 'light' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  usuario.tema === 'light'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Sun size={24} className={usuario.tema === 'light' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="text-sm font-medium">Claro</span>
              </button>
              <button
                onClick={() => setUsuario({ ...usuario, tema: 'dark' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  usuario.tema === 'dark'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Moon size={24} className={usuario.tema === 'dark' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="text-sm font-medium">Escuro</span>
              </button>
              <button
                onClick={() => setUsuario({ ...usuario, tema: 'auto' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  usuario.tema === 'auto'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Laptop size={24} className={usuario.tema === 'auto' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="text-sm font-medium">Automático</span>
              </button>
            </div>
          </div>

          {/* Densidade da Tabela */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Grid size={18} />
              Densidade das Tabelas
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setUsuario({ ...usuario, densidade_tabela: 'compacta' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  usuario.densidade_tabela === 'compacta'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <List size={18} className={usuario.densidade_tabela === 'compacta' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="text-sm font-medium">Compacta</span>
              </button>
              <button
                onClick={() => setUsuario({ ...usuario, densidade_tabela: 'confortavel' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  usuario.densidade_tabela === 'confortavel'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <List size={20} className={usuario.densidade_tabela === 'confortavel' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="text-sm font-medium">Confortável</span>
              </button>
              <button
                onClick={() => setUsuario({ ...usuario, densidade_tabela: 'espaçosa' })}
                className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
                  usuario.densidade_tabela === 'espaçosa'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <List size={24} className={usuario.densidade_tabela === 'espaçosa' ? 'text-blue-600' : 'text-gray-400'} />
                <span className="text-sm font-medium">Espaçosa</span>
              </button>
            </div>
          </div>

          {/* Notificações */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Bell size={18} />
              Notificações
            </label>
            <div className="space-y-3">
              {/* Toggle Geral */}
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  {usuario.notificacoes_ativadas ? <Bell size={20} className="text-blue-600" /> : <BellOff size={20} className="text-gray-400" />}
                  <div>
                    <p className="font-medium text-gray-900">Notificações Ativadas</p>
                    <p className="text-sm text-gray-500">Receber notificações no sistema</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={usuario.notificacoes_ativadas}
                  onChange={(e) => setUsuario({ ...usuario, notificacoes_ativadas: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              {/* Email */}
              <label className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${!usuario.notificacoes_ativadas && 'opacity-50 cursor-not-allowed'}`}>
                <div className="flex items-center gap-3">
                  <Mail size={20} className={usuario.notificacoes_email ? 'text-blue-600' : 'text-gray-400'} />
                  <div>
                    <p className="font-medium text-gray-900">Notificações por E-mail</p>
                    <p className="text-sm text-gray-500">Receber atualizações importantes</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={usuario.notificacoes_email}
                  onChange={(e) => setUsuario({ ...usuario, notificacoes_email: e.target.checked })}
                  disabled={!usuario.notificacoes_ativadas}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                />
              </label>

              {/* Push */}
              <label className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${!usuario.notificacoes_ativadas && 'opacity-50 cursor-not-allowed'}`}>
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className={usuario.notificacoes_push ? 'text-blue-600' : 'text-gray-400'} />
                  <div>
                    <p className="font-medium text-gray-900">Notificações Push</p>
                    <p className="text-sm text-gray-500">Receber alertas no navegador</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={usuario.notificacoes_push}
                  onChange={(e) => setUsuario({ ...usuario, notificacoes_push: e.target.checked })}
                  disabled={!usuario.notificacoes_ativadas}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                />
              </label>
            </div>
          </div>
        </div>

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