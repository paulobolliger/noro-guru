import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SimulacaoPreco } from '../../../types/pricing'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@noro/ui'
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@noro/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@noro/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@noro/ui'
import { Input } from '@noro/ui'
import { Loader2 } from 'lucide-react'
import { formatarMoeda, formatarPorcentagem } from '../../../lib/pricing'

// Schema de validação
const formSchema = z.object({
  tipo_produto: z.string().min(1, 'Tipo de produto é obrigatório'),
  fornecedor_id: z.string().uuid().optional(),
  cliente_id: z.string().uuid().optional(),
  valor_custo: z.number()
    .min(0.01, 'Valor deve ser maior que zero'),
  moeda_custo: z.enum(['EUR', 'USD', 'BRL']),
  taxa_cambio: z.number().optional()
})

type FormData = z.infer<typeof formSchema>

interface ResultadoSimulacao {
  valorFinal: number
  margemLucro: number
  margemPercentual: number
  regrasAplicadas: {
    tipo: string
    valor: number
    descricao: string
  }[]
  justificativa: string
}

export default function SimuladorPrecos() {
  const [isLoading, setIsLoading] = useState(false)
  const [resultado, setResultado] = useState<ResultadoSimulacao | null>(null)
  
  const supabase = createClientComponentClient()

  // Form initialization
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo_produto: '',
      valor_custo: 0,
      moeda_custo: 'EUR'
    }
  })

  // Simular preço
  const handleSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const { data: simulacao, error } = await supabase
        .rpc('calcular_markup_final', {
          p_tenant_id: '00000000-0000-0000-0000-000000000000', // TODO: Get from context
          p_tipo_produto: data.tipo_produto,
          p_valor_custo: data.valor_custo,
          p_fornecedor_id: data.fornecedor_id,
          p_cliente_id: data.cliente_id
        })

      if (error) throw error

      // Salvar simulação
      await supabase
        .from('fin_simulacoes_preco')
        .insert({
          ...data,
          ...simulacao
        })

      setResultado({
        valorFinal: simulacao.valor_final,
        margemLucro: simulacao.margem_lucro,
        margemPercentual: simulacao.margem_percentual,
        regrasAplicadas: simulacao.regras_aplicadas,
        justificativa: simulacao.justificativa
      })

    } catch (error) {
      console.error('Erro ao simular preço:', error)
      toast.error('Erro ao simular preço')
    } finally {
      setIsLoading(false)
    }
  }

  // Tipos de produto disponíveis
  const tiposProduto = [
    { value: 'hotel', label: 'Hotel' },
    { value: 'voo', label: 'Voo' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'passeio', label: 'Passeio' },
    { value: 'seguro', label: 'Seguro' },
    { value: 'visto', label: 'Visto' }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Preços</CardTitle>
          <CardDescription>
            Simule preços com base nas regras cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Tipo de Produto */}
              <FormField
                control={form.control}
                name="tipo_produto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Produto</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo de produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposProduto.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Valor de Custo */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="valor_custo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor de Custo</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moeda_custo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moeda</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="USD">Dólar ($)</SelectItem>
                          <SelectItem value="BRL">Real (R$)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simular Preço
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Resultado */}
      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Simulação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Valores */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Valor Final</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatarMoeda(resultado.valorFinal, form.getValues('moeda_custo'))}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Margem de Lucro</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatarMoeda(resultado.margemLucro, form.getValues('moeda_custo'))}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Margem Percentual</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatarPorcentagem(resultado.margemPercentual)}
                  </p>
                </div>
              </div>

              {/* Regras Aplicadas */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Regras Aplicadas</h3>
                <div className="border rounded-lg divide-y">
                  {resultado.regrasAplicadas.map((regra, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{regra.descricao}</p>
                        <p className="text-sm text-gray-500">Tipo: {regra.tipo}</p>
                      </div>
                      <p className="font-mono text-gray-900">
                        {formatarPorcentagem(regra.valor)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Justificativa */}
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-700">{resultado.justificativa}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}