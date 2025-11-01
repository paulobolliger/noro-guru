import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MarkupPadrao, TipoMarkup } from '../../../types/pricing'
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
import { Switch } from '@noro/ui'
import { Loader2 } from 'lucide-react'

// Schema de validação
const formSchema = z.object({
  tipo_produto: z.string().min(1, 'Tipo de produto é obrigatório'),
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  descricao: z.string().optional(),
  tipo_markup: z.enum(['fixo', 'percentual', 'dinamico', 'personalizado'] as const),
  valor_markup: z.number()
    .min(0, 'Valor deve ser positivo')
    .max(999.99, 'Valor máximo excedido'),
  moeda: z.enum(['EUR', 'USD', 'BRL']),
  ativo: z.boolean(),
  ordem: z.number().int().min(0)
})

type FormData = z.infer<typeof formSchema>

interface MarkupPadraoFormProps {
  markup?: MarkupPadrao
  onSubmit: (data: FormData) => Promise<void>
  isLoading?: boolean
}

export default function MarkupPadraoForm({ 
  markup,
  onSubmit,
  isLoading = false 
}: MarkupPadraoFormProps) {
  // Form initialization
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: markup ? {
      tipo_produto: markup.tipo_produto,
      nome: markup.nome,
      descricao: markup.descricao,
      tipo_markup: markup.tipo_markup,
      valor_markup: markup.valor_markup,
      moeda: markup.moeda,
      ativo: markup.ativo,
      ordem: markup.ordem
    } : {
      tipo_produto: '',
      nome: '',
      descricao: '',
      tipo_markup: 'percentual',
      valor_markup: 0,
      moeda: 'EUR',
      ativo: true,
      ordem: 0
    }
  })

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuração de Markup</CardTitle>
            <CardDescription>
              Configure o markup padrão para este tipo de produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            {/* Nome */}
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
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
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Markup */}
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
                        <SelectValue placeholder="Selecione o tipo de markup" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixo">Valor Fixo</SelectItem>
                      <SelectItem value="percentual">Percentual</SelectItem>
                      <SelectItem value="dinamico">Dinâmico</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor do Markup */}
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

            {/* Ativo */}
            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Ativo</FormLabel>
                    <FormDescription>
                      Markup está ativo e será aplicado nos cálculos
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
          {markup ? 'Atualizar Markup' : 'Criar Markup'}
        </Button>
      </form>
    </Form>
  )
}