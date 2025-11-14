# Migrations Desabilitadas

## 20251030_financeiro_rls_dev.sql.DISABLED

**Data de Desabilitação:** 2025-11-14
**Razão:** Vulnerabilidade Crítica de Segurança Multi-Tenant

### Problema

Esta migration criava políticas RLS que permitiam acesso IRRESTRITO a dados financeiros:

```sql
CREATE POLICY "Allow all SELECT on fin_receitas for development"
ON public.fin_receitas
FOR SELECT
TO authenticated, anon  -- ⚠️ Permite acesso anônimo!
USING (true);  -- ⚠️ SEM FILTROS!
```

### Impacto

- Qualquer usuário autenticado (ou anônimo) poderia acessar dados financeiros de TODOS os tenants
- Vazamento completo de dados entre agências
- Violação de LGPD/GDPR

### Solução

As políticas RLS corretas já existem em:
- `20251030_financeiro_schema.sql` - Políticas baseadas em tenant_id
- `20251027094215_multi-tenant-stage1.sql` - RLS com isolamento por tenant

### Quando Reativar

**NUNCA** em produção. Se necessário em desenvolvimento local:
1. Usar em ambiente isolado
2. Documentar claramente que é DEV-ONLY
3. Adicionar guards de ambiente (`WHERE current_database() = 'development'`)
