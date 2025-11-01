import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { XMLParser } from 'fast-xml-parser'

// Parser XML com opções otimizadas para NFS-e
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseAttributeValue: true,
  trimValues: true,
})

interface NFSeData {
  numero_nfse: string
  data_emissao: string
  data_vencimento?: string
  prestador: {
    cnpj: string
    razao_social: string
    nome_fantasia?: string
    inscricao_municipal?: string
    endereco?: string
    cidade?: string
    uf?: string
  }
  valor_servicos: number
  valor_total_nota: number
  descricao_servicos: string
  codigo_servico?: string
  aliquota_iss?: number
  valor_iss?: number
  valor_liquido?: number
}

// Função para extrair dados de NFS-e (suporta múltiplos layouts)
function extrairDadosNFSe(xmlObj: any): NFSeData {
  let nfseData: Partial<NFSeData> = {}

  // Tentar múltiplos padrões de NFS-e brasileiras
  
  // Padrão 1: ABRASF (mais comum)
  const compNfse = xmlObj?.CompNfse || xmlObj?.ConsultarNfseResposta?.CompNfse
  if (compNfse) {
    const nfse = compNfse.Nfse || compNfse
    const infNfse = nfse?.InfNfse || nfse
    
    nfseData = {
      numero_nfse: infNfse?.Numero || infNfse?.['@_Numero'] || '',
      data_emissao: infNfse?.DataEmissao || infNfse?.DadosNfse?.DataEmissao || '',
      prestador: {
        cnpj: infNfse?.PrestadorServico?.IdentificacaoPrestador?.Cnpj || 
              infNfse?.Prestador?.Cnpj || '',
        razao_social: infNfse?.PrestadorServico?.RazaoSocial || 
                      infNfse?.Prestador?.RazaoSocial || '',
        nome_fantasia: infNfse?.PrestadorServico?.NomeFantasia,
        inscricao_municipal: infNfse?.PrestadorServico?.IdentificacaoPrestador?.InscricaoMunicipal,
      },
      valor_servicos: parseFloat(infNfse?.Servico?.Valores?.ValorServicos || 0),
      valor_total_nota: parseFloat(infNfse?.Servico?.Valores?.ValorTotalNota || 
                                    infNfse?.ValorServicos || 0),
      descricao_servicos: infNfse?.Servico?.Discriminacao || '',
      codigo_servico: infNfse?.Servico?.CodigoTributacaoMunicipio,
      aliquota_iss: parseFloat(infNfse?.Servico?.Valores?.Aliquota || 0),
      valor_iss: parseFloat(infNfse?.Servico?.Valores?.ValorIss || 0),
      valor_liquido: parseFloat(infNfse?.Servico?.Valores?.ValorLiquidoNfse || 0),
    }
  }
  
  // Padrão 2: Nota Carioca (Rio de Janeiro)
  const notaCarioca = xmlObj?.Nota || xmlObj?.NotaFiscal
  if (notaCarioca && !nfseData.numero_nfse) {
    nfseData = {
      numero_nfse: notaCarioca?.NumeroNota || notaCarioca?.Numero || '',
      data_emissao: notaCarioca?.DataEmissao || '',
      prestador: {
        cnpj: notaCarioca?.CPFCNPJPrestador || notaCarioca?.Prestador?.CNPJ || '',
        razao_social: notaCarioca?.NomePrestador || notaCarioca?.Prestador?.RazaoSocial || '',
        inscricao_municipal: notaCarioca?.InscricaoMunicipalPrestador,
      },
      valor_servicos: parseFloat(notaCarioca?.ValorServicos || 0),
      valor_total_nota: parseFloat(notaCarioca?.ValorTotal || 0),
      descricao_servicos: notaCarioca?.DiscriminacaoServicos || '',
      valor_iss: parseFloat(notaCarioca?.ValorISS || 0),
    }
  }
  
  // Padrão 3: Nota Fiscal Paulistana (São Paulo)
  const nfPaulista = xmlObj?.NFe || xmlObj?.NotaFiscalEletronica
  if (nfPaulista && !nfseData.numero_nfse) {
    nfseData = {
      numero_nfse: nfPaulista?.NumeroNF || nfPaulista?.Numero || '',
      data_emissao: nfPaulista?.DataEmissao || '',
      prestador: {
        cnpj: nfPaulista?.Prestador?.CNPJ || '',
        razao_social: nfPaulista?.Prestador?.RazaoSocial || '',
        inscricao_municipal: nfPaulista?.Prestador?.InscricaoMunicipal,
      },
      valor_servicos: parseFloat(nfPaulista?.ValorServicos || 0),
      valor_total_nota: parseFloat(nfPaulista?.ValorTotalRecebido || 0),
      descricao_servicos: nfPaulista?.Discriminacao || '',
    }
  }

  // Validações básicas
  if (!nfseData.numero_nfse || !nfseData.prestador?.cnpj) {
    throw new Error('XML inválido: não foi possível extrair número da nota ou CNPJ do prestador')
  }

  // Definir data de vencimento padrão (30 dias após emissão se não informado)
  if (!nfseData.data_vencimento && nfseData.data_emissao) {
    const dataEmissao = new Date(nfseData.data_emissao)
    dataEmissao.setDate(dataEmissao.getDate() + 30)
    nfseData.data_vencimento = dataEmissao.toISOString().split('T')[0]
  }

  return nfseData as NFSeData
}

// Função para limpar e formatar CNPJ
function limparCNPJ(cnpj: string): string {
  return cnpj.replace(/\D/g, '')
}

// POST: Importar NFS-e
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Verificar autenticação
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Obter tenant_id
    const { searchParams } = new URL(request.url)
    const tenantId = searchParams.get('tenant_id')
    if (!tenantId) {
      return NextResponse.json({ error: 'tenant_id é obrigatório' }, { status: 400 })
    }

    const body = await request.json()
    const { xml_content, confirmar } = body

    if (!xml_content) {
      return NextResponse.json({ error: 'xml_content é obrigatório' }, { status: 400 })
    }

    // Parsear XML
    let xmlObj
    try {
      xmlObj = xmlParser.parse(xml_content)
    } catch (error) {
      return NextResponse.json(
        { error: 'XML inválido', details: error instanceof Error ? error.message : 'Erro desconhecido' },
        { status: 400 }
      )
    }

    // Extrair dados da NFS-e
    let nfseData: NFSeData
    try {
      nfseData = extrairDadosNFSe(xmlObj)
    } catch (error) {
      return NextResponse.json(
        { error: 'Erro ao extrair dados da NFS-e', details: error instanceof Error ? error.message : 'Erro desconhecido' },
        { status: 400 }
      )
    }

    const cnpjLimpo = limparCNPJ(nfseData.prestador.cnpj)

    // Buscar fornecedor por CNPJ
    let fornecedor = await supabase
      .from('fin_fornecedores')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('cnpj_cpf', cnpjLimpo)
      .single()

    let fornecedorFoiCriado = false

    // Se não encontrou, criar fornecedor automaticamente
    if (!fornecedor.data) {
      const novoFornecedor = {
        tenant_id: tenantId,
        nome: nfseData.prestador.razao_social,
        nome_fantasia: nfseData.prestador.nome_fantasia || null,
        cnpj_cpf: cnpjLimpo,
        tipo_pessoa: cnpjLimpo.length === 14 ? 'juridica' : 'fisica',
        inscricao_municipal: nfseData.prestador.inscricao_municipal || null,
        endereco: nfseData.prestador.endereco || null,
        cidade: nfseData.prestador.cidade || null,
        estado: nfseData.prestador.uf || null,
        ativo: true,
        observacoes: `Cadastro automático via importação de NFS-e ${nfseData.numero_nfse}`,
      }

      const { data: fornecedorCriado, error: erroFornecedor } = await supabase
        .from('fin_fornecedores')
        .insert(novoFornecedor)
        .select()
        .single()

      if (erroFornecedor) {
        return NextResponse.json(
          { error: 'Erro ao criar fornecedor', details: erroFornecedor.message },
          { status: 500 }
        )
      }

      // Atualizar referência do fornecedor criado
      fornecedor.data = fornecedorCriado
      fornecedorFoiCriado = true
    }

    // Preparar preview dos dados
    const preview = {
      fornecedor_id: fornecedor.data!.id,
      fornecedor_nome: fornecedor.data!.nome,
      fornecedor_cnpj: cnpjLimpo,
      fornecedor_criado: fornecedorFoiCriado,
      numero_documento: nfseData.numero_nfse,
      descricao: `NFS-e ${nfseData.numero_nfse} - ${nfseData.descricao_servicos.substring(0, 100)}`,
      valor_total: nfseData.valor_total_nota || nfseData.valor_servicos,
      valor_liquido: nfseData.valor_liquido,
      valor_iss: nfseData.valor_iss,
      data_emissao: nfseData.data_emissao,
      data_vencimento: nfseData.data_vencimento,
      descricao_servicos: nfseData.descricao_servicos,
      codigo_servico: nfseData.codigo_servico,
      aliquota_iss: nfseData.aliquota_iss,
    }

    // Se confirmar=true, criar duplicata
    if (confirmar === true) {
      const novaDuplicata = {
        tenant_id: tenantId,
        fornecedor_id: preview.fornecedor_id,
        numero_documento: preview.numero_documento,
        descricao: preview.descricao,
        valor_total: preview.valor_total,
        data_emissao: preview.data_emissao,
        data_vencimento: preview.data_vencimento,
        marca: 'NORO', // Marca padrão
        moeda: 'BRL',
        status: 'pendente',
        observacoes: `Importado de NFS-e. ISS: R$ ${preview.valor_iss || 0}. Código Serviço: ${preview.codigo_servico || 'N/A'}`,
      }

      const { data: duplicataCriada, error: erroDuplicata } = await supabase
        .from('fin_duplicatas_pagar')
        .insert(novaDuplicata)
        .select()
        .single()

      if (erroDuplicata) {
        return NextResponse.json(
          { error: 'Erro ao criar duplicata', details: erroDuplicata.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'NFS-e importada com sucesso!',
        duplicata: duplicataCriada,
        fornecedor_criado: !fornecedor.data,
      })
    }

    // Retornar preview para confirmação
    return NextResponse.json({
      success: true,
      mode: 'preview',
      message: 'NFS-e processada. Revise os dados antes de confirmar.',
      preview,
    })

  } catch (error) {
    console.error('Erro ao importar NFS-e:', error)
    return NextResponse.json(
      {
        error: 'Erro ao importar NFS-e',
        details: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}
