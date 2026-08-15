# 🗂️ Wooba Travellink API — Static Contents (Auto-Complete & Tabelas Estáticas)

> 🚨 **DOCUMENTO DE REFERÊNCIA TÉCNICA INTERNA (NORO GURU MASTER)**
> **PREMISSA DE PRODUTO INVIOLÁVEL**: Nenhum tenant (agência ou cliente final) tem ou terá acesso/conhecimento deste fornecedor. Este documento é mantido **estritamente como referência técnica interna para a equipe de engenharia do Noro Guru**.

Este documento especifica os endpoints de **Tabelas Estáticas e Dicionários de Dados** extraídos da especificação Swagger do Wooba (`/swagger/docs/v1`).

---

## 📌 1. Visão Geral dos Endpoints Estáticos

Estes endpoints permitem realizar carga inicial e auto-complete de aeroportos IATA, cidades/destinos de hotéis, terminais rodoviários e modalidades de seguro no **Noro Guru Master**:

| Endpoint REST | Método | Descrição |
|---|---|---|
| `/api/static/airports` | `POST` | Catálogo completo de aeroportos IATA e cidades (ex: `GRU`, `CGH`, `GIG`, `MIA`, `JFK`). |
| `/api/static/destinations` | `POST` | Dicionário de destinos e cidades para busca e auto-complete de hospedagem. |
| `/api/static/bus` | `POST` | Tabela de terminais rodoviários e trechos de ônibus cadastrados. |
| `/api/static/insurance-destinations` | `POST` | Lista de regiões e continentes cobertos por apólices de seguro viagem. |
| `/api/static/insurance-types` | `POST` | Dicionário de categorias e tipos de cobertura de seguro. |

---

## 💡 2. Aplicação Prática no Noro Guru

Estes endpoints servem para alimentar a nossa tabela de **Geo/Airports/Destinations** no PostgreSQL do Noro Guru, garantindo que a barra de pesquisa do nosso frontend (`apps/core`) tenha autocomplete ultra-rápido sem depender de chamadas externas em tempo de execução.
