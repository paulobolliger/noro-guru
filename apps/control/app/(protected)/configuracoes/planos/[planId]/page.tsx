import { Metadata } from "next"
import { getPlan } from "../../actions"
import { PlanHeader } from "./components/PlanHeader"
import { PlanDetails } from "./components/PlanDetails"
import { PlanSubscribers } from "./components/PlanSubscribers"
import { PlanHistory } from "./components/PlanHistory"
import { PlanMetrics } from "./components/PlanMetrics"
import { PendingApprovals } from "./components/PendingApprovals"
import { notFound } from "next/navigation"

interface PlanPageProps {
  params: {
    planId: string
  }
}

export async function generateMetadata({ params }: PlanPageProps): Promise<Metadata> {
  const plan = await getPlan(params.planId)
  if (!plan) return { title: "Plano não encontrado" }
  
  return {
    title: `${plan.name} | Control Plane`,
    description: plan.description
  }
}

export default async function PlanPage({ params }: PlanPageProps) {
  const plan = await getPlan(params.planId)
  if (!plan) notFound()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <PlanHeader plan={plan} />
      
      {/* Seção principal */}
      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-8">
        {/* Coluna principal - 5 colunas */}
        <div className="md:col-span-4 lg:col-span-5 space-y-4">
          <PendingApprovals />
          <PlanDetails plan={plan} />
          <PlanMetrics planId={plan.id} />
        </div>

        {/* Coluna lateral - 3 colunas */}
        <div className="md:col-span-3 space-y-4">
          <PlanSubscribers planId={plan.id} />
          <PlanHistory planId={plan.id} />
        </div>
      </div>
    </div>
  )
}