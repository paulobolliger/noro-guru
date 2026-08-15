# 🏨 Integração RateHawk — API de Hospedagem (Hotels)

Este documento especifica os detalhes técnicos da API RateHawk (Emerging Travel Group — ETG) para a vertical de **Hospedagem**, mapeada para o motor de reservas e precificação do Noro Guru.

---

## 1. Visão Geral
*   **Nome do Fornecedor**: RateHawk (Emerging Travel Group)
*   **Vertical**: Hospedagem (Hotels)
*   **Contato de Suporte Técnico**: apisupport@ratehawk.com
*   **URL da Documentação Oficial**: [docs.emergingtravel.com](https://docs.emergingtravel.com/)
*   **Guia de Integração**: [docs.emergingtravel.com/docs/integration-guide](https://docs.emergingtravel.com/docs/integration-guide/)
*   **Melhores Práticas API V3**: [docs.emergingtravel.com/docs/best-practices-for-apiv3](https://docs.emergingtravel.com/docs/best-practices-for-apiv3/)
*   **Glossário Oficial ETG**: [docs.emergingtravel.com/docs/glossary](https://docs.emergingtravel.com/docs/glossary/)
*   **Adapter Key**: `ratehawk`

---

## 2. Autenticação e Ambientes (Sandbox)

A RateHawk utiliza **HTTP Basic Authentication** para autenticação da API. 
*   **Username (API Key ID)**: `203`
*   **Password (Access Token)**: `297ccc67-ef1d-4b0a-9421-43d4dce5423a`

### Construção do Header HTTP:
```http
Authorization: Basic MjAzOjI5N2NjYzY3LWVmMWQtNGIwYS05NDIxLTQzZDRkY2U1NDIzYQ==
```
*(Nota: O valor após "Basic" é a codificação em Base64 da string `"203:297ccc67-ef1d-4b0a-9421-43d4dce5423a"`)*

### Endpoints Base
*   **Ambiente de Homologação (Sandbox)**: `https://api.worldota.net/api/b2b/v3`
*   **Ambiente de Produção**: *(Fornecido após homologação e certificação)*

---

## 3. Mapeamento de Credenciais (Tabela `noro.suppliers`)

As chaves do fornecedor serão salvas na tabela de configurações técnicas do Control Plane (`noro_supplier_apis` ou variáveis de ambiente de homologação):

```env
RATEHAWK_API_KEY_ID="203"
RATEHAWK_API_ACCESS_TOKEN="297ccc67-ef1d-4b0a-9421-43d4dce5423a"
```

---

## 4. Hotéis de Teste e Casos Especiais no Sandbox

Para homologar a integração, a RateHawk disponibiliza HIDs (Hotel IDs) específicos que disparam comportamentos pré-definidos no Sandbox:

| Cenário de Teste / Feature | Hotel ID (HID) | Nome do Hotel / Slug |
| --- | --- | --- |
| Estrutura de Metapolítica e Infos Extras | `6362880`<br>`6682380` | `pullman_dubai_jumeirah_lakes_towers`<br>`hotel_monsieur` |
| Taxas Adicionais (`tax_data`) | `10595223`<br>`10654204` | `key_view_the_residences`<br>`staycae_upper_crest_downtown_view` |
| Dados de IVA/VAT (`vat_data`) | `10678836` | `lux_the_pad_executive_suite_burj_khalifa_view_4` |
| Aumento de preço de **10%** no Prebook | `8819557` | `rosa_bell_motel_los_angeles` |
| Aumento de preço de **20%** no Prebook | `9744270` | `aparthotel_adagio_paris_montmartre` |
| Todos os tipos de alimentação disponíveis | `10047711` | `downtown_la_vacation_apartments_by_stay_city_rentals_3` |
| Bloqueio de disponibilidade para residentes HN | `8142632` | `apartamenty_sadovoe_koltso_paveletskaia` |
| Preço dobra para residentes HN | `6471709` | `sadovoye_koltso_apartment_1905_goda` |
| Diferença de hash entre SERP (Search) e HP (Hotel Page) | `8608790`<br>`10724071` | `coeur_de_paris__pompidou`<br>`silkhaus_private_beach_unique_1bdr_in_emaar` |
| **Hotel Completo** (Taxas, VAT, refeições, grupos estáticos de quartos) | `10004834` | `conrad_los_angeles` |

---

## 5. Fluxo de Reserva & Testes Obrigatórios (Pre-Certification)

Para obter a chave de produção, a equipe da RateHawk exige a execução e validação dos seguintes testes no Sandbox:

### A. Reserva com Crianças e Quartos Múltiplos (Multi-room)
*   **HID**: `10004834`
*   **Configuração**: 2 Quartos
    *   **Quarto 1**: 2 adultos + 1 criança (3 anos).
    *   **Quarto 2**: 2 adultos + 3 crianças (1, 5 e 17 anos).

### B. Reserva com Crianças no Quarto
*   **HID**: `10004834`
*   **Configuração**: 1 Quarto com 2 adultos + 2 crianças (0 e 17 anos).

### C. Reserva especificando Nacionalidade/Residência
*   **HID**: `10004834`
*   **Nacionalidade do Hóspede**: Uzbequistão (`Uzbekistan`)
*   **Configuração**: 1 Quarto com 2 adultos.

### D. Simulação de Flutuação de Preço (Prebook Price Increase)
*   **HID**: `8819557`
*   **Configuração**: Realizar o prebook para disparar o aumento de 10% no valor do quarto e validar o tratamento de alteração de preço na nossa UI (aviso ao usuário).

---

## 6. Simulação de Erros Técnicos no Sandbox

Para testar a resiliência do nosso Booking Engine e garantir que exibimos mensagens de erro elegantes para o usuário, o Sandbox permite forçar erros específicos adicionando sufixos ao campo `partner_order_id` na chamada de **Booking Finish**:

### Erros de Status Assíncrono (Unknown Errors)
*   `unknown_success`: A chamada retorna um erro temporário desconhecido, mas após re-consultar o status, ela retorna `ok` (sucesso).
*   `unknown_provider`: Retorna erro desconhecido, que depois resolve para erro de provedor (`provider`).
*   `unknown_soldout`: Retorna erro desconhecido, que depois resolve para esgotado (`soldout`).
*   `unknown_book_limit`: Retorna erro desconhecido, que depois resolve para limite de reserva excedido (`book_limit`).

### Erros de Processamento Imediato
*   `booking_form_expired`: Simula que o formulário de reserva expirou. (Passar sufixo `booking_form_expired` no ID).
*   `insufficient_b2b_balance`: Simula falta de saldo na carteira B2B (a ser tratado pelo nosso Control Plane). (Sufixo `insufficient_b2b_balance`).
*   `soldout`: Simula quarto esgotado no momento da emissão. (Sufixo `soldout`).
*   `order_not_cancellable`: Simula que a reserva não permite cancelamento. (Sufixo `order_not_cancellable`).

---

## 7. Mapeamento dos Termos e Fluxo de Estados (Glossário ETG)

Para alinhar com a nomenclatura oficial da RateHawk (conforme o Glossário ETG):
*   **SERP (Search Results Page)**: Endpoint de busca rápida de hotéis em uma região. Retorna listas de hotéis com os preços mínimos.
*   **HP (Hotel Page)**: Endpoint que retorna todos os quartos e tarifas detalhadas de um hotel específico.
*   **Prebook**: Endpoint crítico (`/serp/prebook` ou `/hotel/prebook`) que valida se a tarifa selecionada ainda está disponível e se o preço mudou, antes de exibir o formulário de pagamento.
*   **Booking Form / Start**: Inicializa o processo de reserva travando a tarifa (início do Hold/TTL).
*   **Booking Finish**: Envia os detalhes dos hóspedes e efetiva a reserva.
