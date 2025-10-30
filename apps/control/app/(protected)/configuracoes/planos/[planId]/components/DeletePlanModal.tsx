import { Button } from "@noro/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@noro/ui/dialog"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { deletePlan } from "../../actions"
import { useRouter } from "next/navigation"

interface DeletePlanModalProps {
  planId: string
  planName: string
  subscriberCount: number
  isOpen: boolean
  onClose: () => void
}

export function DeletePlanModal({
  planId,
  planName,
  subscriberCount,
  isOpen,
  onClose,
}: DeletePlanModalProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      await deletePlan(planId)
      router.push("/configuracoes/planos")
      router.refresh()
    } catch (error) {
      console.error("Erro ao excluir plano:", error)
      // Aqui poderíamos adicionar um toast de erro
    } finally {
      setIsDeleting(false)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Plano</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o plano <strong>{planName}</strong>?
            {subscriberCount > 0 && (
              <div className="mt-2 text-red-500">
                ⚠️ Este plano possui {subscriberCount} assinante{subscriberCount > 1 ? "s" : ""} ativo{subscriberCount > 1 ? "s" : ""}.
                Eles precisarão ser migrados para outro plano antes da exclusão.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting || subscriberCount > 0}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {subscriberCount > 0 ? "Não é possível excluir" : "Excluir plano"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}