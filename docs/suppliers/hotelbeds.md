# 🏨 Hotelbeds APItude — Especificação Técnica de Integração (Hotéis, Atividades & Transfers)

Este documento especifica a arquitetura de integração, autenticação por Assinatura SHA-256 e consumo da suíte **APItude da Hotelbeds** (Hotéis, Atividades/Passeios e Transfers) no motor do **Noro Guru**.

---

## 📌 1. Visão Geral
*   **Fornecedor**: Hotelbeds (Bedbank B2B Global #1)
*   **Verticais**:
    1. **APItude Hotels**: Reserva de Hotéis Globais (`/hotel-api/1.0` e `/hotel-content-api/1.0`)
    2. **APItude Activities**: Passeios, Excursões e Ingressos (`/activity-api/3.0`)
    3. **APItude Transfers**: Shuttles e Transporte executivo (`/transfer-cache-api/1.0` e `/transfer-api/1.0`)
*   **Documentação Oficial**: `https://developer.hotelbeds.com/documentation/getting-started/`
*   **Adapter Key**: `hotelbeds`

---

## 🌐 2. Ambientes e Base URLs

| Ambiente | Base URL |
|---|---|
| **Sandbox / Pruebas** | `https://api.test.hotelbeds.com` |
| **Produção** | `https://api.hotelbeds.com` |

---

## 🔐 3. Autenticação por Criptografia SHA-256 (`X-Signature`)

A Hotelbeds exige a geração dinâmica do cabeçalho `X-Signature` a cada requisição HTTP:

### Algoritmo de Assinatura:
$$\text{X-Signature} = \text{SHA256}(\text{ApiKey} + \text{Secret} + \text{TimestampInSeconds})$$

```javascript
const crypto = require('crypto');
const timestamp = Math.floor(Date.now() / 1000);
const signature = crypto.createHash('sha256')
  .update(apiKey + secret + timestamp)
  .digest('hex');
```

### Headers HTTP Obrigatórios:

| Header HTTP | Descrição |
|---|---|
| `Api-key` | Chave pública da API |
| `X-Signature` | Hash SHA-256 gerado em tempo real |
| `Accept` | `application/json` |
| `Accept-Encoding` | `gzip` |
| `Content-Type` | `application/json` (Em chamadas POST) |

---

## 🔑 4. Credenciais Sandbox Testadas & Validadas (`HOTELBEDS SPAIN - PRUEBAS`)

Todas as 3 chaves foram **testadas e validadas com sucesso (HTTP 200 OK)**:

| Vertical | Alias | Api-key | Secret | Status Testado |
|---|---|---|---|---|
| 🏨 **Hotéis** | `hotel` | `0e04908f5aa34c0373597c6333346e37` | `KJHYJMWQAz` | 🟢 **HTTP 200 OK** |
| 🎟️ **Atividades** | `atividades` | `2a4fd0b5f6daa8aa4f2e677319405c49` | `6fYowm58hB` | 🟢 **HTTP 200 OK** |
| 🚐 **Transfers** | `transfers` | `a8daf8289233835a3bfd6c46bd863a53` | `Al8eH3zArm` | 🟢 **HTTP 200 OK** |

### Configuração no `.env.local`:
```env
# Hotelbeds APItude (Pruebas - Sandbox)
HOTELBEDS_HOTEL_API_KEY=0e04908f5aa34c0373597c6333346e37
HOTELBEDS_HOTEL_SECRET=KJHYJMWQAz

HOTELBEDS_ACTIVITIES_API_KEY=2a4fd0b5f6daa8aa4f2e677319405c49
HOTELBEDS_ACTIVITIES_SECRET=6fYowm58hB

HOTELBEDS_TRANSFERS_API_KEY=a8daf8289233835a3bfd6c46bd863a53
HOTELBEDS_TRANSFERS_SECRET=Al8eH3zArm
```

---

## 🛠️ 5. Principais Endpoints Mapeados

### A. APItude Hotels (`/hotel-api/1.0`)
*   `GET /hotel-api/1.0/status`: Verificação de saúde da API.
*   `POST /hotel-api/1.0/hotels`: Pesquisa concorrente de hotéis por destino ou coordenadas GPS.
*   `POST /hotel-api/1.0/checkrates`: Checagem de disponibilidade e tarifa em tempo real (Re-eval).
*   `POST /hotel-api/1.0/bookings`: Criação e confirmação de reserva de hotel.
*   `DELETE /hotel-api/1.0/bookings/{bookingReference}`: Cancelamento de reserva.

### B. APItude Activities (`/activity-api/3.0`)
*   `POST /activity-api/3.0/activities`: Busca concorrente de passeios, ingressos e excursões.
*   `POST /activity-api/3.0/bookings`: Confirmação e emissão de vouchers de atividades.

### C. APItude Transfers (`/transfer-api/1.0` e `/transfer-cache-api/1.0`)
*   `GET /transfer-cache-api/1.0/locations/countries`: Consulta de catálogo de países.
*   `POST /transfer-api/1.0/availability`: Cotador em tempo real de translados aeroporto/hotel.
