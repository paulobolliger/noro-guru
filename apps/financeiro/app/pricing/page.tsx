import { useEffect } from "react"
import { MarkupPadraoForm } from "@/components/pricing/markup-padrao-form"
import { MarkupsTable } from "@/components/pricing/markups-table"
import { RegraPrecoPadraoForm } from "@/components/pricing/regra-preco-padrao-form"
import { RegrasPrecoTable } from "@/components/pricing/regras-preco-table"
import { RegraPrecoPadraoDialog } from "@/components/pricing/regra-preco-dialog"
import { Button } from "@/components/ui/button"
import { usePricing } from "@/hooks/usePricing"
import { useState, useEffect } from "react"
import { addMonths, subMonths, format } from "date-fns"
import { PrevisaoPrecos } from "@/components/pricing/previsao-precos"
import { MarkupPadrao, RegraPreco } from "@/types/pricing"
import { SimuladorPrecos } from "@/components/pricing/simulador-precos"
import { DashboardPrecos } from "@/components/pricing/dashboard-precos"
import { GeradorRelatorios } from "@/components/pricing/gerador-relatorios"
import { useGerarRelatorio } from "@/hooks/useGerarRelatorio"
import { AnaliseComparativa } from "@/components/pricing/analise-comparativa"
export default function PricingPage() {
  const {
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
    obterMetricasComparativas
  } = usePricing()
  const { gerarRelatorio } = useGerarRelatorio()

  const [metricas, setMetricas] = useState<any>(null)
  const [relatoriosRecentes, setRelatoriosRecentes] = useState<any[]>([])
  const [metricasComparativas, setMetricasComparativas] = useState<any>(null)
  const [previsoes, setPrevisoes] = useState<any>(null)

  useEffect(() => {
    loadMarkups()
    loadRegrasPreco()
    carregarMetricas()
    carregarMetricasComparativas()
    carregarPrevisoes()
  }, [])

  const carregarMetricas = async () => {
    try {
      const dataInicial = format(subMonths(new Date(), 3), 'yyyy-MM-dd')
      const dataFinal = format(new Date(), 'yyyy-MM-dd')
      const dados = await obterMetricas(dataInicial, dataFinal)
      setMetricas(dados)
    } catch (error) {
      console.error('Erro ao carregar métricas:', error)
    }
  }

  const carregarMetricasComparativas = async () => {
    try {
      const dataFinalAtual = new Date()
      const dataInicialAtual = subMonths(dataFinalAtual, 3)
      const dataFinalAnterior = subMonths(dataInicialAtual, 1)
      const dataInicialAnterior = subMonths(dataFinalAnterior, 3)

      const dados = await obterMetricasComparativas(
        format(dataInicialAtual, 'yyyy-MM-dd'),
        format(dataFinalAtual, 'yyyy-MM-dd'),
        format(dataInicialAnterior, 'yyyy-MM-dd'),
        format(dataFinalAnterior, 'yyyy-MM-dd')
      )
      setMetricasComparativas(dados)
    } catch (error) {
      console.error('Erro ao carregar métricas comparativas:', error)
    }
  }

  const carregarPrevisoes = async () => {
    try {
      const dataInicial = format(subMonths(new Date(), 12), 'yyyy-MM-dd')
      const dataFinal = format(new Date(), 'yyyy-MM-dd')
      const dados = await obterPrevisaoPrecos(dataInicial, dataFinal)
      setPrevisoes(dados)
    } catch (error) {
      console.error('Erro ao carregar previsões:', error)
    }
  }

  const handleCreate = async (data: Omit<MarkupPadrao, 'id' | 'created_at' | 'updated_at'>) => {
    await createMarkup(data)
  }

  const handleEdit = async (markup: MarkupPadrao, data: Partial<MarkupPadrao>) => {
    await updateMarkup(markup.id, data)
  }

  const handleToggleStatus = async (markup: MarkupPadrao) => {
    await toggleMarkupStatus(markup.id, !markup.ativo)
  }

  const handleCreateRegra = async (data: Omit<RegraPreco, 'id' | 'created_at' | 'updated_at'>) => {
    await createRegraPreco(data)
  }

  const handleEditRegra = async (regra: RegraPreco, data: Partial<RegraPreco>) => {
    await updateRegraPreco(regra.id, data)
  }

  const handleToggleStatusRegra = async (regra: RegraPreco) => {
    await toggleRegraPrecoStatus(regra.id, !regra.ativo)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gerenciamento de Preços</h1>
        <p className="text-muted-foreground">
          Configure os markups e regras de preço para seus produtos.
        </p>
      </div>

      <div className="space-y-10">
        {/* Dashboard */}
        {metricas && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Dashboard de Preços</h2>
              <GeradorRelatorios
                onGerarRelatorio={gerarRelatorio}
                relatoriosRecentes={relatoriosRecentes}
              />
            </div>
            <DashboardPrecos 
              margens={metricas.margens}
              distribuicaoRegras={metricas.distribuicaoRegras}
              metricas={metricas.metricas}
            />
          </section>
        )}

        {/* Análise Comparativa */}
        {metricasComparativas && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Análise Comparativa</h2>
            <AnaliseComparativa 
              periodoAtual={metricasComparativas.periodoAtual}
              periodoAnterior={metricasComparativas.periodoAnterior}
              onPeriodosChange={async (periodoAtual, periodoAnterior) => {
                const dados = await obterMetricasComparativas(
                  format(periodoAtual.dataInicial, 'yyyy-MM-dd'),
                  format(periodoAtual.dataFinal, 'yyyy-MM-dd'),
                  format(periodoAnterior.dataInicial, 'yyyy-MM-dd'),
                  format(periodoAnterior.dataFinal, 'yyyy-MM-dd')
                )
                setMetricasComparativas(dados)
              }}
            />
          </section>
        )}

        {/* Previsões de Preços */}
        {previsoes && (
          <section className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Previsões e Tendências</h2>
            <PrevisaoPrecos
              tendenciasGerais={previsoes.tendencias_gerais}
              previsoes={previsoes.previsoes}
              tendenciasCategorias={previsoes.tendencias_categorias}
              sazonalidade={previsoes.sazonalidade}
              metricasConfianca={previsoes.metricas_confianca}
              onPeriodoChange={async (inicio, fim, periodos) => {
                const dados = await obterPrevisaoPrecos(
                  format(inicio, 'yyyy-MM-dd'),
                  format(fim, 'yyyy-MM-dd'),
                  periodos
                )
                setPrevisoes(dados)
              }}
            />
          </section>
        )}

        {/* Simulador de Preços */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Simulador de Preços</h2>
          <SimuladorPrecos 
            onSimular={simularPreco}
            isLoading={isLoading}
          />
        </section>

        {/* Seção de Markups */}
        <section>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Markups Padrão</h2>
              <MarkupPadraoForm 
                onSubmit={async (data) => {
                  await handleCreate({
                    ...data,
                    tenant_id: "1", // TODO: Pegar do contexto
                    ativo: true,
                    created_by: "sistema", // TODO: Pegar do usuário logado
                    tipo_produto: "padrao",
                    ordem: markups.length + 1,
                    moeda: "BRL"
                  })
                }}
                isSubmitting={isLoading}
              />
            </div>

            <div>
              <MarkupsTable 
                markups={markups}
                onEdit={(markup) => handleEdit(markup, markup)}
                onToggleStatus={handleToggleStatus}
              />
            </div>
          </div>
        </section>

        {/* Seção de Regras de Preço */}
        <section>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Regras de Preço</h2>
              <RegraPrecoPadraoForm 
                onSubmit={async (data) => {
                  await handleCreateRegra({
                    ...data,
                    tenant_id: "1", // TODO: Pegar do contexto
                    ativo: true,
                    created_by: "sistema", // TODO: Pegar do usuário logado
                    moeda: "BRL"
                  })
                }}
                isSubmitting={isLoading}
              />
            </div>

            <div>
              <RegrasPrecoTable
                regras={regrasPreco}
                onEdit={(regra) => handleEditRegra(regra, regra)}
                onToggleStatus={handleToggleStatusRegra}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}