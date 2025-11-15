# GUIA DE TESTE LOCAL MULTI-TENANT

## 🚀 Como Testar Localmente

### Passo 1: Rodar as Duas Aplicações

```bash
# Terminal 1 - Control Plane (Gestão de Tenants)
cd apps/control
npm run dev
# Roda em: http://localhost:3000

# Terminal 2 - Core (Aplicação dos Tenants)
cd apps/core
npm run dev -- -p 3001
# Roda em: http://localhost:3001
```

### Passo 2: Editar arquivo hosts (Simular DNS)

**Windows:**
```cmd
# Abrir Notepad como Administrador
# Editar: C:\Windows\System32\drivers\etc\hosts
# Adicionar:
127.0.0.1  abc.noro.guru
127.0.0.1  control.noro.guru
```

**Mac/Linux:**
```bash
sudo nano /etc/hosts
# Adicionar:
127.0.0.1  abc.noro.guru
127.0.0.1  control.noro.guru
```

### Passo 3: Configurar Proxy Reverso (Opcional mas Recomendado)

#### Opção A: Usando Caddy (Mais Simples)

1. **Instalar Caddy:**
   ```bash
   # Windows (Chocolatey)
   choco install caddy

   # Mac
   brew install caddy

   # Linux
   sudo apt install caddy
   ```

2. **Criar Caddyfile:**
   ```caddyfile
   # Arquivo: Caddyfile

   # Control Plane
   control.noro.guru {
       reverse_proxy localhost:3000
   }

   # Tenants (qualquer subdomínio)
   *.noro.guru {
       reverse_proxy localhost:3001
   }

   # Também aceitar sem subdomínio
   noro.guru {
       reverse_proxy localhost:3000
   }
   ```

3. **Rodar Caddy:**
   ```bash
   caddy run
   # Acesse: http://abc.noro.guru
   ```

#### Opção B: Usando Nginx

1. **Criar config:**
   ```nginx
   # /etc/nginx/sites-available/noro

   server {
       listen 80;
       server_name control.noro.guru;
       location / {
           proxy_pass http://localhost:3000;
       }
   }

   server {
       listen 80;
       server_name ~^(?<subdomain>.+)\.noro\.guru$;
       location / {
           proxy_pass http://localhost:3001;
       }
   }
   ```

2. **Ativar e reiniciar:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/noro /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## 🌐 TESTE SEM PROXY (Mais Simples)

Se não quiser configurar proxy, você pode testar assim:

### 1. Rodar apenas o Core:
```bash
cd apps/core
npm run dev
```

### 2. Acessar direto:
```
http://localhost:3000
```

### 3. O middleware vai usar tenant padrão em desenvolvimento
- Linha 67-80 do middleware.ts
- Busca tenant com slug 'noro' automaticamente
- Permite desenvolvimento sem configurar domínio

---

## 🔧 PARA PRODUÇÃO (Vercel)

### Deploy Separado de Cada App

```bash
# 1. Deploy Control Plane
cd apps/control
vercel --prod
# Vai para: control.noro.guru

# 2. Deploy Core (Tenants)
cd apps/core
vercel --prod
# Vai para: *.noro.guru (wildcard)
```

### Configurar DNS na Cloudflare

```
Tipo    Nome       Destino
------  ---------  --------------------------
CNAME   control    cname.vercel-dns.com
CNAME   *          cname.vercel-dns.com (wildcard)
```

### Configurar Domínios na Vercel

1. No projeto `noro-control`:
   - Settings > Domains
   - Adicionar: `control.noro.guru`

2. No projeto `noro-core`:
   - Settings > Domains
   - Adicionar: `*.noro.guru`

---

## ✅ VERIFICAR SE ESTÁ FUNCIONANDO

### Teste 1: Control Plane
```
http://control.noro.guru
ou
http://localhost:3000

Deve mostrar: Gestão de Tenants
```

### Teste 2: Tenant ABC
```
http://abc.noro.guru
ou
http://localhost:3001

Deve mostrar: Aplicação do cliente ABC
```

### Teste 3: Ver logs do middleware
```bash
# No terminal do core (porta 3001)
# Você deve ver:
[Middleware] Request: { hostname: 'abc.noro.guru', pathname: '/' }
[Middleware] Access granted: { userId: '...', tenantId: '...', role: 'admin' }
```

---

## 🐛 TROUBLESHOOTING

### "Domain not found"
- ✅ Tenant foi criado no Control Plane?
- ✅ Domínio `abc.noro.guru` está em `cp.domains`?
- ✅ Arquivo hosts configurado?

### "User not authenticated"
- ✅ Faça login primeiro em `http://abc.noro.guru/login`
- ✅ Usuário tem acesso ao tenant ABC?
- ✅ Verifique `cp.user_tenant_roles`

### Proxy não funciona
- ✅ Portas 3000 e 3001 estão rodando?
- ✅ Firewall bloqueando porta 80?
- ✅ Caddy/Nginx instalado corretamente?
