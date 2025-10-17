// lib/notion-tracker.ts
// Sistema para atualizar automaticamente o progresso do projeto no Notion

export interface ProjectPhase {
  name: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  priority: 'P1' | 'P2' | 'P3';
  description: string;
  tasks: string[];
  completedAt?: string;
  blockers?: string[];
}

export const projectPhases: Record<string, ProjectPhase> = {
  'config_preferencias': {
    name: 'Implementar Aba Preferências',
    status: 'not_started',
    priority: 'P1',
    description: 'Definir e construir campos de UI e Server Action para preferências do sistema',
    tasks: [
      'Criar tabela noro_configuracoes',
      'Implementar UI da aba Preferências',
      'Criar Server Actions para salvar/carregar',
      'Adicionar preferências de sistema (moeda, fuso, idioma)',
      'Adicionar preferências de usuário (tema, densidade)'
    ]
  },
  'gestao_clientes': {
    name: 'Gestão de Clientes',
    status: 'in_progress',
    priority: 'P1',
    description: 'Página completa de gestão de clientes com CRUD',
    tasks: [
      'Criar ClientesClientPage com listagem',
      'Implementar filtros e busca avançada',
      'Adicionar modal de criação de cliente',
      'Implementar edição de cliente',
      'Adicionar visualização detalhada',
      'Criar histórico de interações',
      'Sistema de tags e categorização'
    ]
  },
  'dashboard_melhorias': {
    name: 'Melhorias no Dashboard',
    status: 'not_started',
    priority: 'P2',
    description: 'Adicionar gráficos e métricas avançadas',
    tasks: [
      'Implementar gráfico de receita mensal',
      'Adicionar gráfico de leads por origem',
      'Criar gráfico de taxa de conversão',
      'Adicionar filtro de período',
      'Implementar comparativo mês anterior'
    ]
  }
};

/**
 * Atualiza o status de uma fase no Notion
 * Usa as ferramentas Notion MCP disponíveis
 */
export async function updatePhaseInNotion(
  phaseId: string,
  updates: Partial<ProjectPhase>,
  notionPageId?: string
) {
  const phase = { ...projectPhases[phaseId], ...updates };
  
  // Monta o conteúdo em Markdown para o Notion
  const content = `
# ${phase.name}

**Status:** ${phase.status}
**Prioridade:** ${phase.priority}

## Descrição
${phase.description}

## Tarefas
${phase.tasks.map((task, i) => `- [ ] ${task}`).join('\n')}

${phase.blockers ? `## Bloqueadores\n${phase.blockers.map(b => `- ⚠️ ${b}`).join('\n')}` : ''}

${phase.completedAt ? `\n✅ **Concluído em:** ${phase.completedAt}` : ''}
`;

  return {
    phaseId,
    phase,
    notionContent: content
  };
}

/**
 * Gera relatório de progresso completo
 */
export function generateProgressReport(): string {
  const phases = Object.values(projectPhases);
  const completed = phases.filter(p => p.status === 'completed').length;
  const inProgress = phases.filter(p => p.status === 'in_progress').length;
  const total = phases.length;
  const percentage = ((completed / total) * 100).toFixed(1);

  return `
# 🚀 Relatório de Progresso - CRM Nomade Guru

**Data:** ${new Date().toLocaleDateString('pt-PT')}
**Progresso Geral:** ${completed}/${total} fases (${percentage}%)

## 📊 Status
- ✅ Concluídas: ${completed}
- 🔄 Em Progresso: ${inProgress}
- ⏳ Não Iniciadas: ${total - completed - inProgress}

## 📋 Fases

${phases.map(phase => `
### ${phase.name}
**Status:** ${getStatusEmoji(phase.status)} ${phase.status}
**Prioridade:** ${phase.priority}

**Tarefas:**
${phase.tasks.map(task => `- [ ] ${task}`).join('\n')}

---
`).join('\n')}

## 🎯 Próximos Passos
${phases
  .filter(p => p.status === 'not_started' && p.priority === 'P1')
  .map(p => `- ${p.name}`)
  .join('\n')}
`;
}

function getStatusEmoji(status: string): string {
  const emojis: Record<string, string> = {
    'completed': '✅',
    'in_progress': '🔄',
    'not_started': '⏳',
    'blocked': '🚫'
  };
  return emojis[status] || '❓';
}

// Exemplo de uso:
// const report = generateProgressReport();
// Depois você pode usar a ferramenta notion-create-pages para criar no Notion