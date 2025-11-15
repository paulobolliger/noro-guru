# GUIA DE CONFIGURAÇÃO MULTI-TENANT

## Arquitetura Atual

```
apps/
├── control/     → Control Plane (gestão de tenants)
├── core/        → Aplicação base (template do tenant)
```

## Como Funciona o Roteamento Multi-Tenant

### Cenário 1: Acesso ao Control Plane
- URL: `control.noro.guru` ou `noro.guru/control`
- App: `/apps/control`
- Função: Gerenciar tenants, criar novos, configurar, etc.

### Cenário 2: Acesso ao Tenant
- URL: `abc.noro.guru`
- App: `/apps/core` com contexto do tenant "abc"
- Função: Aplicação do cliente ABC

## Opções de Implementação

### ⚠️ IMPORTANTE: Escolha UMA das opções abaixo

---

## OPÇÃO 1: Vercel com Domínios Customizados (Recomendado para Produção)

### Vantagens
- ✅ Melhor performance
- ✅ Isolamento total
- ✅ SSL automático
- ✅ Edge caching

### Como Configurar

1. **Deploy separado para cada aplicação:**
   ```bash
   # Deploy do Control Plane
   cd apps/control
   vercel --prod

   # Deploy do Core (template)
   cd apps/core
   vercel --prod
   ```

2. **Configurar domínios na Vercel:**
   - Control Plane: `control.noro.guru` → projeto `noro-control`
   - Core (wildcard): `*.noro.guru` → projeto `noro-core`

3. **DNS na Cloudflare/Route53:**
   ```
   control.noro.guru  → CNAME para vercel
   *.noro.guru        → CNAME para vercel (core)
   ```

4. **Middleware no Core** (já vou criar abaixo)

---

## OPÇÃO 2: Middleware com Rewrite (Desenvolvimento Local)

### Vantagens
- ✅ Funciona localmente
- ✅ Um único deploy
- ✅ Mais simples para testar

### Desvantagens
- ❌ Menos performático
- ❌ Complicado em produção

### Como Configurar

1. **Executar ambos os apps:**
   ```bash
   # Terminal 1 - Control Plane
   cd apps/control
   npm run dev # porta 3000

   # Terminal 2 - Core
   cd apps/core
   npm run dev -- -p 3001
   ```

2. **Proxy reverso (Nginx/Caddy):**
   ```nginx
   # Se hostname = control.noro.guru
   → proxy para localhost:3000

   # Se hostname = *.noro.guru (qualquer subdomínio)
   → proxy para localhost:3001
   ```

3. **Ou usar Vercel Dev com Wildcard:**
   ```bash
   # Não suportado nativamente
   # Precisa de configuração avançada
   ```

---

## OPÇÃO 3: Monorepo com Next.js Rewrites (Complexo)

### Não recomendado para multi-tenant com domínios diferentes
- Rewrites do Next.js não funcionam bem com hostnames diferentes
- Melhor usar Vercel multi-zones ou proxy reverso

---

## 🚀 PRÓXIMOS PASSOS (Vou implementar)

Vou criar:
1. ✅ Middleware para `/apps/core` que detecta o tenant
2. ✅ Hook para acessar tenant_id no código
3. ✅ Helper para queries com tenant_id automático
4. ✅ Documentação de deploy

Depois você escolhe a opção que prefere!
