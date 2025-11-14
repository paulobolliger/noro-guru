# APIs do Noro Core

Documentação das APIs REST implementadas no sistema.

## 📊 APIs de Análise de Custos

### GET `/api/admin/costs/all`

Retorna análise consolidada de todos os custos de IA.

**Query Parameters:**
- `period` (opcional): `7d` | `30d` | `90d` | `365d` | `all` (padrão: `30d`)

**Response:**
```json
{
  "metrics": {
    "totalCost": 45.67,
    "totalItems": 120,
    "totalTextCost": 38.50,
    "totalImageCost": 7.17,
    "avgCostPerItem": 0.38
  },
  "byType": {
    "site_roteiro": {
      "count": 50,
      "text_cost": 20.00,
      "image_cost": 5.00,
      "total_cost": 25.00
    },
    "bulk_roteiro": { ... },
    "bulk_artigo": { ... }
  },
  "dailyChart": [
    {
      "date": "2025-01-01",
      "total_cost": 5.67,
      "count": 15
    }
  ]
}
```

---

### GET `/api/admin/costs/roteiros`

Retorna análise de custos específica de roteiros.

**Query Parameters:**
- `period` (opcional): `7d` | `30d` | `90d` | `365d` | `all` (padrão: `30d`)

**Response:**
```json
{
  "metrics": {
    "totalCost": 30.00,
    "totalItems": 75,
    "totalTextCost": 25.00,
    "totalImageCost": 5.00,
    "avgCostPerItem": 0.40
  },
  "bySource": {
    "Site": { ... },
    "Bulk Generation": { ... }
  },
  "dailyChart": [ ... ]
}
```

---

### GET `/api/admin/costs/artigos`

Retorna análise de custos específica de artigos.

**Query Parameters:**
- `period` (opcional): `7d` | `30d` | `90d` | `365d` | `all` (padrão: `30d`)

**Response:**
```json
{
  "metrics": { ... },
  "dailyChart": [ ... ],
  "items": [
    {
      "id": "uuid",
      "title": "Título do artigo",
      "created_at": "2025-01-01T10:00:00Z",
      "text_cost": 0.05,
      "image_cost": 0.00,
      "total_cost": 0.05
    }
  ]
}
```

---

## 🤖 APIs de Geração em Massa

### POST `/api/admin/bulk-generate-roteiros`

Gera roteiros em massa usando IA. Retorna logs em tempo real via Server-Sent Events (SSE).

**Request Body:**
```json
{
  "destinos": [
    "Paris, França",
    "Tóquio, Japão",
    "Nova York, EUA"
  ],
  "options": {
    "tipo": "Cultural",
    "dificuldade": "Fácil",
    "categoria": "Roteiro Completo"
  }
}
```

**Response:** Stream SSE
```
data: {"message":"🚀 Iniciando geração de 3 roteiros..."}

data: {"message":"📍 [1/3] Processando: Paris, França"}

data: {"message":"✅ Paris, França gerado com sucesso! (ID: a1b2c3d4)"}

data: {"message":"[DONE]"}
```

**Campos salvos na tabela `roteiros`:**
- `tenant_id`, `titulo`, `slug`, `destino`
- `tipo`, `dificuldade`, `categoria`
- `status` (sempre `draft`)
- `conteudo` (HTML gerado pela IA)
- `created_by`, `created_at`

**Custos registrados na tabela `ai_costs`:**
- `type`: `bulk_roteiro`
- `text_cost`, `image_cost`, `total_cost`

---

### POST `/api/admin/bulk-generate-artigos`

Gera artigos em massa usando IA. Retorna logs em tempo real via SSE.

**Request Body:**
```json
{
  "topicos": [
    "10 Dicas para Viajar Sozinho",
    "Como Planejar uma Viagem Sustentável"
  ],
  "options": {
    "categoria": "Dicas de Viagem",
    "tom": "Inspirador",
    "tamanho": "Médio"
  }
}
```

**Response:** Stream SSE (mesmo formato que roteiros)

**Campos salvos na tabela `artigos`:**
- `tenant_id`, `titulo`, `slug`
- `categoria`, `tom`, `tamanho`
- `status` (sempre `draft`)
- `conteudo` (HTML gerado pela IA)
- `tags`, `created_by`, `created_at`

**Custos registrados na tabela `ai_costs`:**
- `type`: `bulk_artigo`
- Custo varia por tamanho:
  - Curto: $0.03
  - Médio: $0.05
  - Longo: $0.08

---

## 🌐 APIs de Redes Sociais

### GET `/api/admin/social/config`

Retorna configurações de redes sociais do tenant.

**Response:**
```json
{
  "success": true,
  "configs": [
    {
      "id": "uuid",
      "tenant_id": "uuid",
      "provider": "upload-post",
      "active_provider": "upload-post",
      "status": "connected",
      "credentials": { ... },
      "created_at": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

### POST `/api/admin/social/config`

Cria ou atualiza configuração de rede social.

**Request Body:**
```json
{
  "provider": "upload-post",
  "credentials": {
    "api_key": "xxx",
    "secret": "yyy"
  }
}
```

**Response:**
```json
{
  "success": true,
  "config": { ... }
}
```

---

## 🔒 Autenticação

Todas as APIs requerem autenticação via Supabase. O token de autenticação deve ser incluído automaticamente pelo SDK do Supabase no lado do cliente.

**Headers automáticos:**
```
Authorization: Bearer <supabase_jwt_token>
```

---

## 🗄️ Tabelas do Banco de Dados

### Tabela `ai_costs`
```sql
CREATE TABLE ai_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'site_roteiro', 'bulk_roteiro', 'bulk_artigo'
  title TEXT,
  text_cost DECIMAL(10, 4) DEFAULT 0,
  image_cost DECIMAL(10, 4) DEFAULT 0,
  total_cost DECIMAL(10, 4) DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Tabela `roteiros`
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
```

### Tabela `artigos`
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
```

---

## ⚠️ Notas Importantes

1. **Implementação de IA**: As APIs de geração em massa contêm código simulado. Você precisa:
   - Integrar com OpenAI, Anthropic Claude, ou outro provedor de IA
   - Implementar prompts adequados para gerar conteúdo de qualidade
   - Calcular custos reais baseados no uso de tokens

2. **Nomes de Tabelas**: Ajuste os nomes das tabelas (`roteiros`, `artigos`, `ai_costs`) conforme seu schema do Supabase.

3. **Validação**: Adicione validação mais robusta nos endpoints conforme necessário.

4. **Rate Limiting**: Considere adicionar rate limiting para as APIs de geração em massa.

5. **Error Handling**: Os erros são logados no console. Considere usar um serviço de logging como Sentry em produção.

---

## 🧪 Testando as APIs

### Teste via curl:

```bash
# Custos totais
curl -X GET "http://localhost:3004/api/admin/costs/all?period=30d" \
  -H "Authorization: Bearer $TOKEN"

# Geração em massa de roteiros
curl -X POST "http://localhost:3004/api/admin/bulk-generate-roteiros" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "destinos": ["Paris", "Londres"],
    "options": {"tipo": "Cultural"}
  }'
```

### Teste via JavaScript (no navegador):

```javascript
// Custos
const response = await fetch('/api/admin/costs/all?period=30d');
const data = await response.json();
console.log(data);

// Geração com SSE
const response = await fetch('/api/admin/bulk-generate-roteiros', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destinos: ['Paris', 'Londres'],
    options: { tipo: 'Cultural' }
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const text = decoder.decode(value);
  console.log(text);
}
```

---

## 📝 TODO

- [ ] Implementar integração real com IA (OpenAI/Claude)
- [ ] Adicionar rate limiting
- [ ] Implementar cache para APIs de custos
- [ ] Adicionar testes unitários e de integração
- [ ] Implementar webhooks para notificações
- [ ] Adicionar suporte a retry automático em caso de falha
