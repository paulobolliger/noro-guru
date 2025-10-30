import { Button } from "@noro/ui/button"
import { Plan } from "../types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@noro/ui/card"
import { formatCurrency } from "@noro/lib/utils"
import { AlertCircle, CheckCircle2, User, HardDrive, Database, Globe, Palette, HeadphonesIcon, Key } from "lucide-react"
import { Badge } from "@noro/ui/badge"

interface PlanFeatureProps {
  icon: React.ReactNode
  text: string
  included: boolean
  value?: string | number
}

function PlanFeature({ icon, text, included, value }: PlanFeatureProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4">
        {icon}
      </div>
      <span className="flex-1">{text}</span>
      {value ? (
        <Badge variant={included ? "default" : "secondary"}>
          {value}
        </Badge>
      ) : (
        included ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-gray-300" />
        )
      )}
    </div>
  )
}

interface PlanCardProps {
  plan: Plan
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card className={
      plan.slug === 'pro' 
        ? 'border-primary shadow-lg' 
        : ''
    }>
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-3xl font-bold">
            {formatCurrency(plan.monthly_price)}
            <span className="text-sm font-normal text-muted-foreground">/mês</span>
          </div>
          {plan.trial_days > 0 && (
            <div className="text-sm text-muted-foreground">
              {plan.trial_days} dias grátis
            </div>
          )}
        </div>

        <div className="space-y-2">
          <PlanFeature
            icon={<User className="w-4 h-4" />}
            text="Usuários"
            included={true}
            value={plan.features.users}
          />
          <PlanFeature
            icon={<HardDrive className="w-4 h-4" />}
            text="Armazenamento"
            included={true}
            value={`${plan.features.storage_gb}GB`}
          />
          <PlanFeature
            icon={<Database className="w-4 h-4" />}
            text="Requisições API/dia"
            included={true}
            value={plan.features.api_requests_per_day.toLocaleString()}
          />
          <PlanFeature
            icon={<Globe className="w-4 h-4" />}
            text="Domínio personalizado"
            included={plan.features.custom_domain}
          />
          <PlanFeature
            icon={<Palette className="w-4 h-4" />}
            text="White Label"
            included={plan.features.white_label}
          />
          <PlanFeature
            icon={<HeadphonesIcon className="w-4 h-4" />}
            text="Suporte prioritário"
            included={plan.features.priority_support}
          />
          <PlanFeature
            icon={<Key className="w-4 h-4" />}
            text="Acesso à API"
            included={plan.features.api_access}
          />
        </div>

        <div className="space-y-2 pt-4">
          <h4 className="font-medium">Módulos inclusos:</h4>
          {Object.entries(plan.modules).map(([module, included]) => (
            <PlanFeature
              key={module}
              icon={<CheckCircle2 className="w-4 h-4" />}
              text={module.charAt(0).toUpperCase() + module.slice(1)}
              included={included}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" variant={plan.slug === 'pro' ? 'default' : 'outline'}>
          Selecionar plano
        </Button>
        {plan.slug === 'enterprise' && (
          <Button variant="ghost" className="w-full">
            Falar com consultor
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}