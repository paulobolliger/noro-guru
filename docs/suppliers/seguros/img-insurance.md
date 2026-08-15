# 🛡️ IMG (International Medical Group) — Especificação Técnica de Integração (Seguro Viagem)

Este documento especifica a arquitetura de integração do fornecedor de **Seguro Viagem Internacional IMG** no motor do **Noro Guru** (importado da plataforma irmã *SafeTrip.guru*).

---

## 📌 1. Visão Geral
*   **Fornecedor**: IMG (International Medical Group)
*   **Vertical**: Seguro Viagem Internacional & Travel Medical Insurance
*   **Protocolo**: REST API / OAuth 2.0 (Password Grant)
*   **Adapter Key**: `img_insurance`

---

## 🌐 2. Ambientes & Base URLs

| Ambiente | API Base URL | OAuth Token URL |
|---|---|---|
| **Beta / Sandbox** | `https://beta-services.imglobal.com/API` | `https://beta-services.imglobal.com/oAuth/token` |
| **Produção** | `https://services.imglobal.com/API` | `https://services.imglobal.com/oAuth/token` |

---

## 🔑 3. Variáveis de Ambiente (`.env.local`)

```env
# IMG Travel Insurance
IMG_PRODUCER_NUMBER=
IMG_API_USERNAME=
IMG_API_PASSWORD=
IMG_API_ENV=beta
```

---

## 🛠️ 4. Produtos & Endpoints Mapeados

### Produtos Principais:
1. **`PATAI` (Patriot America Lite)**: Cobertura médica internacional que **inclui viagem para os Estados Unidos**.
2. **`PATII` (Patriot International Lite)**: Cobertura médica internacional para viagens ao redor do mundo **exceto os EUA**.
3. **`PPLAI` / `PPLII` (Patriot Platinum)**: Coberturas VIP de teto elevado.

### Endpoints REST:
* `POST /oAuth/token`: Autenticação OAuth 2.0.
* `POST /Quotes/GetQuote`: Cotação em tempo real de planos por origem, destino, datas e idades dos viajantes.
* `POST /Purchases/GetCertificate`: Emissão instantânea da apólice/certificado do seguro viagem com geração do voucher em PDF.
