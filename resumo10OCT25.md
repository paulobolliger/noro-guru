Projeto: Painel de Administração (CRM) para Nomade Guru

Data do Resumo: 16 de Outubro de 2025

Objetivo: Concluir as últimas pendências da seção de Configurações e iniciar a construção das páginas principais do CRM, com foco na Gestão de Clientes.

1. Estado Atual do Projeto
---------------------------------

O Painel de Administração em `http://localhost:3000/admin` está **Estável e Funcional**. A arquitetura (Server/Client/Admin) está consolidada, e a conexão segura com o Supabase (`SERVICE_ROLE_KEY`) foi validada.

2. Resumo Detalhado do Trabalho Realizado
-----------------------------------------------

### 2.1 Base e Arquitetura
* **Corrigidos erros de tipagem:** O problema central de tipagem do TypeScript (`Argument of type '...' is not assignable to parameter of type 'never'`) foi resolvido através da geração e aplicação dos tipos Supabase em toda a aplicação.
* **Unificação do Cliente Supabase:** A criação do cliente foi unificada em três camadas: Navegador (`client.ts`), Servidor com RLS (`server.ts`) e Servidor com privilégios Admin (`admin.ts`).
* **Resolução de Variáveis de Ambiente:** O erro de vazamento da `SERVICE_ROLE_KEY` foi resolvido movendo a busca de dados para o componente de servidor pai (`layout.tsx`).

### 2.2 Estrutura e Páginas
* **Estrutura de Rotas:** Placeholders criados para todas as rotas do menu Admin (Ex: `/admin/leads`, `/admin/clientes`, `/admin/orcamentos`, etc.).
* **Layout Admin:** Implementado layout protegido (`/admin/(protected)/layout.tsx`) com `Sidebar` e `TopBar`.
* **Páginas de CRM Prontas (Estrutura):** Leads, Clientes, Orçamentos, Pedidos, Financeiro, Tarefas, Relatórios, Marketing, E-mails, Comunicação, Configurações.

### 2.3 Seção de Configurações (Quase Completa)
* **Estrutura da Página:** Criada a estrutura de abas (`Integracoes`, `Utilizadores`, `Preferencias`) no componente `ConfiguracoesClient`.
* **Aba "Utilizadores" (CONCLUÍDA):**
    * `Convidar Novo Utilizador`: Implementado com sucesso via `inviteUserAction`.
    * `Editar Função` e `Remover Utilizador`: Implementadas e validadas as `Server Actions` (`updateUserRoleAction`, `deleteUserAction`) e os respetivos modais.
* **Aba "Integrações (APIs)" (CONCLUÍDA):**
    * **Problema de Permissão (Vault):** O erro `42501` foi resolvido usando a função nativa do Supabase (`vault.create_secret`) com `PERFORM`.
    * **Funcionalidade:** O método `saveSecretAction` no backend e a ligação dos botões "Guardar" na interface (`ConfiguracoesClient.tsx`) estão **100% funcionais**.

3. Linha Lógica e Próximos Passos
------------------------------------

### 3.1 Ações IMEDIATAS (Conclusão da Seção Configurações)

| PRIORIDADE | TAREFA | PLANO |
| :--- | :--- | :--- |
| **P1** | Implementar a aba "Preferências" | Definir e construir os campos de UI e a `Server Action` para salvar as preferências do sistema (ex: Moeda Padrão) e/ou do utilizador (ex: Tema/Densidade da Tabela). |
| **P2** | Definir Estrutura de Configuração no DB | Criar a tabela `nomade_configuracoes` (para preferências globais) e/ou expandir `nomade_users` (para preferências pessoais) no Supabase. |

### 3.2 Próximo GRANDE Foco (Após Configurações)

| PRIORIDADE | PÁGINA | TAREFAS |
| :--- | :--- | :--- |
| **F1** | **Gestão de Clientes (`/admin/clientes`)** | Substituir o *placeholder* "Página em Construção". Criar o componente de tabela principal (`ClientesClientPage`) para listar dados da tabela `nomade_clientes`. |
| **F2** | **Adicionar Novo Cliente** | Criar o `Modal/Formulário` de adição de cliente e a `Server Action` correspondente para inserção na tabela `nomade_clientes`. |

### 3.3 Pendências Futuras (Estrutura Pronta)

| PÁGINA | STATUS ATUAL | TAREFAS PENDENTES |
| :--- | :--- | :--- |
| **Orçamentos** (`/admin/orcamentos`) | Placeholder pronto. | Implementar listagem da tabela `nomade_orcamentos`. |
| **Pedidos** (`/admin/pedidos`) | Placeholder pronto. | Implementar listagem da tabela `nomade_pedidos`. |
| **Tarefas** (`/admin/tarefas`) | Placeholder pronto e Listagem do Dashboard iniciada. | Implementar a listagem completa de tarefas e funcionalidades de CRUD (Criar, Editar, Concluir). |
| **Financeiro** (`/admin/financeiro`) | Placeholder pronto. | Construir a interface de visualização de receitas/despesas da tabela `nomade_transacoes`. |