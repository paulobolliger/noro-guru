'use client';

import { useState } from 'react';
import { ChevronDown, Database, Gauge, Power, Puzzle, Save, Server } from 'lucide-react';
import { Button as NButton } from '@/../../packages/ui/button';
import { Alert as NAlert } from '@/../../packages/ui/alert';
import type { ConfiguracaoGlobal } from '@/../../packages/types/control-plane';

interface ConfiguracoesGlobaisProps {
  config: ConfiguracaoGlobal;
  onSave: (section: keyof ConfiguracaoGlobal, data: any) => Promise<{success: boolean; message: string}>;
}

export default function ConfiguracoesGlobais({ config, onSave }: ConfiguracoesGlobaisProps) {
  const [activeSection, setActiveSection] = useState<keyof ConfiguracaoGlobal>('limites');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{success: boolean; message: string} | null>(null);
  const [editingConfig, setEditingConfig] = useState<ConfiguracaoGlobal>(config);

  const handleSave = async (section: keyof ConfiguracaoGlobal) => {
    setIsSaving(true);
    setStatus(null);
    try {
      await onSave(section, editingConfig[section]);
      setStatus({
        success: true,
        message: 'Configurações salvas com sucesso'
      });
    } catch (error) {
      setStatus({
        success: false,
        message: 'Erro ao salvar configurações'
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const sections = [
    {
      key: 'limites' as const,
      label: 'Limites',
      icon: Gauge,
      fields: [
        { key: 'max_usuarios_por_tenant', label: 'Máximo de Usuários por Tenant', type: 'number' },
        { key: 'max_leads_por_tenant', label: 'Máximo de Leads por Tenant', type: 'number' },
        { key: 'max_armazenamento_por_tenant', label: 'Máximo de Armazenamento (MB)', type: 'number' },
        { key: 'max_requisicoes_api_por_dia', label: 'Máximo de Requisições API/dia', type: 'number' }
      ]
    },
    {
      key: 'instancia' as const,
      label: 'Instância',
      icon: Server,
      fields: [
        { key: 'modo_manutencao', label: 'Modo Manutenção', type: 'boolean' },
        { key: 'versao_minima_cli', label: 'Versão Mínima CLI', type: 'text' },
        { key: 'versao_atual_api', label: 'Versão Atual API', type: 'text' },
        { key: 'dominios_permitidos', label: 'Domínios Permitidos', type: 'array' }
      ]
    },
    {
      key: 'cache' as const,
      label: 'Cache',
      icon: Database,
      fields: [
        { key: 'tempo_cache_api', label: 'Tempo de Cache API (segundos)', type: 'number' },
        { key: 'cache_habilitado', label: 'Cache Habilitado', type: 'boolean' }
      ]
    },
    {
      key: 'servicos' as const,
      label: 'Serviços',
      icon: Power,
      fields: [
        { key: 'api_publica_habilitada', label: 'API Pública Habilitada', type: 'boolean' },
        { key: 'registro_publico_habilitado', label: 'Registro Público Habilitado', type: 'boolean' },
        { key: 'convites_habilitados', label: 'Convites Habilitados', type: 'boolean' },
        { key: 'oauth_habilitado', label: 'OAuth Habilitado', type: 'boolean' }
      ]
    },
    {
      key: 'recursos' as const,
      label: 'Recursos',
      icon: Puzzle,
      fields: [
        { key: 'endpoints_desabilitados', label: 'Endpoints Desabilitados', type: 'array' },
        { key: 'features_beta', label: 'Features Beta', type: 'array' },
        { key: 'features_desativadas', label: 'Features Desativadas', type: 'array' }
      ]
    }
  ];

  const renderField = (section: keyof ConfiguracaoGlobal, field: {key: string; label: string; type: string}) => {
    const value = editingConfig[section][field.key as keyof typeof editingConfig[typeof section]];
    
    if (field.type === 'boolean') {
      return (
        <div key={field.key} className="flex items-center justify-between py-3">
          <label className="text-sm font-medium text-primary">{field.label}</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value as boolean}
              onChange={(e) => setEditingConfig({
                ...editingConfig,
                [section]: {
                  ...editingConfig[section],
                  [field.key]: e.target.checked
                }
              })}
              className="h-4 w-4 rounded border-gray-300"
            />
          </div>
        </div>
      );
    }

    if (field.type === 'array') {
      return (
        <div key={field.key} className="py-3">
          <label className="block text-sm font-medium text-primary mb-2">{field.label}</label>
          <textarea
            value={(value as string[]).join('\n')}
            onChange={(e) => setEditingConfig({
              ...editingConfig,
              [section]: {
                ...editingConfig[section],
                [field.key]: e.target.value.split('\n').filter(Boolean)
              }
            })}
            className="w-full h-24 px-3 py-2 text-sm border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"
            placeholder="Um item por linha"
          />
        </div>
      );
    }

    return (
      <div key={field.key} className="py-3">
        <label className="block text-sm font-medium text-primary mb-2">{field.label}</label>
        <input
          type={field.type}
          value={value as string | number}
          onChange={(e) => setEditingConfig({
            ...editingConfig,
            [section]: {
              ...editingConfig[section],
              [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
            }
          })}
          className="w-full px-3 py-2 text-sm border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <div key={section.key} className="surface-card rounded-lg border border-default overflow-hidden">
            <button
              onClick={() => setActiveSection(activeSection === section.key ? null as any : section.key)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-primary" />
                <span className="font-semibold text-primary">{section.label}</span>
              </div>
              <ChevronDown 
                size={20} 
                className={`text-muted transition-transform ${
                  activeSection === section.key ? 'rotate-180' : ''
                }`}
              />
            </button>
            
            {activeSection === section.key && (
              <div className="px-6 pb-6 border-t border-default">
                <div className="mt-4 space-y-1">
                  {section.fields.map((field) => renderField(section.key, field))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {status && activeSection === section.key && (
                    <NAlert 
                      variant={status.success ? 'success' : 'error'}
                      className="mr-4"
                    >
                      {status.message}
                    </NAlert>
                  )}
                  <NButton
                    onClick={() => handleSave(section.key)}
                    disabled={isSaving}
                    variant="default"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </NButton>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}