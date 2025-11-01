# 🏗️ Estratégia de Escalabilidade - Módulo Financeiro NORO

## 📋 Decisão Arquitetural: **Mesmo BD (por enquanto)**

### ✅ Justificativa
- Volume inicial será baixo (< 100k transações/mês)
- RLS do Supabase já separa dados por tenant
- Simplicidade operacional e de desenvolvimento
- Custo otimizado

---

## 📊 Estimativa de Volume por Fase

### **Fase 1: MVP (0-6 meses)**
- **Tenants ativos**: 5-10
- **Transações/mês**: ~10k-50k
- **Tamanho BD**: ~500MB
- **Conexões simultâneas**: < 20
- **Status**: ✅ MESMO BD - Sem problemas

### **Fase 2: Crescimento (6-18 meses)**
- **Tenants ativos**: 50-100
- **Transações/mês**: ~200k-500k
- **Tamanho BD**: ~5-10GB
- **Conexões simultâneas**: 30-50
- **Status**: ⚠️ MONITORAR - Índices compostos críticos

### **Fase 3: Escala (18+ meses)**
- **Tenants ativos**: 100+
- **Transações/mês**: > 1M
- **Tamanho BD**: > 50GB
- **Conexões simultâneas**: > 60
- **Status**: 🚨 SEPARAR BD ou PARTICIONAR

---

## 🎯 Métricas de Monitoramento

### 🟢 **Indicadores Saudáveis (Ficar no mesmo BD)**
```sql
-- Latência de queries < 200ms
EXPLAIN ANALYZE 
SELECT * FROM fin_receitas 
WHERE tenant_id = 'xxx' AND status = 'pendente';

-- Índice hit rate > 99%
SELECT 
  schemaname,
  tablename,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND tablename LIKE 'fin_%';

-- Tamanho total das tabelas financeiras
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'fin_%'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 🔴 **Alertas Críticos (Hora de separar)**
- ❌ Queries financeiras > 500ms consistentemente
- ❌ Pool de conexões > 80% de uso
- ❌ Lock timeouts frequentes
- ❌ Tabelas financeiras > 50GB
- ❌ Dashboard demorando > 2s para carregar

---

## 🛠️ Otimizações Implementadas

### ✅ **Já Feito na Migration**
1. **Índices Simples**: tenant_id, marca, status, datas
2. **Índices Compostos**: (tenant_id, status), (tenant_id, data_competencia)
3. **Índices Parciais**: Só para registros pendentes/atrasados (economiza espaço)
4. **Campos Computed**: `valor_brl` calculado automaticamente (evita JOIN)
5. **Triggers Otimizados**: Atualização de saldo em tempo real

### 🚀 **Próximas Otimizações (Quando Necessário)**

#### **Nível 1: Query Optimization (Fase 2)**
```sql
-- Materialized View para Dashboard (atualizada a cada 15min)
CREATE MATERIALIZED VIEW mv_fin_dashboard_kpis AS
SELECT 
  tenant_id,
  marca,
  DATE_TRUNC('month', data_competencia) as mes,
  SUM(CASE WHEN status = 'pago' THEN valor_brl ELSE 0 END) as receita_mensal,
  COUNT(CASE WHEN recorrente = true THEN 1 END) as clientes_recorrentes
FROM fin_receitas
GROUP BY 1, 2, 3;

CREATE UNIQUE INDEX ON mv_fin_dashboard_kpis (tenant_id, marca, mes);

-- Refresh automático via cron job
-- pg_cron: SELECT cron.schedule('refresh-kpis', '*/15 * * * *', 
--   'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_fin_dashboard_kpis');
```

#### **Nível 2: Particionamento por Data (Fase 3)**
```sql
-- Converter tabelas em particionadas (REQUER DOWNTIME)
ALTER TABLE fin_receitas RENAME TO fin_receitas_old;

CREATE TABLE fin_receitas (
  -- mesmo schema...
) PARTITION BY RANGE (data_competencia);

-- Criar partições mensais
CREATE TABLE fin_receitas_2025_01 PARTITION OF fin_receitas
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE fin_receitas_2025_02 PARTITION OF fin_receitas
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Migrar dados
INSERT INTO fin_receitas SELECT * FROM fin_receitas_old;

-- Script de manutenção: criar partição do próximo mês
CREATE OR REPLACE FUNCTION criar_particao_mes_seguinte()
RETURNS void AS $$
DECLARE
  proximo_mes date := DATE_TRUNC('month', NOW() + INTERVAL '1 month');
  mes_seguinte date := proximo_mes + INTERVAL '1 month';
  nome_particao text := 'fin_receitas_' || TO_CHAR(proximo_mes, 'YYYY_MM');
BEGIN
  EXECUTE format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF fin_receitas 
     FOR VALUES FROM (%L) TO (%L)',
    nome_particao, proximo_mes, mes_seguinte
  );
END;
$$ LANGUAGE plpgsql;
```

#### **Nível 3: Archiving de Dados Antigos**
```sql
-- Mover dados > 2 anos para tabela de arquivo
CREATE TABLE fin_receitas_archive (LIKE fin_receitas INCLUDING ALL);

INSERT INTO fin_receitas_archive 
SELECT * FROM fin_receitas 
WHERE data_competencia < NOW() - INTERVAL '2 years';

DELETE FROM fin_receitas 
WHERE data_competencia < NOW() - INTERVAL '2 years';
```

---

## 🔄 Estratégia de Migração para BD Separado

### **Quando decidir separar?**
Se **3 ou mais** dessas condições forem verdadeiras:
- [ ] Volume > 1M transações/mês
- [ ] Latência > 500ms em queries financeiras
- [ ] Tabelas financeiras > 50GB
- [ ] Precisa de SLA diferente (99.99% uptime)
- [ ] Regulatório exige isolamento físico

### **Plano de Migração (Zero Downtime)**

#### **Passo 1: Criar novo projeto Supabase**
```bash
# Novo projeto: noro-financeiro
SUPABASE_FINANCEIRO_URL=https://xxx.supabase.co
SUPABASE_FINANCEIRO_KEY=xxx
```

#### **Passo 2: Replicação Dual-Write**
```typescript
// Escrever nos 2 BDs simultaneamente (transitório)
async function criarReceita(data: FinReceitaInsert) {
  const [resultPrincipal, resultFinanceiro] = await Promise.all([
    supabasePrincipal.from('fin_receitas').insert(data),
    supabaseFinanceiro.from('fin_receitas').insert(data)
  ]);
  
  // Validar consistência
  if (resultPrincipal.error || resultFinanceiro.error) {
    // Rollback ou retry
  }
}
```

#### **Passo 3: Migração de Dados Históricos**
```bash
# Dump apenas tabelas financeiras
pg_dump $SUPABASE_PRINCIPAL_URL \
  -t fin_* \
  --data-only \
  --file=financeiro_data.sql

# Restore no novo BD
psql $SUPABASE_FINANCEIRO_URL < financeiro_data.sql
```

#### **Passo 4: Cutover**
```typescript
// Feature flag para direcionar 100% para novo BD
if (FINANCEIRO_NEW_DB_ENABLED) {
  return supabaseFinanceiro.from('fin_receitas')...
} else {
  return supabasePrincipal.from('fin_receitas')...
}
```

---

## 💰 Análise de Custo

### **Cenário 1: Mesmo BD (Atual)**
- **Supabase Pro**: $25/mês
- **Aumento de storage**: ~$0.10/GB/mês
- **Custo estimado Fase 2**: $30-40/mês
- **Custo estimado Fase 3**: $50-80/mês

### **Cenário 2: BD Separado**
- **Supabase Principal**: $25/mês
- **Supabase Financeiro**: $25/mês
- **Custo total**: $50/mês + storage
- **Break-even**: Só vale a pena se performance for crítica

### **Recomendação**: Ficar no mesmo BD até Fase 3, economizando ~$300-600/ano

---

## 🎯 Conclusão e Próximos Passos

### ✅ **Decisão Final: INICIAR NO MESMO BD**

**Ações Imediatas:**
1. ✅ Rodar migration com índices otimizados
2. ⏳ Configurar dashboard de monitoramento (pg_stat_statements)
3. ⏳ Definir alertas de performance no Supabase
4. ⏳ Documentar thresholds de migração

**Revisão Futura:**
- 📅 **3 meses**: Analisar volume e performance
- 📅 **6 meses**: Avaliar se índices estão sendo usados
- 📅 **12 meses**: Decidir sobre particionamento
- 📅 **18 meses**: Reavaliar necessidade de BD separado

---

## 📞 Quando Pedir Ajuda?

Se qualquer desses cenários acontecer:
- 🚨 Dashboard demorando > 3 segundos
- 🚨 Timeouts em transações financeiras
- 🚨 Relatórios de BI travando
- 🚨 Clientes reclamando de lentidão

**Ação**: Contratar consultoria especializada em PostgreSQL/Supabase para otimização avançada.
