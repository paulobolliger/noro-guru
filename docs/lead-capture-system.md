# Sistema de Captação de Leads - NORO

Sistema completo de captação de leads integrado entre o site público (noro.guru) e o Control Plane (control.noro.guru).

## 📋 Visão Geral

O sistema permite capturar leads através de:
- **Modal de Contato**: Acessível via botões "Fale Conosco" no header e footer
- **Página de Contato**: `/contact` com formulário dedicado
- **Página de Pricing**: Botões de CTA integrados aos planos

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     noro.guru (Web)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐      ┌──────────────┐     ┌─────────────┐ │
│  │ ContactModal│      │ Contact Page │     │Pricing Page │ │
│  └──────┬──────┘      └──────┬───────┘     └──────┬──────┘ │
│         │                    │                     │        │
│         └────────────────────┴─────────────────────┘        │
│                              │                               │
│                    ┌─────────▼─────────┐                    │
│                    │  /api/lead (POST) │                    │
│                    └─────────┬─────────┘                    │
└──────────────────────────────┼──────────────────────────────┘
                               │
                               │ HTTPS + Bearer Token
                               │
┌──────────────────────────────▼──────────────────────────────┐
│              control.noro.guru (Control Plane)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐   ┌──────────────┐   ┌──────────────┐ │
│  │ /api/leads      │   │ /api/email/  │   │ /api/        │ │
│  │                 │   │ send         │   │ notifications│ │
│  │ • Salva no CRM  │   │              │   │              │ │
│  │ • Valida dados  │   │ • Envia por  │   │ • Notifica   │ │
│  │ • Verifica dupl.│   │   Resend     │   │   equipe     │ │
│  └────────┬────────┘   └──────┬───────┘   └──────┬───────┘ │
│           │                    │                   │         │
│           └────────────────────┴───────────────────┘         │
│                              │                               │
│                    ┌─────────▼──────────┐                   │
│                    │  Supabase Database │                   │
│                    │  • leads           │                   │
│                    │  • notifications   │                   │
│                    └────────────────────┘                   │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 Autenticação

Todas as chamadas para o Control Plane usam **Bearer Token**:

```typescript
Authorization: Bearer noro_api_key_production_2025
```

## 📝 Endpoints

### 1. POST /api/lead (Web)

**Local**: `apps/web/app/api/lead/route.ts`

Recebe dados do formulário, valida e envia para o Control Plane.

**Request Body**:
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com.br",
  "phone": "(11) 98765-4321",
  "company": "Empresa XYZ",
  "interest": "plano-professional",
  "message": "Gostaria de saber mais sobre..."
}
```

**Resposta**:
```json
{
  "message": "Obrigado! Entraremos em contato em breve.",
  "leadId": "uuid-do-lead"
}
```

**Fluxo**:
1. Valida dados (email, campos obrigatórios)
2. Salva lead no Control Plane CRM
3. Envia email de confirmação para o lead
4. Notifica equipe de vendas
5. Retorna sucesso

### 2. POST /api/leads (Control Plane)

**Local**: `apps/control/app/api/leads/route.ts`

Salva ou atualiza lead no banco de dados.

**Headers**:
```
Authorization: Bearer noro_api_key_production_2025
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "João Silva",
  "email": "joao@empresa.com.br",
  "phone": "(11) 98765-4321",
  "company": "Empresa XYZ",
  "interest": "plano-professional",
  "message": "Mensagem do lead",
  "source": "website"
}
```

**Resposta**:
```json
{
  "success": true,
  "leadId": "uuid-123",
  "message": "Lead salvo com sucesso"
}
```

**Lógica**:
- Verifica se já existe lead com o email
- Se existe: atualiza dados e `last_contact_at`
- Se não existe: cria novo lead com `status: 'new'`

### 3. POST /api/email/send (Control Plane)

**Local**: `apps/control/app/api/email/send/route.ts`

Envia emails via Resend.

**Headers**:
```
Authorization: Bearer noro_api_key_production_2025
Content-Type: application/json
```

**Request Body**:
```json
{
  "to": "lead@email.com",
  "subject": "Obrigado pelo contato!",
  "html": "<html>...</html>",
  "from": "NORO <contato@noro.guru>",
  "replyTo": "contato@noro.guru"
}
```

**Resposta**:
```json
{
  "success": true,
  "messageId": "resend-message-id",
  "message": "Email enviado com sucesso"
}
```

### 4. POST /api/notifications (Control Plane)

**Local**: `apps/control/app/api/notifications/route.ts`

Cria notificações para usuários do sistema.

**Headers**:
```
Authorization: Bearer noro_api_key_production_2025
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Novo Lead!",
  "message": "João Silva da Empresa XYZ entrou em contato",
  "type": "info",
  "metadata": {
    "leadId": "uuid-123",
    "source": "website"
  }
}
```

**Resposta**:
```json
{
  "success": true,
  "notificationsCreated": 2,
  "message": "Notificações criadas com sucesso"
}
```

**Lógica**:
- Se `userId` fornecido: notifica usuário específico
- Senão: busca todos admins e owners e notifica

## 🗄️ Banco de Dados

### Tabela: `leads`

```sql
CREATE TABLE public.leads (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  interest TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  tenant_id UUID,
  assigned_to UUID,
  last_contact_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Status possíveis**:
- `new`: Lead recém-capturado
- `contacted`: Equipe já fez contato
- `qualified`: Lead qualificado, potencial cliente
- `converted`: Convertido em cliente
- `lost`: Lead perdido/desqualificado

**Source possíveis**:
- `website`: Site noro.guru
- `referral`: Indicação
- `social`: Redes sociais
- `ads`: Anúncios
- `event`: Eventos

**RLS Policies**:
```sql
-- Admins e owners podem acessar (via user_tenants)
CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN user_tenants ut ON ut.user_id = u.id
      WHERE u.auth_user_id = auth.uid()
      AND ut.role IN ('admin', 'owner')
      AND ut.ativo = true
    )
  );

-- Service role (API) tem acesso total
CREATE POLICY "Service role full access to leads"
  ON leads FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');
```

### Tabela: `notifications`

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);
```

**Types**:
- `info`: Informação geral
- `success`: Sucesso/confirmação
- `warning`: Atenção
- `error`: Erro

## ⚙️ Variáveis de Ambiente

### Web (noro.guru)

```env
# .env.local
CONTROL_PLANE_URL=https://control.noro.guru
CONTROL_PLANE_API_KEY=noro_api_key_production_2025
NEXT_PUBLIC_APP_URL=https://noro.guru
```

### Control Plane (control.noro.guru)

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

CONTROL_PLANE_API_KEY=noro_api_key_production_2025
RESEND_API_KEY=re_your_resend_api_key

ALLOWED_ORIGINS=https://noro.guru,https://www.noro.guru,http://localhost:3000
```

## 🚀 Deployment

### 1. Aplicar Migration no Supabase

```bash
cd supabase
npx supabase db push
```

Ou via Supabase Dashboard:
- Copie o conteúdo de `migrations/20251030000000_leads_notifications.sql`
- Cole no SQL Editor
- Execute

### 2. Configurar Resend

1. Criar conta em [resend.com](https://resend.com)
2. Adicionar domínio `noro.guru`
3. Configurar DNS (SPF, DKIM)
4. Obter API key
5. Adicionar em `RESEND_API_KEY`

### 3. Configurar CORS

Adicionar origens permitidas:
- `https://noro.guru`
- `https://www.noro.guru`
- `http://localhost:3000` (dev)

### 4. Deploy dos Apps

```bash
# Web
cd apps/web
npm run build
npm run start

# Control
cd apps/control
npm run build
npm run start
```

## 🧪 Testes

### Testar Captação de Lead

```bash
curl -X POST https://noro.guru/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@email.com",
    "phone": "(11) 99999-9999",
    "company": "Empresa Teste",
    "interest": "plano-starter",
    "message": "Teste de integração"
  }'
```

### Testar Endpoint do Control Plane

```bash
# Criar Lead
curl -X POST https://control.noro.guru/api/leads \
  -H "Authorization: Bearer noro_api_key_production_2025" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste",
    "email": "teste@email.com"
  }'

# Enviar Email
curl -X POST https://control.noro.guru/api/email/send \
  -H "Authorization: Bearer noro_api_key_production_2025" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "teste@email.com",
    "subject": "Teste",
    "html": "<h1>Teste</h1>"
  }'

# Criar Notificação
curl -X POST https://control.noro.guru/api/notifications \
  -H "Authorization: Bearer noro_api_key_production_2025" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Teste",
    "message": "Mensagem de teste"
  }'
```

## 📊 Monitoramento

### Logs Importantes

```typescript
// Web: apps/web/app/api/lead/route.ts
console.log('Lead received:', { name, email, source });
console.log('Lead saved to CRM:', leadResponse);
console.error('Error saving lead:', error);

// Control: apps/control/app/api/leads/route.ts
console.log('New lead created:', leadId);
console.log('Existing lead updated:', leadId);
console.error('Error creating lead:', insertError);
```

### Métricas

Acompanhar via Supabase Dashboard:

```sql
-- Total de leads
SELECT COUNT(*) FROM leads;

-- Leads por status
SELECT status, COUNT(*) 
FROM leads 
GROUP BY status;

-- Leads por fonte
SELECT source, COUNT(*) 
FROM leads 
GROUP BY source;

-- Taxa de conversão
SELECT 
  COUNT(*) FILTER (WHERE status = 'converted') as converted,
  COUNT(*) as total,
  ROUND(COUNT(*) FILTER (WHERE status = 'converted')::numeric / COUNT(*) * 100, 2) as conversion_rate
FROM leads;

-- Leads por dia
SELECT 
  DATE(created_at) as date,
  COUNT(*) as leads
FROM leads
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## 🔒 Segurança

### Validações Implementadas

1. **Email**: Regex validação
2. **API Key**: Bearer token obrigatório
3. **CORS**: Origins controlados
4. **RLS**: Row Level Security no Supabase
5. **Rate Limiting**: TODO - implementar

### Recomendações

- [ ] Adicionar rate limiting (ex: 5 requisições/minuto por IP)
- [ ] Implementar captcha nos formulários
- [ ] Adicionar logs de auditoria
- [ ] Monitorar tentativas de abuso
- [ ] Rotacionar API keys periodicamente

## 📱 Componentes Frontend

### ContactModal

**Local**: `apps/web/components/ContactModal.tsx`

Modal reutilizável com formulário de 6 campos.

**Props**:
```typescript
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}
```

**Uso**:
```tsx
<ContactModal 
  isOpen={isModalOpen} 
  onClose={() => setIsModalOpen(false)} 
/>
```

### ContactForm

**Local**: `apps/web/components/ContactForm.tsx`

Formulário reutilizável para página dedicada.

**Uso**:
```tsx
<ContactForm />
```

## 🎨 Customização

### Templates de Email

Editar em: `apps/web/app/api/lead/route.ts`

```typescript
// Email para o lead
const confirmationHtml = `
  <div style="font-family: sans-serif;">
    <h1>Olá ${name}!</h1>
    <p>Recebemos seu contato...</p>
  </div>
`;

// Email para equipe
const notificationHtml = `
  <div>
    <h2>Novo Lead Capturado</h2>
    <p><strong>Nome:</strong> ${name}</p>
    ...
  </div>
`;
```

### Campos do Formulário

Adicionar novos campos em:
1. `ContactModal.tsx` - Interface do modal
2. `ContactForm.tsx` - Interface da página
3. `app/api/lead/route.ts` - Validação e processamento
4. `apps/control/app/api/leads/route.ts` - Salvamento
5. Migration SQL - Adicionar coluna na tabela

## 📚 Referências

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Resend Email API](https://resend.com/docs)
- [TypeScript](https://www.typescriptlang.org/)

## 🆘 Troubleshooting

### Lead não está sendo salvo

1. Verificar API key configurada
2. Verificar CORS no Control Plane
3. Verificar logs no console
4. Testar endpoint diretamente com curl
5. Verificar RLS policies no Supabase

### Email não está sendo enviado

1. Verificar RESEND_API_KEY configurada
2. Verificar domínio verificado no Resend
3. Verificar DNS (SPF, DKIM)
4. Verificar logs do Resend Dashboard
5. Testar com email pessoal primeiro

### Notificações não aparecem

1. Verificar usuários admin/owner existem
2. Verificar RLS policies da tabela notifications
3. Verificar query no frontend para buscar notificações
4. Testar criar notificação manualmente via SQL

---

**Última atualização**: 30/10/2024
**Versão**: 1.0.0
**Mantido por**: NORO Team
