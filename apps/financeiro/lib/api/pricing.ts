import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import { MarkupPadrao, RegraPreco, SimulacaoPreco } from '@/types/pricing'

const supabase = createClientComponentClient<Database>()

export const pricingApi = {
  // Markups
  async listMarkups() {
    const { data, error } = await supabase
      .from('markups')
      .select('*')
      .order('ordem')
    
    if (error) throw error
    return data
  },

  async createMarkup(markup: Omit<MarkupPadrao, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('markups')
      .insert(markup)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateMarkup(id: string, markup: Partial<MarkupPadrao>) {
    const { data, error } = await supabase
      .from('markups')
      .update(markup)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async toggleMarkupStatus(id: string, ativo: boolean) {
    const { data, error } = await supabase
      .from('markups')
      .update({ ativo })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Regras de Preço
  async listRegrasPreco() {
    const { data, error } = await supabase
      .from('regras_preco')
      .select('*')
      .order('prioridade')
    
    if (error) throw error
    return data
  },

  async createRegraPreco(regra: Omit<RegraPreco, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('regras_preco')
      .insert(regra)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateRegraPreco(id: string, regra: Partial<RegraPreco>) {
    const { data, error } = await supabase
      .from('regras_preco')
      .update(regra)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async toggleRegraPrecoStatus(id: string, ativo: boolean) {
    const { data, error } = await supabase
      .from('regras_preco')
      .update({ ativo })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Cálculo de Preços
  async calcularPreco(params: {
    preco_base: number
    produto_id?: string
    cliente_id?: string
    quantidade?: number
    data?: string
  }) {
    const { data, error } = await supabase
      .rpc('calcular_preco_final', params)
    
    if (error) throw error
    return data
  }
}