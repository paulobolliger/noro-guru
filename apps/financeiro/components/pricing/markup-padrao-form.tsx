'use client'

import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"



import { TipoMarkup, MarkupPadrao } from "@/types/pricing"

type FormValues = {
  nome: string
  descricao?: string
  tipo_markup: TipoMarkup
  valor_markup: number
}

const defaultValues: FormValues = {
  nome: "",
  descricao: "",
  tipo_markup: "percentual",
  valor_markup: 0,
}

interface MarkupPadraoFormProps {
  onSubmit?: (data: FormValues) => void
  isSubmitting?: boolean
}

export function MarkupPadraoForm({ 
  onSubmit: onSubmitProp,
  isSubmitting = false 
}: MarkupPadraoFormProps) {
  const form = useForm<FormValues>({
    defaultValues,
  })

  async function onSubmit(data: FormValues) {
    try {
      onSubmitProp?.(data)
      form.reset(defaultValues)
      toast.success("Markup padrão criado com sucesso!")
    } catch (error) {
      toast.error("Erro ao criar markup padrão")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Markup Padrão" {...field} />
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
                <Input placeholder="Ex: Markup para produtos padrão" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tipo_markup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Markup</FormLabel>
              <FormControl>
                <select 
                  className="w-full px-3 py-2 border rounded-md"
                  {...field}
                >
                  <option value="percentual">Percentual</option>
                  <option value="fixo">Valor Fixo</option>
                  <option value="dinamico">Dinâmico</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </FormControl>
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
                  placeholder={
                    form.watch("tipo_markup") === "percentual"
                      ? "Ex: 25.5"
                      : "Ex: 100.00"
                  }
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando..." : "Criar Markup"}
        </Button>
      </form>
    </Form>
  )
}