import type { MarkupPadrao, RegraPreco, SimulacaoPreco } from '@/types/pricing';

const disabledMessage =
  'Precificação usava tabelas e funções SQL sem collections Appwrite oficiais.';

export const pricingApi = {
  async listMarkups(): Promise<MarkupPadrao[]> {
    return [];
  },
  async createMarkup(_markup: Omit<MarkupPadrao, 'id' | 'created_at' | 'updated_at'>) {
    throw new Error(disabledMessage);
  },
  async updateMarkup(_id: string, _markup: Partial<MarkupPadrao>) {
    throw new Error(disabledMessage);
  },
  async toggleMarkupStatus(_id: string, _ativo: boolean) {
    throw new Error(disabledMessage);
  },
  async listRegrasPreco(): Promise<RegraPreco[]> {
    return [];
  },
  async createRegraPreco(_regra: Omit<RegraPreco, 'id' | 'created_at' | 'updated_at'>) {
    throw new Error(disabledMessage);
  },
  async updateRegraPreco(_id: string, _regra: Partial<RegraPreco>) {
    throw new Error(disabledMessage);
  },
  async toggleRegraPrecoStatus(_id: string, _ativo: boolean) {
    throw new Error(disabledMessage);
  },
  async simularPreco(_params: SimulacaoPreco) {
    throw new Error(disabledMessage);
  },
};
