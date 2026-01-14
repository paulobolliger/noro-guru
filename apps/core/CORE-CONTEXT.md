# Documentação Técnica do Core da Aplicação

Este documento detalha a estrutura, seções e variáveis fundamentais do módulo `apps/core` da aplicação Noro. O objetivo é fornecer um mapa completo para integração com o Control Plane.

## 1. Estrutura de Navegação (Sidebar)

A aplicação está organizada nos seguintes módulos principais, conforme definido em `components/admin/Sidebar.tsx`:

### Principal
*   **Dashboard** (`/`) - Visão geral do sistema.

### Comercial & CRM
*   **Leads** (`/leads`) - Gestão de potenciais clientes.
*   **Clientes** (`/clientes`) - Base de clientes ativos.
*   **Comunicação** (`/comunicacao`) - Central de mensagens e interações.
*   **Tarefas** (`/tarefas`) - Gestão de tarefas e agenda.

### Vendas & Financeiro
*   **Orçamentos** (`/orcamentos`) - Criação e gestão de propostas.
*   **Pedidos** (`/pedidos`) - Gestão de pedidos de venda.
*   **Financeiro** (`/financeiro`) - Controle financeiro (contas a pagar/receber).

### Marketing & IA
*   **Marketing** (`/marketing`) - Campanhas e posts (Integração Social).
*   **Geração AI** (`/geracao`) - Ferramentas de IA para criação.
*   **Conteúdo** (`/conteudo`) - Gestão de ativos digitais.
*   **Custos AI** (`/custos`) - Monitoramento de consumo de tokens/créditos.

### Sistema
*   **Relatórios** (`/relatorios`) - Analytics e BI.
*   **Administração** (`/configuracoes`) - Configurações do tenant, usuários e preferências.

---

## 2. Modelos de Dados e Variáveis

### 2.1. Configurações do Sistema (`ConfiguracaoSistema`)
Geridas via tabela `noro_configuracoes` (onde `tipo = 'sistema'` e `user_id = null`). Estas configurações afetam todos os usuários do tenant.

| Variável | Tipo | Valores Aceitos / Exemplo | Descrição |
| :--- | :--- | :--- | :--- |
| `moeda_padrao` | String (Enum) | `'EUR'`, `'USD'`, `'BRL'` | Moeda base para operações financeiras. |
| `fuso_horario` | String | `'Europe/Lisbon'`, `'America/Sao_Paulo'` | Timezone para exibição de datas. |
| `idioma` | String (Enum) | `'pt'`, `'en'`, `'es'` | Idioma da interface. |
| `formato_data` | String (Enum) | `'DD/MM/YYYY'`, `'MM/DD/YYYY'`, `'YYYY-MM-DD'` | Formato de exibição de datas. |
| `logo_url_admin` | String (URL) | `https://...` | URL do logo personalizado do tenant. |
| `topbar_color` | String (Hex) | `#232452` | Cor de fundo da barra lateral/topo. |

### 2.2. Preferências do Usuário (`ConfiguracaoUsuario`)
Geridas via tabela `noro_configuracoes` (onde `tipo = 'usuario'` e `user_id = UUID`). Personalizações individuais.

| Variável | Tipo | Valores Aceitos / Exemplo | Descrição |
| :--- | :--- | :--- | :--- |
| `tema` | String (Enum) | `'light'`, `'dark'`, `'auto'` | Tema da interface. |
| `densidade_tabela`| String (Enum) | `'compacta'`, `'confortavel'`, `'espaçosa'` | Espaçamento em listagens. |
| `notificacoes_ativadas` | Boolean | `true` / `false` | Master switch de notificações. |
| `notificacoes_email` | Boolean | `true` / `false` | Receber alertas por email. |
| `notificacoes_push` | Boolean | `true` / `false` | Receber push notifications. |

### 2.3. Dados da Empresa (`EmpresaDados`)
Geridos via tabela `noro_empresa`. Representa a entidade legal do tenant.

| Variável | Tipo | Sub-propriedades | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | - | ID único do registro da empresa. |
| `nome_empresa` | String | - | Razão social ou nome fantasia. |
| `documento` | String | - | NIF, CNPJ ou equivalente. |
| `endereco` | JSON | `rua`, `cidade`, `estado`, `cep`, `pais` | Endereço completo. |
| `telefone_comercial` | String | - | Telefone principal. |
| `email_principal` | String | - | Email para contato oficial. |
| `website` | String | - | Website da empresa. |
| `contato_principal` | JSON | `nome`, `cargo`, `telefone`, `email` | Pessoa de contato responsável. |
| `redes_sociais` | JSON | `facebook`, `instagram`, `linkedin`, `whatsapp` | Links para perfis sociais. |

---

## 3. Estrutura de Banco de Dados (Supabase)

Para integração com o Control Plane, as seguintes tabelas são críticas:

*   **`tenants`**: Tabela mestre de tenants (ID, Nome, Status).
*   **`user_tenants`**: Tabela de relacionamento (Link `user_id` <-> `tenant_id`).
*   **`noro_users`**: Perfil estendido dos usuários (Nome, Cargo, Avatar).
*   **`noro_empresa`**: Dados cadastrais da empresa do tenant (1 por tenant).
*   **`noro_configuracoes`**: Armazenamento Key-Value para configurações (Sistema e Usuário).

## 4. Integração com Control Plane

Pontos de contato sugeridos para a API do Control Plane:

1.  **Provisionamento:** Ao criar um novo tenant no Control Plane, deve-se inicializar um registro em `noro_empresa` e configurações padrão em `noro_configuracoes`.
2.  **Gestão de Planos:** A aba **Assinatura** no Core visualiza dados. O Control Plane deve fornecer endpoints ou webhooks para atualizar status de pagamento, validade do plano e limites.
3.  **Suporte:** A nova aba **Suporte** envia solicitações. O Control Plane deve receber esses tickets (via tabela de chamados ou integração com ferramenta externa).
