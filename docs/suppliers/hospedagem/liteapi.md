# 🏨 Integração LiteAPI (Nuitee Connect) — Especificação Técnica

Este documento centraliza as especificações técnicas, autenticação, endpoints e fluxos de integração da **LiteAPI (Nuitee Connect)** para o motor de reservas e precificação do Noro Guru.

> [!NOTE]
> Para uma análise detalhada das 69 ferramentas do **MCP Server**, suporte a **Passagens Aéreas**, **Vouchers White-Label**, **Fidelidade** e **Busca Semântica por IA**, consulte o relatório completo em [liteapi-analysis.md](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/docs/suppliers/hospedagem/liteapi-analysis.md).

---

## 1. Visão Geral
*   **Nome do Fornecedor**: LiteAPI (Nuitee Connect Travel)
*   **Verticais Suportadas**: Hospedagem (Hotéis), Passagens Aéreas (Flights GDS/NDC), Vouchers, Fidelização e Analytics.
*   **URL da Documentação Oficial**: [docs.liteapi.travel](https://docs.liteapi.travel/)
*   **MCP Server Endpoint**: `https://mcp.liteapi.travel/api/mcp?apiKey=YOUR_API_KEY`
*   **Adapter Key**: `liteapi`

---

## 2. Autenticação e Ambientes

A autenticação é feita via HTTP Header `X-API-Key` ou parâmetro URL `apiKey`.

### Credencial de Homologação (Sandbox):
*   **API Key**: `sand_b273758a-1ec7-492c-82b1-d356a6bcb142`

### Endpoint Base do Sandbox:
```http
https://api.liteapi.travel/v3.0
```

### Cabeçalhos HTTP Recomendados:
```http
X-API-Key: sand_b273758a-1ec7-492c-82b1-d356a6bcb142
Content-Type: application/json
```

---

## 3. Mapeamento de Endpoints Principais

### A. Hospedagem (Hotels)

| Ação | Endpoint | Descrição |
|---|---|---|
| **Busca de Tarifas** | `POST /hotels/rates` | Consulta a disponibilidade e preços em tempo real para uma lista de hotéis. |
| **Menor Tarifa** | `POST /hotels/min-rates` | Consulta rápida da menor tarifa de cada propriedade para vitrines e mapas. |
| **Pré-reserva (Prebook)** | `POST /rates/prebook` | Valida se a tarifa ainda está disponível antes de ir para o checkout e gera o `prebookId`. |
| **Reserva (Book)** | `POST /rates/book` | Finaliza a compra vinculando o `prebookId` e os nomes dos hóspedes. |
| **Consulta de Reserva** | `GET /bookings/{bookingId}` | Detalhes da reserva, vouchers e status. |
| **Alteração (Amend)** | `PUT /bookings/{bookingId}/amend` | Altera dados dos hóspedes e observações da reserva existente. |

### B. Passagens Aéreas (Flights)

| Ação | Endpoint | Descrição |
|---|---|---|
| **Busca de Voos** | `POST /flights/rates` | Busca tarifas de voos para ida, volta ou múltiplos trechos. |
| **Verificação de Oferta** | `POST /flights/verify` | Valida a expiração e o valor NET da oferta selecionada. |
| **Pré-reserva / Assentos** | `POST /flights/prebooks` | Bloqueia a oferta e registra os dados dos passageiros. |
| **Serviços Adicionais** | `POST /flights/prebooks/{id}/services` | Adiciona bagagens extras e serviços. |
| **Emissão de Bilhetes** | `POST /flights/bookings` | Emite o bilhete aéreo (PNR) via saldo B2B ou cartão. |

---

## 4. Integração com o Motor de Precificação (@noro/lib/pricing-engine)

A integração com a LiteAPI seguirá o mesmo fluxo canônico estabelecido na arquitetura do Noro Guru:

1.  **Custo Net**: A API da LiteAPI retorna valores líquidos em USD ou EUR na propriedade `pricing.display.total` (ou no discriminativo por passageiro).
2.  **Conversão e Markups**: O motor de precificação do Noro Guru converte o custo líquido para BRL usando as cotações ativas da tabela `exchange_rates`, aplica os markups cadastrados em `pricing_rules` para o Tenant e calcula as taxas de gateway Asaas.
3.  **Visualização em Tela**: O preço final em BRL com opções de parcelamento é exibido no checkout.
