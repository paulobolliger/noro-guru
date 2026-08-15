# 📍 OpenCEP — Gateway & Autocomplete de CEP Grátis (100% Open Source)

Este documento especifica a arquitetura de consulta rápida de **CEP (Código de Endereçamento Postal)** e preenchimento automático de endereço em todas as páginas de cadastro e checkout do **Noro Guru**.

---

## 📌 1. Visão Geral
*   **Provedor Primário**: OpenCEP ([https://opencep.com](https://opencep.com))
*   **Repositório GitHub**: `https://github.com/SeuAliado/OpenCEP`
*   **Velocidade**: ~50ms (CDN Cloudflare + Jamstack)
*   **SLA**: 99,99% de disponibilidade sem limite de requisições.

---

## 🌐 2. Endpoints e Fallbacks Resilientes

O serviço [`cepService.ts`](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/packages/lib/services/cepService.ts) realiza a busca no OpenCEP e aciona fallbacks automáticos caso ocorra algum problema de rede:

1. **Primário (OpenCEP)**:  
   `GET https://opencep.com/v1/{cep}.json`
2. **Fallback 1 (ViaCEP)**:  
   `GET https://viacep.com.br/ws/{cep}/json/`
3. **Fallback 2 (AwesomeAPI CEP)**:  
   `GET https://cep.awesomeapi.com.br/json/{cep}?token={AWESOME_API_KEY}`

---

## 🛠️ 3. Estrutura do Payload Retornado

```json
{
  "cep": "15050-305",
  "logradouro": "Rua Josina Teixeira de Carvalho",
  "complemento": "",
  "bairro": "Vila Anchieta",
  "cidade": "São José do Rio Preto",
  "estado": "SP",
  "ibge": "3549805",
  "source": "OpenCEP"
}
```

---

## 🎨 4. Componente de UI Reutilizável (`CepAutocompleteField`)

*   **Componente**: [`apps/control/components/CepAutocompleteField.tsx`](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/apps/control/components/CepAutocompleteField.tsx)
*   **API Route**: [`/api/cep/[cep]`](file:///c:/Users/paulo/0-dev/02-aplicacoes/04%20noro-guru/noro-guru/apps/control/app/api/cep/[cep]/route.ts)
*   **Comportamento**:
    1. Assim que o usuário digita ou cola 8 números no campo CEP, o autocomplete é disparado instantaneamente.
    2. Os campos `Logradouro/Rua`, `Bairro`, `Cidade` e `Estado` do formulário são preenchidos automaticamente.
    3. O foco do cursor vai diretamente para o campo `Número`.
