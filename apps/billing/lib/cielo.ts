import axios from 'axios';

interface CieloConfig {
  merchantId: string;
  merchantKey: string;
  sandbox?: boolean;
}

export class CieloService {
  private merchantId: string;
  private merchantKey: string;
  private apiUrl: string;

  constructor(config: CieloConfig) {
    this.merchantId = config.merchantId;
    this.merchantKey = config.merchantKey;
    this.apiUrl = config.sandbox
      ? 'https://apisandbox.cieloecommerce.cielo.com.br'
      : 'https://api.cieloecommerce.cielo.com.br';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'MerchantId': this.merchantId,
      'MerchantKey': this.merchantKey
    };
  }

  async createPayment(params: {
    amount: number;
    installments: number;
    softDescriptor: string;
    cardToken?: string;
    cardNumber?: string;
    holder?: string;
    expirationDate?: string;
    securityCode?: string;
  }) {
    try {
      const payload = {
        MerchantOrderId: Date.now().toString(),
        Customer: {
          Name: params.holder
        },
        Payment: {
          Type: 'CreditCard',
          Amount: params.amount,
          Installments: params.installments,
          SoftDescriptor: params.softDescriptor,
          CreditCard: params.cardToken
            ? { CardToken: params.cardToken }
            : {
                CardNumber: params.cardNumber,
                Holder: params.holder,
                ExpirationDate: params.expirationDate,
                SecurityCode: params.securityCode
              },
          Capture: true
        }
      };

      const response = await axios.post(
        `${this.apiUrl}/1/sales`,
        payload,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createCardToken(params: {
    cardNumber: string;
    holder: string;
    expirationDate: string;
    securityCode: string;
  }) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/1/card`,
        {
          CustomerName: params.holder,
          CardNumber: params.cardNumber,
          Holder: params.holder,
          ExpirationDate: params.expirationDate,
          Brand: 'Visa' // Será detectado automaticamente pela Cielo
        },
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async capturePayment(paymentId: string, amount?: number) {
    try {
      const response = await axios.put(
        `${this.apiUrl}/1/sales/${paymentId}/capture`,
        amount ? { Amount: amount } : undefined,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async cancelPayment(paymentId: string, amount?: number) {
    try {
      const response = await axios.put(
        `${this.apiUrl}/1/sales/${paymentId}/void`,
        amount ? { Amount: amount } : undefined,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPayment(paymentId: string) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/1/sales/${paymentId}`,
        { headers: this.getHeaders() }
      );

      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (axios.isAxiosError(error)) {
      return new Error(
        error.response?.data?.message || 'Erro na comunicação com a Cielo'
      );
    }
    return error;
  }
}