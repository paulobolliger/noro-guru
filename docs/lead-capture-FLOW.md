# 🎯 Fluxo de Dados - Sistema de Leads

## Diagrama de Sequência

```
┌──────────────┐        ┌────────────┐        ┌─────────────────┐        ┌──────────────┐
│   Usuário    │        │ Web (NORO) │        │  Control Plane  │        │   Supabase   │
│  no Browser  │        │ noro.guru  │        │ control.noro.guru│        │   Database   │
└──────┬───────┘        └─────┬──────┘        └────────┬────────┘        └──────┬───────┘
       │                      │                         │                        │
       │  1. Clica "Fale      │                         │                        │
       │     Conosco"         │                         │                        │
       │─────────────────────>│                         │                        │
       │                      │                         │                        │
       │  2. Abre Modal       │                         │                        │
       │<─────────────────────│                         │                        │
       │                      │                         │                        │
       │  3. Preenche e       │                         │                        │
       │     Envia Form       │                         │                        │
       │─────────────────────>│                         │                        │
       │                      │                         │                        │
       │                      │  4. POST /api/lead      │                        │
       │                      │     {name, email, ...}  │                        │
       │                      │                         │                        │
       │                      │  5. POST /api/leads     │                        │
       │                      │     Bearer Token        │                        │
       │                      │────────────────────────>│                        │
       │                      │                         │                        │
       │                      │                         │  6. INSERT/UPDATE      │
       │                      │                         │     leads              │
       │                      │                         │───────────────────────>│
       │                      │                         │                        │
       │                      │                         │  7. Lead salvo ✓       │
       │                      │                         │<───────────────────────│
       │                      │                         │                        │
       │                      │  8. {leadId, success}   │                        │
       │                      │<────────────────────────│                        │
       │                      │                         │                        │
       │                      │  9. POST /api/email/send│                        │
       │                      │     (confirmação)       │                        │
       │                      │────────────────────────>│                        │
       │                      │                         │                        │
       │                      │                         │  10. Resend.send()     │
       │                      │                         │───────> 📧 Resend API  │
       │                      │                         │                        │
       │                      │ 11. Email enviado ✓     │                        │
       │                      │<────────────────────────│                        │
       │                      │                         │                        │
       │                      │ 12. POST /api/notifications                      │
       │                      │     (equipe vendas)     │                        │
       │                      │────────────────────────>│                        │
       │                      │                         │                        │
       │                      │                         │  13. INSERT            │
       │                      │                         │      notifications     │
       │                      │                         │───────────────────────>│
       │                      │                         │                        │
       │                      │                         │  14. Notif. criadas ✓  │
       │                      │                         │<───────────────────────│
       │                      │                         │                        │
       │                      │ 15. {success: true}     │                        │
       │                      │<────────────────────────│                        │
       │                      │                         │                        │
       │  16. "Obrigado!"     │                         │                        │
       │      (sucesso)       │                         │                        │
       │<─────────────────────│                         │                        │
       │                      │                         │                        │
```

## Estados e Validações

### 1️⃣ Frontend (Web)

```typescript
// Estado do formulário
interface FormState {
  name: string        // required
  email: string       // required, validação regex
  phone?: string      // optional
  company?: string    // optional
  interest?: string   // optional (dropdown)
  message?: string    // optional
}

// Validação no submit
✅ Email válido (regex)
✅ Nome e email preenchidos
✅ Feedback visual de loading
✅ Mensagens de erro/sucesso
```

### 2️⃣ API Web (/api/lead)

```typescript
// Validações
✅ Email regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
✅ Campos obrigatórios: name, email
✅ Try-catch para cada chamada
✅ Continua mesmo se Control Plane falhar

// Respostas
200 ✓ - Lead capturado com sucesso
400 ✗ - Dados inválidos
500 ✗ - Erro interno
```

### 3️⃣ API Control (/api/leads)

```typescript
// Autenticação
✅ Bearer Token obrigatório
✅ Header: Authorization: Bearer [key]
✅ Validação contra CONTROL_PLANE_API_KEY

// Lógica de duplicatas
if (lead exists by email) {
  ↪ UPDATE (mantém histórico)
  ↪ Atualiza last_contact_at
} else {
  ↪ INSERT novo lead
  ↪ Status: 'new'
}

// Respostas
200 ✓ - Lead salvo
401 ✗ - Unauthorized
400 ✗ - Dados inválidos
500 ✗ - Erro no banco
```

### 4️⃣ Database (Supabase)

```sql
-- RLS Policies aplicadas
✅ Admins podem ver todos leads
✅ Service role (API) tem acesso total
✅ Usuários normais não veem leads

-- Índices otimizados
✅ idx_leads_email (busca rápida)
✅ idx_leads_status (filtros)
✅ idx_leads_created_at (ordenação)

-- Triggers
✅ updated_at automático
```

## Resiliência e Fallbacks

### Cenário 1: Control Plane offline

```
Web (/api/lead)
  ├─ Try: Salvar no Control
  │  └─ ERRO: Connection refused
  │
  └─ Catch: Log error
     └─ Retorna sucesso parcial
        └─ "Obrigado! Entraremos em contato"
```

**Resultado**: Usuário vê sucesso, mas lead não salvo
**Solução**: Monitorar logs, implementar retry ou queue

### Cenário 2: Email falha

```
Web (/api/lead)
  ├─ ✓ Lead salvo no banco
  │
  ├─ Try: Enviar email
  │  └─ ERRO: Resend API error
  │
  └─ Catch: Log error
     └─ Continua (não bloqueia)
        └─ Notificação ainda é criada
```

**Resultado**: Lead salvo, sem email de confirmação
**Solução**: Revisar leads no CRM manualmente

### Cenário 3: Notificação falha

```
Web (/api/lead)
  ├─ ✓ Lead salvo
  ├─ ✓ Email enviado
  │
  ├─ Try: Criar notificação
  │  └─ ERRO: Nenhum admin encontrado
  │
  └─ Catch: Log error
     └─ Retorna sucesso
```

**Resultado**: Lead capturado, sem notificação interna
**Solução**: Revisar leads diariamente no dashboard

## Performance e Escalabilidade

### Métricas Esperadas

```
┌─────────────────────────┬──────────────┬───────────────┐
│ Operação                │ Tempo Médio  │ Timeout       │
├─────────────────────────┼──────────────┼───────────────┤
│ Submit form (frontend)  │ 50-100ms     │ -             │
│ POST /api/lead          │ 1-2s         │ 10s           │
│ POST /api/leads         │ 200-500ms    │ 5s            │
│ INSERT lead (DB)        │ 50-100ms     │ -             │
│ POST /api/email/send    │ 500ms-1s     │ 5s            │
│ POST /api/notifications │ 200-400ms    │ 5s            │
│ TOTAL (end-to-end)      │ 2-4s         │ 10s           │
└─────────────────────────┴──────────────┴───────────────┘
```

### Capacidade

```
📊 Leads/dia:      ~1000 (sem otimização)
📊 Leads/segundo:  ~10 (com rate limit)
📊 DB Queries:     ~3 por lead capturado
📊 Emails/dia:     ~2000 (Resend free tier: 3k/mês)
```

### Bottlenecks Potenciais

1. **Resend API**: 3.000 emails/mês (free tier)
   - Solução: Upgrade para pago ou AWS SES

2. **Supabase**: 500MB storage (free tier)
   - Solução: Limpar leads antigos ou upgrade

3. **Duplicatas**: Check por email é sequencial
   - Solução: Índice único em email (já criado)

4. **CORS Preflight**: Cada request tem OPTIONS
   - Solução: Cache de preflight (86400s configurado)

## Monitoramento Recomendado

### Logs Críticos

```typescript
// Web
console.log('Lead submission:', { email, timestamp })
console.error('Control Plane error:', error)

// Control
console.log('Lead created:', { leadId, email })
console.error('Email send failed:', error)
console.warn('No admin users for notification')
```

### Alertas Sugeridos

```
🚨 High Priority:
  - Control Plane down > 5min
  - Email send failure rate > 10%
  - Database connection errors

⚠️ Medium Priority:
  - Leads/day > 1000 (capacity)
  - Duplicate emails > 50%
  - Response time > 5s

ℹ️ Low Priority:
  - New lead captured
  - Email sent
  - Notification created
```

### Queries de Saúde

```sql
-- Leads nas últimas 24h
SELECT COUNT(*) FROM leads 
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Taxa de duplicatas hoje
SELECT 
  COUNT(DISTINCT email) as unique_emails,
  COUNT(*) as total_leads,
  ROUND((COUNT(*) - COUNT(DISTINCT email))::numeric / COUNT(*) * 100, 2) as duplicate_rate
FROM leads 
WHERE created_at::date = CURRENT_DATE;

-- Leads sem notificação
SELECT l.* FROM leads l
LEFT JOIN notifications n ON n.metadata->>'leadId' = l.id::text
WHERE n.id IS NULL
AND l.created_at > NOW() - INTERVAL '1 day';
```

---

## 🎓 Conceitos Técnicos

### CORS (Cross-Origin Resource Sharing)

```
┌─────────────────┐                    ┌──────────────────┐
│   noro.guru     │                    │ control.noro.guru │
│   (Origin A)    │                    │   (Origin B)      │
└────────┬────────┘                    └─────────┬────────┘
         │                                       │
         │  1. OPTIONS (preflight)               │
         │  Origin: https://noro.guru           │
         │──────────────────────────────────────>│
         │                                       │
         │  2. Headers:                          │
         │     Access-Control-Allow-Origin: *    │
         │     Access-Control-Allow-Methods: POST│
         │<──────────────────────────────────────│
         │                                       │
         │  3. POST /api/leads                   │
         │──────────────────────────────────────>│
         │                                       │
         │  4. Response + CORS headers           │
         │<──────────────────────────────────────│
         │                                       │
```

### Bearer Token Authentication

```
┌──────────────────────────────────────────────────────┐
│ Request Headers:                                     │
│                                                      │
│ Authorization: Bearer noro_api_key_production_2025  │
│                      └────────────┬────────────┘    │
│                                   │                  │
│                        Token extraído e validado    │
│                        contra .env                   │
└──────────────────────────────────────────────────────┘

✅ Token válido    → 200 OK
❌ Token inválido  → 401 Unauthorized
❌ Sem token       → 401 Unauthorized
```

### Row Level Security (RLS)

```sql
-- Policy 1: Admins veem tudo
CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  USING (
    user_role IN ('admin', 'owner')
  );

-- Policy 2: Service role (API) acesso total
CREATE POLICY "Service role full access"
  ON leads FOR ALL
  USING (
    jwt_role = 'service_role'
  );

┌──────────────┬─────────────┬────────────────┐
│ User Type    │ Can Read?   │ Can Write?     │
├──────────────┼─────────────┼────────────────┤
│ Anonymous    │ ❌ No       │ ❌ No          │
│ Regular User │ ❌ No       │ ❌ No          │
│ Admin        │ ✅ Yes      │ ✅ Yes         │
│ Service Role │ ✅ Yes      │ ✅ Yes         │
└──────────────┴─────────────┴────────────────┘
```

---

**Documentação completa**: `docs/lead-capture-system.md`
**Guia de deployment**: `DEPLOYMENT-LEADS.md`
**Checklist**: `docs/lead-capture-CHECKLIST.md`
