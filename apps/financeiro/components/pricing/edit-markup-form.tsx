'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MarkupPadrao } from "@/types/pricing"

const formSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  descricao: z.string().optional(),
  tipo_produto: z.string().min(1, "Selecione o tipo de produto"),
  tipo_markup: z.enum(["fixo", "percentual"]),
  valor_markup: z.coerce
    .number()
    .min(0, "Valor não pode ser negativo")
    .max(1000, "Valor muito alto"),
  ordem: z.coerce.number().int().min(1),
})

interface EditMarkupFormProps {
  markup: MarkupPadrao
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: z.infer<typeof formSchema>) => void
}

export function EditMarkupForm({ 
  markup,
  open,
  onOpenChange,
  onSubmit 
}: EditMarkupFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: markup.nome,
      descricao: markup.descricao,
      tipo_produto: markup.tipo_produto,
      tipo_markup: markup.tipo_markup,
      valor_markup: markup.valor_markup,
      ordem: markup.ordem,
    },
  })

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      onSubmit?.(data)
      toast.success("Markup atualizado com sucesso!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Erro ao atualizar markup")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Markup</DialogTitle>
          <DialogDescription>
            Atualize as informações do markup selecionado
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      placeholder="Ex: 25.5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ordem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ordem</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}