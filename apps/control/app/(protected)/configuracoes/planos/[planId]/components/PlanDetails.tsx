import { Plan } from "../../types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@noro/ui/card"
import { formatCurrency } from "@noro/lib/utils"
import { AlertCircle, CheckCircle2, User, HardDrive, Database, Globe, Palette, HeadphonesIcon, Key } from "lucide-react"
import { Badge } from "@noro/ui/badge"

interface PlanDetailsProps {
  plan: Plan
}

export function PlanDetails({ plan }: PlanDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Preços e Trial */}
      <Card>
        <CardHeader>
          <CardTitle>Preços e Período Trial</CardTitle>
          <CardDescription>Configurações de preços e trial para diferentes ciclos de pagamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Mensal</p>
              <p className="text-2xl font-bold">{formatCurrency(plan.monthly_price)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Trimestral</p>
              <p className="text-2xl font-bold">{formatCurrency(plan.quarterly_price)}</p>
              <p className="text-sm text-muted-foreground">
                {Math.round((1 - (plan.quarterly_price / 3) / plan.monthly_price) * 100)}% de desconto
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Anual</p>
              <p className="text-2xl font-bold">{formatCurrency(plan.yearly_price)}</p>
              <p className="text-sm text-muted-foreground">
                {Math.round((1 - (plan.yearly_price / 12) / plan.monthly_price) * 100)}% de desconto
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Período Trial</p>
              <p className="text-2xl font-bold">{plan.trial_days} dias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recursos e Limites */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos e Limites</CardTitle>
          <CardDescription>Features e limites inclusos neste plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium">Limites</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Usuários</span>
                  </div>
                  <Badge>{plan.features.users}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    <span>Armazenamento</span>
                  </div>
                  <Badge>{plan.features.storage_gb}GB</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Requisições API/dia</span>
                  </div>
                  <Badge>{plan.features.api_requests_per_day.toLocaleString()}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Features</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Domínio personalizado</span>
                  </div>
                  {plan.features.custom_domain ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span>White Label</span>
                  </div>
                  {plan.features.white_label ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HeadphonesIcon className="h-4 w-4" />
                    <span>Suporte prioritário</span>
                  </div>
                  {plan.features.priority_support ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-300" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    <span>Acesso à API</span>
                  </div>
                  {plan.features.api_access ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-gray-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Módulos */}
      <Card>
        <CardHeader>
          <CardTitle>Módulos Inclusos</CardTitle>
          <CardDescription>Módulos disponíveis neste plano</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(plan.modules).map(([module, enabled]) => (
              <div 
                key={module}
                className="flex items-center justify-between p-4 border rounded"
              >
                <span className="capitalize">{module}</span>
                {enabled ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}