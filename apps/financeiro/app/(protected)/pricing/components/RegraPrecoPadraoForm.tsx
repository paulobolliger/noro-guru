import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegraPreco, TipoRegraPreco } from '../../../types/pricing'
import { Button } from '@noro/ui'
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
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
import { Switch } from '@noro/ui'
import { Loader2 } from 'lucide-react'
import { Textarea } from '@noro/ui'

// Schema de validação
const formSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  tipo: z.enum(['markup_padrao', 'volume', 'sazonalidade', 'cliente_categoria', 'destino', 'fornecedor', 'produto'] as const),
  descricao: z.string().optional(),
  
  // Condições
  valor_minimo: z.number().optional(),
  valor_maximo: z.number().optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  
  // Markup
  tipo_markup: z.enum(['fixo', 'percentual'] as const),
  valor_markup: z.number()
    .min(-100, 'Valor mínimo é -100%')
    .max(999.99, 'Valor máximo excedido'),
  moeda: z.enum(['EUR', 'USD', 'BRL']),
  
  // Controle
  prioridade: z.number().int().min(0).max(100),
  sobrepor_regras: z.boolean(),
  ativo: z.boolean(),
  
  // Metadados específicos por tipo
  metadados: z.record(z.any()).optional()
})

type FormData = z.infer<typeof formSchema>

interface RegraPrecoPadraoFormProps {
  regra?: RegraPreco
  onSubmit: (data: FormData) => Promise<void>
  isLoading?: boolean
}

export default function RegraPrecoPadraoForm({
  regra,
  onSubmit,
  isLoading = false
}: RegraPrecoPadraoFormProps) {
  const [selectedTipo, setSelectedTipo] = useState<TipoRegraPreco>(
    regra?.tipo || 'markup_padrao'
  )

  // Form initialization
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: regra ? {
      nome: regra.nome,
      tipo: regra.tipo,
      descricao: regra.descricao,
      valor_minimo: regra.valor_minimo,
      valor_maximo: regra.valor_maximo,
      data_inicio: regra.data_inicio,
      data_fim: regra.data_fim,
      tipo_markup: regra.tipo_markup,
      valor_markup: regra.valor_markup,
      moeda: regra.moeda,
      prioridade: regra.prioridade,
      sobrepor_regras: regra.sobrepor_regras,
      ativo: regra.ativo,
      metadados: regra.metadados
    } : {
      nome: '',
      tipo: 'markup_padrao',
      descricao: '',
      tipo_markup: 'percentual',
      valor_markup: 0,
      moeda: 'EUR',
      prioridade: 0,
      sobrepor_regras: false,
      ativo: true
    }
  })

  // Tipos de regras disponíveis
  const tiposRegra = [
    { value: 'markup_padrao', label: 'Markup Padrão' },
    { value: 'volume', label: 'Volume' },
    { value: 'sazonalidade', label: 'Sazonalidade' },
    { value: 'cliente_categoria', label: 'Categoria de Cliente' },
    { value: 'destino', label: 'Destino' },
    { value: 'fornecedor', label: 'Fornecedor' },
    { value: 'produto', label: 'Produto' }
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração da Regra</CardTitle>
            <CardDescription>
              Configure os parâmetros da regra de preço
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Regra</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Regra */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Regra</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedTipo(value as TipoRegraPreco)
                    }}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo de regra" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposRegra.map((tipo) => (
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

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Condições de Valor */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valor_minimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo</FormLabel>
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
                name="valor_maximo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Máximo</FormLabel>
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
            </div>

            {/* Período de Validade */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Início</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_fim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Fim</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Markup */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_markup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Markup</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fixo">Valor Fixo</SelectItem>
                        <SelectItem value="percentual">Percentual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_markup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch('tipo_markup') === 'percentual' 
                        ? 'Percentual (%)' 
                        : 'Valor'}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step={form.watch('tipo_markup') === 'percentual' ? '0.01' : '1'}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Moeda */}
            <FormField
              control={form.control}
              name="moeda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moeda</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading || form.watch('tipo_markup') === 'percentual'}
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

            {/* Prioridade */}
            <FormField
              control={form.control}
              name="prioridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    0 = menor prioridade, 100 = maior prioridade
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sobrepor Regras */}
            <FormField
              control={form.control}
              name="sobrepor_regras"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Sobrepor Regras</FormLabel>
                    <FormDescription>
                      Se ativado, esta regra substituirá as regras anteriores
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Ativo */}
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <FormDescription>
                      Regra está ativa e será aplicada nos cálculos
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {regra ? 'Atualizar Regra' : 'Criar Regra'}
        </Button>
      </form>
    </Form>
  )
}