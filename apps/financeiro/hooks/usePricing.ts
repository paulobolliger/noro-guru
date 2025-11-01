import { useState } from 'react'
import { MarkupPadrao, RegraPreco, SimulacaoPreco } from '@/types/pricing'
import { pricingApi } from '@/lib/api/pricing'
import { toast } from 'sonner'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

const supabase = createClientComponentClient<Database>()

export function usePricing() {
  const [markups, setMarkups] = useState<MarkupPadrao[]>([])
  const [regrasPreco, setRegrasPreco] = useState<RegraPreco[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Markups
  const loadMarkups = async () => {
    try {
      setIsLoading(true)
      const data = await pricingApi.listMarkups()
      setMarkups(data)
    } catch (error) {
      toast.error('Erro ao carregar markups')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const createMarkup = async (markup: Omit<MarkupPadrao, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true)
      const data = await pricingApi.createMarkup(markup)
      setMarkups(prev => [...prev, data])
      toast.success('Markup criado com sucesso!')
      return data
    } catch (error) {
      toast.error('Erro ao criar markup')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateMarkup = async (id: string, markup: Partial<MarkupPadrao>) => {
    try {
      setIsLoading(true)
      const data = await pricingApi.updateMarkup(id, markup)
      setMarkups(prev => prev.map(m => m.id === id ? data : m))
      toast.success('Markup atualizado com sucesso!')
      return data
    } catch (error) {
      toast.error('Erro ao atualizar markup')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMarkupStatus = async (id: string, ativo: boolean) => {
    try {
      setIsLoading(true)
      const data = await pricingApi.toggleMarkupStatus(id, ativo)
      setMarkups(prev => prev.map(m => m.id === id ? data : m))
      toast.success(ativo ? 'Markup ativado!' : 'Markup desativado!')
      return data
    } catch (error) {
      toast.error('Erro ao alterar status do markup')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Regras de Preço
  const loadRegrasPreco = async () => {
    try {
      setIsLoading(true)
      const data = await pricingApi.listRegrasPreco()
      setRegrasPreco(data)
    } catch (error) {
      toast.error('Erro ao carregar regras de preço')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const createRegraPreco = async (regra: Omit<RegraPreco, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true)
      const data = await pricingApi.createRegraPreco(regra)
      setRegrasPreco(prev => [...prev, data])
      toast.success('Regra de preço criada com sucesso!')
      return data
    } catch (error) {
      toast.error('Erro ao criar regra de preço')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateRegraPreco = async (id: string, regra: Partial<RegraPreco>) => {
    try {
      setIsLoading(true)
      const data = await pricingApi.updateRegraPreco(id, regra)
      setRegrasPreco(prev => prev.map(r => r.id === id ? data : r))
      toast.success('Regra de preço atualizada com sucesso!')
      return data
    } catch (error) {
      toast.error('Erro ao atualizar regra de preço')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const toggleRegraPrecoStatus = async (id: string, ativo: boolean) => {
    try {
      setIsLoading(true)
      const data = await pricingApi.toggleRegraPrecoStatus(id, ativo)
      setRegrasPreco(prev => prev.map(r => r.id === id ? data : r))
      toast.success(ativo ? 'Regra de preço ativada!' : 'Regra de preço desativada!')
      return data
    } catch (error) {
      toast.error('Erro ao alterar status da regra de preço')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Métricas e Analytics
  const obterMetricas = async (dataInicial: string, dataFinal?: string) => {
    try {
      setIsLoading(true)
      
      const [metricasResponse, margensDiariasResponse] = await Promise.all([
        supabase.rpc('obter_metricas_gerais'),
        supabase.rpc('calcular_metricas_precos', {
          p_data_inicial: dataInicial,
          p_data_final: dataFinal || new Date().toISOString()
        })
      ])

      if (!metricasResponse.data || !margensDiariasResponse.data) {
        throw new Error('Erro ao carregar métricas')
      }

      const distribuicaoRegras = margensDiariasResponse.data[0]?.distribuicao_regras || []
      
      return {
        metricas: metricasResponse.data,
        margens: margensDiariasResponse.data.map(m => ({
          data: m.periodo,
          margem_media: m.margem_media,
          markup_medio: m.markup_medio,
          margem_minima: m.margem_minima,
          margem_maxima: m.margem_maxima
        })),
        distribuicaoRegras
      }
    }
    } catch (error) {
      toast.error('Erro ao carregar métricas')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Simulação de Preços
  const simularPreco = async (params: {
    tipo_produto: string
    valor_custo: number
    quantidade: number
    cliente_id?: string
    fornecedor_id?: string
    data_simulacao: string
  }): Promise<SimulacaoPreco> => {
    try {
      setIsLoading(true)
      const { data: resultado } = await supabase.rpc('simular_preco', params)
      
      if (!resultado) {
        throw new Error('Erro ao simular preço')
      }

      return {
        ...resultado,
        valor_custo: params.valor_custo,
        valor_final: resultado.preco_final,
        markup_aplicado: resultado.markup_total,
        margem_lucro: resultado.preco_final - params.valor_custo,
        margem_percentual: ((resultado.preco_final - params.valor_custo) / params.valor_custo) * 100,
        regras_aplicadas: resultado.detalhamento.map((d: any) => ({
          tipo: d.nome_regra,
          valor: d.valor_aplicado,
          descricao: d.nome_regra
        }))
      }
    } catch (error) {
      toast.error('Erro ao simular preço')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Métricas Comparativas
  const obterMetricasComparativas = async (
    dataInicialAtual: string, 
    dataFinalAtual: string,
    dataInicialAnterior: string,
    dataFinalAnterior: string
  ) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.rpc('obter_metricas_comparativas', {
        data_inicial_atual: dataInicialAtual,
        data_final_atual: dataFinalAtual,
        data_inicial_anterior: dataInicialAnterior,
        data_final_anterior: dataFinalAnterior
      })

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Erro ao carregar métricas comparativas')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Previsões de Preços
  const obterPrevisaoPrecos = async (
    dataInicial: string,
    dataFinal: string,
    periodosFuturos: number = 12
  ) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.rpc('calcular_previsoes_precos', {
        data_inicial: dataInicial,
        data_final: dataFinal,
        periodos_futuros: periodosFuturos
      })

      if (error) throw error
      return data
    } catch (error) {
      toast.error('Erro ao calcular previsões')
      console.error(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    markups,
    regrasPreco,
    isLoading,
    loadMarkups,
    createMarkup,
    updateMarkup,
    toggleMarkupStatus,
    loadRegrasPreco,
    createRegraPreco,
    updateRegraPreco,
    toggleRegraPrecoStatus,
    simularPreco,
    obterMetricas,
    obterMetricasComparativas,
    obterPrevisaoPrecos
  }
}