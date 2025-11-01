'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { format, subDays, subMonths } from 'date-fns'
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'

interface FormValues {
  dataInicial: string
  dataFinal: string
  tipoRelatorio: 'margens' | 'regras' | 'simulacoes' | 'completo'
  formato: 'excel' | 'pdf'
  incluirGraficos: boolean
  incluirDetalhamento: boolean
  incluirComparativoPeriodoAnterior: boolean
}

const defaultValues: FormValues = {
  dataInicial: format(subMonths(new Date(), 1), 'yyyy-MM-dd'),
  dataFinal: format(new Date(), 'yyyy-MM-dd'),
  tipoRelatorio: 'completo',
  formato: 'excel',
  incluirGraficos: true,
  incluirDetalhamento: true,
  incluirComparativoPeriodoAnterior: true
}

const periodosPreDefinidos = [
  { label: 'Últimos 7 dias', valor: 7 },
  { label: 'Últimos 30 dias', valor: 30 },
  { label: 'Últimos 90 dias', valor: 90 },
  { label: 'Último mês', tipo: 'mes' },
  { label: 'Último trimestre', tipo: 'trimestre' }
]

interface GeradorRelatoriosProps {
  onGerarRelatorio: (dados: FormValues) => Promise<string>
  relatoriosRecentes?: Array<{
    id: string
    nome: string
    tipo: string
    formato: string
    dataCriacao: string
    url: string
  }>
}

export function GeradorRelatorios({ 
  onGerarRelatorio,
  relatoriosRecentes = []
}: GeradorRelatoriosProps) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<FormValues>({ defaultValues })

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)
      const url = await onGerarRelatorio(data)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selecionarPeriodo = (dias?: number, tipo?: string) => {
    const hoje = new Date()
    let dataInicial = hoje
    
    if (tipo === 'mes') {
      dataInicial = subMonths(hoje, 1)
    } else if (tipo === 'trimestre') {
      dataInicial = subMonths(hoje, 3)
    } else if (dias) {
      dataInicial = subDays(hoje, dias)
    }

    form.setValue('dataInicial', format(dataInicial, 'yyyy-MM-dd'))
    form.setValue('dataFinal', format(hoje, 'yyyy-MM-dd'))
  }

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Gerar Relatório
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerar Relatório de Preços</DialogTitle>
            <DialogDescription>
              Configure as opções do relatório que deseja gerar.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Período */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  {periodosPreDefinidos.map((periodo) => (
                    <Button
                      key={periodo.label}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => selecionarPeriodo(periodo.valor, periodo.tipo)}
                    >
                      {periodo.label}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dataInicial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Inicial</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataFinal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Final</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Tipo e Formato */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoRelatorio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Relatório</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="completo">Relatório Completo</SelectItem>
                          <SelectItem value="margens">Análise de Margens</SelectItem>
                          <SelectItem value="regras">Regras de Preço</SelectItem>
                          <SelectItem value="simulacoes">Simulações</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="formato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formato</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o formato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="excel">Excel</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Opções */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="incluirGraficos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Incluir Gráficos</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Adiciona visualizações gráficas ao relatório
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incluirDetalhamento"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Incluir Detalhamento</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Adiciona detalhes específicos de cada regra e markup
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="incluirComparativoPeriodoAnterior"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Comparativo com Período Anterior</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Inclui comparação com o período anterior equivalente
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Relatório...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Gerar Relatório
                  </>
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Relatórios Recentes */}
      {relatoriosRecentes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosRecentes.map((relatorio) => (
                <div
                  key={relatorio.id}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent"
                >
                  <div className="flex items-center gap-3">
                    {relatorio.formato === 'excel' ? (
                      <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">{relatorio.nome}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(relatorio.dataCriacao).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(relatorio.url, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}