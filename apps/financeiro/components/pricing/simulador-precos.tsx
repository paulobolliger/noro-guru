'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'
import { SimulacaoPreco } from '@/types/pricing'

interface FormValues {
  tipo_produto: string
  valor_custo: number
  quantidade: number
  cliente_id?: string
  fornecedor_id?: string
  data_simulacao: string
}

const defaultValues: FormValues = {
  tipo_produto: 'padrao',
  valor_custo: 0,
  quantidade: 1,
  data_simulacao: new Date().toISOString().split('T')[0]
}

interface SimuladorPrecosProps {
  onSimular: (data: FormValues) => Promise<SimulacaoPreco>
  isLoading?: boolean
}

export function SimuladorPrecos({ onSimular, isLoading = false }: SimuladorPrecosProps) {
  const [resultado, setResultado] = useState<SimulacaoPreco | null>(null)
  const form = useForm<FormValues>({ defaultValues })

  const handleSubmit = async (data: FormValues) => {
    try {
      const simulacao = await onSimular(data)
      setResultado(simulacao)
    } catch (error) {
      console.error('Erro ao simular preço:', error)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Simulador de Preços</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tipo_produto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Produto</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de produto" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="padrao">Produto Padrão</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="promocional">Promocional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor_custo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de Custo (R$)</FormLabel>
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
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="1"
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
                name="data_simulacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Simulação</FormLabel>
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

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Calculando..." : "Simular Preço"}
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
          <CardContent className="space-y-6">
            {/* Valores */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Valor de Custo:</span>
                <span className="font-medium">{formatCurrency(resultado.valor_custo)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Markup Total:</span>
                <span className="font-medium">{formatCurrency(resultado.markup_aplicado || 0)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Margem (%):</span>
                <span className="font-medium">
                  {resultado.margem_percentual?.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between items-center py-3 border-b text-lg font-semibold">
                <span>Preço Final:</span>
                <span className="text-primary">{formatCurrency(resultado.valor_final || 0)}</span>
              </div>
            </div>

            {/* Regras Aplicadas */}
            {resultado.regras_aplicadas && resultado.regras_aplicadas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground mb-2">
                  Regras Aplicadas
                </h4>
                <div className="space-y-2">
                  {resultado.regras_aplicadas.map((regra, index) => (
                    <div 
                      key={index}
                      className="text-sm p-2 rounded-md bg-muted"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{regra.descricao}</span>
                        <span>{formatCurrency(regra.valor)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tipo: {regra.tipo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultado.justificativa && (
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Observações:</p>
                <p>{resultado.justificativa}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}