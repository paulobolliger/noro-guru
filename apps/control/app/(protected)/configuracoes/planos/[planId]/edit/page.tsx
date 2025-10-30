import { Metadata } from "next"
import { getPlan } from "../../../actions"
import { PlanForm } from "../components/PlanForm"
import { notFound } from "next/navigation"
import { Button } from "@noro/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditPlanPageProps {
  params: {
    planId: string
  }
}

export async function generateMetadata({ params }: EditPlanPageProps): Promise<Metadata> {
  const plan = await getPlan(params.planId)
  if (!plan) return { title: "Plano não encontrado" }
  
  return {
    title: `Editar ${plan.name} | Control Plane`,
    description: `Editar configurações do plano ${plan.name}`
  }
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const plan = await getPlan(params.planId)
  if (!plan) notFound()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href={`/configuracoes/planos/${plan.id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold">Editar Plano</h2>
          </div>
          <p className="text-muted-foreground">
            Atualize as configurações do plano {plan.name}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <PlanForm plan={plan} />
      </div>
    </div>
  )
}