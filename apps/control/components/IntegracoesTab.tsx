// components/IntegracoesTab.tsx
'use client';

import { useState } from 'react';
import { Save, Eye, EyeOff, Key, Database, Mail, Webhook, Globe, Server, Cloud, Plus, Trash2, X, Power, Pencil, Check, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EnvVariable {
  key: string;
  value: string;
  category: 'database' | 'auth' | 'email' | 'api' | 'other';
  description?: string;
  isSecret?: boolean;
  service?: string; // Nome do serviço (SUPABASE, OPENAI, etc)
  isEnabled?: boolean; // Se a variável está ativa ou comentada
}

interface IntegracoesTabProps {
  envVariables: EnvVariable[];
}

const isProduction = typeof window !== 'undefined' 
  ? window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
  : false;

// Mapear serviços conhecidos para ícones e cores
const serviceConfig: Record<string, { icon: string; color: string; name: string; category: string }> = {
  SUPABASE: { icon: '🗄️', color: 'from-green-500 to-emerald-600', name: 'Supabase', category: 'database' },
  OPENAI: { icon: '🤖', color: 'from-purple-500 to-indigo-600', name: 'OpenAI', category: 'ai' },
  STRIPE: { icon: '💳', color: 'from-blue-500 to-violet-600', name: 'Stripe', category: 'payment' },
  AWS: { icon: '📧', color: 'from-orange-500 to-yellow-600', name: 'AWS SES', category: 'email' },
  NEXTAUTH: { icon: '🔐', color: 'from-cyan-500 to-blue-600', name: 'NextAuth', category: 'auth' },
  NOTION: { icon: '📝', color: 'from-gray-600 to-slate-700', name: 'Notion', category: 'api' },
  VERCEL: { icon: '▲', color: 'from-black to-gray-800', name: 'Vercel', category: 'hosting' },
  DATABASE: { icon: '💾', color: 'from-teal-500 to-cyan-600', name: 'Database', category: 'database' },
  API: { icon: '🔌', color: 'from-indigo-500 to-purple-600', name: 'API', category: 'api' },
  OTHER: { icon: '⚙️', color: 'from-gray-500 to-slate-600', name: 'Outros', category: 'other' },
};

// Opções de ícones por categoria
const iconOptions: Record<string, string[]> = {
  database: ['🗄️', '💾', '🏛️', '📊', '🗃️'],
  ai: ['🤖', '🧠', '✨', '🎯', '🔮'],
  email: ['📧', '✉️', '📬', '📮', '📪'],
  payment: ['💳', '💰', '💸', '🏦', '💵'],
  auth: ['🔐', '🔑', '🛡️', '🔒', '👤'],
  api: ['🔌', '🔗', '⚡', '🌐', '📡'],
  hosting: ['☁️', '🌩️', '🖥️', '🚀', '▲'],
  other: ['⚙️', '🔧', '🛠️', '📦', '🎨'],
};

// Categorias disponíveis
const categoryLabels: Record<string, string> = {
  database: 'Banco de Dados',
  ai: 'Inteligência Artificial',
  email: 'Email',
  payment: 'Pagamento',
  auth: 'Autenticação',
  api: 'API',
  hosting: 'Hospedagem',
  other: 'Outros',
};

// Função para detectar o serviço baseado na chave
const detectService = (key: string): string => {
  const keyUpper = key.toUpperCase();
  if (keyUpper.includes('SUPABASE')) return 'SUPABASE';
  if (keyUpper.includes('OPENAI') || keyUpper.includes('OPEN_AI')) return 'OPENAI';
  if (keyUpper.includes('STRIPE')) return 'STRIPE';
  if (keyUpper.includes('AWS') || keyUpper.includes('SES')) return 'AWS';
  if (keyUpper.includes('NEXTAUTH') || keyUpper.includes('AUTH_SECRET')) return 'NEXTAUTH';
  if (keyUpper.includes('NOTION')) return 'NOTION';
  if (keyUpper.includes('VERCEL')) return 'VERCEL';
  if (keyUpper.includes('DATABASE_URL') || keyUpper.includes('DB_')) return 'DATABASE';
  if (keyUpper.includes('API')) return 'API';
  return 'OTHER';
};

// Componente Sortable para cada variável
interface SortableVariableItemProps {
  variable: EnvVariable;
  visibleSecrets: Set<string>;
  toggleSecretVisibility: (key: string) => void;
  handleValueChange: (key: string, value: string) => void;
  toggleVariableEnabled: (key: string) => void;
  handleDeleteVariable: (key: string) => void;
}

function SortableVariableItem({
  variable,
  visibleSecrets,
  toggleSecretVisibility,
  handleValueChange,
  toggleVariableEnabled,
  handleDeleteVariable,
}: SortableVariableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: variable.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`space-y-2 p-3 rounded-lg border transition-all ${
        variable.isEnabled 
          ? 'bg-[var(--color-surface)] border-default/50' 
          : 'bg-[var(--color-surface)]/50 border-default/30 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Handle para arrastar */}
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-secondary hover:text-primary transition-colors flex-shrink-0"
            title="Arrastar para reordenar"
          >
            <GripVertical size={16} />
          </button>

          {/* Toggle Liga/Desliga */}
          <button
            onClick={() => toggleVariableEnabled(variable.key)}
            className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${
              variable.isEnabled 
                ? 'bg-emerald-500' 
                : 'bg-gray-400'
            }`}
            title={variable.isEnabled ? 'Desativar variável (comentar no .env)' : 'Ativar variável (descomentar no .env)'}
          >
            <div 
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                variable.isEnabled ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>

          <label className={`text-sm font-medium truncate ${variable.isEnabled ? 'text-primary' : 'text-secondary'}`}>
            {variable.key}
          </label>
          {variable.isSecret && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex-shrink-0">
              Secret
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {variable.isSecret && (
            <button
              onClick={() => toggleSecretVisibility(variable.key)}
              className="text-secondary hover:text-primary transition-colors"
              title={visibleSecrets.has(variable.key) ? 'Ocultar' : 'Mostrar'}
            >
              {visibleSecrets.has(variable.key) ? (
                <EyeOff size={14} />
              ) : (
                <Eye size={14} />
              )}
            </button>
          )}
          <button
            onClick={() => handleDeleteVariable(variable.key)}
            className="text-secondary hover:text-red-500 transition-colors"
            title="Remover variável"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      
      {variable.description && (
        <p className="text-xs text-description pl-11">{variable.description}</p>
      )}
      
      <div className="pl-11">
        <input
          type={variable.isSecret && !visibleSecrets.has(variable.key) ? 'password' : 'text'}
          value={variable.value}
          onChange={(e) => handleValueChange(variable.key, e.target.value)}
          disabled={!variable.isEnabled}
          className={`input-field w-full text-sm ${!variable.isEnabled ? 'cursor-not-allowed' : ''}`}
          placeholder={variable.isEnabled ? `Digite ${variable.key}` : 'Variável desativada'}
        />
      </div>
    </div>
  );
}

export default function IntegracoesTab({ envVariables }: IntegracoesTabProps) {
  const [variables, setVariables] = useState<EnvVariable[]>(
    envVariables.map(v => ({ ...v, service: v.service || detectService(v.key), isEnabled: v.isEnabled !== false }))
  );
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editingServiceName, setEditingServiceName] = useState<string>('');
  const [editIconModal, setEditIconModal] = useState<{ service: string; open: boolean }>({ service: '', open: false });
  const [newVarLines, setNewVarLines] = useState<Array<{ service: string; key: string; value: string; isSecret: boolean }>>([
    { service: 'OTHER', key: '', value: '', isSecret: false }
  ]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const toggleSecretVisibility = (key: string) => {
    setVisibleSecrets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleValueChange = (key: string, newValue: string) => {
    setVariables(prev => prev.map(v => 
      v.key === key ? { ...v, value: newValue } : v
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/env-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variables }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Erro ao salvar');
      
      alert(data.message || 'Configurações salvas com sucesso!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewVariables = () => {
    const validLines = newVarLines.filter(line => line.key && line.value);
    if (validLines.length === 0) {
      alert('Adicione ao menos uma variável válida');
      return;
    }

    const newVariables: EnvVariable[] = validLines.map(line => ({
      key: line.key,
      value: line.value,
      service: line.service,
      category: 'other',
      isSecret: line.isSecret,
    }));

    setVariables(prev => [...prev, ...newVariables]);
    setIsModalOpen(false);
    setNewVarLines([{ service: 'OTHER', key: '', value: '', isSecret: false }]);
  };

  const handleDeleteVariable = (key: string) => {
    if (confirm(`Deseja realmente remover a variável ${key}?`)) {
      setVariables(prev => prev.filter(v => v.key !== key));
    }
  };

  const toggleVariableEnabled = (key: string) => {
    setVariables(prev => prev.map(v => 
      v.key === key ? { ...v, isEnabled: !v.isEnabled } : v
    ));
  };

  const startEditingService = (service: string) => {
    const config = serviceConfig[service] || serviceConfig.OTHER;
    setEditingService(service);
    setEditingServiceName(config.name);
  };

  const saveServiceName = (oldService: string) => {
    if (!editingServiceName.trim()) {
      alert('O nome do serviço não pode estar vazio');
      return;
    }

    // Criar novo identificador de serviço baseado no nome
    const newServiceKey = editingServiceName.toUpperCase().replace(/\s+/g, '_');
    
    // Adicionar nova configuração se não existir
    if (!serviceConfig[newServiceKey]) {
      serviceConfig[newServiceKey] = {
        icon: '⚙️',
        color: 'from-gray-500 to-slate-600',
        name: editingServiceName,
        category: 'other',
      };
    } else {
      // Atualizar nome existente
      serviceConfig[newServiceKey].name = editingServiceName;
    }

    // Atualizar todas as variáveis desse serviço
    setVariables(prev => prev.map(v => 
      v.service === oldService ? { ...v, service: newServiceKey } : v
    ));

    setEditingService(null);
    setEditingServiceName('');
  };

  const cancelEditingService = () => {
    setEditingService(null);
    setEditingServiceName('');
  };

  const openEditIconModal = (service: string) => {
    setEditIconModal({ service, open: true });
  };

  const closeEditIconModal = () => {
    setEditIconModal({ service: '', open: false });
  };

  const updateServiceIcon = (service: string, newIcon: string) => {
    if (serviceConfig[service]) {
      serviceConfig[service].icon = newIcon;
      setVariables([...variables]); // Force re-render
    }
    closeEditIconModal();
  };

  const updateServiceCategory = (service: string, newCategory: string) => {
    if (serviceConfig[service]) {
      serviceConfig[service].category = newCategory;
      // Atualizar cor baseado na categoria
      const colorMap: Record<string, string> = {
        database: 'from-green-500 to-emerald-600',
        ai: 'from-purple-500 to-indigo-600',
        email: 'from-orange-500 to-yellow-600',
        payment: 'from-blue-500 to-violet-600',
        auth: 'from-cyan-500 to-blue-600',
        api: 'from-indigo-500 to-purple-600',
        hosting: 'from-black to-gray-800',
        other: 'from-gray-500 to-slate-600',
      };
      serviceConfig[service].color = colorMap[newCategory] || colorMap.other;
      setVariables([...variables]); // Force re-render
    }
  };

  const handleDragEnd = (event: DragEndEvent, service: string) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setVariables((prevVariables) => {
        // Pegar apenas as variáveis deste serviço
        const serviceVars = prevVariables.filter(v => v.service === service);
        const otherVars = prevVariables.filter(v => v.service !== service);
        
        const oldIndex = serviceVars.findIndex(v => v.key === active.id);
        const newIndex = serviceVars.findIndex(v => v.key === over.id);
        
        const reorderedServiceVars = arrayMove(serviceVars, oldIndex, newIndex);
        
        // Manter a ordem: outras variáveis + variáveis reordenadas deste serviço
        return [...otherVars, ...reorderedServiceVars];
      });
    }
  };

  const addNewVarLine = () => {
    setNewVarLines(prev => [...prev, { service: 'OTHER', key: '', value: '', isSecret: false }]);
  };

  const removeNewVarLine = (index: number) => {
    setNewVarLines(prev => prev.filter((_, i) => i !== index));
  };

  const updateNewVarLine = (index: number, field: string, value: string | boolean) => {
    setNewVarLines(prev => prev.map((line, i) => 
      i === index ? { ...line, [field]: value } : line
    ));
  };

  // Agrupar por serviço
  const groupedByService = variables.reduce((acc, variable) => {
    const service = variable.service || 'OTHER';
    if (!acc[service]) {
      acc[service] = [];
    }
    acc[service].push(variable);
    return acc;
  }, {} as Record<string, EnvVariable[]>);

  return (
    <div className="space-y-6">
      {/* Header com Badge e Botões */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">Integrações & Variáveis</h3>
            <p className="text-sm text-description mt-1">
              Gerencie as integrações e variáveis de ambiente do sistema
            </p>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
            isProduction 
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isProduction ? (
              <>
                <Cloud size={14} />
                <span>Produção</span>
              </>
            ) : (
              <>
                <Server size={14} />
                <span>Desenvolvimento</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <Plus size={16} />
            Adicionar Variável
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg"
          >
            <Save size={16} />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      {/* Grid de Cards por Serviço - 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedByService).map(([service, vars]) => {
          const config = serviceConfig[service] || serviceConfig.OTHER;
          
          return (
            <div key={service} className="surface-card rounded-xl border border-default p-6 space-y-4">
              {/* Header do Card com Ícone e Nome do Serviço */}
              <div className="flex items-center gap-3 pb-4 border-b border-default">
                <button
                  onClick={() => openEditIconModal(service)}
                  className="relative group"
                  title="Editar ícone e categoria"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl transition-transform group-hover:scale-105`}>
                    {config.icon}
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Pencil size={14} className="opacity-0 group-hover:opacity-100 text-white" />
                  </div>
                </button>
                <div className="flex-1">
                  {editingService === service ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingServiceName}
                        onChange={(e) => setEditingServiceName(e.target.value)}
                        className="input-field flex-1 text-sm font-semibold"
                        placeholder="Nome do serviço"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveServiceName(service);
                          if (e.key === 'Escape') cancelEditingService();
                        }}
                      />
                      <button
                        onClick={() => saveServiceName(service)}
                        className="p-1.5 rounded text-emerald-500 hover:bg-emerald-500/20 transition-colors"
                        title="Salvar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={cancelEditingService}
                        className="p-1.5 rounded text-secondary hover:bg-[var(--color-surface)] transition-colors"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-primary flex-1">{config.name}</h4>
                      <button
                        onClick={() => startEditingService(service)}
                        className="p-1.5 rounded text-secondary hover:text-primary hover:bg-[var(--color-surface)] transition-colors"
                        title="Editar nome do serviço"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-description mt-1">{vars.length} {vars.length === 1 ? 'variável' : 'variáveis'}</p>
                </div>
              </div>

              {/* Variáveis do Serviço com DnD */}
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, service)}
              >
                <SortableContext
                  items={vars.map(v => v.key)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {vars.map((variable) => (
                      <SortableVariableItem
                        key={variable.key}
                        variable={variable}
                        visibleSecrets={visibleSecrets}
                        toggleSecretVisibility={toggleSecretVisibility}
                        handleValueChange={handleValueChange}
                        toggleVariableEnabled={toggleVariableEnabled}
                        handleDeleteVariable={handleDeleteVariable}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          );
        })}
      </div>

      {/* Warning Box */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-yellow-500 mt-0.5">⚠️</div>
          <div className="text-sm text-description">
            {isProduction ? (
              <>
                <strong className="text-primary">Produção (Vercel):</strong> As alterações serão salvas 
                nas variáveis de ambiente do Vercel. É necessário fazer <strong>redeploy do projeto</strong> 
                para que as mudanças sejam aplicadas.
              </>
            ) : (
              <>
                <strong className="text-primary">Desenvolvimento:</strong> As alterações serão salvas 
                no arquivo <code className="text-accent">.env.local</code>. É necessário <strong>reiniciar 
                o servidor</strong> para que as mudanças sejam aplicadas.
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal para Adicionar Variáveis */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="surface-card rounded-xl border border-default max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="sticky top-0 bg-[var(--color-surface-card)] border-b border-default px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">Adicionar Variáveis de Ambiente</h3>
                <p className="text-sm text-description mt-1">Adicione uma ou mais variáveis ao seu ambiente</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-secondary hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body do Modal */}
            <div className="p-6 space-y-4">
              {newVarLines.map((line, index) => (
                <div key={index} className="p-4 bg-[var(--color-surface)] rounded-lg border border-default space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-description">Variável {index + 1}</span>
                    {newVarLines.length > 1 && (
                      <button
                        onClick={() => removeNewVarLine(index)}
                        className="text-secondary hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Serviço */}
                    <div>
                      <label className="block text-xs font-medium text-label mb-1.5">Serviço</label>
                      <select
                        value={line.service}
                        onChange={(e) => updateNewVarLine(index, 'service', e.target.value)}
                        className="input-field w-full text-sm"
                      >
                        {Object.entries(serviceConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.icon} {config.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Nome da Variável */}
                    <div>
                      <label className="block text-xs font-medium text-label mb-1.5">Nome da Variável</label>
                      <input
                        type="text"
                        value={line.key}
                        onChange={(e) => updateNewVarLine(index, 'key', e.target.value.toUpperCase())}
                        className="input-field w-full text-sm"
                        placeholder="MINHA_VARIAVEL"
                      />
                    </div>

                    {/* Tipo */}
                    <div>
                      <label className="block text-xs font-medium text-label mb-1.5">Tipo</label>
                      <select
                        value={line.isSecret ? 'secret' : 'public'}
                        onChange={(e) => updateNewVarLine(index, 'isSecret', e.target.value === 'secret')}
                        className="input-field w-full text-sm"
                      >
                        <option value="public">Pública</option>
                        <option value="secret">Secret</option>
                      </select>
                    </div>
                  </div>

                  {/* Valor */}
                  <div>
                    <label className="block text-xs font-medium text-label mb-1.5">Valor</label>
                    <input
                      type="text"
                      value={line.value}
                      onChange={(e) => updateNewVarLine(index, 'value', e.target.value)}
                      className="input-field w-full text-sm"
                      placeholder="valor_da_variavel"
                    />
                  </div>
                </div>
              ))}

              {/* Botão Adicionar Linha */}
              <button
                onClick={addNewVarLine}
                className="w-full py-3 border-2 border-dashed border-default rounded-lg text-sm font-medium text-secondary hover:text-primary hover:border-accent transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Adicionar outra variável
              </button>
            </div>

            {/* Footer do Modal */}
            <div className="sticky bottom-0 bg-[var(--color-surface-card)] border-t border-default px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNewVariables}
                className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={16} />
                Adicionar {newVarLines.filter(l => l.key && l.value).length} {newVarLines.filter(l => l.key && l.value).length === 1 ? 'Variável' : 'Variáveis'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Editar Ícone e Categoria */}
      {editIconModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="surface-card rounded-xl border border-default max-w-md w-full">
            {/* Header do Modal */}
            <div className="bg-[var(--color-surface-card)] border-b border-default px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">Editar Serviço</h3>
                <p className="text-sm text-description mt-1">Personalize o ícone e categoria</p>
              </div>
              <button
                onClick={closeEditIconModal}
                className="text-secondary hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body do Modal */}
            <div className="p-6 space-y-6">
              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-label mb-3">Categoria</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const isSelected = serviceConfig[editIconModal.service]?.category === key;
                    return (
                      <button
                        key={key}
                        onClick={() => updateServiceCategory(editIconModal.service, key)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          isSelected
                            ? 'bg-accent/20 border-accent text-accent'
                            : 'bg-[var(--color-surface)] border-default text-secondary hover:text-primary hover:border-accent/50'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ícones */}
              <div>
                <label className="block text-sm font-medium text-label mb-3">Ícone</label>
                <div className="grid grid-cols-5 gap-2">
                  {iconOptions[serviceConfig[editIconModal.service]?.category || 'other'].map((icon) => {
                    const isSelected = serviceConfig[editIconModal.service]?.icon === icon;
                    return (
                      <button
                        key={icon}
                        onClick={() => updateServiceIcon(editIconModal.service, icon)}
                        className={`aspect-square p-3 rounded-lg border text-2xl transition-all ${
                          isSelected
                            ? 'bg-accent/20 border-accent scale-110'
                            : 'bg-[var(--color-surface)] border-default hover:border-accent/50 hover:scale-105'
                        }`}
                      >
                        {icon}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="bg-[var(--color-surface-card)] border-t border-default px-6 py-4 flex items-center justify-end">
              <button
                onClick={closeEditIconModal}
                className="btn-primary px-4 py-2 rounded-lg"
              >
                Concluído
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
