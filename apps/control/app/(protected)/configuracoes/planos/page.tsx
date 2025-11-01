import { Metadata } from 'next'
import { getPlans } from './actions'
import { PlanCard } from './components/PlanCard'
import PageContainer from '@/components/layout/PageContainer'
import SectionHeader from '@/components/layout/SectionHeader'
import { Plug, Users, SlidersHorizontal, CreditCard, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@noro/ui/button"

export const metadata: Metadata = {
  title: 'Planos e Assinaturas | Control Plane',
  description: 'Gerencie os planos e assinaturas disponíveis.',
}

export default async function PlansPage() {
  const plans = await getPlans()

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between mb-6">
        <SectionHeader
          title="Configurações"
          subtitle="Gira as integrações, utilizadores e preferências do sistema."
        />
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        </div>
      </div>

      {/* Abas de navegação */}
      <div className="flex border-b-2 border-[#4aede5]/20 mb-8">
        <Link 
          href="/configuracoes/planos" 
          className="flex items-center gap-2 px-4 py-3 font-semibold transition-colors -mb-[2px] border-b-2 border-[#D4AF37] text-primary"
        >
          <CreditCard size={18} /> Planos
        </Link>
        <Link 
          href="/configuracoes" 
          className="flex items-center gap-2 px-4 py-3 font-semibold transition-colors text-secondary hover:text-primary hover:border-b-2 hover:border-[#4aede5] -mb-[2px]"
        >
          <Users size={18} /> Utilizadores
        </Link>
        <button 
          disabled
          className="flex items-center gap-2 px-4 py-3 font-semibold transition-colors text-secondary hover:text-primary hover:border-b-2 hover:border-[#4aede5] -mb-[2px] opacity-50 cursor-not-allowed"
          title="Disponível na página de Configurações"
        >
          <SlidersHorizontal size={18} /> Preferências
        </button>
        <button 
          disabled
          className="flex items-center gap-2 px-4 py-3 font-semibold transition-colors text-secondary hover:text-primary hover:border-b-2 hover:border-[#4aede5] -mb-[2px] opacity-50 cursor-not-allowed"
          title="Disponível na página de Configurações"
        >
          <Plug size={18} /> Integrações
        </button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </PageContainer>
  )
}