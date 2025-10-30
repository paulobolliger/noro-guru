import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@noro/ui/card"
import { Badge } from "@noro/ui/badge"
import { Button } from "@noro/ui/button"
import { ScrollArea } from "@noro/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { approvePlanChanges, getPlanApprovals, rejectPlanChanges } from "../actions"
import { useState } from "react"
import { formatCurrency } from "../utils"

interface PlanApprovalRequest {
  id: string
  requestedBy: {
    name: string
    email: string
  }
  status: "pending" | "approved" | "rejected" | "cancelled"
  requestDate: string
  currentData: any
  proposedChanges: any
  impactAnalysis: {
    affectedSubscriptions: number
    priceIncreasePercentage: number
    removedFeatures: string[]
    removedModules: string[]
  }
}

export function PendingApprovals() {
  const [approvals, setApprovals] = useState<PlanApprovalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  async function loadApprovals() {
    try {
      const data = await getPlanApprovals()
      setApprovals(data)
    } catch (error) {
      console.error("Erro ao carregar aprovações:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(approvalId: string) {
    try {
      setProcessing(approvalId)
      await approvePlanChanges(approvalId)
      // Recarrega a lista
      await loadApprovals()
    } catch (error) {
      console.error("Erro ao aprovar mudanças:", error)
    } finally {
      setProcessing(null)
    }
  }

  async function handleReject(approvalId: string) {
    try {
      setProcessing(approvalId)
      await rejectPlanChanges(approvalId)
      // Recarrega a lista
      await loadApprovals()
    } catch (error) {
      console.error("Erro ao rejeitar mudanças:", error)
    } finally {
      setProcessing(null)
    }
  }

  function renderStatusBadge(status: string) {
    const statusMap = {
      pending: { label: "Pendente", variant: "warning" },
      approved: { label: "Aprovado", variant: "success" },
      rejected: { label: "Rejeitado", variant: "destructive" },
      cancelled: { label: "Cancelado", variant: "secondary" },
    } as const

    const { label, variant } = statusMap[status as keyof typeof statusMap]
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aprovações Pendentes</CardTitle>
        <CardDescription>
          Solicitações de mudanças em planos que requerem aprovação
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : approvals.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Nenhuma aprovação pendente
          </p>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {approvals.map((approval) => (
                <Card key={approval.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Solicitado por {approval.requestedBy.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(approval.requestDate).toLocaleString("pt-BR")}
                        </p>
                      </div>
                      {renderStatusBadge(approval.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mudanças de preço */}
                      {approval.currentData.monthly_price !==
                        approval.proposedChanges.monthly_price && (
                        <div>
                          <p className="font-medium">Alteração de Preço</p>
                          <div className="mt-1 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Atual
                              </p>
                              <p>
                                {formatCurrency(
                                  approval.currentData.monthly_price
                                )}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Proposto
                              </p>
                              <p>
                                {formatCurrency(
                                  approval.proposedChanges.monthly_price
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Features removidas */}
                      {approval.impactAnalysis.removedFeatures.length > 0 && (
                        <div>
                          <p className="font-medium">Features Removidas</p>
                          <ul className="mt-1 list-disc pl-4">
                            {approval.impactAnalysis.removedFeatures.map(
                              (feature) => (
                                <li key={feature}>{feature}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Módulos removidos */}
                      {approval.impactAnalysis.removedModules.length > 0 && (
                        <div>
                          <p className="font-medium">Módulos Removidos</p>
                          <ul className="mt-1 list-disc pl-4">
                            {approval.impactAnalysis.removedModules.map(
                              (module) => (
                                <li key={module}>{module}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Impacto */}
                      <div>
                        <p className="font-medium">Análise de Impacto</p>
                        <div className="mt-1 space-y-1 text-sm">
                          <p>
                            Assinaturas afetadas:{" "}
                            {approval.impactAnalysis.affectedSubscriptions}
                          </p>
                          {approval.impactAnalysis.priceIncreasePercentage > 0 && (
                            <p>
                              Aumento de preço:{" "}
                              {approval.impactAnalysis.priceIncreasePercentage}%
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ações */}
                      {approval.status === "pending" && (
                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleReject(approval.id)}
                            disabled={!!processing}
                          >
                            {processing === approval.id && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Rejeitar
                          </Button>
                          <Button
                            onClick={() => handleApprove(approval.id)}
                            disabled={!!processing}
                          >
                            {processing === approval.id && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Aprovar
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}