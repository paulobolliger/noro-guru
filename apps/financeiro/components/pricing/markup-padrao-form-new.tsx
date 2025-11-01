'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  percentual: z.coerce
    .number()
    .min(0, "Percentual não pode ser negativo")
    .max(1000, "Percentual muito alto"),
})

type FormSchema = z.infer<typeof formSchema>

const defaultValues: Partial<FormSchema> = {
  nome: "",
  descricao: "",
  percentual: 0,
}

interface MarkupPadraoFormProps {
  onSubmit?: (data: FormSchema) => void
}

export function MarkupPadraoForm({ onSubmit: onSubmitProp }: MarkupPadraoFormProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(data: FormSchema) {
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
                <Input 
                  placeholder="Ex: Markup para produtos padrão" 
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
          name="percentual"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Percentual (%)</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="Ex: 25.5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Criar Markup</Button>
      </form>
    </Form>
  )
}