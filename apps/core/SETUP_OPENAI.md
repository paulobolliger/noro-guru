# Setup OpenAI Integration

Este guia explica como configurar a integração com OpenAI para geração de conteúdo.

## 1. Instalar Dependências

```bash
cd apps/core
npm install openai
```

## 2. Configurar Variáveis de Ambiente

Crie ou edite o arquivo `.env.local` na **raiz do projeto** (não em `/apps/core`):

```bash
# .env.local (na raiz: /home/user/noro-guru/.env.local)

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview

# Supabase (se ainda não configurado)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3004
```

**IMPORTANTE**: O arquivo `.env.local` deve estar na raiz do monorepo, não dentro de `/apps/core`.

## 3. Obter API Key da OpenAI

1. Acesse https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-proj-...`)
5. Cole no `.env.local` como valor de `OPENAI_API_KEY`

## 4. Modelos Disponíveis

Você pode usar diferentes modelos OpenAI. Configure em `OPENAI_MODEL`:

### GPT-4 Turbo (Recomendado)
```env
OPENAI_MODEL=gpt-4-turbo-preview
```
- **Custo**: $10/1M tokens (input), $30/1M tokens (output)
- **Contexto**: 128k tokens
- **Melhor para**: Conteúdo de alta qualidade

### GPT-4
```env
OPENAI_MODEL=gpt-4
```
- **Custo**: $30/1M tokens (input), $60/1M tokens (output)
- **Contexto**: 8k tokens
- **Melhor para**: Tarefas complexas

### GPT-3.5 Turbo (Mais Barato)
```env
OPENAI_MODEL=gpt-3.5-turbo
```
- **Custo**: $0.50/1M tokens (input), $1.50/1M tokens (output)
- **Contexto**: 16k tokens
- **Melhor para**: Testes e volumes altos

## 5. Custos Estimados

### Geração de Roteiros
- **Tokens médios**: ~3.000-4.000 tokens por roteiro
- **Custo com GPT-4 Turbo**: ~$0.10-0.15 por roteiro
- **Custo com GPT-3.5**: ~$0.003-0.005 por roteiro

### Geração de Artigos
- **Curto**: ~1.000 tokens → $0.03 (GPT-4 Turbo)
- **Médio**: ~2.000 tokens → $0.06 (GPT-4 Turbo)
- **Longo**: ~3.500 tokens → $0.11 (GPT-4 Turbo)

## 6. Testar a Integração

Após configurar, teste a geração:

```bash
# Iniciar servidor
cd apps/core
npm run dev
```

Acesse:
1. http://localhost:3004/geracao/roteiros
2. Digite alguns destinos (um por linha)
3. Clique em "Iniciar Geração"
4. Observe os logs em tempo real

## 7. Monitorar Custos

### No OpenAI Dashboard
1. Acesse https://platform.openai.com/usage
2. Visualize consumo em tempo real
3. Configure limites de gasto em Settings → Limits

### No Noro
1. Acesse `/custos/all` para ver custos consolidados
2. Acesse `/custos/roteiros` para custos de roteiros
3. Acesse `/custos/artigos` para custos de artigos

## 8. Tabelas do Banco de Dados

Certifique-se de que as seguintes tabelas existem no Supabase:

### `ai_costs`
```sql
CREATE TABLE ai_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  text_cost DECIMAL(10, 6) DEFAULT 0,
  image_cost DECIMAL(10, 6) DEFAULT 0,
  total_cost DECIMAL(10, 6) DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_ai_costs_tenant ON ai_costs(tenant_id);
CREATE INDEX idx_ai_costs_type ON ai_costs(type);
CREATE INDEX idx_ai_costs_created ON ai_costs(created_at);
```

### `roteiros`
```sql
CREATE TABLE roteiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL,
  destino TEXT,
  tipo TEXT,
  dificuldade TEXT,
  categoria TEXT,
  status TEXT DEFAULT 'draft',
  conteudo TEXT,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_roteiros_tenant ON roteiros(tenant_id);
CREATE INDEX idx_roteiros_status ON roteiros(status);
```

### `artigos`
```sql
CREATE TABLE artigos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  slug TEXT NOT NULL,
  categoria TEXT,
  tom TEXT,
  tamanho TEXT,
  status TEXT DEFAULT 'draft',
  conteudo TEXT,
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_artigos_tenant ON artigos(tenant_id);
CREATE INDEX idx_artigos_status ON artigos(status);
```

## 9. Troubleshooting

### Erro: "OpenAI API key not found"
- Verifique se `.env.local` está na **raiz do projeto**
- Verifique se a variável `OPENAI_API_KEY` está definida
- Reinicie o servidor após adicionar variáveis

### Erro: "Insufficient quota"
- Verifique saldo em https://platform.openai.com/account/billing
- Adicione créditos ou configure billing

### Erro: "Rate limit exceeded"
- Aguarde alguns segundos e tente novamente
- OpenAI tem limites de requisições por minuto
- Considere adicionar delay entre gerações em massa

### Conteúdo não está sendo salvo
- Verifique se as tabelas existem no Supabase
- Verifique os logs do console para erros de banco
- Ajuste nomes de tabelas se necessário

## 10. Próximos Passos

- [ ] Configurar rate limiting
- [ ] Adicionar retry automático
- [ ] Implementar cache de prompts
- [ ] Adicionar geração de imagens (DALL-E)
- [ ] Implementar fila de processamento

## 11. Segurança

⚠️ **NUNCA** commite o arquivo `.env.local` no git!

O arquivo já está no `.gitignore`, mas sempre verifique:

```bash
git status
# .env.local NÃO deve aparecer na lista
```

---

## Suporte

Para dúvidas sobre a API OpenAI:
- Documentação: https://platform.openai.com/docs
- Community: https://community.openai.com
- Status: https://status.openai.com
