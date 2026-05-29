# 07 — NORO Supplier & API Roadmap

> Documento estratégico sobre fornecedores, produtos e integrações de API para a NORO Guru, conectando a operação real da Nomade Guru com a futura infraestrutura replicável para agências, consultores, creators e líderes de grupo.

---

## 1. Objetivo

Este documento define uma visão pragmática para a camada de fornecedores e APIs da NORO.

A meta não é integrar “tudo que existe” logo no início.

A meta é construir uma arquitetura capaz de:

- operar produtos turísticos de forma manual no começo;
- cadastrar fornecedores e regras comerciais;
- vender produtos com margem e comissão;
- conectar APIs gradualmente;
- validar operação usando a Nomade Guru como tenant fundador;
- transformar fluxos reais em módulos replicáveis da NORO.

---

## 2. Princípio central

A NORO deve começar com produtos vendáveis, não com integrações complexas.

```txt
primeiro: vender, operar e medir
depois: automatizar
depois: integrar APIs
depois: escalar catálogo
```

Integrar API antes de validar produto, margem e suporte é um clássico caso de “vamos construir um foguete para entregar pastel”. Bonito, mas desnecessário no começo.

---

## 3. Relação entre Nomade Guru e NORO

A Nomade Guru deve ser a operação real de teste.

```txt
Nomade Guru
→ testa fornecedores
→ testa produtos
→ testa margem
→ testa proposta
→ testa checkout
→ testa suporte
→ testa documentos
→ testa reembolso/cancelamento
→ NORO transforma em produto escalável
```

A NORO deve absorver da Nomade o que funcionar.

---

## 4. Categorias de produtos

A NORO deve organizar fornecedores por categorias.

### 4.1 Seguro viagem

Produto ideal para MVP.

Motivos:

- necessidade clara;
- fácil de acoplar a qualquer viagem;
- comissionável;
- relativamente simples de explicar;
- boa margem potencial;
- emissão/documentação mais simples que aéreo;
- excelente para validar checkout e proposta.

Possíveis fornecedores/integradores:

- IMG Travel Insurance;
- Assist Card;
- Coris;
- outros fornecedores já usados pela Nomade.

### 4.2 Vistos e documentação

Produto de serviço.

Motivos:

- alta dor;
- margem de consultoria;
- checklist;
- acompanhamento;
- possibilidade de automação;
- sinergia com Vistos.Guru.

Produtos possíveis:

- assessoria de visto Brasil;
- vistos internacionais;
- ETA/e-visa;
- checklists;
- revisão de documentos;
- formulários guiados.

### 4.3 Tours e experiências

Produto bom para distribuição.

Motivos:

- visual;
- fácil de vender em landing pages;
- bom para creators;
- bom para páginas de destino;
- comissionável;
- pode começar manual e depois via API.

Possíveis fornecedores/integradores:

- Civitatis;
- GetYourGuide;
- Viator;
- fornecedores locais;
- operadores receptivos.

### 4.4 Transfers

Produto complementar.

Motivos:

- alto uso;
- fácil de vender junto com hotel/viagem;
- boa automação futura;
- reduz fricção do cliente;
- útil para grupos.

Possíveis fornecedores:

- Mobility;
- receptivos locais;
- RateHawk/fornecedores globais;
- parceiros manuais.

### 4.5 Hospedagem

Produto central, mas mais complexo.

Motivos:

- alto volume;
- essencial no turismo;
- boa margem dependendo do fornecedor;
- exige disponibilidade, cancelamento, regras e suporte.

Possíveis fornecedores/integradores:

- LiteAPI;
- HotelBeds;
- RateHawk;
- Expedia TAAP;
- HotelDo;
- Booking, se houver viabilidade;
- operadores e consolidadoras.

### 4.6 Aéreo

Produto importante, mas de alta complexidade.

Motivos para cautela:

- tarifas dinâmicas;
- emissão;
- remarcação;
- cancelamento;
- regras tarifárias;
- GDS/consolidadora;
- suporte complexo;
- risco operacional alto.

Possíveis caminhos:

- Flytour;
- consolidadoras;
- Amadeus;
- APIs de busca;
- Skyscanner apenas como inspiração/busca, se aplicável;
- FlightAPI/FlightAware como dados auxiliares.

Aéreo não deve ser o primeiro grande módulo transacional da NORO.

### 4.7 Cruzeiros

Produto forte para grupos e consultores.

Motivos:

- ticket alto;
- boa comissão;
- ótimo para grupos;
- bom para líderes;
- boa narrativa de venda;
- exige especialização.

Pode entrar como produto manual inicialmente.

### 4.8 Pacotes e grupos

Produto altamente estratégico.

Motivos:

- GMV alto;
- conversa com líder de grupo;
- permite margem;
- permite cobrança por passageiro;
- valida comissionamento;
- diferencia a NORO de CRMs genéricos.

Pode começar 100% manual.

### 4.9 Aluguel de carro

Produto complementar.

Possíveis fornecedores/integradores:

- CarTrawler;
- Mobility;
- locadoras;
- parceiros locais.

Não deve ser prioridade inicial, mas pode entrar como add-on.

---

## 5. Tipos de fornecedor

A NORO deve aceitar diferentes tipos de fornecedores.

### 5.1 Fornecedor manual

Fornecedor cadastrado sem API.

Exemplo:

- receptivo local;
- guia;
- operador;
- hotel parceiro;
- agência parceira;
- fornecedor de visto;
- transfer local.

Funcionalidades necessárias:

- cadastro;
- contatos;
- produtos;
- tarifas;
- regras;
- documentos;
- status;
- comissões;
- observações.

### 5.2 Fornecedor semiautomático

Fornecedor com portal ou extranet, mas sem integração completa.

Exemplo:

- RateHawk;
- Expedia TAAP;
- HotelDo;
- Flytour;
- Civitatis;
- plataformas com painel.

Fluxo:

```txt
consultor cria proposta na NORO
→ operador consulta fornecedor externo
→ insere dados na NORO
→ cliente paga na NORO
→ operação confirma fora
→ voucher/documento é anexado na NORO
```

### 5.3 Fornecedor via API

Fornecedor com integração técnica.

Fluxo:

```txt
cotação
→ disponibilidade
→ reserva
→ pagamento
→ confirmação
→ voucher
→ cancelamento
```

Esse é o estágio mais avançado.

### 5.4 Fornecedor global NORO

Fornecedor homologado pela plataforma e disponível para vários tenants.

### 5.5 Fornecedor próprio do tenant

Fornecedor cadastrado por uma agência/tenant específico.

Deve respeitar permissões.

---

## 6. Roadmap de integração

### Fase 1 — Catálogo manual

Objetivo:

- permitir venda antes de integrar APIs.

Funcionalidades:

- cadastro de fornecedores;
- cadastro de produtos;
- custo net;
- preço de venda;
- markup;
- comissão;
- documentos;
- observações;
- anexos;
- status.

Produtos ideais:

- seguros;
- vistos;
- tours;
- transfers;
- pacotes;
- grupos;
- consultoria;
- serviços manuais.

### Fase 2 — Produtos semiautomáticos

Objetivo:

- usar fornecedores externos já existentes sem integração profunda.

Funcionalidades:

- campos de confirmação;
- número de reserva;
- voucher;
- fornecedor vinculado;
- custo e margem;
- status operacional;
- prazos de pagamento.

### Fase 3 — Primeiras APIs simples

Objetivo:

- integrar produtos com menor risco.

Prioridade sugerida:

```txt
1. seguro viagem
2. tours/experiências
3. transfers
4. hotelaria simples
```

### Fase 4 — Hotelaria estruturada

Objetivo:

- integrar disponibilidade, tarifa, reserva e cancelamento de hospedagem.

Requisitos:

- regras de cancelamento;
- moedas;
- impostos/taxas;
- disponibilidade;
- markup;
- voucher;
- suporte.

### Fase 5 — Aéreo e GDS

Objetivo:

- integrar busca/emissão aérea apenas quando a operação estiver madura.

Requisitos:

- equipe operacional;
- regras tarifárias;
- remarcação;
- cancelamento;
- suporte;
- conciliação;
- fallback manual.

### Fase 6 — Marketplace de fornecedores

Objetivo:

- permitir que fornecedores publiquem produtos para a rede NORO.

Requisitos:

- portal fornecedor;
- regras comerciais;
- comissão;
- SLA;
- reputação;
- aprovação;
- moderação;
- suporte.

---

## 7. APIs e fornecedores mapeados

A lista de Notion indica possíveis APIs e fornecedores:

```txt
LiteAPI Travel
Amadeus
CarTrawler
GetYourGuide
HotelBeds
Booking
TripAdvisor
FlightAware
Skyscanner
FlightAPI
RapidAPI
BrokerNexus
IMG Travel Insurance
```

Além disso, a operação da Nomade já tem ou pode ter relação com fornecedores como:

```txt
Flytour
HotelDo
Expedia TAAP
RateHawk
Agaxtur
AIC Travel Group
Assist Card
Mobility
Coris
Civitatis
IMG
```

---

## 8. Priorização recomendada

### 8.1 Prioridade alta para MVP

#### Seguro viagem

Motivo:

- rápido de vender;
- produto universal;
- boa conexão com SafeTrip Guru;
- documentação técnica IMG já existe;
- ótimo para testar checkout.

#### Vistos / serviços

Motivo:

- produto próprio de consultoria;
- conexão com Vistos.Guru;
- alta margem de serviço;
- baixa dependência de inventário.

#### Tours e experiências

Motivo:

- bom para páginas de destino;
- bom para creators;
- fácil de explicar;
- operação possível manualmente;
- Civitatis/GetYourGuide como referências.

#### Pacotes manuais e grupos

Motivo:

- valida o core H2B2H;
- alto GMV;
- ótimo para líderes de grupo;
- exige mais operação, mas menos API.

---

### 8.2 Prioridade média

#### Hospedagem

Motivo:

- importante para turismo;
- boa receita;
- mas exige mais controle.

Fornecedores possíveis:

- LiteAPI;
- HotelBeds;
- RateHawk;
- Expedia TAAP;
- HotelDo.

#### Transfers

Motivo:

- complementar e útil;
- especialmente para grupos.

#### Cruzeiros

Motivo:

- alto ticket;
- bom para consultores;
- boa margem;
- mas exige especialização.

---

### 8.3 Prioridade baixa no início

#### Aéreo/GDS

Motivo:

- complexidade alta;
- suporte pesado;
- risco operacional;
- margem menor;
- regras complicadas.

#### TripAdvisor/Skyscanner/FlightAware

Podem servir mais como dados, inspiração ou camada auxiliar do que como core transacional inicial.

#### RapidAPI

Usar com cuidado.

Pode ser útil para protótipos, mas não deve ser base crítica de produto sem validação de estabilidade, contrato e custo.

---

## 9. Modelo de produto manual antes da API

A NORO deve permitir criar produtos manualmente com campos robustos.

### 9.1 Campos básicos

- nome do produto;
- categoria;
- fornecedor;
- descrição;
- destino;
- duração;
- inclusões;
- exclusões;
- política de cancelamento;
- imagens;
- documentos;
- custo net;
- preço de venda;
- moeda;
- markup;
- comissão;
- disponibilidade manual;
- validade da oferta.

### 9.2 Campos operacionais

- contato do fornecedor;
- prazo de confirmação;
- prazo de pagamento;
- forma de pagamento ao fornecedor;
- status da reserva;
- número de confirmação;
- voucher;
- observações internas;
- responsável operacional.

### 9.3 Campos comerciais

- pode aparecer em site público;
- pode ser vendido por consultores;
- comissão por perfil;
- campanha vinculada;
- tenant permitido;
- margem mínima;
- preço mínimo;
- destaque.

---

## 10. Supplier Hub

A NORO deve ter um módulo de Supplier Hub.

### 10.1 Objetivo

Centralizar fornecedores, produtos, tarifas, contatos, regras e documentos.

### 10.2 Funcionalidades iniciais

- cadastro de fornecedor;
- categorias;
- contatos;
- documentos;
- produtos;
- regras comerciais;
- status;
- observações;
- anexos;
- vinculação a tenant ou global.

### 10.3 Funcionalidades futuras

- portal do fornecedor;
- envio de disponibilidade;
- atualização de tarifas;
- confirmação de reservas;
- upload de vouchers;
- relatórios de vendas;
- repasses;
- reputação;
- SLA.

---

## 11. API abstraction layer

A NORO deve evitar acoplar o produto diretamente a uma API específica.

Criar uma camada de abstração.

### 11.1 Exemplo

Em vez de o sistema depender diretamente de “HotelBeds”, criar um domínio interno:

```txt
AccommodationProvider
SearchAccommodation
BookAccommodation
CancelAccommodation
GetVoucher
```

HotelBeds, LiteAPI ou RateHawk entram como providers.

### 11.2 Benefício

Permite trocar fornecedor sem reconstruir o produto.

### 11.3 Categorias de abstração

```txt
InsuranceProvider
VisaServiceProvider
TourProvider
TransferProvider
AccommodationProvider
CarRentalProvider
FlightProvider
CruiseProvider
PaymentProvider
```

---

## 12. Dados e normalização

Cada fornecedor usa nomes e estruturas diferentes.

A NORO precisa normalizar.

### 12.1 Entidades comuns

- destination;
- product;
- supplier;
- rate;
- availability;
- booking;
- passenger;
- voucher;
- cancellation_policy;
- commission_rule;
- markup_rule;
- currency;
- tax;
- fee.

### 12.2 Problemas esperados

- moedas diferentes;
- impostos inclusos ou não;
- regras de cancelamento diferentes;
- campos incompletos;
- imagens ruins;
- descrições inconsistentes;
- nomes duplicados;
- destinos com grafias diferentes;
- timezones;
- disponibilidade divergente.

---

## 13. Operação antes de automação

Mesmo com APIs, a NORO deve ter fallback manual.

### 13.1 Por quê?

Porque turismo quebra.

API cai, fornecedor muda regra, tarifa expira, voucher não chega, cliente altera data.

### 13.2 Requisito

Toda reserva/API deve permitir intervenção humana:

- editar status;
- anexar voucher;
- corrigir valor;
- adicionar observação;
- cancelar;
- solicitar suporte;
- registrar evento.

---

## 14. Regras comerciais por fornecedor

Cada fornecedor pode ter regras diferentes.

### 14.1 Campos necessários

- comissão padrão;
- markup mínimo;
- prazo de pagamento;
- moeda;
- política de cancelamento;
- impostos;
- quem emite nota/recibo;
- quem presta suporte;
- quem responde pelo erro;
- quem pode vender;
- quais tenants têm acesso.

### 14.2 Regra global vs. tenant

A NORO pode ter fornecedores globais.

Mas tenants podem ter regras próprias.

Exemplo:

```txt
Fornecedor global: Civitatis
Comissão NORO: X
Comissão tenant: Y
Comissão consultor: Z
```

---

## 15. Fornecedores como motor de distribuição

Fornecedores podem criar campanhas.

Exemplo:

```txt
Hotel parceiro quer vender pacote em baixa temporada
→ cria campanha
→ NORO disponibiliza para agências/consultores/creators
→ cada um divulga com página própria
→ vendas são rastreadas
→ comissão é distribuída
```

Esse é um módulo futuro, não MVP.

---

## 16. Relação com IA

A IA pode apoiar a camada de fornecedores.

### 16.1 Usos

- resumir produto;
- transformar descrição técnica em texto comercial;
- gerar FAQ;
- sugerir combinação de produtos;
- comparar alternativas;
- traduzir conteúdo;
- extrair regras de cancelamento;
- criar roteiro com produtos;
- sugerir upsell;
- alertar inconsistências.

### 16.2 Cuidado

IA não deve inventar disponibilidade, preço ou regra.

Dados de fornecedor precisam ser fonte de verdade.

---

## 17. Integração com propostas

Produtos devem entrar facilmente em propostas.

Fluxo:

```txt
consultor cria proposta
→ busca produto manual/API
→ adiciona à proposta
→ sistema calcula custo, markup, comissão
→ cliente aprova
→ checkout
→ reserva/confirmar produto
→ voucher
```

---

## 18. Integração com sites

Produtos devem poder virar páginas.

Exemplo:

```txt
tour no Rio de Janeiro
→ página pública
→ lead ou checkout
→ comissão atribuída
```

Ou:

```txt
pacote Disney grupo 2026
→ página do líder
→ cobrança por passageiro
```

---

## 19. Integração com billing

Produto, fornecedor e pagamento precisam estar conectados.

Cada item vendido deve ter:

- custo;
- fornecedor;
- margem;
- comissão;
- status de pagamento;
- status de reserva;
- repasse;
- política de cancelamento.

Sem isso, a plataforma perde controle econômico.

---

## 20. Métricas de fornecedores

### 20.1 Comerciais

- vendas por fornecedor;
- GMV por fornecedor;
- margem por fornecedor;
- conversão por produto;
- ticket médio;
- produtos mais vendidos.

### 20.2 Operacionais

- tempo de confirmação;
- cancelamentos;
- reclamações;
- suporte;
- falhas de reserva;
- vouchers pendentes.

### 20.3 Financeiras

- comissões recebidas;
- repasses pagos;
- margem líquida;
- taxa de reembolso;
- inadimplência;
- custo de suporte.

### 20.4 Qualidade

- avaliação do cliente;
- avaliação do consultor;
- NPS;
- problemas recorrentes.

---

## 21. Riscos

### 21.1 Integrar API cedo demais

Risco:

- gastar energia técnica sem validar demanda.

Mitigação:

- começar manual/semiautomático.

### 21.2 Depender de fornecedor único

Risco:

- mudança de regra;
- corte de acesso;
- margem baixa;
- instabilidade.

Mitigação:

- provider abstraction layer;
- fornecedores alternativos;
- fallback manual.

### 21.3 Dados ruins

Risco:

- proposta errada;
- preço errado;
- regra errada.

Mitigação:

- revisão;
- logs;
- validação;
- status;
- fonte de verdade.

### 21.4 Complexidade operacional

Risco:

- suporte explodir.

Mitigação:

- poucos produtos no início;
- templates;
- automação gradual;
- equipe/rotina operacional.

### 21.5 Produto sem margem

Risco:

- vender muito e ganhar pouco.

Mitigação:

- margem mínima;
- simulador;
- regra por produto;
- análise de rentabilidade.

---

## 22. MVP recomendado para Supplier/API

### 22.1 Entrar no MVP

- cadastro manual de fornecedor;
- cadastro manual de produto;
- categoria;
- custo;
- preço;
- markup;
- comissão;
- anexos;
- status;
- vínculo com proposta;
- vínculo com venda;
- vínculo com pagamento;
- voucher/documento;
- fornecedor global ou tenant.

### 22.2 Não entrar no MVP

- integração aérea;
- múltiplas APIs;
- marketplace de fornecedor;
- portal fornecedor;
- disponibilidade em tempo real complexa;
- precificação dinâmica avançada;
- IA tomando decisão de disponibilidade.

---

## 23. Roadmap sugerido

### Fase 1 — Manual first

- Supplier Hub básico;
- produtos manuais;
- propostas;
- checkout;
- comissão;
- vouchers anexados.

### Fase 2 — Produtos prioritários

- seguro;
- vistos;
- tours;
- transfers;
- grupos.

### Fase 3 — Primeira API real

Escolher um produto com menor risco.

Possível candidato:

```txt
IMG Travel Insurance
```

ou outro fornecedor com documentação clara e caso de uso simples.

### Fase 4 — Hotelaria

- LiteAPI;
- HotelBeds;
- RateHawk;
- outro fornecedor escolhido.

### Fase 5 — Catálogo distribuível

- produtos publicados para tenants;
- campanhas;
- páginas;
- comissão por canal.

### Fase 6 — APIs complexas

- aéreo;
- GDS;
- car rental;
- múltiplos fornecedores;
- comparação.

### Fase 7 — Supplier Marketplace

- fornecedores publicam produtos;
- tenants vendem;
- NORO controla regras;
- reputação;
- SLAs.

---

## 24. Decisões pendentes

1. Qual fornecedor/produto será o primeiro piloto?
2. A primeira integração será seguro, tours ou hotel?
3. A Nomade operará manualmente os fornecedores no início?
4. Produtos de terceiros serão globais ou por tenant?
5. Tenants poderão cadastrar fornecedores próprios no MVP?
6. Quem será responsável pelo suporte do produto vendido?
7. Como serão configuradas comissões por fornecedor?
8. Como tratar cancelamento e reembolso por categoria?
9. Qual será a camada de abstração técnica para APIs?
10. Qual dado será considerado fonte da verdade?
11. Como evitar vender produto sem margem?
12. Como versionar tarifas e regras?
13. Como lidar com moedas diferentes?
14. Qual integração deve esperar maturidade operacional?

---

## 25. Conclusão

A camada de fornecedores e APIs é essencial para a NORO, mas deve ser construída com pragmatismo.

A NORO não precisa nascer integrada com todos os fornecedores.

Ela precisa nascer capaz de vender, operar e medir produtos reais.

A estratégia correta é:

```txt
manual
→ semiautomático
→ API simples
→ API complexa
→ marketplace de fornecedores
```

Frase central:

> A NORO deve integrar APIs apenas depois de entender quais produtos vendem, quais dão margem e quais a operação consegue suportar.

Esse é o caminho para não transformar a plataforma em um museu de integrações bonitas que ninguém usa.
