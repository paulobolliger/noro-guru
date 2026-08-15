# 🚐 Integração RateHawk — API de Transfers (Traslados)

Este documento mapeia a vertical de **Transfers (Traslados)** da RateHawk (Emerging Travel Group — ETG) para o motor de reservas e precificação do Noro Guru.

---

## 1. Visão Geral
*   **Nome do Fornecedor**: RateHawk (Emerging Travel Group)
*   **Vertical**: Traslados (Transfers - Aeroporto/Hotel/Eventos)
*   **Contato Comercial / Suporte Técnico**: apisupport@ratehawk.com / metasearch@emergingtravel.com
*   **URL da Documentação Oficial**: [docs.emergingtravel.com](https://docs.emergingtravel.com/) (Acesso restrito via painel do parceiro B2B)
*   **Adapter Key**: `ratehawk_transfers`

---

## 2. Autenticação e Ambientes (Sandbox)
As credenciais de autenticação da vertical de Transfers utilizam a mesma infraestrutura de chaves (HTTP Basic Authentication):
*   **Username (API Key ID)**: `203`
*   **Password (Access Token)**: `297ccc67-ef1d-4b0a-9421-43d4dce5423a`

### Endpoint Base do Sandbox:
```http
https://api.worldota.net/api/b2b/v3/transfer/
```

### Cabeçalho HTTP:
```http
Authorization: Basic MjAzOjI5N2NjYzY3LWVmMWQtNGIwYS05NDIxLTQzZDRkY2U1NDIzYQ==
```

> [!IMPORTANT]
> **Flight Tracking e Atrasos**: O serviço de transfer da RateHawk inclui rastreamento automático do status do voo (*Flight Tracking*). Certifique-se de que a requisição de reserva envie o número do voo correto para garantir que o receptivo local monitore eventuais atrasos na retirada do passageiro.

---

## 3. Mapeamento de Custo e Precificação (Net vs. Bruto)

O motor de precificação canônico do Noro Guru ([@noro/lib Pricing Engine](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/packages/lib/pricing-engine/engine.ts)) processará os transfers usando a seguinte lógica:

1.  **Custo Net (Transfer)**: O valor líquido do veículo/trecho retornado pela API da RateHawk.
2.  **Markup do Tenant**: Markup cadastrado em `pricing_rules` para a categoria `transfer` (com fallback para regras globais do tenant).
3.  **MDR de Parcelamento**: Calculado e somado de forma proporcional com base nas regras do Asaas configuradas para o tenant.
4.  **Valor Bruto**: Preço final de venda exibido na proposta e cobrado no checkout do cliente.

---

## 4. Fluxo de Integração (Endpoints & Contratos Esperados)

O fluxo de transfer suporta viagens de ida simples (*one-way*) e de ida e volta (*round-trip*) no mesmo payload de busca.

```mermaid
graph TD
    A[Busca de Rota /transfer/search] --> B[Seleção de Veículo & Prebook /transfer/prebook]
    B --> C[Efetivação de Agendamento /transfer/book]
    C --> D[Obtenção do Voucher /transfer/info]
```

### A. Busca/Disponibilidade
*   **Endpoint**: `POST /transfer/search/`
*   **Descrição**: Consulta veículos disponíveis para a rota especificada de coordenadas ou endereços (aeroporto para hotel, hotel para aeroporto ou ponto-a-ponto).
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "pickup_point": {
    "type": "airport",
    "code": "GRU",
    "name": "Guarulhos Airport"
  },
  "dropoff_point": {
    "type": "hotel",
    "id": "10004834",
    "name": "Conrad Los Angeles"
  },
  "pickup_datetime": "2026-08-10T14:30:00Z",
  "passengers": {
    "adults": 2,
    "children_ages": [5]
  },
  "round_trip": false,
  "currency": "USD"
}
```
*   **Estrutura de Resposta**: Retorna os veículos disponíveis (sedan, SUV, minivan, van) e o `match_hash` de tarifa.

---

### B. Pré-Reserva (Prebook)
*   **Endpoint**: `POST /transfer/prebook/`
*   **Descrição**: Valida se a tarifa do veículo selecionado ainda está disponível, bloqueia a rota com o provedor local e retorna a quantidade de bagagem permitida por passageiro.
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "match_hash": "transfer_tariff_uuid_hash_from_search",
  "currency": "USD"
}
```

---

### C. Confirmação / Emissão (Confirm / Book)
*   **Endpoint**: `POST /transfer/order/book/`
*   **Descrição**: Confirma o agendamento do traslado debitando o valor correspondente do saldo de depósito B2B do tenant na RateHawk.
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "match_hash": "transfer_tariff_uuid_hash_from_prebook",
  "partner_order_id": "NORO-TRF-1092837",
  "lead_passenger": {
    "first_name": "Paulo",
    "last_name": "Bolliger",
    "phone": "+5511999999999",
    "email": "corporate-agency@noroguru.com"
  },
  "flight_number": "LA8074",
  "luggage_count": 3,
  "special_requests": "Need 1 child seat for a 5 year old",
  "payment_type": "deposit"
}
```

---

### D. Cancelamento (Cancel)
*   **Endpoint**: `POST /transfer/order/cancel/`
*   **Descrição**: Cancela o agendamento do transfer de acordo com os termos de penalidades exibidos na cotação.
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "partner_order_id": "NORO-TRF-1092837"
}
```

---

## 5. Tratamento de Erros e Códigos de Status

| Código HTTP | Erro da API | Mapeamento no Backend Noro Guru | Ação na UI do Agente |
|---|---|---|---|
| **400** | `luggage_exceeded` | Erro de regra de negócio | "Número de bagagens excede o limite máximo permitido para este veículo." |
| **400** | `invalid_pickup_time` | Invalidação de cotação | "O horário de retirada deve ser de pelo menos X horas após a chegada do voo." |
| **402** | `insufficient_balance` | Bloqueio de Emissão | Alerta no Control Plane: "Saldo B2B insuficiente com o provedor. Fale com a administração." |
| **5xx** | Erro de Provedor | Log em `integration_logs` | "Serviço temporariamente indisponível. Tente novamente em alguns instantes." |

---

## 6. Testes Obrigatórios de Sandbox (Pre-Certification)
Para validar traslados no sandbox da RateHawk:
1.  **Reserva Aeroporto -> Hotel**: Efetue uma reserva padrão saindo de um aeroporto principal de teste informando o número do voo (Ex: "AA100") e verifique se as informações de recepção (local de encontro no terminal) são retornadas e formatadas na UI do voucher.
2.  **Solicitação de Cadeirinha de Bebê**: Faça um teste enviando a contagem de crianças e especificando nas observações (`special_requests`) a necessidade de assento infantil, validando a transmissão correta do campo text do request.
3.  **Simulação de Falha de Pagamento**: Envie a chamada de confirmação com o sufixo `_insufficient_b2b_balance` no campo `partner_order_id` e valide se o status de falha é corretamente capturado no logs do banco.
