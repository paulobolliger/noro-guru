import { Button } from "@noro/ui/button"
import { Plus } from "lucide-react"

export function SubscriptionPlansHeader() {
  return (
    <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Planos e Assinaturas</h2>
        <p className="text-muted-foreground">
          Gerencie os planos disponíveis e suas configurações.
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Plano
        </Button>
      </div>
    </div>
  )
}