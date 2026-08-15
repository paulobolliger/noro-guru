# 🚗 Integração RateHawk — API de Aluguel de Carros (Car Rental)

Este documento mapeia a vertical de **Aluguel de Carros** da RateHawk (Emerging Travel Group — ETG) para o motor de reservas e precificação do Noro Guru.

---

## 1. Visão Geral
*   **Nome do Fornecedor**: RateHawk (Emerging Travel Group)
*   **Vertical**: Aluguel de Carros (Car Rental)
*   **Contato Comercial / Suporte Técnico**: apisupport@ratehawk.com / metasearch@emergingtravel.com
*   **URL da Documentação Oficial**: [docs.emergingtravel.com](https://docs.emergingtravel.com/) (Acesso restrito via painel do parceiro B2B)
*   **Adapter Key**: `ratehawk_cars`

---

## 2. Autenticação e Ambientes (Sandbox)
As credenciais de autenticação da vertical de Carros são as mesmas utilizadas na vertical de Hospedagem (HTTP Basic Authentication).
*   **Username (API Key ID)**: `203`
*   **Password (Access Token)**: `297ccc67-ef1d-4b0a-9421-43d4dce5423a`

### Endpoint Base do Sandbox:
```http
https://api.worldota.net/api/b2b/v3/car/
```

### Cabeçalho HTTP:
```http
Authorization: Basic MjAzOjI5N2NjYzY3LWVmMWQtNGIwYS05NDIxLTQzZDRkY2U1NDIzYQ==
```

> [!NOTE]
> **Ativação do Módulo**: A API de aluguel de carros é um módulo adicional que deve ser expressamente ativado pelo seu Gerente de Contas B2B da RateHawk. Certifique-se de que a API Key ID `203` está habilitada para o serviço de carros no sandbox antes de iniciar os testes de integração.

---

## 3. Mapeamento de Custo e Precificação (Net vs. Bruto)

Para carros, o motor de precificação canônico do Noro Guru ([@noro/lib Pricing Engine](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/packages/lib/pricing-engine/engine.ts)) receberá o custo **Net** retornado pela API da RateHawk e aplicará os cálculos baseados nas regras comerciais ativas do tenant:

1.  **Custo Net (Carro + Taxas de Retirada)**: O valor líquido do aluguel retornado pela API.
2.  **Markup do Tenant**: Markup cadastrado em `pricing_rules` para a categoria `car_rental` (com fallback para regras globais do tenant).
3.  **MDR de Parcelamento**: Calculado e somado de forma proporcional com base nas regras do Asaas configuradas para o tenant.
4.  **Valor Bruto**: Preço final de venda exibido na proposta e cobrado no checkout do cliente.

---

## 4. Fluxo de Integração (Endpoints & Contratos Esperados)

A integração de carros segue uma esteira REST clássica de 3 passos para confirmação de tarifa antes de efetivar o bloqueio.

```mermaid
graph TD
    A[Busca de Carros /car/search] --> B[Seleção & Prebook /car/prebook]
    B --> C[Efetivação de Reserva /car/book]
    C --> D[Obtenção do Voucher /car/info]
```

### A. Busca/Disponibilidade
*   **Endpoint**: `POST /car/search/`
*   **Descrição**: Consulta as locadoras disponíveis de acordo com local de retirada/devolução, datas, horários e tipo de veículo.
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "pickup_location_id": "GRU",
  "dropoff_location_id": "GRU",
  "pickup_datetime": "2026-08-10T10:00:00Z",
  "dropoff_datetime": "2026-08-17T10:00:00Z",
  "driver_age": 30,
  "residency": "br",
  "currency": "USD"
}
```
*   **Estrutura de Resposta (Mock de Referência)**: Retorna a lista de veículos com o `match_hash` de tarifa associado para seleção.

---

### B. Pré-Reserva / Validação de Tarifa (Prebook)
*   **Endpoint**: `POST /car/prebook/`
*   **Descrição**: Valida se o veículo e a tarifa selecionada ainda estão disponíveis. Retorna taxas adicionais locais (como taxa de aeroporto ou seguros obrigatórios) e o `match_hash` atualizado para finalizar o booking.
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "match_hash": "car_tariff_uuid_hash_from_search",
  "currency": "USD"
}
```

---

### C. Confirmação / Emissão (Confirm / Book)
*   **Endpoint**: `POST /car/order/book/`
*   **Descrição**: Conclui o aluguel do carro debitando o valor do saldo de depósito B2B do tenant na RateHawk.
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "match_hash": "car_tariff_uuid_hash_from_prebook",
  "partner_order_id": "NORO-CAR-1002394",
  "driver": {
    "first_name": "Paulo",
    "last_name": "Bolliger",
    "phone": "+5511999999999",
    "email": "corporate-agency@noroguru.com"
  },
  "payment_type": "deposit"
}
```

---

### D. Cancelamento (Cancel)
*   **Endpoint**: `POST /car/order/cancel/`
*   **Descrição**: Cancela a reserva de veículo ativa respeitando as políticas de cancelamento e penalidades mapeadas no prebook.
*   **Estrutura de Requisição (Mock de Referência)**:
```json
{
  "partner_order_id": "NORO-CAR-1002394"
}
```

---

## 5. Tratamento de Erros e Códigos de Status

| Código HTTP | Erro da API | Mapeamento no Backend Noro Guru | Ação na UI do Agente |
|---|---|---|---|
| **400 / 422** | `rate_not_found` | Invalidação de cotação | "Veículo selecionado não está mais disponível. Por favor, pesquise novamente." |
| **400** | `age_not_allowed` | Erro de regra de negócio | "Idade do condutor abaixo do mínimo exigido pela locadora." |
| **402** | `insufficient_balance` | Bloqueio de Emissão | Alerta no Control Plane: "Saldo B2B insuficiente com o provedor. Fale com a administração." |
| **5xx** | Erro de Provedor | Log em `integration_logs` | "Serviço temporariamente indisponível. Tente novamente em alguns instantes." |

---

## 6. Testes Obrigatórios de Sandbox (Pre-Certification)
Para validar o aluguel de carros no ambiente sandbox da RateHawk:
1.  **Reserva Padrão**: Execute um fluxo completo de ponta a ponta (Search -> Prebook -> Book) usando o ID de localização de teste fornecido na documentação do parceiro (Ex: Aeroporto GRU ou aeroportos dos EUA).
2.  **Tratamento de Idade do Condutor**: Faça uma cotação informando idade do motorista inferior a 21 anos para validar se o sistema trata e exibe corretamente restrições ou taxas extras de jovem condutor.
3.  **Simulação de Falha de Pagamento**: Adicione o sufixo `_insufficient_b2b_balance` no campo `partner_order_id` durante a chamada `/car/order/book/` para testar a resiliência do fluxo de pagamento e logs de falhas.
