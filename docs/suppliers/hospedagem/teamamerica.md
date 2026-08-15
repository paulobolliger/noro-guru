# 🗽 TeamAmerica Service (XML 5.0 J) — Especificação Técnica de Integração

Este documento especifica a arquitetura de integração, operações SOAP/XML, verticais e fluxo de reservas da **TeamAmerica Service** (Receptivo e Consolidador B2B Especialista em Estados Unidos & Nova York) no motor do **Noro Guru**.

---

## 📌 1. Visão Geral
*   **Fornecedor**: TeamAmerica Service (Team America NY)
*   **Especialidade**: Receptivo EUA, Hotéis, Transfers, Passeios, Escorted Tours e Pacotes.
*   **Protocolo**: WebService SOAP 1.1 / Doclit XML 5.0 J
*   **WSDL Endpoint**: `https://developers.teamamericany.com/taxml/services/tadoclit?wsdl`
*   **Requisito de Segurança**: Whitelist de IP obrigatória no firewall da TeamAmerica (`it@teamamericany.com`).
*   **Adapter Key**: `teamamerica`

---

## 🛠️ 2. Ciclo de Vida da Reserva (Status Flow)

A TeamAmerica utiliza um modelo de status de quatro etapas para o inventário:

```
[ Busca / Dispo ]  --->  [ Processamento ]  --->  [ Confirmação ]  --->  [ Cancelamento ]
  Available (CF)            PK (Pending Hotel)        BK (Booked)             CX (Cancelled)
  On Request (RQ)           PR (Pending Request)      UC (Unconfirmed)        PX/XB (In Progress)
```

1. **CF (Confirmed)**: Item com confirmação imediata. Ao reservar, vira `PK` e logo em seguida `BK`.
2. **RQ (On Request)**: Item sob solicitação. Ao reservar, vira `PR` e aguarda aceite do hotel (`BK`) ou negação (`UC`).
3. **Impossibilidade de Cancelamento no Status `PK` / `PR`**: Durante o processamento entre o distribuidor e o hotel, cancelamentos retornam erro.

---

## 🌐 3. Principais Métodos SOAP/XML Mapeados

### A. Busca e Cotação Dinâmica (`1. SEARCH`)

| Método SOAP | Descrição |
|---|---|
| `PriceSearch` | Busca dinâmica ultra-rápida de tarifas e disponibilidade por cidade (`CityCode`), tipo (`Hotel`), check-in, check-out e ocupação. |
| `ProductInfo` | Consulta de catálogo estático de hotéis (fotos, coordenadas GPS, política de resort fee, tipo de quarto, plano de refeição). |
| `ServiceSearch` | Busca de passeios, ingressos, traslados e serviços receptivos. |
| `EscortedToursSearch` | Pesquisa de circuitos guiados e pacotes pelos EUA. |
| `ListCities` | Consulta do catálogo oficial de códigos de cidades (`CityCode`, ex: `NYC`, `MIA`, `ORL`). |

#### Exemplo de Payload XML (`PriceSearch` Request):
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.wso2.org/php/xsd">
   <soapenv:Header/>
   <soapenv:Body>
      <xsd:PriceSearch>
         <xsd:UserName>SUA_AGENCIA_USER</xsd:UserName>
         <xsd:Password>SEU_PASSWORD</xsd:Password>
         <xsd:CityCode>NYC</xsd:CityCode>
         <xsd:Type>Hotel</xsd:Type>
         <xsd:Occupancy>DBL+1CH-10</xsd:Occupancy>
         <xsd:ArrivalDate>2026-09-15</xsd:ArrivalDate>
         <xsd:NumberOfNights>4</xsd:NumberOfNights>
         <xsd:NumberOfRooms>1</xsd:NumberOfRooms>
         <xsd:DisplayClosedOut>N</xsd:DisplayClosedOut>
         <xsd:DisplayOnRequest>Y</xsd:DisplayOnRequest>
      </xsd:PriceSearch>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### B. Emissão de Reservas (`2. BOOK`)

| Método SOAP | Descrição |
|---|---|
| `NewMultiItemReservation` | Criação e liquidação de reservas com 1 ou múltiplos itens (hotéis, serviços, transfers e passeios em uma única transação). |

---

### C. Leitura e Cancelamento (`3. RETRIEVE` / `4. CANCEL`)

| Método SOAP | Descrição |
|---|---|
| `RetrieveReservation` | Leitura detalhada do itinerário e voucher pelo ID interno de reserva TeamAmerica. |
| `RetrieveResByReference` | Consulta de reserva pelo código local da agência (Partner Order ID). |
| `CancelReservation` | Solicitação de cancelamento total da reserva com apuração de multa. |
| `DeleteItem` | Removido de item específico dentro de uma reserva multi-item. |

---

## 🔑 4. Credenciais da Agência no Portal TeamAmerica

* **Agência**: `TURISMO NOMADE`
* **Username**: `TURISNO`
* **Contato**: `Paulo Bolliger`
* **Domínio / IP de Produção**: `noro.guru` (`76.76.21.21`)

---

## ✉️ 5. Solicitação Exclusiva de Whitelist de IP para a API XML 5.0 J (`it@teamamericany.com`)

* **Para**: `it@teamamericany.com`
* **Assunto**: `IP Whitelist Request for XML 5.0 J API - TURISMO NOMADE`

```text
Dear TeamAmerica IT Support,

Please whitelist our server IP address for accessing the TeamAmerica XML 5.0 J Web Service (https://developers.teamamericany.com/taxml/services/tadoclit?wsdl):

• Agency: TURISMO NOMADE
• Username: TURISNO
• Domain: noro.guru
• Server IP: 76.76.21.21

Thank you!
Best regards,
Paulo Bolliger
TURISMO NOMADE
```
