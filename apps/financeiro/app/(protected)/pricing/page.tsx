import { Tabs, TabsContent, TabsList, TabsTrigger } from '@noro/ui'
import SectionHeader from '@/components/layout/SectionHeader'
import { Calculator } from 'lucide-react'
import GerenciarMarkups from './components/GerenciarMarkups'
import GerenciarRegrasPreco from './components/GerenciarRegrasPreco'
import SimuladorPrecos from './components/SimuladorPrecos'

export default function PricingPage() {
  return (
    <div className="container-app py-8 space-y-6">
      <SectionHeader 
        title="Pricing Engine" 
        subtitle="Gerencie markups, regras de preço e simule valores"
        icon={<Calculator size={28} />}
      />
      
      <Tabs defaultValue="markups" className="w-full">
        <TabsList>
          <TabsTrigger value="markups">Markups Padrão</TabsTrigger>
          <TabsTrigger value="regras">Regras de Preço</TabsTrigger>
          <TabsTrigger value="simulador">Simulador</TabsTrigger>
        </TabsList>
        
        <TabsContent value="markups" className="mt-6">
          <GerenciarMarkups />
        </TabsContent>
        
        <TabsContent value="regras" className="mt-6">
          <GerenciarRegrasPreco />
        </TabsContent>
        
        <TabsContent value="simulador" className="mt-6">
          <SimuladorPrecos />
        </TabsContent>
      </Tabs>
    </div>
  )
}