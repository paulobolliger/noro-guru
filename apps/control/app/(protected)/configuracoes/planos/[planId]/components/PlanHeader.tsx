import { Plan } from "../../types"
import { Button } from "@noro/ui/button"
import { Edit2, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@noro/ui/badge"
import { formatCurrency } from "@noro/lib/utils"

interface PlanHeaderProps {
  plan: Plan
}

export function PlanHeader({ plan }: PlanHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link href="/configuracoes/planos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">{plan.name}</h2>
          <Badge variant={plan.is_public ? "default" : "secondary"}>
            {plan.is_public ? "Público" : "Privado"}
          </Badge>
          {plan.is_custom && (
            <Badge variant="outline">Customizado</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">{plan.description}</p>
          <div className="flex items-center gap-2">
            <span className="font-medium text-lg">
              {formatCurrency(plan.monthly_price)}
            </span>
            <span className="text-sm text-muted-foreground">/mês</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button>
          <Edit2 className="mr-2 h-4 w-4" />
          Editar Plano
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>
    </div>
  )
}