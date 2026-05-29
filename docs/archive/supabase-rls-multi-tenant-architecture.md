# Arquitetura Multi-Tenant Supabase RLS

Status: historico.

Documento original: `docs/multi-tenant-architecture.md`

Este arquivo preserva a arquitetura antiga de multi-tenancy baseada em Supabase RLS.

A referencia vigente foi substituida por:

```txt
docs/architecture/multi-tenant-current-model.md
```

Consultar este historico apenas para entender a fase anterior do projeto.

---

# Conteudo Original

# 🏢 Arquitetura Multi-Tenant - Sistema NORO

**Data de análise:** 29 de outubro de 2025  
**Branch:** update3-subdominios

---

## 📊 **Visão Geral**

O sistema NORO implementa **multi-tenancy através de Row Level Security (RLS)** no Supabase, com duas camadas de dados:

### **Schema `cp` (Control Plane)**
- Gerenciamento de tenants, usuários, billing, API keys
- Tabela central: `cp.tenants`
- Vincula usuários a tenants: `cp.user_tenant_roles`

### **Schema `public` (Dados de Negócio)**
- Clientes, leads, pedidos, orçamentos, tarefas
- Todas tabelas `noro_*` têm coluna `tenant_id NOT NULL`
- RLS habilitado em **todas as tabelas**

---

## 🔐 **Como Funciona a Segurança**

### **1. Vinculação Usuário → Tenant**
```sql
-- Tabela: cp.user_tenant_roles
user_id (UUID) → auth.uid()
tenant_id (UUID) → cp.tenants.id
role (TEXT) → 'owner' | 'admin' | 'member' | 'readonly'
```

### **2. RLS Policies (Padrão em todas tabelas)**

**SELECT Policy:**
```sql
CREATE POLICY p_noro_clientes_select ON public.noro_clientes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM cp.user_tenant_roles utr
    WHERE utr.user_id = auth.uid() 
      AND utr.tenant_id = noro_clientes.tenant_id
  )
);
```

Este arquivo foi truncado no archive curado para evitar manter como guia operacional. O original completo esta no historico Git, se necessario.
