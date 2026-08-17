# AUDITORIA DE RESQUÍCIOS DE DEPENDÊNCIAS LEGADAS

> Documento consolidado gerado automaticamente mapeando tecnologias e serviços descontinuados.

## apps/control

### Gateway de Pagamento Ativo Identificado:
**Stripe (Possível Legado)**

### 1. `package.json` (Dependências Órfãs/Desnecessárias)
- `@aws-sdk/client-ses no arquivo apps/control/package.json`
- `@react-email/components no arquivo apps/control/package.json`
- `react-email no arquivo apps/control/package.json`
- `resend no arquivo apps/control/package.json`

### 2. Variáveis de Ambiente (`.env*`)
- Nenhuma encontrada.

### 3. Código Fonte e Rotas
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:16`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:29`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    { value: 'STRIPE', label: 'Stripe (Cartão/Link de Pagamento)' },
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:30`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    { value: 'CIELO', label: 'Cielo (Transação Direta - Cartão)' }, // Mantido como Transação Direta
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:31`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    { value: 'BTG', label: 'BTG Pactual (PIX/Boleto)' },
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:32`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    { value: 'ASAAS', label: 'Asaas (PIX/Boleto/Cartão)' },
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:126`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.checkoutUrl) { // Stripe e Link de Pagamento BTG/Cielo (se implementado)
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:129`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.bankSlipUrl) { // Asaas Boleto Link
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:132`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.pixCopyPaste) { // Asaas PIX Copia e Cola
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:135`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.digitableLine) { // BTG Boleto (Linha Digitável)
    ```
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:138`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.emv) { // BTG PIX Copia e Cola
    ```
- **Arquivo:** `apps/control/components/pedidos/PedidoCobrancasList.tsx:6`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/pedidos/PedidoCobrancasList.tsx:42`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.checkoutUrl) { // Stripe e Link de Pagamento BTG/Cielo (se implementado)
    ```
- **Arquivo:** `apps/control/components/pedidos/PedidoCobrancasList.tsx:45`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.digitableLine) { // BTG Boleto
    ```
- **Arquivo:** `apps/control/components/pedidos/PedidoCobrancasList.tsx:48`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (data.emv) { // BTG PIX
    ```
- **Arquivo:** `apps/control/components/pedidos/PedidoItemManager.tsx:12`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Database } from "@noro-types/supabase"; // Importe o tipo Database
    ```
- **Arquivo:** `apps/control/components/KanbanBoard.tsx:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/orcamentos/EditOrcamentoForm.tsx:10`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/orcamentos/GerarRoteiroAIModal.tsx:7`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/orcamentos/[id]/page.tsx:7`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/orcamentos/OrcamentoDetalhes.tsx:10`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/OrcamentosClientPage.tsx:9`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { Database } from "@noro-types/supabase";
    ```
- **Arquivo:** `apps/control/components/IntegracoesTab.tsx:46`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    STRIPE: { icon: '💳', color: 'from-blue-500 to-violet-600', name: 'Stripe', category: 'payment' },
    ```
- **Arquivo:** `apps/control/components/emails/InviteUserEmail.tsx:10`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    } from '@react-email/components';
    ```
- **Arquivo:** `apps/control/app/settings/stripe/components/StripeStatus.tsx:44`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Verificando status da integração com o Stripe...
    ```
- **Arquivo:** `apps/control/app/settings/stripe/components/StripeStatus.tsx:59`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Status dos componentes da integração com o Stripe
    ```
- **Arquivo:** `apps/control/app/settings/stripe/page.tsx:58`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    toast.success('Configurações do Stripe atualizadas com sucesso');
    ```
- **Arquivo:** `apps/control/app/settings/stripe/page.tsx:71`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <h1 className="text-3xl font-bold tracking-tight">Configurações do Stripe</h1>
    ```
- **Arquivo:** `apps/control/app/settings/stripe/page.tsx:73`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Configure as chaves de API e outras opções do Stripe
    ```
- **Arquivo:** `apps/control/app/settings/stripe/page.tsx:82`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Habilite ou desabilite a integração com o Stripe
    ```
- **Arquivo:** `apps/control/app/settings/stripe/page.tsx:122`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Configure as chaves de API do Stripe para {liveMode ? 'produção' : 'teste'}
    ```
- **Arquivo:** `apps/control/app/settings/stripe/metrics/page.tsx:89`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Configure o Stripe e processe algumas transações para ver as métricas.
    ```
- **Arquivo:** `apps/control/app/settings/stripe/metrics/page.tsx:101`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <h1 className="text-3xl font-bold tracking-tight">Métricas do Stripe</h1>
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:34`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('Erro ao buscar configurações do Stripe:', error);
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:35`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error('Erro ao buscar configurações do Stripe');
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:51`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    errors.push('Configuração de API do Stripe incompleta.');
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:55`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    errors.push('Webhook secret do Stripe não configurado.');
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:67`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    errors.push('Nenhum produto/preço Stripe encontrado.');
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:77`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('Erro ao verificar integração Stripe:', error);
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:82`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    errors: ['Erro ao verificar integração Stripe.'],
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:107`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('Erro ao atualizar configurações do Stripe:', error);
    ```
- **Arquivo:** `apps/control/app/settings/stripe/actions.ts:108`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error('Erro ao atualizar configurações do Stripe');
    ```
- **Arquivo:** `apps/control/app/api/search/route.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/api/support/meta/route.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/api/support/tickets/[ticketId]/route.ts:2`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/api/support/tickets/[ticketId]/messages/route.ts:2`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/api/support/tickets/route.ts:2`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/api/contato/route.ts:2`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Resend } from 'resend';
    ```
- **Arquivo:** `apps/control/app/api/contato/route.ts:5`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const resend = new Resend(process.env.RESEND_API_KEY);
    ```
- **Arquivo:** `apps/control/app/api/contato/route.ts:46`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const { data, error } = await resend.emails.send({
    ```
- **Arquivo:** `apps/control/app/api/env-config/route.ts:107`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    ? `https://api.vercel.com/v10/projects/${vercelProjectId}/env?teamId=${vercelTeamId}`
    ```
- **Arquivo:** `apps/control/app/api/env-config/route.ts:108`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    : `https://api.vercel.com/v10/projects/${vercelProjectId}/env`;
    ```
- **Arquivo:** `apps/control/app/api/email/send/route.ts:2`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Resend } from 'resend';
    ```
- **Arquivo:** `apps/control/app/api/email/send/route.ts:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const resend = new Resend(process.env.RESEND_API_KEY);
    ```
- **Arquivo:** `apps/control/app/api/email/send/route.ts:75`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const { data, error } = await resend.emails.send({
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:2`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    import Stripe from "stripe";
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:10`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    return NextResponse.json({ error: "Stripe env vars missing" }, { status: 500 });
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:13`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:14`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    let event: Stripe.Event;
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:29`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    const inv = event.data.object as Stripe.Invoice;
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:48`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    const inv = event.data.object as Stripe.Invoice;
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:91`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    (${revenueId}, ${tenant_id}, ${amount}, ${`Stripe invoice ${stripe_invoice_id}`}),
    ```
- **Arquivo:** `apps/control/app/api/webhooks/stripe/route.ts:92`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    (${cashId}, ${tenant_id}, ${amount}, ${`Stripe invoice ${stripe_invoice_id}`})
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:17`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Route Handler para receber eventos de Webhook do Asaas.
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:25`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Webhook Asaas] Erro: Token de segurança inválido ou ausente.');
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:34`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Webhook Asaas] Erro ao ler corpo da requisição.');
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:48`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Webhook Asaas] Erro ao parsear webhook:', err.message);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:53`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Webhook Asaas] Evento recebido: ${eventType} (ID: ${providerEventId}, PaymentID: ${providerPaymentId})`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:56`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Webhook Asaas] Evento sem providerPaymentId associado. Ignorando.`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:74`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Webhook Asaas] Evento duplicado ignorado de forma idempotente: ${providerEventId}`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:106`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Webhook Asaas] Drizzle Charge ${charge.id} atualizada para o status: ${internalStatus}`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:109`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Webhook Asaas] Erro ao atualizar tabela payment_charges no Drizzle:', dbErr);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:133`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Webhook Asaas] Pedido ${chargeRecord.proposalId} atualizado no banco VPS para status: ${nextOrderStatus}`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:140`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Webhook Asaas] Nenhuma cobrança encontrada em noro.payment_charges para transaction_id: ${providerPaymentId}`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:149`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Webhook Asaas] Erro de execução ao processar webhook:', err);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:155`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Webhook Asaas] Falha ao gravar status de erro do evento no banco:', repoErr);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:9`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    * Route Handler para receber eventos de Webhook do BTG Pactual.
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:17`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.error('Webhook BTG: Header de Autorização ausente ou incorreto.');
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:25`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.error('Webhook BTG: Erro ao parsear JSON.');
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:36`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.log(`Webhook BTG recebido: Tipo ${eventType}`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:48`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.error(`Webhook BTG: Pedido ID não encontrado no payload de pagamento:`, eventData);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:66`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.warn(`Webhook BTG: Cobrança pendente não encontrada para Pedido ${pedidoId}. Pode ter sido paga manualmente ou é duplicidade.`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:95`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.log(`✅ Pagamento BTG conciliado. Pedido ${pedidoId} e Cobrança ${cobranca.id} atualizados para CONCLUIDO.`);
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:102`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.error('Erro de DB ao processar webhook BTG:', dbError);
    ```
- **Arquivo:** `apps/control/app/(protected)/configuracoes/user-actions.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Resend } from 'resend';
    ```
- **Arquivo:** `apps/control/app/(protected)/configuracoes/user-actions.ts:10`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/configuracoes/user-actions.ts:20`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const resend = new Resend(process.env.RESEND_API_KEY);
    ```
- **Arquivo:** `apps/control/app/(protected)/configuracoes/user-actions.ts:257`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    await resend.emails.send({
    ```
- **Arquivo:** `apps/control/app/(protected)/configuracoes/page.tsx:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/configuracoes/planos/[planId]/actions.ts:5`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from "@logto/next/server-actions"
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/pedidos-actions.ts:240`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    export type PaymentProvider = 'CIELO' | 'STRIPE' | 'BOLETO' | 'BTG' | 'ASAAS';
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/pedidos-actions.ts:290`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    billingType: provider === 'STRIPE' ? 'CREDIT_CARD' : provider === 'BTG' ? 'BOLETO' : 'PIX',
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/pedidos-actions.ts:313`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    case 'CIELO': if (!cartaoToken) throw new Error('Token do cartão é necessário para Cielo.'); providerResult = await createCieloCharge({ pedido: pedidoComRelacionamentos, cartaoToken, parcelas }); break;
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/pedidos-actions.ts:314`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    case 'BTG': providerResult = await createBTGCharge({ pedido: pedidoComRelacionamentos, cobrancaId: charge.id, dataVencimento: data_vencimento }); break;
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:13`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Emite uma cobrança via Asaas (PIX por padrão) no ambiente Sandbox/Produção.
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:23`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Dados de cliente (CPF/CNPJ, Nome) são obrigatórios para cobrança Asaas.'
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:30`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Asaas] Criando/Buscando cliente no gateway para email: ${cliente.email}...`);
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:41`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Não foi possível obter o ID do cliente no Asaas.'
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:54`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Asaas] Emitindo cobrança de ${pedido.valor_total} via PIX...`);
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:66`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Cobrança Asaas emitida com sucesso!',
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:78`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Asaas] Erro ao criar cobrança:', error);
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:81`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Erro na API do Asaas: ${error.message || error}`
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:11`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const COMPANY_ID = process.env.BTG_COMPANY_ID; // CNPJ da empresa BTG (necessário na URL)
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:19`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Obtém ou renova o Access Token OAuth 2.0 do BTG via Client Credentials Grant.
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:28`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error("BTG: Client ID ou Secret ausente.");
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:56`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('Erro ao obter token do BTG:', error.response?.data || error.message);
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:72`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Emite uma cobrança Boleto Híbrido (Bolepix) via API do BTG.
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:79`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return { success: false, message: 'Falha na autenticação BTG. Não foi possível obter o token.' };
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:83`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return { success: false, message: 'BTG Company ID (CNPJ da empresa) ausente.' };
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:89`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return { success: false, message: 'Dados de cliente (CPF/CNPJ, Nome) são obrigatórios para Boleto/PIX BTG.' };
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:160`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Boleto Híbrido (PIX/Boleto) BTG criado com sucesso!`,
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:171`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const errorMessage = data.errorMessage || data.detail || 'Erro desconhecido na API do BTG.';
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:174`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `BTG Falha na Criação: ${errorMessage}`,
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:180`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('Erro na API BTG (Collections):', errorData);
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:183`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Falha na comunicação BTG: ${errorData.errorMessage || errorData.message || 'Erro de rede/servidor.'}`,
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:2`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import Stripe from 'stripe';
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Database } from "@noro-types/supabase"; // Para tipagem dos itens
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:12`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:29`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Converte os itens do pedido para o formato esperado pelo Stripe Line Items.
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:32`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    function mapToStripeLineItems(items: PedidoItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:57`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Cria uma Stripe Checkout Session para o pedido.
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:74`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    client_reference_id: pedidoId, // Referência visível no painel do Stripe
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:86`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return { success: false, message: 'Stripe não retornou um URL de checkout válido.' };
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:91`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Sessão de pagamento Stripe criada com sucesso!`,
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:100`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('Erro na API do Stripe ao criar sessão:', error);
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:103`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Falha na comunicação com a API do Stripe. Verifique as chaves e a estrutura dos dados.',
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:28`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Cria uma transação na API da Cielo para cartão de crédito.
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:36`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return { success: false, message: 'Credenciais da Cielo ausentes.' };
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:79`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Transação Cielo Autorizada! PaymentId: ${data.Payment.PaymentId}`,
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:93`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Cielo: ${returnMessage} (Status: ${data.Payment?.Status || response.status})`,
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:101`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('Erro na API da Cielo:', errorResponse);
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:105`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Falha na comunicação com a Cielo: ${errorResponse[0]?.Code} - ${errorResponse[0]?.Message || error.message}`,
    ```
- **Arquivo:** `apps/control/app/(protected)/billing/actions.ts:25`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    cpfCnpj: string;        // obrigatório no Asaas
    ```
- **Arquivo:** `apps/control/app/(protected)/billing/actions.ts:26`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    mobilePhone: string;    // obrigatório no Asaas
    ```
- **Arquivo:** `apps/control/app/(protected)/billing/actions.ts:40`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return { success: false, message: 'Billing Asaas já está ativo para este tenant.' };
    ```
- **Arquivo:** `apps/control/app/(protected)/notificacoes/page.tsx:8`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from "@logto/next/server-actions";
    ```
- **Arquivo:** `apps/control/app/(protected)/page.tsx:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/tarefas/actions.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from "@logto/next/server-actions";
    ```
- **Arquivo:** `apps/control/app/(protected)/comunicacao/actions.ts:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/api-keys/actions.ts:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from "@logto/next/server-actions";
    ```
- **Arquivo:** `apps/control/app/(protected)/users/page.tsx:7`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from "@logto/next/server-actions";
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/actions.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:64`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log('[Asaas Onboarding] Iniciando onboarding para o tenant:', tenantId);
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:68`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    alert(`Billing Asaas ativado com sucesso!\nWallet ID: ${result.walletId}`);
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:71`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    setError(result.message || 'Erro desconhecido ao ativar subconta Asaas.');
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:74`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Asaas Onboarding] Erro:', err);
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:89`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <h3 className="text-lg font-bold text-gray-900">Integração Financeira Asaas</h3>
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:90`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <p className="text-sm text-gray-500">A subconta do Asaas está ativa para este tenant.</p>
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:96`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <span className="text-gray-500 font-medium block">ID da Subconta Asaas</span>
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/TenantAsaasOnboardingForm.tsx:130`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Ativar Subconta Asaas (Gateway de Agência)
    ```
- **Arquivo:** `apps/control/app/(protected)/tenants/[id]/assinatura/page.tsx:7`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/control/tasks/actions.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from "@logto/next/server-actions";
    ```
- **Arquivo:** `apps/control/app/(protected)/control/orgs/create/route.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/control/orgs/[id]/actions.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from "@logto/next/server-actions";
    ```
- **Arquivo:** `apps/control/app/(protected)/control/leads/create/route.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/control/leads/kanban/assign/route.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/control/leads/kanban/task/route.ts:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/(protected)/webhooks/endpoints/create/route.ts:3`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/actions/comum.ts:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/globals.css:10`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    /* --- PROFESSIONAL PALETTE (Vercel/Stripe Style) --- */
    ```
- **Arquivo:** `apps/control/app/auth/callback/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { handleSignIn } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/auth/whoami/route.ts:8`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/auth/sign-out/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { signOut } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/app/auth/sign-in/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { signIn } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/control/lib/logto.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { LogtoNextConfig } from '@logto/next';
    ```
- **Arquivo:** `apps/control/lib/supportEmail.ts:14`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return supabaseUrl ? supabaseUrl.replace(".supabase.co", ".functions.supabase.co") : null;
    ```

### 4. Comentários / Documentação
- **Arquivo:** `apps/control/components/pagamentos/EmitirCobrancaForm.tsx:100`
  - Comentário:
    ```typescript
    // Captura o URL de checkout para exibição imediata (principalmente Stripe)
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:13`
  - Comentário:
    ```typescript
    // Configuração do segredo do webhook configurado no painel do Asaas
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:38`
  - Comentário:
    ```typescript
    // 3. Parsear o evento do Asaas
    ```
- **Arquivo:** `apps/control/app/api/webhooks/asaas/route.ts:158`
  - Comentário:
    ```typescript
    // Retorna 500 para o Asaas re-tentar o envio
    ```
- **Arquivo:** `apps/control/app/api/webhooks/btg/route.ts:38`
  - Comentário:
    ```typescript
    // 2. Tentar conciliar Pedido e Cobrança a partir dos dados do BTG
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/asaas-provider.ts:27`
  - Comentário:
    ```typescript
    // Limpa CPF/CNPJ para validação do Asaas
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:127`
  - Comentário:
    ```typescript
    // Dados do Beneficiário (Payee) - Deve vir das configurações do BTG
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:133`
  - Comentário:
    ```typescript
    // Dados do Detalhe (Será populado pelo BTG)
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/btg-provider.ts:150`
  - Comentário:
    ```typescript
    // Adicionar x-idempotency-key se o BTG exigir
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:11`
  - Comentário:
    ```typescript
    // Inicializa o cliente Stripe para Node.js
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:38`
  - Comentário:
    ```typescript
    // Stripe espera o valor em centavos
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/stripe-provider.ts:99`
  - Comentário:
    ```typescript
    // O erro do Stripe pode ser um objeto complexo, logamos para debug
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:43`
  - Comentário:
    ```typescript
    // Valor total em centavos (Cielo espera int32)
    ```
- **Arquivo:** `apps/control/app/(protected)/pedidos/providers/cielo-provider.ts:99`
  - Comentário:
    ```typescript
    // Erro de comunicação HTTP ou 400/500 da Cielo
    ```
- **Arquivo:** `apps/control/app/(protected)/billing/actions.ts:16`
  - Comentário:
    ```typescript
    // Onboarding de subconta Asaas
    ```
- **Arquivo:** `apps/control/app/(protected)/billing/actions.ts:51`
  - Comentário:
    ```typescript
    // Cria subconta Asaas via API master da NORO
    ```
- **Arquivo:** `apps/control/app/(protected)/billing/actions.ts:70`
  - Comentário:
    ```typescript
    // Reverte para pending se a criação no Asaas falhou
    ```
- **Arquivo:** `apps/control/app/(protected)/billing/actions.ts:187`
  - Comentário:
    ```typescript
    // Emite no Asaas
    ```
- **Arquivo:** `apps/control/middleware.ts:49`
  - Comentário:
    ```typescript
    //   const ctx = await getLogtoContext(logtoConfig);  // @logto/next/server-actions
    ```
- **Arquivo:** `apps/control/lib/modules/billing.ts:18`
  - Comentário:
    ```typescript
    // Portal do Stripe
    ```
- **Arquivo:** `apps/control/lib/modules/index.ts:18`
  - Comentário:
    ```typescript
    // TODO: verificar configurações do Stripe, validar webhooks, sincronizar produtos
    ```
- **Arquivo:** `apps/control/lib/modules/index.ts:21`
  - Comentário:
    ```typescript
    // TODO: limpar cache de sessões, fechar conexões com Stripe
    ```

---

## apps/core

### Gateway de Pagamento Ativo Identificado:
**Asaas**

### 1. `package.json` (Dependências Órfãs/Desnecessárias)
- Nenhuma encontrada.

### 2. Variáveis de Ambiente (`.env*`)
- Nenhuma encontrada.

### 3. Código Fonte e Rotas
- **Arquivo:** `apps/core/components/admin/pagamentos/EmitirCobrancaForm.tsx:33`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    { value: 'ASAAS',         label: 'Asaas — PIX/Boleto', icon: <DollarSign className="h-4 w-4" /> },
    ```
- **Arquivo:** `apps/core/components/admin/pagamentos/EmitirCobrancaForm.tsx:321`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <span>Uma cobrança será gerada via Asaas. O cliente poderá visualizar a fatura e pagar por PIX ou Boleto Bancário.</span>
    ```
- **Arquivo:** `apps/core/components/admin/ConfiguracoesClient.tsx:92`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    setBillingError(err.message || 'Erro inesperado ao conectar ao Asaas.');
    ```
- **Arquivo:** `apps/core/components/admin/ConfiguracoesClient.tsx:259`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <p className="text-sm text-gray-500">A subconta do Asaas está ativa para sua agência.</p>
    ```
- **Arquivo:** `apps/core/components/admin/ConfiguracoesClient.tsx:296`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Ativar Subconta Asaas (Integração Financeira)
    ```
- **Arquivo:** `apps/core/app/(protected)/configuracoes/page.tsx:3`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/core/app/(protected)/configuracoes/billing-actions.ts:68`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    return { success: false, message: 'Billing Asaas já está ativo para esta agência.' };
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/pedidos-actions.ts:428`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error('Agência não possui integração Asaas configurada em Configurações > Assinatura.');
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:14`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Emite uma cobrança via Asaas (PIX por padrão) no ambiente Sandbox/Produção para a subconta do tenant.
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:24`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Dados de cliente (CPF/CNPJ, Nome) são obrigatórios para cobrança Asaas.'
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:31`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Asaas Core] Criando/Buscando cliente no gateway para email: ${cliente.email} com walletId: ${walletId}...`);
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:43`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Não foi possível obter o ID do cliente no Asaas.'
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:56`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.log(`[Asaas Core] Emitindo cobrança de ${pedido.valor_total} via PIX com walletId: ${walletId}...`);
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:70`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Cobrança Asaas emitida com sucesso!',
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:82`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    console.error('[Asaas Core] Erro ao criar cobrança:', error);
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:85`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: `Erro na API do Asaas: ${error.message || error}`
    ```
- **Arquivo:** `apps/core/app/auth/callback/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { handleSignIn } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/core/app/auth/whoami/route.ts:8`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/core/app/auth/sign-out/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { signOut } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/core/app/auth/sign-in/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { signIn } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/core/lib/logto.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { LogtoNextConfig } from '@logto/next';
    ```

### 4. Comentários / Documentação
- **Arquivo:** `apps/core/components/admin/pagamentos/EmitirCobrancaForm.tsx:153`
  - Comentário:
    ```typescript
    // Asaas PIX Copia e Cola
    ```
- **Arquivo:** `apps/core/components/admin/pagamentos/EmitirCobrancaForm.tsx:161`
  - Comentário:
    ```typescript
    // Asaas Boleto / Fatura / Checkout
    ```
- **Arquivo:** `apps/core/components/admin/pedidos/PedidoCobrancasList.tsx:47`
  - Comentário:
    ```typescript
    // Asaas PIX Copia e Cola
    ```
- **Arquivo:** `apps/core/components/admin/pedidos/PedidoCobrancasList.tsx:55`
  - Comentário:
    ```typescript
    // Asaas Boleto Link
    ```
- **Arquivo:** `apps/core/components/admin/pedidos/PedidoCobrancasList.tsx:59`
  - Comentário:
    ```typescript
    // Asaas / Stripe Checkout Link
    ```
- **Arquivo:** `apps/core/app/(protected)/configuracoes/billing-actions.ts:79`
  - Comentário:
    ```typescript
    // Cria subconta Asaas
    ```
- **Arquivo:** `apps/core/app/(protected)/pedidos/providers/asaas-provider.ts:28`
  - Comentário:
    ```typescript
    // Limpa CPF/CNPJ para validação do Asaas
    ```

---

## apps/billing

### Gateway de Pagamento Ativo Identificado:
**Stripe (Possível Legado)**

### 1. `package.json` (Dependências Órfãs/Desnecessárias)
- Nenhuma encontrada.

### 2. Variáveis de Ambiente (`.env*`)
- Nenhuma encontrada.

### 3. Código Fonte e Rotas
- **Arquivo:** `apps/billing/components/BillingPortal.tsx:30`
  - Status: `[Código Morto / Não Importado]`
  - Trecho:
    ```typescript
    Gerencie assinatura, métodos de pagamento e histórico de faturas pelo Stripe.
    ```
- **Arquivo:** `apps/billing/app/api/webhooks/cielo/route.ts:18`
  - Status: `[Dual-path / Fallback]`
  - Trecho:
    ```typescript
    console.error('Error processing Cielo webhook:', error);
    ```
- **Arquivo:** `apps/billing/app/billing/success/page.tsx:21`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error('Sessão Stripe sem tenantId.');
    ```
- **Arquivo:** `apps/billing/app/billing/success/page.tsx:31`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Sua assinatura foi confirmada pelo Stripe.
    ```
- **Arquivo:** `apps/billing/app/billing/success/page.tsx:53`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Não foi possível confirmar a sessão do Stripe.
    ```
- **Arquivo:** `apps/billing/app/plans/page.tsx:10`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    A configuração de planos e preços fica no Stripe.
    ```
- **Arquivo:** `apps/billing/app/plans/new/page.tsx:6`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    description: 'Planos são criados no Stripe',
    ```
- **Arquivo:** `apps/billing/app/plans/new/page.tsx:15`
  - Status: `[Código Morto / Não Importado]`
  - Trecho:
    ```typescript
    Planos de assinatura ainda devem ser criados no Stripe legado ate a
    ```
- **Arquivo:** `apps/billing/app/plans/new/page.tsx:16`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    migracao para o modelo financeiro Asaas.
    ```
- **Arquivo:** `apps/billing/app/plans/actions.ts:20`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error('Planos devem ser criados no Stripe. Não há modelo de dados ativo para planos.');
    ```
- **Arquivo:** `apps/billing/app/plans/actions.ts:25`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error('Planos devem ser atualizados no Stripe. Não há modelo de dados ativo para planos.');
    ```
- **Arquivo:** `apps/billing/app/plans/[id]/edit/page.tsx:6`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    description: 'Planos são editados no Stripe',
    ```
- **Arquivo:** `apps/billing/app/plans/[id]/edit/page.tsx:15`
  - Status: `[Código Morto / Não Importado]`
  - Trecho:
    ```typescript
    Planos de assinatura ainda devem ser editados no Stripe legado ate a
    ```
- **Arquivo:** `apps/billing/app/plans/[id]/edit/page.tsx:16`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    migracao para o modelo financeiro Asaas.
    ```
- **Arquivo:** `apps/billing/app/page.tsx:27`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <p className="text-gray-600">Gerencie planos e pagamentos pelo Stripe.</p>
    ```
- **Arquivo:** `apps/billing/app/page.tsx:38`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <p className="text-gray-600">Planos são gerenciados no Stripe.</p>
    ```
- **Arquivo:** `apps/billing/lib/cielo.ts:89`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    Brand: 'Visa' // Será detectado automaticamente pela Cielo
    ```
- **Arquivo:** `apps/billing/lib/cielo.ts:144`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    error.response?.data?.message || 'Erro na comunicação com a Cielo'
    ```
- **Arquivo:** `apps/billing/lib/stripe.ts:23`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error(`Stripe request failed: ${text}`);
    ```

### 4. Comentários / Documentação
- Nenhuma encontrada.

---

## apps/portal

### Gateway de Pagamento Ativo Identificado:
**Unknown**

### 1. `package.json` (Dependências Órfãs/Desnecessárias)
- `resend no arquivo apps/portal/package.json`

### 2. Variáveis de Ambiente (`.env*`)
- Nenhuma encontrada.

### 3. Código Fonte e Rotas
- **Arquivo:** `apps/portal/lib/magic-link.ts:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { Resend } from 'resend';
    ```

### 4. Comentários / Documentação
- **Arquivo:** `apps/portal/app/api/webhooks/asaas/route.ts:10`
  - Comentário:
    ```typescript
    // Configurar no painel Asaas: https://sandbox.asaas.com → Configurações → Webhooks
    ```
- **Arquivo:** `apps/portal/app/api/webhooks/asaas/route.ts:48`
  - Comentário:
    ```typescript
    // Registra erro mas retorna 200 para o Asaas não reenviar
    ```
- **Arquivo:** `apps/portal/app/api/webhooks/asaas/route.ts:66`
  - Comentário:
    ```typescript
    // Mapeia eventos Asaas para atualizações de status
    ```

---

## apps/soon-landing

### Gateway de Pagamento Ativo Identificado:
**Asaas**

### 1. `package.json` (Dependências Órfãs/Desnecessárias)
- `@vercel/node no arquivo apps/soon-landing/package.json`

### 2. Variáveis de Ambiente (`.env*`)
- Nenhuma encontrada.

### 3. Código Fonte e Rotas
- **Arquivo:** `apps/soon-landing/package-lock.json:25`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "@vercel/node": "^5.8.8",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1870`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/build-utils": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1872`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "resolved": "https://registry.npmjs.org/@vercel/build-utils/-/build-utils-13.26.4.tgz",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1877`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "@vercel/python-analysis": "0.11.1",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1882`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/build-utils/node_modules/es-module-lexer": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1889`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/error-utils": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1891`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "resolved": "https://registry.npmjs.org/@vercel/error-utils/-/error-utils-2.1.0.tgz",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1896`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/nft": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1898`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "resolved": "https://registry.npmjs.org/@vercel/nft/-/nft-1.10.0.tgz",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1923`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1925`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "resolved": "https://registry.npmjs.org/@vercel/node/-/node-5.8.8.tgz",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1934`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "@vercel/build-utils": "13.26.4",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1935`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "@vercel/error-utils": "2.1.0",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1936`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "@vercel/nft": "1.10.0",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1937`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "@vercel/static-config": "3.4.0",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1954`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/aix-ppc64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1971`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/android-arm": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:1988`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/android-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2005`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/android-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2022`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/darwin-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2039`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/darwin-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2056`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/freebsd-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2073`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/freebsd-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2090`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-arm": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2107`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2124`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-ia32": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2141`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-loong64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2158`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-mips64el": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2175`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-ppc64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2192`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-riscv64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2209`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-s390x": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2226`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/linux-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2243`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/netbsd-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2260`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/netbsd-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2277`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/openbsd-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2294`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/openbsd-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2311`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/openharmony-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2328`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/sunos-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2345`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/win32-arm64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2362`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/win32-ia32": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2379`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@esbuild/win32-x64": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2396`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/@types/node": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2406`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/esbuild": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2448`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/node-fetch": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2469`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/path-to-regexp": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2476`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/tsx": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2496`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/typescript": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2510`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/node/node_modules/undici-types": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2517`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/python-analysis": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2519`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "resolved": "https://registry.npmjs.org/@vercel/python-analysis/-/python-analysis-0.11.1.tgz",
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2533`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "node_modules/@vercel/static-config": {
    ```
- **Arquivo:** `apps/soon-landing/package-lock.json:2535`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    "resolved": "https://registry.npmjs.org/@vercel/static-config/-/static-config-3.4.0.tgz",
    ```
- **Arquivo:** `apps/soon-landing/src/components/BenefitSection.tsx:68`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    title: 'Faturamento Integrado (Asaas)',
    ```
- **Arquivo:** `apps/soon-landing/src/components/Hero.tsx:60`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    status: "Faturado (Asaas)",
    ```
- **Arquivo:** `apps/soon-landing/src/components/FAQSection.tsx:59`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    question: 'Como funciona a integração com o Asaas?',
    ```
- **Arquivo:** `apps/soon-landing/src/App.tsx:30`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    userAgent: 'Stripe Safari Mock'
    ```
- **Arquivo:** `apps/soon-landing/api/chat.ts:2`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { VercelRequest, VercelResponse } from "@vercel/node";
    ```

### 4. Comentários / Documentação
- Nenhuma encontrada.

---

## apps/web

### Gateway de Pagamento Ativo Identificado:
**Stripe (Possível Legado)**

### 1. `package.json` (Dependências Órfãs/Desnecessárias)
- Nenhuma encontrada.

### 2. Variáveis de Ambiente (`.env*`)
- Nenhuma encontrada.

### 3. Código Fonte e Rotas
- **Arquivo:** `apps/web/app/api/create-checkout-session/route.ts:47`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    ```
- **Arquivo:** `apps/web/app/api/create-checkout-session/route.ts:68`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    message: 'Checkout em desenvolvimento. Integração com Stripe será ativada em breve.',
    ```
- **Arquivo:** `apps/web/app/security/page.tsx:53`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    { label: 'PCI DSS', desc: 'Segurança de dados de pagamento', status: 'Via Stripe ✓' },
    ```
- **Arquivo:** `apps/web/app/features/page.tsx:41`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    'Integração com Stripe e Asaas',
    ```
- **Arquivo:** `apps/web/app/auth/callback/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { handleSignIn } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/web/app/auth/sign-out/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { signOut } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/web/app/auth/sign-in/route.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { signIn } from '@logto/next/server-actions';
    ```
- **Arquivo:** `apps/web/.stitch/designs/home.html:131`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    <img alt="Stripe" class="h-8" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVreqegHc3fsN5loIcd8Xbclnk28Q3nJD4_Hyy_fLqqKVnYiaz_uOJA8p-I43y9vxj_gko4XOAZDsgF062U3AOLxZoOiXrUYNNEOJykZ4zNSNptIl80bwPFR9PHAGzf75ZHPpsFcQI9SmUDlFc7vlO8fKLgUUbrtGCbH51S_Z9Y0ZePILgfDxdxXoU0_WtxFa5ldY4DmHF6656ZcGfpsNthKkxBxgmhrNDPDHLGwwPlNws3ieHPmXZoHAlAkopAHSC-BeWExP2zWU"/>
    ```
- **Arquivo:** `apps/web/lib/logto.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { LogtoNextConfig } from '@logto/next';
    ```

### 4. Comentários / Documentação
- **Arquivo:** `apps/web/app/api/create-checkout-session/route.ts:3`
  - Comentário:
    ```typescript
    // Mapeamento de planos para preços do Stripe
    ```
- **Arquivo:** `apps/web/app/api/create-checkout-session/route.ts:32`
  - Comentário:
    ```typescript
    // Obter o price_id do Stripe
    ```
- **Arquivo:** `apps/web/app/api/create-checkout-session/route.ts:42`
  - Comentário:
    ```typescript
    // TODO: Criar sessão do Stripe Checkout
    ```

---

## packages

### Gateway de Pagamento Ativo Identificado:
**Asaas**

### 1. `package.json` (Dependências Órfãs/Desnecessárias)
- `@vercel/style-guide no arquivo packages/eslint-config/package.json`
- `@logto/next no arquivo packages/auth/package.json`

### 2. Variáveis de Ambiente (`.env*`)
- Nenhuma encontrada.

### 3. Código Fonte e Rotas
- **Arquivo:** `packages/db/schema/identity-links.ts:6`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    export const identityProviderValues = ['logto', 'supabase'] as const;
    ```
- **Arquivo:** `packages/db/repositories/authIdentityRepository.ts:60`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    provider: 'supabase',
    ```
- **Arquivo:** `packages/control-worker/README.md:30`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    docs/architecture/supabase-residue-report.md
    ```
- **Arquivo:** `packages/control-worker/README.md:31`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    supabase/FROZEN.md
    ```
- **Arquivo:** `packages/eslint-config/next.js:18`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    require.resolve("@vercel/style-guide/eslint/next"),
    ```
- **Arquivo:** `packages/lib/providers/asaas-provider.ts:70`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error(`Asaas API error ${res.status}: ${body}`);
    ```
- **Arquivo:** `packages/lib/providers/asaas-provider.ts:199`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    throw new Error('Asaas webhook: body inválido (não é JSON)');
    ```
- **Arquivo:** `packages/lib/providers/asaas-provider.ts:205`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    if (!event) throw new Error('Asaas webhook: campo event ausente');
    ```
- **Arquivo:** `packages/auth/adapters/logto-session-adapter.ts:4`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Depende de: @logto/next (instalado em packages/auth)
    ```
- **Arquivo:** `packages/auth/adapters/logto-session-adapter.ts:30`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import { getLogtoContext } from '@logto/next/server-actions';
    ```
- **Arquivo:** `packages/auth/adapters/logto-session-adapter.ts:31`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { LogtoNextConfig } from '@logto/next';
    ```
- **Arquivo:** `packages/auth/adapters/logto-session-adapter.ts:68`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    * Chama `getLogtoContext()` do `@logto/next/server-actions`.
    ```
- **Arquivo:** `packages/auth/adapters/logto-session-adapter.ts:101`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    *   import type { LogtoNextConfig } from '@logto/next';
    ```
- **Arquivo:** `packages/types/admin.ts:1`
  - Status: `[Código Ativo em Produção]`
  - Trecho:
    ```typescript
    import type { Database } from './supabase';
    ```

### 4. Comentários / Documentação
- **Arquivo:** `packages/eslint-config/next.js:10`
  - Comentário:
    ```typescript
    * For more information, see https://github.com/vercel/style-guide
    ```
- **Arquivo:** `packages/lib/providers/asaas-provider.ts:11`
  - Comentário:
    ```typescript
    // Chaves Asaas via variáveis de ambiente — nunca hardcoded
    ```
- **Arquivo:** `packages/lib/providers/asaas-provider.ts:32`
  - Comentário:
    ```typescript
    // Mapeamento de status Asaas → status interno canônico
    ```
- **Arquivo:** `packages/lib/providers/asaas-provider.ts:117`
  - Comentário:
    ```typescript
    // Asaas: usar totalValue + installmentCount para parcelamento
    ```
- **Arquivo:** `packages/lib/providers/asaas-provider.ts:218`
  - Comentário:
    ```typescript
    // Chamado pelo apps/control ao ativar billing Asaas para um tenant
    ```
- **Arquivo:** `packages/lib/providers/payment-provider.ts:35`
  - Comentário:
    ```typescript
    // ID da subconta Asaas do tenant (walletId) — null para Modelo A (plataforma)
    ```

---
