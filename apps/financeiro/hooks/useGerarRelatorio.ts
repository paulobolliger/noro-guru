import { useState } from 'react'
import { format } from 'date-fns'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

interface RelatorioConfig {
  dataInicial: string
  dataFinal: string
  tipoRelatorio: 'margens' | 'regras' | 'simulacoes' | 'completo'
  formato: 'excel' | 'pdf'
  incluirGraficos: boolean
  incluirDetalhamento: boolean
  incluirComparativoPeriodoAnterior: boolean
}

interface UseGerarRelatorioReturn {
  gerarRelatorio: (config: RelatorioConfig) => Promise<string>
  isLoading: boolean
  error: Error | null
}

export function useGerarRelatorio(): UseGerarRelatorioReturn {
  const supabase = useSupabaseClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const gerarRelatorioMargens = async (config: RelatorioConfig) => {
    const { data, error } = await supabase
      .rpc('gerar_relatorio_margens', {
        data_inicial: config.dataInicial,
        data_final: config.dataFinal,
        incluir_comparativo: config.incluirComparativoPeriodoAnterior
      })

    if (error) throw error
    return data
  }

  const gerarRelatorioRegras = async (config: RelatorioConfig) => {
    const { data, error } = await supabase
      .rpc('gerar_relatorio_regras', {
        data_inicial: config.dataInicial,
        data_final: config.dataFinal
      })

    if (error) throw error
    return data
  }

  const gerarRelatorioSimulacoes = async (config: RelatorioConfig) => {
    const { data, error } = await supabase
      .rpc('gerar_relatorio_simulacoes', {
        data_inicial: config.dataInicial,
        data_final: config.dataFinal
      })

    if (error) throw error
    return data
  }

  const gerarExcel = async (dados: any[], config: RelatorioConfig) => {
    const workbook = new ExcelJS.Workbook()
    
    // Configurações do documento
    workbook.creator = 'Sistema de Precificação'
    workbook.created = new Date()
    
    // Adiciona uma planilha para cada tipo de dado
    if (config.tipoRelatorio === 'completo' || config.tipoRelatorio === 'margens') {
      const sheetMargens = workbook.addWorksheet('Análise de Margens')
      // Configurar cabeçalhos e dados
      sheetMargens.columns = [
        { header: 'Categoria', key: 'categoria', width: 20 },
        { header: 'Produto', key: 'produto', width: 30 },
        { header: 'Custo', key: 'custo', width: 15 },
        { header: 'Preço Venda', key: 'preco_venda', width: 15 },
        { header: 'Markup', key: 'markup', width: 15 },
        { header: 'Margem Lucro', key: 'margem_lucro', width: 15 }
      ]
      sheetMargens.addRows(dados.margens || [])
    }

    // Adiciona planilhas para outros tipos de dados conforme necessário
    if (config.tipoRelatorio === 'completo' || config.tipoRelatorio === 'regras') {
      // Adiciona dados de regras
    }

    if (config.tipoRelatorio === 'completo' || config.tipoRelatorio === 'simulacoes') {
      // Adiciona dados de simulações
    }

    // Gera o arquivo
    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    return URL.createObjectURL(blob)
  }

  const gerarPDF = async (dados: any[], config: RelatorioConfig) => {
    const doc = new jsPDF()
    const dataAtual = format(new Date(), 'dd/MM/yyyy HH:mm')
    
    // Cabeçalho
    doc.setFontSize(16)
    doc.text('Relatório de Preços', 14, 15)
    
    doc.setFontSize(10)
    doc.text(`Gerado em: ${dataAtual}`, 14, 25)
    doc.text(`Período: ${format(new Date(config.dataInicial), 'dd/MM/yyyy')} a ${format(new Date(config.dataFinal), 'dd/MM/yyyy')}`, 14, 30)

    let yPos = 40

    if (config.tipoRelatorio === 'completo' || config.tipoRelatorio === 'margens') {
      doc.setFontSize(14)
      doc.text('Análise de Margens', 14, yPos)
      yPos += 10

      // @ts-ignore
      doc.autoTable({
        startY: yPos,
        head: [['Categoria', 'Produto', 'Custo', 'Preço Venda', 'Markup', 'Margem']],
        body: (dados.margens || []).map(m => [
          m.categoria,
          m.produto,
          m.custo.toFixed(2),
          m.preco_venda.toFixed(2),
          m.markup.toFixed(2),
          `${m.margem_lucro.toFixed(2)}%`
        ])
      })

      yPos = doc.lastAutoTable.finalY + 10
    }

    // Adiciona outras seções conforme necessário

    const blob = doc.output('blob')
    return URL.createObjectURL(blob)
  }

  const gerarRelatorio = async (config: RelatorioConfig) => {
    try {
      setIsLoading(true)
      setError(null)

      // Coleta os dados necessários
      const dados: any = {}

      if (config.tipoRelatorio === 'completo' || config.tipoRelatorio === 'margens') {
        dados.margens = await gerarRelatorioMargens(config)
      }

      if (config.tipoRelatorio === 'completo' || config.tipoRelatorio === 'regras') {
        dados.regras = await gerarRelatorioRegras(config)
      }

      if (config.tipoRelatorio === 'completo' || config.tipoRelatorio === 'simulacoes') {
        dados.simulacoes = await gerarRelatorioSimulacoes(config)
      }

      // Gera o arquivo no formato escolhido
      const url = config.formato === 'excel' 
        ? await gerarExcel(dados, config)
        : await gerarPDF(dados, config)

      return url
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao gerar relatório'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { gerarRelatorio, isLoading, error }
}