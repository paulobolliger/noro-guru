# 🏢 CNPJ Service — Consulta Resiliente de CNPJ (CNPJ.ws, BrasilAPI, ReceitaWS)

Este documento especifica a arquitetura do serviço de **Consulta e Preenchimento Automático de Dados de Empresas por CNPJ** no **Noro Guru**.

---

## 📌 1. Visão Geral
*   **Provedor Primário**: **CNPJ.ws** (`https://publica.cnpj.ws/cnpj/{cnpj}`)
*   **Cobertura**: Dados oficiais da Receita Federal (Razão Social, Nome Fantasia, Situação Cadastral, CNAE, Telefone, E-mail e Endereço Completo).
*   **SLA & Resiliência**: Fallback automático em caso de indisponibilidade ou limite de requisições.

---

## 🌐 2. Endpoints e Fallbacks Resilientes

O serviço [`cnpjService.ts`](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/packages/lib/services/cnpjService.ts) consulta os dados da empresa de forma transparente:

1. **Primário (CNPJ.ws)**:  
   `GET https://publica.cnpj.ws/cnpj/{cnpj}`
2. **Fallback 1 (BrasilAPI)**:  
   `GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}`
3. **Fallback 2 (ReceitaWS)**:  
   `GET https://receitaws.com.br/v1/cnpj/{cnpj}`

---

## 🎨 3. Componente de UI Reutilizável (`CnpjAutocompleteField`)

*   **Componente**: [`apps/control/components/CnpjAutocompleteField.tsx`](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/apps/control/components/CnpjAutocompleteField.tsx)
*   **API Route**: [`/api/cnpj/[cnpj]`](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/apps/control/app/api/cnpj/[cnpj]/route.ts)
*   **Campos Preenchidos Automaticamente**:
    *   `Razão Social`
    *   `Nome Fantasia`
    *   `Telefone` & `E-mail`
    *   `CEP`, `Rua/Logradouro`, `Número`, `Bairro`, `Cidade` e `Estado (UF)`.
