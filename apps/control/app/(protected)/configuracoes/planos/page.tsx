import { Metadata } from 'next'
import { getPlans } from './actions'
import { PlanCard } from './components/PlanCard'
import { SubscriptionPlansHeader } from './components/SubscriptionPlansHeader'

export const metadata: Metadata = {
  title: 'Planos e Assinaturas | Control Plane',
  description: 'Gerencie os planos e assinaturas disponíveis.',
}

export default async function PlansPage() {
  const plans = await getPlans()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <SubscriptionPlansHeader />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}