'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Save,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import { Alert, AlertDescription } from '../../../components/ui/alert'
import { useToast } from '../../../components/ui/toast'

interface PreviewData {
  fornecedor_id: string
  fornecedor_nome: string
  fornecedor_cnpj: string
  fornecedor_criado: boolean
  numero_documento: string
  descricao: string
  valor_total: number
  valor_liquido?: number
  valor_iss?: number
  data_emissao: string
  data_vencimento?: string
  descricao_servicos: string
  codigo_servico?: string
  aliquota_iss?: number
}

interface Props {
  tenantId: string
}

export default function ImportarNFSeClient({ tenantId }: Props) {
  const router = useRouter()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(false)
  const [xmlContent, setXmlContent] = useState('')
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState<PreviewData | null>(null)
  const [error, setError] = useState('')

  // Função para ler arquivo XML
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError('')
    setPreview(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setXmlContent(content)
    }
    reader.onerror = () => {
      setError('Erro ao ler arquivo XML')
    }
    reader.readAsText(file)
  }

  // Função para processar XML e gerar preview
  const handleProcessarXML = async () => {
    if (!xmlContent.trim()) {
      setError('Selecione um arquivo XML ou cole o conteúdo')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/importar-nfse?tenant_id=${tenantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xml_content: xmlContent,
          confirmar: false, // Apenas preview
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar XML')
      }

      if (data.mode === 'preview') {
        setPreview(data.preview)
        showToast('success', 'NFS-e processada!', 'Revise os dados antes de confirmar.')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMsg)
      showToast('error', 'Erro ao processar XML', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Função para confirmar e criar duplicata
  const handleConfirmar = async () => {
    if (!preview) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/importar-nfse?tenant_id=${tenantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          xml_content: xmlContent,
          confirmar: true, // Confirmar e criar duplicata
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao importar NFS-e')
      }

      showToast('success', 'NFS-e importada com sucesso!', 
        data.fornecedor_criado 
          ? 'Fornecedor criado e duplicata gerada.'
          : 'Duplicata gerada com sucesso.'
      )

      // Redirecionar para duplicatas a pagar
      router.push('/financeiro/duplicatas-pagar')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMsg)
      showToast('error', 'Erro ao importar NFS-e', errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Função para limpar tudo
  const handleLimpar = () => {
    setXmlContent('')
    setFileName('')
    setPreview(null)
    setError('')
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Importar NFS-e</h1>
        <p className="text-muted-foreground">
          Faça upload do XML da NFS-e para criar automaticamente a duplicata a pagar
        </p>
      </div>

      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload do XML
          </CardTitle>
          <CardDescription>
            Selecione o arquivo XML da NFS-e ou cole o conteúdo diretamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="grid gap-2">
            <Label htmlFor="xml-file">Arquivo XML</Label>
            <div className="flex gap-2">
              <Input
                id="xml-file"
                type="file"
                accept=".xml"
                onChange={handleFileUpload}
                disabled={loading}
              />
              {fileName && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {fileName}
                </Badge>
              )}
            </div>
          </div>

          {/* Textarea para colar XML */}
          <div className="grid gap-2">
            <Label htmlFor="xml-content">Ou cole o conteúdo XML</Label>
            <textarea
              id="xml-content"
              className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Cole aqui o conteúdo do XML da NFS-e..."
              value={xmlContent}
              onChange={(e) => setXmlContent(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Ações */}
          <div className="flex gap-2">
            <Button
              onClick={handleProcessarXML}
              disabled={loading || !xmlContent.trim()}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Eye className="mr-2 h-4 w-4" />
              Processar e Visualizar
            </Button>
            {(xmlContent || preview) && (
              <Button variant="outline" onClick={handleLimpar} disabled={loading}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview Card */}
      {preview && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Preview da Importação
            </CardTitle>
            <CardDescription className="text-green-600">
              Revise os dados extraídos da NFS-e antes de confirmar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fornecedor */}
            <div className="rounded-lg border border-green-300 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-green-700">Fornecedor</h3>
                {preview.fornecedor_criado && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Será Criado Automaticamente
                  </Badge>
                )}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Razão Social:</span>
                  <span className="font-medium">{preview.fornecedor_nome}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CNPJ:</span>
                  <span className="font-medium font-mono">
                    {formatCNPJ(preview.fornecedor_cnpj)}
                  </span>
                </div>
              </div>
            </div>

            {/* Duplicata */}
            <div className="rounded-lg border border-green-300 bg-white p-4">
              <h3 className="mb-2 font-semibold text-green-700">Duplicata a Pagar</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Número NFS-e:</span>
                  <span className="font-medium">{preview.numero_documento}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Emissão:</span>
                  <span className="font-medium">
                    {new Date(preview.data_emissao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {preview.data_vencimento && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Vencimento:</span>
                    <span className="font-medium">
                      {new Date(preview.data_vencimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Valor Total:</span>
                  <span className="text-lg font-bold text-green-700">
                    {formatCurrency(preview.valor_total)}
                  </span>
                </div>
                {preview.valor_iss && preview.valor_iss > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISS Retido:</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(preview.valor_iss)}
                    </span>
                  </div>
                )}
                {preview.valor_liquido && preview.valor_liquido !== preview.valor_total && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor Líquido:</span>
                    <span className="font-semibold">
                      {formatCurrency(preview.valor_liquido)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição dos Serviços */}
            <div className="rounded-lg border border-green-300 bg-white p-4">
              <h3 className="mb-2 font-semibold text-green-700">Discriminação dos Serviços</h3>
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {preview.descricao_servicos}
              </p>
              {preview.codigo_servico && (
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Código do Serviço:</span>
                  <Badge variant="secondary">{preview.codigo_servico}</Badge>
                </div>
              )}
            </div>

            {/* Botão de Confirmação */}
            <Button
              onClick={handleConfirmar}
              disabled={loading}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Confirmar e Criar Duplicata
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Instruções */}
      {!preview && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Como funciona?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="font-bold">1.</span>
                <span>
                  Faça upload do arquivo XML da NFS-e ou cole o conteúdo no campo de texto
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">2.</span>
                <span>
                  Clique em "Processar e Visualizar" para extrair os dados da nota
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">3.</span>
                <span>
                  Revise os dados extraídos (fornecedor, valor, datas, etc.)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">4.</span>
                <span>
                  Clique em "Confirmar" para criar automaticamente a duplicata a pagar
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold">✓</span>
                <span className="text-green-600">
                  Se o fornecedor não existir, será cadastrado automaticamente!
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
