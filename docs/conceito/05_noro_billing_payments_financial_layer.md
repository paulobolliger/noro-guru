# 05 — NORO Billing, Payments & Financial Layer

> Documento estratégico sobre a camada financeira da NORO: checkout, pagamentos, parcelamento, comissões, repasses, ledger, grupos, cotas, pagamento programado e evolução futura para embedded finance.

---

## 1. Definição

A camada financeira da NORO é o conjunto de funcionalidades que transforma uma proposta de viagem em uma operação econômica rastreável.

Ela deve controlar:

- valor vendido;
- custo de fornecedor;
- margem;
- taxas de pagamento;
- impostos;
- comissão;
- repasse;
- status financeiro;
- cancelamento;
- reembolso;
- chargeback;
- saldo por passageiro;
- conciliação;
- relatórios.

A NORO não deve nascer como fintech regulada, mas deve nascer com mentalidade de infraestrutura financeira verticalizada para turismo.

---

## 2. Tese central

No turismo, quem controla o financeiro controla a margem.

A NORO deve capturar valor porque pequenos vendedores de viagem normalmente não têm:

- boas taxas de adquirência;
- ferramentas de cobrança;
- controle de parcelamento;
- conciliação;
- split;
- cálculo de comissão;
- gestão de grupos;
- cobrança por passageiro;
- controle de repasses;
- gestão de pagamentos internacionais;
- relatórios financeiros claros.

A NORO pode oferecer isso como infraestrutura.

---

## 3. Por que pagamentos são centrais para a NORO

Sem pagamento, a NORO seria apenas:

```txt
CRM
+ propostas
+ site
+ organização
```

Com pagamento, a NORO vira:

```txt
infraestrutura transacional
+ controle de margem
+ motor de comissão
+ plataforma de distribuição
```

O checkout é o ponto onde a plataforma deixa de ser ferramenta e passa a participar da economia da venda.

---

## 4. Características específicas do Brasil

A NORO precisa ser desenhada para a realidade brasileira.

### 4.1 O brasileiro compra parcelado

Viagens são produtos de alto valor.

Muitos clientes esperam:

- parcelamento;
- PIX;
- boleto;
- sinal;
- saldo;
- pagamentos mensais;
- pagamento individual por passageiro;
- possibilidade de contribuição de terceiros.

### 4.2 Cartão de crédito é caro

Taxas de adquirência e parcelamento podem comprometer a margem.

Agências pequenas têm pouco volume e, por isso, negociam mal.

A NORO pode agregar volume e, no futuro, negociar condições melhores.

### 4.3 Grupos exigem controle individual

Uma venda de grupo não é uma venda única simples.

Ela pode envolver:

- vários passageiros;
- vários meios de pagamento;
- diferentes datas;
- cancelamentos individuais;
- inadimplência parcial;
- comissões por líder;
- repasses a fornecedores;
- sinal e saldo;
- documentação individual.

### 4.4 WhatsApp e informalidade

Muitas vendas de turismo começam no WhatsApp e terminam em planilha.

A NORO deve profissionalizar esse fluxo sem torná-lo burocrático.

---

## 5. Princípios da camada financeira

### 5.1 Simplicidade para o usuário

O usuário deve enxergar:

```txt
valor da venda
quanto o cliente pagou
quanto falta pagar
quanto eu vou ganhar
quando vou receber
```

### 5.2 Robustez no backend

O sistema deve armazenar:

```txt
valor bruto
custo
taxas
impostos
margem
comissão
repasse
saldo
eventos financeiros
status
```

### 5.3 Comissão nunca deve ser “achismo”

Toda comissão deve nascer de uma regra rastreável.

### 5.4 Dinheiro precisa de histórico

Toda alteração financeira precisa gerar evento.

Exemplo:

```txt
pagamento criado
pagamento confirmado
pagamento falhou
pagamento reembolsado
comissão calculada
comissão liberada
comissão paga
fornecedor pago
cancelamento solicitado
chargeback aberto
```

### 5.5 O sistema deve separar venda de recebimento

Uma venda aprovada comercialmente não é necessariamente dinheiro recebido.

Estados diferentes:

```txt
proposta enviada
proposta aceita
pagamento pendente
pagamento parcial
pagamento confirmado
reserva confirmada
fornecedor pago
comissão disponível
comissão paga
```

---

## 6. Componentes principais

### 6.1 Checkout

O checkout deve permitir:

- PIX;
- boleto;
- cartão;
- parcelamento;
- pagamento à vista;
- sinal + saldo;
- pagamento por passageiro;
- pagamento por link;
- pagamento de cotas;
- pagamento programado;
- taxa de serviço;
- cupons/descontos, se necessário.

### 6.2 Ledger financeiro

O ledger é o coração contábil interno da NORO.

Ele deve registrar eventos financeiros imutáveis ou auditáveis.

Exemplo de eventos:

```txt
SALE_CREATED
PAYMENT_AUTHORIZED
PAYMENT_CAPTURED
PAYMENT_FAILED
PAYMENT_REFUNDED
SUPPLIER_PAYABLE_CREATED
SUPPLIER_PAID
COMMISSION_CALCULATED
COMMISSION_AVAILABLE
COMMISSION_PAID
PLATFORM_FEE_RECOGNIZED
CHARGEBACK_OPENED
CHARGEBACK_RESOLVED
```

### 6.3 Motor de comissão

Deve calcular comissões por:

- agência;
- consultor;
- líder de grupo;
- afiliado;
- creator;
- operador;
- NORO;
- fornecedor, se houver campanha.

### 6.4 Motor de margem

Deve calcular:

- custo net;
- preço de venda;
- markup;
- taxa de serviço;
- desconto;
- margem bruta;
- taxas de pagamento;
- impostos estimados;
- margem líquida;
- margem distribuível.

### 6.5 Conciliação

Deve reconciliar:

- valor cobrado;
- valor recebido;
- taxa de gateway;
- parcelas;
- repasses;
- pagamentos a fornecedor;
- comissões;
- reembolsos;
- chargebacks.

### 6.6 Repasses

Repasses podem ocorrer para:

- fornecedores;
- consultores;
- líderes de grupo;
- afiliados;
- tenants/agências;
- NORO.

---

## 7. Gateway de pagamento

A NORO deve começar com um gateway/parceiro, não com fintech própria.

Critérios para escolha:

- PIX;
- boleto;
- cartão;
- parcelamento;
- recorrência;
- split, se disponível;
- subcontas, se disponível;
- API boa;
- webhook confiável;
- conciliação;
- saque/repasse;
- custo;
- suporte;
- capacidade de escalar.

### 7.1 Possíveis caminhos

- Asaas;
- Pagar.me;
- Stripe;
- Cielo;
- Rede;
- InfinitePay;
- outro PSP/adquirente;
- solução híbrida.

### 7.2 Recomendação conceitual

Começar com o parceiro que permita:

```txt
cobrar bem
conciliar bem
automatizar bem
suportar boleto/PIX/cartão
integrar rápido
```

A melhor solução não é necessariamente a mais barata no dia 1.

É a que reduz fricção operacional sem travar o futuro.

---

## 8. Modelos de pagamento

### 8.1 À vista

Formas:

- PIX;
- cartão à vista;
- boleto à vista.

Uso:

- seguro;
- visto;
- tours;
- sinal;
- produtos simples.

### 8.2 Parcelado no cartão

Uso comum no Brasil.

O sistema deve calcular:

- taxa do cartão;
- taxa por parcela;
- custo de antecipação, se houver;
- repasse de juros;
- impacto na margem.

### 8.3 Sinal + saldo

Muito útil para viagens, grupos e produtos de alto valor.

Exemplo:

```txt
30% de sinal para reservar
70% até X dias antes da viagem
```

### 8.4 Pagamento por passageiro

Essencial para grupos.

Cada passageiro deve ter:

- valor devido;
- status;
- links próprios;
- pagamentos realizados;
- saldo;
- documentos;
- cancelamento individual.

### 8.5 Pagamento recorrente/programado

Uso:

- viagens futuras;
- grupos;
- intercâmbio;
- Disney;
- formatura;
- cruzeiros;
- lua de mel.

Não deve ser chamado de consórcio.

### 8.6 Cotas de viagem

Uso:

- lua de mel;
- aniversário;
- formatura;
- presente coletivo;
- viagem de 15 anos;
- viagem familiar.

Terceiros contribuem para uma viagem específica.

---

## 9. Pagamento programado / Cofre de Viagem

### 9.1 Definição

Pagamento programado é um fluxo em que o cliente ou grupo paga uma viagem ao longo do tempo, vinculando os pagamentos a uma proposta/viagem específica.

### 9.2 O que não é

Não é:

- consórcio;
- investimento;
- poupança;
- rendimento;
- captação financeira;
- conta remunerada.

### 9.3 O que é

É:

- plano de pagamento;
- cobrança recorrente ou programada;
- saldo vinculado a uma viagem;
- pagamento antecipado de produto/serviço turístico;
- contribuição para uma proposta específica.

### 9.4 Funcionalidades

- criar plano;
- definir valor total;
- definir número de parcelas;
- gerar cobranças;
- acompanhar saldo;
- permitir pagamento avulso;
- permitir contribuição de terceiros;
- emitir recibos;
- aplicar saldo à viagem;
- controlar regras de cancelamento.

### 9.5 Riscos

- enquadramento regulatório;
- reembolso;
- cancelamento;
- dinheiro parado;
- fornecedor sem reserva garantida;
- expectativa do cliente;
- inadimplência.

### 9.6 Mitigações

- vínculo claro com proposta/viagem;
- termos de uso;
- política de cancelamento;
- parceiro de pagamento regulado;
- registro de eventos;
- não prometer rendimento;
- não chamar de consórcio;
- não misturar saldos sem controle.

---

## 10. Cotas de viagem / presente de viagem

### 10.1 Definição

Funcionalidade para que terceiros contribuam financeiramente para uma viagem.

Casos:

- lua de mel;
- casamento;
- aniversário;
- formatura;
- intercâmbio;
- viagem de família;
- viagem religiosa.

### 10.2 Fluxo

```txt
cliente cria viagem/campanha
→ define meta ou cotas
→ compartilha link
→ terceiros contribuem
→ saldo é aplicado à viagem
→ viagem é emitida/operada
```

### 10.3 Receita possível

- taxa de serviço;
- take rate;
- comissão sobre viagem final;
- produtos adicionais;
- plano premium para página personalizada.

### 10.4 Cuidados

- deixar claro destino do valor;
- política de não realização da viagem;
- reembolso;
- identificação de pagadores;
- recibos;
- prevenção de fraude.

---

## 11. Grupos e cobrança individual

### 11.1 Definição

Módulo para gerenciar viagens em grupo com pagamentos individualizados.

### 11.2 Funcionalidades

- criar grupo;
- adicionar passageiros;
- gerar link individual;
- status por pessoa;
- pagamentos parciais;
- saldo;
- vencimentos;
- lembretes;
- inadimplência;
- comissão do líder;
- repasse a fornecedor;
- documentos por passageiro.

### 11.3 Exemplo

```txt
Grupo Miami
10 passageiros
R$ 10.000 por passageiro
GMV: R$ 100.000
Sinal: R$ 2.000 por passageiro
Saldo: R$ 8.000 até data limite
```

O sistema deve mostrar:

```txt
quem pagou
quem está pendente
quanto entrou
quanto falta
quanto é custo
quanto é margem
quanto é comissão
quando fornecedores devem ser pagos
```

---

## 12. Comissão

### 12.1 Papéis com comissão

- consultor;
- líder de grupo;
- afiliado;
- creator;
- agência/tenant;
- vendedor interno;
- operador;
- NORO.

### 12.2 Estados da comissão

```txt
estimada
calculada
pendente
bloqueada
disponível
paga
cancelada
estornada
```

### 12.3 Quando liberar comissão

Possíveis marcos:

- pagamento confirmado;
- reserva confirmada;
- após embarque;
- após viagem;
- após fornecedor pagar comissão;
- após prazo de cancelamento;
- após prazo de chargeback.

### 12.4 Recomendação

No início, não liberar comissão cedo demais.

Viagens têm risco de cancelamento, reembolso e chargeback.

Modelo conservador:

```txt
comissão estimada no fechamento
comissão disponível após confirmação operacional
comissão paga após marco seguro
```

---

## 13. Margem e precificação

### 13.1 Elementos da precificação

```txt
custo fornecedor
markup
taxa de serviço
desconto
taxa de pagamento
imposto
margem NORO
comissão consultor/líder
margem tenant
preço final
```

### 13.2 Simulador de venda

A NORO deve ter um simulador para mostrar:

- preço à vista;
- preço parcelado;
- impacto da taxa;
- desconto possível;
- margem final;
- comissão estimada;
- lucro da agência/NORO.

### 13.3 Previsão de ganhos

Inspirado nos mapas antigos da Unico, o consultor/líder deve ver:

```txt
se vender por R$ X
com custo Y
você pode ganhar até Z
```

Mas isso precisa ser condicionado à confirmação da venda e regras de margem.

---

## 14. Taxas e repasse de custo

### 14.1 Taxa absorvida

A agência/NORO absorve taxa de pagamento.

Vantagem:

- preço mais bonito.

Desvantagem:

- margem menor.

### 14.2 Taxa repassada

Cliente paga taxa de conveniência ou juros.

Vantagem:

- protege margem.

Desvantagem:

- pode reduzir conversão.

### 14.3 Modelo híbrido

Exemplo:

```txt
PIX com desconto
cartão até X parcelas incluso
parcelas maiores com repasse de juros
```

Esse modelo conversa bem com a realidade brasileira.

---

## 15. Split vs. repasse manual

### 15.1 Split automático

Vantagens:

- automatiza repasses;
- reduz trabalho;
- melhora escala.

Desvantagens:

- depende do gateway;
- pode complicar cancelamentos;
- exige KYC;
- pode travar onboarding.

### 15.2 Repasse manual/semiautomático

Vantagens:

- mais simples no início;
- maior controle;
- menos dependência de subcontas.

Desvantagens:

- operacional;
- risco de erro;
- escala pior.

### 15.3 Recomendação

Começar com repasse controlado/semiautomático e arquitetura preparada para split.

---

## 16. Ledger mínimo recomendado para MVP

Mesmo que o MVP seja simples, ele deve ter um ledger básico.

### 16.1 Entidades principais

```txt
Sale
Payment
PaymentInstallment
LedgerEntry
Commission
Payout
Refund
SupplierPayable
PlatformFee
```

### 16.2 Eventos mínimos

```txt
sale.created
payment.created
payment.confirmed
payment.failed
payment.refunded
commission.estimated
commission.confirmed
commission.paid
supplier_payable.created
supplier_payable.paid
platform_fee.recorded
```

### 16.3 Campos importantes

- tenant_id;
- user_id;
- customer_id;
- sale_id;
- payment_id;
- amount_gross;
- amount_net;
- currency;
- status;
- due_date;
- paid_at;
- provider;
- gateway_fee;
- platform_fee;
- supplier_cost;
- commission_amount;
- margin_amount.

---

## 17. Estados financeiros de uma venda

### 17.1 Estados comerciais

```txt
draft
sent
accepted
cancelled
expired
```

### 17.2 Estados de pagamento

```txt
unpaid
partially_paid
paid
failed
refunded
chargeback
```

### 17.3 Estados operacionais

```txt
pending_reservation
reserved
confirmed
documents_issued
in_travel
completed
cancelled
```

### 17.4 Estados de comissão

```txt
not_calculated
estimated
pending
available
paid
reversed
```

Esses estados não são a mesma coisa.

Misturá-los gera caos.

---

## 18. Produtos e impacto financeiro

### 18.1 Seguro viagem

Bom para MVP.

- ticket menor;
- emissão relativamente simples;
- comissão clara;
- API possível;
- baixa complexidade comparada a aéreo.

### 18.2 Vistos

Bom para serviço.

- taxa de serviço;
- checklist;
- acompanhamento;
- margem de consultoria;
- baixo risco de inventário.

### 18.3 Tours e experiências

Bom para marketplace.

- comissionável;
- fácil de vender;
- bom para conteúdo;
- boa integração com proposta.

### 18.4 Hotéis

Importante, mas mais complexo.

- disponibilidade;
- cancelamento;
- tarifa;
- markup;
- voucher;
- suporte.

### 18.5 Aéreo

Alta complexidade.

- tarifa dinâmica;
- emissão;
- remarcação;
- regras;
- cancelamento;
- suporte;
- GDS/consolidadora.

Deve vir depois.

### 18.6 Grupos

Muito importante para GMV.

- alto valor;
- operação complexa;
- forte necessidade de cobrança individual;
- bom incentivo para líderes.

---

## 19. Relatórios financeiros

### 19.1 Para consultor/líder

- vendas;
- comissões estimadas;
- comissões disponíveis;
- comissões pagas;
- clientes pendentes;
- grupos em aberto.

### 19.2 Para agência/tenant

- GMV;
- margem;
- custos;
- comissões;
- inadimplência;
- pagamentos pendentes;
- repasses;
- vendas por usuário;
- produtos mais vendidos.

### 19.3 Para NORO

- GMV total;
- take rate;
- receita SaaS;
- receita transacional;
- comissões totais;
- volume por tenant;
- volume por produto;
- chargeback;
- cancelamentos;
- taxa média de pagamento;
- margem por produto;
- risco financeiro.

---

## 20. Evolução para camada financeira avançada

### 20.1 Fase 1 — Gateway integrado

- cobrar;
- receber;
- status;
- comissão simples;
- relatórios básicos.

### 20.2 Fase 2 — Ledger e grupos

- ledger;
- cobrança por passageiro;
- comissões por papel;
- repasses;
- conciliação.

### 20.3 Fase 3 — Pagamento programado e cotas

- cofre de viagem;
- presente de viagem;
- pagamentos mensais;
- saldo por viagem.

### 20.4 Fase 4 — Condições comerciais agregadas

- negociar taxas;
- volume agregado;
- planos com melhores taxas;
- parceiros financeiros.

### 20.5 Fase 5 — Embedded finance

- antecipação;
- crédito;
- conta;
- cartão;
- financiamento;
- wallet;
- produtos financeiros em parceria.

---

## 21. Riscos jurídicos e regulatórios

### 21.1 Consórcio

Evitar qualquer estrutura que pareça consórcio.

Não usar:

- consórcio;
- contemplação;
- grupo de autofinanciamento;
- sorteio;
- lance;
- rendimento.

### 21.2 Instituição financeira

Não agir como banco sem estrutura.

Usar parceiros regulados.

### 21.3 Guarda de recursos

Cuidado com saldo parado.

Preferir recursos vinculados a proposta/viagem específica.

### 21.4 Pessoa física vendendo

Definir papel como:

- indicador;
- líder;
- promotor;
- afiliado;
- consultor não emissor.

A venda/contrato deve ser operada por empresa responsável.

### 21.5 Tributação

Separar:

- receita de intermediação;
- taxa de serviço;
- comissão;
- repasse;
- reembolso;
- venda própria;
- venda de terceiro.

Precisa de validação contábil.

---

## 22. Decisões pendentes

1. Qual gateway inicial será usado?
2. Haverá split no MVP ou repasse manual?
3. A comissão será sobre valor total ou margem líquida?
4. Quem emite a venda: NORO, Nomade, tenant ou fornecedor?
5. Pessoa física pode vender ou apenas indicar/organizar?
6. Qual marco libera comissão?
7. Como tratar cancelamento antes do embarque?
8. Como tratar chargeback?
9. Haverá sinal + saldo no MVP?
10. Haverá cobrança por passageiro no MVP?
11. Pagamento programado entra em qual fase?
12. Cotas de viagem entram como módulo separado?
13. A NORO cobrará taxa de plataforma visível ou embutida?
14. Como tratar impostos em cada tipo de receita?
15. A arquitetura terá ledger desde o primeiro release?

---

## 23. Recomendação para MVP

O MVP financeiro deve incluir:

- integração com gateway;
- pagamento por PIX, boleto e cartão;
- status de pagamento;
- proposta vinculada a pagamento;
- cálculo simples de margem;
- comissão estimada;
- comissão confirmada;
- relatório básico;
- eventos financeiros;
- estrutura inicial de ledger;
- repasse manual/semiautomático;
- suporte a sinal + saldo, se possível.

Não precisa incluir no MVP:

- fintech;
- crédito;
- wallet;
- antecipação;
- cotas completas;
- pagamento programado completo;
- split avançado;
- múltiplos gateways;
- regras financeiras extremamente complexas.

---

## 24. Conclusão

A camada financeira é uma das maiores vantagens estratégicas possíveis da NORO.

Ela deve transformar um mercado historicamente operado por planilhas, WhatsApp, taxas altas e repasses confusos em uma infraestrutura organizada para vender viagens com segurança.

A visão de longo prazo é grande:

```txt
gateway
→ billing
→ comissão
→ grupos
→ pagamento programado
→ cotas
→ condições financeiras agregadas
→ embedded finance
```

Mas a execução deve começar simples.

Frase central:

> A NORO não deve começar como fintech, mas deve nascer com arquitetura financeira suficiente para um dia se tornar a infraestrutura financeira vertical do turismo distribuído.
