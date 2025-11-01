'use client'

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { RegraPreco, TipoRegraPreco } from "@/types/pricing"

interface FormValues {
  nome: string
  descricao?: string
  tipo: TipoRegraPreco
  valor_minimo?: number
  valor_maximo?: number
  data_inicio?: string
  data_fim?: string
  tipo_markup: 'fixo' | 'percentual' | 'dinamico' | 'personalizado'
  valor_markup: number
  prioridade: number
  sobrepor_regras: boolean
  metadados?: Record<string, any>
}

const defaultValues: FormValues = {
  nome: "",
  descricao: "",
  tipo: 'markup_padrao',
  valor_minimo: 0,
  valor_maximo: 0,
  data_inicio: "",
  data_fim: "",
  tipo_markup: 'percentual',
  valor_markup: 0,
  prioridade: 1,
  sobrepor_regras: false,
  metadados: {},
}

interface RegraPrecoPadraoFormProps {
  regra?: RegraPreco
  onSubmit?: (data: FormValues) => void
  isSubmitting?: boolean
}

export function RegraPrecoPadraoForm({ 
  regra,
  onSubmit: onSubmitProp,
  isSubmitting = false
}: RegraPrecoPadraoFormProps) {
  const form = useForm<FormValues>({
    defaultValues: regra ? {
      nome: regra.nome,
      descricao: regra.descricao,
      tipo: regra.tipo,
      valor_minimo: regra.valor_minimo,
      valor_maximo: regra.valor_maximo,
      data_inicio: regra.data_inicio,
      data_fim: regra.data_fim,
      tipo_markup: regra.tipo_markup,
      valor_markup: regra.valor_markup,
      prioridade: regra.prioridade,
      sobrepor_regras: regra.sobrepor_regras,
      metadados: regra.metadados
    } : defaultValues
  })

  const handleSubmit = async (data: FormValues) => {
    try {
      await onSubmitProp?.(data)
      if (!regra) {
        form.reset(defaultValues)
      }
      toast.success(regra ? "Regra atualizada com sucesso!" : "Regra criada com sucesso!")
    } catch (error) {
      toast.error(regra ? "Erro ao atualizar regra" : "Erro ao criar regra")
    }
  }

  return (
    <Form {...form}>
      <form 
        id="regra-preco-form"
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-8"
      >
        {/* Informações Básicas */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Regra de markup padrão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Regra para produtos padrão" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Regra</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de regra" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="markup_padrao">Markup Padrão</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                      <SelectItem value="sazonalidade">Sazonalidade</SelectItem>
                      <SelectItem value="cliente_categoria">Categoria de Cliente</SelectItem>
                      <SelectItem value="destino">Destino</SelectItem>
                      <SelectItem value="fornecedor">Fornecedor</SelectItem>
                      <SelectItem value="produto">Produto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Condições */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valor_minimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Mínimo (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="Ex: 100.00"
                        {...field}
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
                    <FormLabel>Valor Máximo (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="Ex: 1000.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Markup e Controles */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="tipo_markup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Markup</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de markup" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentual">Percentual</SelectItem>
                      <SelectItem value="fixo">Valor Fixo</SelectItem>
                      <SelectItem value="dinamico">Dinâmico</SelectItem>
                      <SelectItem value="personalizado">Personalizado</SelectItem>
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
                    {form.watch("tipo_markup") === "percentual" 
                      ? "Percentual (%)" 
                      : "Valor (R$)"}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      step="0.01"
                      placeholder={form.watch("tipo_markup") === "percentual" 
                        ? "Ex: 25.5" 
                        : "Ex: 100.00"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prioridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      min="1"
                      max="100"
                      placeholder="Ex: 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sobrepor_regras"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Sobrepor Outras Regras</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Se ativado, esta regra irá sobrepor outras regras de menor prioridade
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
          </CardContent>
        </Card>

        {!regra && (
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Criar Regra'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}