# Noro Guru — Documentação do Projeto

Esta pasta centraliza todas as especificações, roadmaps, arquitetura e históricos do ecossistema Noro Guru.

## 📂 Estrutura de Diretórios

```txt
docs/
├── README.md                          # Este arquivo (índice da documentação)
├── SPRINT_STATUS.md                   # Status operacional em tempo real das Sprints
│
├── architecture/                      # Arquitetura vigente (fontes de verdade técnica)
│   ├── current-state.md               # Status arquitetural consolidado atual
│   ├── data-auth-transition.md        # Transição de dados e auth de Supabase para PostgreSQL/Logto
│   ├── multi-tenant-current-model.md  # Isolamento e modelo multi-tenant atual
│   └── ...
│
├── backlog/                           # Backlogs operacionais incrementais por área
│   ├── implementation/
│   │   └── noro-foundation-sprint-plan.md  # Plano de sprints fundacionais
│   ├── communication/                 # Backlog de comunicação omnichannel
│   ├── email-marketing/               # Backlog de e-mail marketing
│   └── ...
│
├── archive/                           # Histórico, relatórios antigos e decisões passadas
│   ├── sprints/                       # Relatórios de execução de Sprints concluídas (Sprint 0 a 1N)
│   ├── analise-documentacao-md-projeto.md # Análise histórica de MDs e tensões arquiteturais
│   ├── codebase-unused-legacy-audit.md    # Relatório de auditoria de arquivos e códigos legados
│   └── ...
│
├── ai/                                # Guias de desenvolvimento para agentes de IA
├── apps/                              # Contextos e documentação específica por aplicação
├── conceito/                          # Visão-alvo conceitual e estratégica de produto
└── design/                            # Recursos visuais, fluxos de telas e mockups
```

## 🚀 Como Trabalhar com a Documentação

1. **Arquitetura Vigente**: A pasta [docs/architecture/](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/docs/architecture/) é a única fonte da verdade da arquitetura ativa. Documentações conceituais ou de arquivos arquivados não representam o estado real.
2. **Acompanhamento de Sprints**: O arquivo principal [docs/SPRINT_STATUS.md](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/docs/SPRINT_STATUS.md) serve como painel rápido de status e deve ser atualizado ao final de cada marco concluído.
3. **Backlog de Implementação**: O plano detalhado das sprints fica em [docs/backlog/implementation/noro-foundation-sprint-plan.md](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/docs/backlog/implementation/noro-foundation-sprint-plan.md).
