# 💱 Motor de Câmbio & Composição de Preços (Dólar & Euro PTAX)

Este documento especifica as regras de negócio, arquitetura de atualização diária por Cron Job, política de travas cambiais e telas administrativas no **Control Plane Master Admin (`apps/control`)** para a gestão de câmbio no **Noro Guru**.

---

## 📌 1. Regras Fundamentais de Negócio

1. **Travamento Diário do Câmbio (Sem Flutuação Intradiária)**:
   * A cotação das moedas internacionais (USD e EUR) **NÃO flutua de minuto em minuto** durante as vendas do dia.
   * O câmbio é **travado uma vez ao dia**, alinhando o Noro Guru ao funcionamento padrão das consolidadoras de viagens brasileiras (ex: Flytour, RexturAdvance).

2. **Cron Job Automático às 09:15 da Manhã**:
   * O mercado financeiro abre às 09:00 (Horário de Brasília).
   * Às **09:15 AM**, o Cron Job da plataforma executa a consulta autenticada à **AwesomeAPI**:
     ```http
     GET https://economia.awesomeapi.com.br/json/last/USD-BRLPTAX,EUR-BRLPTAX?token=23b7af563cd43bf96ccbfb7e253919fd9c08db31c4195d4cbd7cc5516be3f29c
     ```
   * O sistema lê o campo `ask` (PTAX Oficial de Venda do Banco Central) e atualiza a taxa travada do dia.

3. **Exclusividade do Master Admin no Control Plane**:
   * **Tenants (Agências de Viagens) NÃO possuem controle ou ajuste fino sobre o Spread de Câmbio**.
   * O controle de margem/spread é **100% centralizado e exclusivo do Master Admin** no Control Plane.

---

## 🏛️ 2. Localização no Control Plane (`apps/control`)

A gestão de moedas fica localizada no modulo **Financeiro**:
📍 **Menu**: `Financeiro` > `Composição de Preços` (`/financeiro/precificacao`)

### Telas e Controles no Master Admin:

1. **Tabela de Câmbio do Dia (PTAX Venda Limpa)**:
   * 🇺🇸 **Dólar (USD PTAX Venda)**: `R$ 5,1217` *(AwesomeAPI `USD-BRLPTAX` Banco Central)*
   * 🇪🇺 **Euro (EUR PTAX Venda)**: `R$ 5,8305` *(AwesomeAPI `EUR-BRLPTAX` Banco Central)*

2. **Composição do Spread Master (Exclusivo Master Admin)**:
   * `Spread Master Dólar (%)`: Ex `+5.2%` $\rightarrow$ **Câmbio Turismo Final USD**: `R$ 5,3880 ≈ R$ 5,3900` *(Bate exatamente com operadoras como Mobility)*
   * `Spread Master Euro (%)`: Ex `+5.65%` $\rightarrow$ **Câmbio Turismo Final EUR**: `R$ 6,1600` *(Bate exatamente com operadoras como Mobility)*

3. **Substituição Manual (Override de Segurança)**:
   * O Master Admin possui a opção de fazer um *Override Manual* para travar um câmbio específico do dia caso deseje parear 100% com uma operadora específica.

---

## 🧮 3. Fórmula de Conversão no Engine de Precificação (`PricingEngine`)

Para qualquer produto cotado em moeda estrangeira (Hotéis RateHawk/LiteAPI, Passeios Civitatis/Viator, Voos):

$$V_{\text{BRL}} = P_{\text{USD/EUR}} \times \text{PTAX}_{\text{Venda (09:15)}} \times (1 + \text{Spread}_{\text{Master}})$$

### Exemplo Prático:
* Passeio Viator em Paris: `€ 100,00 EUR`
* PTAX Venda EUR (09:15): `R$ 6,1200`
* Spread Master EUR: `4.0%`
* **Preço Final Exibido ao Cliente B2C**:
  $$V_{\text{BRL}} = 100 \times 6,1200 \times 1,04 = \mathbf{R\$\,636,48}$$

---

## 🌐 4. Exibição nas Camadas da Plataforma

* **Cliente Final (B2C / Checkout)**:
  * Exibição 100% em **R$ (BRL)** de forma limpa (ex: `R$ 636,48` ou `10x de R$ 63,64`).
* **Agente de Viagens (B2B / Painel Agência)**:
  * Recebe o preço final em BRL com um badge informativo transparente:  
    `Tarifa Original: € 100,00 EUR | Câmbio Travado do Dia: R$ 6,3648 / EUR`
