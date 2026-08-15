# 🔌 Documentação de APIs de Fornecedores (Suppliers)

Esta pasta centraliza as especificações técnicas, contratos de payloads, credenciais de homologação e fluxos de integração de cada fornecedor conectado ao ecossistema da **NORO Guru**.

## 📂 Estrutura de Diretórios Proposta

Para manter o repositório organizado e facilitar a leitura pelos desenvolvedores (e agentes de IA), a documentação é dividida por **Vertical de Serviço**:

```txt
docs/suppliers/
├── README.md                      # Este arquivo (índice e guia de padronização)
│
├── hospedagem/                    # Hotéis e Acomodações
│   ├── ratehawk.md                # Integração RateHawk (API de Referência)
│   ├── liteapi.md                 # LiteAPI specs
│   └── hotelbeds.md
│
├── seguros/                       # Seguro Viagem
│   ├── assistcard.md
│   └── img-travel.md
│
├── aereo/                         # Passagens Aéreas e GDS
│   ├── amadeus.md
│   └── flytour.md
│
├── tours/                         # Passeios, Ingressos e Experiências
│   ├── civitatis.md
│   └── getyourguide.md
│
├── transfers/                     # Receptivos e Traslados
│   └── mobility.md
│
└── carros/                        # Aluguel de Veículos
    └── cartrawler.md
```

---

## 📝 Template de Documentação por Fornecedor

Cada arquivo de fornecedor (ex: `ratehawk.md`) deve seguir o seguinte padrão de tópicos para garantir consistência:

### 1. Visão Geral
*   **Nome do Fornecedor**:
*   **Vertical**:
*   **Contato Comercial / Suporte Técnico**:
*   **URL da Documentação Oficial**:
*   **Adapter Key**: (ex: `ratehawk`, `civitatis`)

### 2. Autenticação e Ambientes
*   **Ambiente de Homologação (Sandbox)**:
    *   Endpoint base:
    *   Método de autenticação: (ex: Header `Authorization: Basic XXX`, API Key, OAuth2)
*   **Ambiente de Produção**:
    *   Endpoint base:

### 3. Mapeamento de Credenciais (Variáveis de Ambiente)
Quais chaves devem ser configuradas na tabela `noro_supplier_apis` ou no arquivo `.env` para autenticação:
*   `SUPPLIER_API_KEY`
*   `SUPPLIER_API_SECRET`
*   *(Outras variáveis necessárias)*

### 4. Fluxo de Integração (Endpoints & Payload Mocks)
Documentar os endpoints exatos que o nosso `SupplierAdapter` consumirá, contendo exemplos de Request e Response (JSON) para:

*   **A. Busca/Pesquisa (Availability / Search)**:
    *   *Endpoint:*
    *   *Payload de Exemplo:*
*   **B. Pré-reserva (Hold / Lock com TTL)**:
    *   *Endpoint:*
    *   *Payload de Exemplo:*
*   **C. Confirmação / Emissão (Confirm / Book)**:
    *   *Endpoint:*
    *   *Payload de Exemplo:*
*   **D. Cancelamento / Reembolso (Cancel / Refund)**:
    *   *Endpoint:*
    *   *Payload de Exemplo:*

### 5. Tratamento de Erros e Códigos de Status
*   Como o fornecedor retorna erros de negócios (ex: tarifa expirada, hotel sem estoque).
*   Mapeamento de códigos Http (400, 429, 500) para os erros internos da NORO (`NegativeMarginError`, etc.).
