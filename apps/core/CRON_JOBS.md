# Cron Jobs - Background Tasks

Este documento descreve os jobs automatizados (cron jobs) configurados no sistema.

## 📋 Jobs Disponíveis

### 1. Limpeza de Notificações

**Endpoint:** `GET /api/cron/cleanup-notifications`
**Frequência:** Diariamente às 2h (horário UTC)
**Função:** Remove notificações lidas com mais de 30 dias

**Como funciona:**
- Busca notificações marcadas como lidas
- Criadas há mais de 30 dias
- Remove do banco de dados para economizar espaço

**Configuração no Vercel:**
```json
{
  "path": "/api/cron/cleanup-notifications",
  "schedule": "0 2 * * *"
}
```

---

### 2. Lembrete de Viagens Próximas

**Endpoint:** `GET /api/cron/upcoming-trips-reminder`
**Frequência:** Diariamente às 9h (horário UTC)
**Função:** Envia lembretes sobre viagens que começam em breve

**Como funciona:**
- Verifica pedidos confirmados que começam em 7, 3 ou 1 dia
- Envia notificação in-app para o cliente
- Opcional: também pode enviar email

**Notificações enviadas:**
- 7 dias antes: "Sua viagem está próxima!"
- 3 dias antes: "Faltam 3 dias para sua viagem!"
- 1 dia antes: "Sua viagem começa amanhã!"

**Configuração no Vercel:**
```json
{
  "path": "/api/cron/upcoming-trips-reminder",
  "schedule": "0 9 * * *"
}
```

---

### 3. Verificação de Pagamentos Vencidos

**Endpoint:** `GET /api/cron/check-overdue-payments`
**Frequência:** Diariamente às 10h (horário UTC)
**Função:** Verifica e notifica sobre pagamentos vencidos

**Como funciona:**
- Busca pagamentos pendentes com data de vencimento passada
- Calcula quantos dias estão em atraso
- Envia notificação com prioridade alta/urgente
- Opcional: também envia email de cobrança

**Prioridades:**
- Até 7 dias: Prioridade Alta
- Mais de 7 dias: Prioridade Urgente

**Configuração no Vercel:**
```json
{
  "path": "/api/cron/check-overdue-payments",
  "schedule": "0 10 * * *"
}
```

---

## 🔒 Segurança

Todos os cron jobs verificam um token de autorização para evitar execução não autorizada.

### Configurar Secret Key

1. Adicione ao `.env.local`:
```env
CRON_SECRET=seu_token_secreto_aqui
```

2. Na Vercel, adicione a variável de ambiente:
   - Dashboard > Settings > Environment Variables
   - Nome: `CRON_SECRET`
   - Valor: `seu_token_secreto_aqui`

3. Os cron jobs da Vercel automaticamente incluem este token no header `Authorization: Bearer <CRON_SECRET>`

---

## 🧪 Testar Localmente

Para testar um cron job localmente:

```bash
# Com secret (recomendado)
curl -H "Authorization: Bearer seu_token_secreto" \
  http://localhost:3004/api/cron/cleanup-notifications

# Sem secret (apenas em dev, se CRON_SECRET não estiver definido)
curl http://localhost:3004/api/cron/cleanup-notifications
```

---

## 📊 Monitoramento

### Logs no Vercel

1. Acesse o dashboard da Vercel
2. Vá em "Functions" > "Cron Jobs"
3. Veja execuções, status e logs

### Exemplo de resposta de sucesso:

```json
{
  "success": true,
  "deletedCount": 150,
  "timestamp": "2025-11-14T02:00:00.000Z"
}
```

### Exemplo de resposta de erro:

```json
{
  "success": false,
  "error": "Database connection failed",
  "timestamp": "2025-11-14T02:00:00.000Z"
}
```

---

## 📅 Sintaxe de Schedule (Cron Expression)

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Dia da semana (0-6, onde 0 = Domingo)
│ │ │ └───── Mês (1-12)
│ │ └─────── Dia do mês (1-31)
│ └───────── Hora (0-23)
└─────────── Minuto (0-59)
```

### Exemplos comuns:

- `0 2 * * *` - Diariamente às 2h
- `0 */6 * * *` - A cada 6 horas
- `0 0 * * 0` - Todo domingo à meia-noite
- `0 9 * * 1-5` - Segunda a sexta às 9h

---

## 🚀 Adicionar Novos Cron Jobs

1. **Criar o endpoint:**
```typescript
// app/api/cron/meu-job/route.ts
export async function GET(request: NextRequest) {
  // Verificar autorização
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  // Sua lógica aqui
  return NextResponse.json({ success: true });
}
```

2. **Adicionar ao vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/meu-job",
      "schedule": "0 * * * *"
    }
  ]
}
```

3. **Deploy:**
```bash
git add .
git commit -m "Add new cron job"
git push
```

---

## 💡 Boas Práticas

1. **Sempre** verifique o CRON_SECRET
2. **Sempre** use try/catch e log de erros
3. **Sempre** retorne JSON com success/error
4. **Timeout**: Máximo 10 segundos no plano Hobby, 60s no Pro
5. **Idempotência**: Jobs devem poder ser executados múltiplas vezes sem duplicar dados
6. **Logs**: Use o logger centralizado para facilitar debugging

---

## 🔧 Troubleshooting

### Job não está executando

1. Verifique se está no `vercel.json`
2. Verifique se fez deploy recente
3. Veja logs no dashboard da Vercel

### Job retorna 401 Unauthorized

1. Verifique se CRON_SECRET está configurado na Vercel
2. Verifique se o valor está correto
3. Re-deploy após adicionar variável

### Job timeout

1. Otimize queries (use índices, limit)
2. Processe em lotes menores
3. Considere dividir em múltiplos jobs
4. Upgrade para plano Pro (60s timeout)

---

## 📚 Recursos

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Crontab Guru](https://crontab.guru/) - Testar expressões cron
