# 🚀 Deployment Guide - Sistema de Leads NORO

## Quick Start (5 minutos)

### 1️⃣ Supabase Migration

**Via Dashboard** (Recomendado):
```sql
-- Copiar e colar no SQL Editor do Supabase Dashboard
-- Arquivo: supabase/migrations/20251030000000_leads_notifications.sql
```

**Via CLI**:
```bash
cd c:\1-Projetos-Sites\GitHub\noro-guru\supabase
npx supabase db push
```

### 2️⃣ Resend Setup

1. Acessar: https://resend.com/emails
2. Add Domain: `noro.guru`
3. Configurar DNS:
   ```
   TXT  _resend  [valor fornecido]
   ```
4. Copiar API Key

### 3️⃣ Control Plane (.env.local)

```bash
cd c:\1-Projetos-Sites\GitHub\noro-guru\apps\control

# Criar .env.local
cp .env.local.example .env.local
```

Editar `.env.local`:
```env
# Supabase (copiar do dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# API Key (IMPORTANTE: usar a mesma no Web)
CONTROL_PLANE_API_KEY=noro_api_key_production_2025

# Resend (da etapa 2)
RESEND_API_KEY=re_[your-key]

# CORS (adicionar domínio de prod quando tiver)
ALLOWED_ORIGINS=https://noro.guru,https://www.noro.guru,http://localhost:3000
```

### 4️⃣ Web (.env.local)

Já está configurado! Verificar:
```env
CONTROL_PLANE_URL=https://control.noro.guru
CONTROL_PLANE_API_KEY=noro_api_key_production_2025
NEXT_PUBLIC_APP_URL=https://noro.guru
```

### 5️⃣ Testar Localmente

**Terminal 1 - Control Plane**:
```powershell
cd c:\1-Projetos-Sites\GitHub\noro-guru\apps\control
npm run dev
```

**Terminal 2 - Web**:
```powershell
cd c:\1-Projetos-Sites\GitHub\noro-guru\apps\web
npm run dev
```

**Teste**:
1. Abrir: http://localhost:3000
2. Clicar: "Fale Conosco"
3. Preencher formulário
4. Verificar console de ambos servidores

### 6️⃣ Verificar no Supabase

```sql
-- Deve retornar seu lead
SELECT * FROM leads ORDER BY created_at DESC LIMIT 5;

-- Deve retornar notificações
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 5;
```

---

## 🔍 Troubleshooting Rápido

### ❌ "Unauthorized - Invalid API key"
- Verificar se API key é idêntica em ambos .env.local
- Não usar aspas nos valores do .env

### ❌ "Error connecting to Supabase"
- Verificar URLs do Supabase
- Verificar Service Role Key (não Anon Key)

### ❌ "Erro ao enviar email"
- Verificar RESEND_API_KEY
- Confirmar domínio verificado no Resend
- Testar com email pessoal primeiro

### ❌ Lead não aparece no banco
- Verificar migration aplicada
- Verificar RLS policies
- Ver logs do servidor Control

### ❌ CORS error
- Adicionar origem em ALLOWED_ORIGINS
- Reiniciar servidor após mudar .env

---

## 📦 Deploy em Produção

### Vercel (Web)

```bash
cd apps/web
vercel --prod

# Configurar Environment Variables no dashboard:
# - CONTROL_PLANE_URL
# - CONTROL_PLANE_API_KEY
# - NEXT_PUBLIC_APP_URL
```

### Vercel/Fly.io (Control Plane)

```bash
cd apps/control
vercel --prod
# ou
fly deploy

# Environment Variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - CONTROL_PLANE_API_KEY
# - RESEND_API_KEY
# - ALLOWED_ORIGINS
```

### Atualizar URLs

Após deploy, atualizar:
```env
# Web
CONTROL_PLANE_URL=https://control.noro.guru

# Control
ALLOWED_ORIGINS=https://noro.guru,https://www.noro.guru
```

---

## ✅ Checklist Final

Antes de marcar como concluído:

- [ ] Migration aplicada no Supabase
- [ ] Domínio verificado no Resend
- [ ] DNS configurado
- [ ] .env.local configurado (Control)
- [ ] .env.local verificado (Web)
- [ ] Teste local realizado
- [ ] Lead apareceu no banco
- [ ] Email de confirmação recebido
- [ ] Notificação criada
- [ ] Deploy em produção (se aplicável)
- [ ] Teste em produção (se aplicável)

---

## 🆘 Comandos Úteis

### Ver logs em tempo real (Supabase)
```sql
-- Últimos leads
SELECT 
  name, 
  email, 
  source, 
  status, 
  created_at 
FROM leads 
ORDER BY created_at DESC 
LIMIT 10;

-- Leads por status
SELECT status, COUNT(*) 
FROM leads 
GROUP BY status;

-- Notificações não lidas
SELECT 
  title, 
  message, 
  created_at 
FROM notifications 
WHERE read = false 
ORDER BY created_at DESC;
```

### Resetar para testar novamente
```sql
-- CUIDADO: Só usar em desenvolvimento!
DELETE FROM notifications WHERE title LIKE '%Teste%';
DELETE FROM leads WHERE email LIKE '%teste%';
```

### Testar endpoints via PowerShell
```powershell
# Ver no CHECKLIST.md seção "Passo 3"
```

---

**Tempo estimado**: 5-10 minutos
**Dificuldade**: ⭐⭐☆☆☆ (Fácil/Médio)

Qualquer problema, verificar logs e documentação completa em `docs/lead-capture-system.md`
