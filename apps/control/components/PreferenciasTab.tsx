// components/admin/PreferenciasTab.tsx
'use client';

import { useEffect, useState, useTransition } from 'react';
import { Globe, Clock, Calendar, DollarSign, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { saveConfiguracaoSistema, saveConfiguracaoUsuario, type ConfiguracaoSistema, type ConfiguracaoUsuario } from "@/app/(protected)/configuracoes/config-actions";
import { Button as NButton } from '@/../../packages/ui/button';
import { Alert as NAlert } from '@/../../packages/ui/alert';
import { Select as NSelect } from '@/../../packages/ui/select';

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
  const [statusSistema, setStatusSistema] = useState<{ success: boolean; message: string } | null>(null);
  const [statusUsuario, setStatusUsuario] = useState<{ success: boolean; message: string } | null>(null);
  const [theme, setTheme] = useState<'system'|'dark'|'light'>(() => {
    if (typeof window === 'undefined') return 'system';
    return (localStorage.getItem('noro.theme') as any) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      root.dataset.theme = theme;
    }
    localStorage.setItem('noro.theme', theme);
  }, [theme]);

  const handleSaveSistema = () => {
    setStatusSistema(null);
    startSavingSistema(async () => {
      const result = await saveConfiguracaoSistema(sistema);
      setStatusSistema(result);
      setTimeout(() => setStatusSistema(null), 3000);
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
    <div className='space-y-8'>
      {/* Sistema (sem aparencia) */}
      <div className='surface-card rounded-xl p-6 border border-default'>
        <h2 className='text-2xl font-bold text-primary mb-2'>Configuracoes do Sistema</h2>
        <p className="text-muted mb-6">Defina as configuracoes globais (sem aparencia).</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Moeda Padrao */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
              <DollarSign size={18} />
              Moeda Padrao
            </label>
            <NSelect
              value={sistema.moeda_padrao}
              onChange={(e) => setSistema({ ...sistema, moeda_padrao: e.target.value as any })}
              className="w-full"
            >
              <option value="EUR">EUR (€) - Euro</option>
              <option value="USD">USD ($) - Dolar Americano</option>
              <option value="BRL">BRL (R$) - Real Brasileiro</option>
            </NSelect>
          </div>

          {/* Fuso Horario */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
              <Clock size={18} />
              Fuso Horario
            </label>
            <NSelect
              value={sistema.fuso_horario}
              onChange={(e) => setSistema({ ...sistema, fuso_horario: e.target.value })}
              className="w-full"
            >
              <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
              <option value="America/Sao_Paulo">Sao Paulo (GMT-3)</option>
              <option value="America/New_York">Nova York (GMT-5)</option>
              <option value="Europe/London">Londres (GMT+0)</option>
              <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
            </NSelect>
          </div>

          {/* Idioma */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
              <Globe size={18} />
              Idioma da Interface
            </label>
            <NSelect
              value={sistema.idioma}
              onChange={(e) => setSistema({ ...sistema, idioma: e.target.value as any })}
              className="w-full"
            >
              <option value="pt">Portugues</option>
              <option value="en">English</option>
              <option value="es">Espanol</option>
            </NSelect>
          </div>

          {/* Formato de Data */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
              <Calendar size={18} />
              Formato de Data
            </label>
            <NSelect
              value={sistema.formato_data}
              onChange={(e) => setSistema({ ...sistema, formato_data: e.target.value as any })}
              className="w-full"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY (16/10/2025)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (10/16/2025)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-10-16)</option>
            </NSelect>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-default">
          {statusSistema && (
            <NAlert className="mr-auto" variant={statusSistema.success ? 'success' : 'error'} icon={statusSistema.success ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}>
              {statusSistema.message}
            </NAlert>
          )}
          <NButton onClick={handleSaveSistema} disabled={isSavingSistema} variant="primary" leftIcon={isSavingSistema ? <Loader2 className="animate-spin" size={18} /> : undefined}>
            {isSavingSistema ? 'Salvando...' : 'Salvar configuracoes do sistema'}
          </NButton>
        </div>
      </div>

      {/* Preferencias do Usuario */}
      <div className="surface-card rounded-xl border border-default p-6">
        <h2 className="text-2xl font-semibold text-primary mb-2">Minhas preferências</h2>
        <p className="text-muted mb-6">Personalize sua experiência de uso.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">Tema</label>
            <div className="flex items-center gap-2">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-60 rounded-lg border border-default bg-[var(--color-surface-alt)] p-2.5 text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(29,211,192,0.35)]"
              >
                <option value="system">System</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
              <div className="text-xs text-muted">Topbar/Sidebar permanecem em tema escuro.</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-6 border-t border-default">
          {statusUsuario && (
            <NAlert className="mr-auto" variant={statusUsuario.success ? 'success' : 'error'} icon={statusUsuario.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}>
              {statusUsuario.message}
            </NAlert>
          )}
          <NButton onClick={handleSaveUsuario} disabled={isSavingUsuario} variant="primary" leftIcon={isSavingUsuario ? <Loader2 className="animate-spin" size={18} /> : undefined}>
            {isSavingUsuario ? 'Salvando...' : 'Salvar minhas preferências'}
          </NButton>
        </div>
      </div>
    </div>
  );
}

