import { Plan } from "../../../types"
import { Button } from "@noro/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@noro/ui/card"
import { Input } from "@noro/ui/input"
import { Label } from "@noro/ui/label"
import { Switch } from "@noro/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@noro/ui/tabs"
import { updatePlan } from "../../../actions"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface PlanFormProps {
  plan: Plan
}

export function PlanForm({ plan }: PlanFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [needsApproval, setNeedsApproval] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const updates = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      is_public: formData.get("is_public") === "on",
      monthly_price: parseFloat(formData.get("monthly_price") as string),
      quarterly_price: parseFloat(formData.get("quarterly_price") as string),
      yearly_price: parseFloat(formData.get("yearly_price") as string),
      trial_days: parseInt(formData.get("trial_days") as string),
      features: {
        users: parseInt(formData.get("users") as string),
        storage_gb: parseInt(formData.get("storage_gb") as string),
        api_requests_per_day: parseInt(formData.get("api_requests_per_day") as string),
        custom_domain: formData.get("custom_domain") === "on",
        white_label: formData.get("white_label") === "on",
        priority_support: formData.get("priority_support") === "on",
        api_access: formData.get("api_access") === "on"
      },
      modules: {
        core: true, // Sempre ativo
        visa: formData.get("module_visa") === "on",
        crm: formData.get("module_crm") === "on",
        billing: formData.get("module_billing") === "on",
        support: formData.get("module_support") === "on"
      }
    }

    try {
      setIsSaving(true)

      // Se precisar de aprovação, criar solicitação
      if (needsApproval) {
        setPendingApproval(true)
        // TODO: Implementar lógica de aprovação
        return
      }

      await updatePlan(plan.id, updates)
      router.refresh()
      router.push(`/configuracoes/planos/${plan.id}`)
    } catch (error) {
      console.error("Erro ao atualizar plano:", error)
      // Aqui poderíamos adicionar um toast de erro
    } finally {
      setIsSaving(false)
    }
  }

  // Verifica se as mudanças precisam de aprovação
  function checkNeedsApproval(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget)
    const newMonthlyPrice = parseFloat(formData.get("monthly_price") as string)
    
    // Preço aumentou mais que 10%
    if (newMonthlyPrice > plan.monthly_price * 1.1) {
      setNeedsApproval(true)
    }
    // Removendo features ou módulos
    else if (
      formData.get("custom_domain") !== "on" && plan.features.custom_domain ||
      formData.get("white_label") !== "on" && plan.features.white_label ||
      formData.get("priority_support") !== "on" && plan.features.priority_support ||
      formData.get("api_access") !== "on" && plan.features.api_access ||
      formData.get("module_visa") !== "on" && plan.modules.visa ||
      formData.get("module_crm") !== "on" && plan.modules.crm ||
      formData.get("module_billing") !== "on" && plan.modules.billing ||
      formData.get("module_support") !== "on" && plan.modules.support
    ) {
      setNeedsApproval(true)
    } else {
      setNeedsApproval(false)
    }
  }

  return (
    <form onSubmit={onSubmit} onChange={(e) => checkNeedsApproval(e)}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Configurações gerais do plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do plano</Label>
              <Input
                id="name"
                name="name"
                defaultValue={plan.name}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                defaultValue={plan.description}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_public"
                name="is_public"
                defaultChecked={plan.is_public}
              />
              <Label htmlFor="is_public">Plano público</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preços e Trial</CardTitle>
            <CardDescription>
              Configure os preços para diferentes períodos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList>
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
                <TabsTrigger value="quarterly">Trimestral</TabsTrigger>
                <TabsTrigger value="yearly">Anual</TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="monthly_price">Preço mensal</Label>
                  <Input
                    id="monthly_price"
                    name="monthly_price"
                    type="number"
                    step="0.01"
                    defaultValue={plan.monthly_price}
                    required
                  />
                </div>
              </TabsContent>
              <TabsContent value="quarterly" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="quarterly_price">Preço trimestral</Label>
                  <Input
                    id="quarterly_price"
                    name="quarterly_price"
                    type="number"
                    step="0.01"
                    defaultValue={plan.quarterly_price}
                    required
                  />
                </div>
              </TabsContent>
              <TabsContent value="yearly" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="yearly_price">Preço anual</Label>
                  <Input
                    id="yearly_price"
                    name="yearly_price"
                    type="number"
                    step="0.01"
                    defaultValue={plan.yearly_price}
                    required
                  />
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-4 grid gap-2">
              <Label htmlFor="trial_days">Dias de trial</Label>
              <Input
                id="trial_days"
                name="trial_days"
                type="number"
                defaultValue={plan.trial_days}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recursos e Limites</CardTitle>
            <CardDescription>
              Configure os recursos disponíveis neste plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="users">Número de usuários</Label>
                  <Input
                    id="users"
                    name="users"
                    type="number"
                    defaultValue={plan.features.users}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="storage_gb">Armazenamento (GB)</Label>
                  <Input
                    id="storage_gb"
                    name="storage_gb"
                    type="number"
                    defaultValue={plan.features.storage_gb}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="api_requests_per_day">
                    Requisições API/dia
                  </Label>
                  <Input
                    id="api_requests_per_day"
                    name="api_requests_per_day"
                    type="number"
                    defaultValue={plan.features.api_requests_per_day}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Switch
                    id="custom_domain"
                    name="custom_domain"
                    defaultChecked={plan.features.custom_domain}
                  />
                  <Label htmlFor="custom_domain">Domínio personalizado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="white_label"
                    name="white_label"
                    defaultChecked={plan.features.white_label}
                  />
                  <Label htmlFor="white_label">White Label</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="priority_support"
                    name="priority_support"
                    defaultChecked={plan.features.priority_support}
                  />
                  <Label htmlFor="priority_support">Suporte prioritário</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="api_access"
                    name="api_access"
                    defaultChecked={plan.features.api_access}
                  />
                  <Label htmlFor="api_access">Acesso à API</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Módulos</CardTitle>
            <CardDescription>
              Selecione os módulos disponíveis neste plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Core é sempre true */}
              <div className="flex items-center gap-2 opacity-50">
                <Switch id="module_core" checked disabled />
                <Label htmlFor="module_core">Core (sempre ativo)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="module_visa"
                  name="module_visa"
                  defaultChecked={plan.modules.visa}
                />
                <Label htmlFor="module_visa">Visa</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="module_crm"
                  name="module_crm"
                  defaultChecked={plan.modules.crm}
                />
                <Label htmlFor="module_crm">CRM</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="module_billing"
                  name="module_billing"
                  defaultChecked={plan.modules.billing}
                />
                <Label htmlFor="module_billing">Billing</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="module_support"
                  name="module_support"
                  defaultChecked={plan.modules.support}
                />
                <Label htmlFor="module_support">Support</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {needsApproval && (
          <Card className="border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-500">
                Aprovação Necessária
              </CardTitle>
              <CardDescription>
                As alterações propostas requerem aprovação:
                <ul className="mt-2 list-disc list-inside">
                  <li>Aumento significativo de preço</li>
                  <li>Remoção de features ou módulos</li>
                </ul>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ao salvar, uma solicitação de aprovação será criada.
                As mudanças só serão aplicadas após aprovação.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push(`/configuracoes/planos/${plan.id}`)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {needsApproval
              ? "Solicitar Aprovação"
              : "Salvar Alterações"}
          </Button>
        </div>
      </div>
    </form>
  )
}