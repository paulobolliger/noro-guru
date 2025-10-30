import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@noro/ui/card"
import { getPlanHistory } from "../../actions"

interface PlanHistoryProps {
  planId: string
}

export async function PlanHistory({ planId }: PlanHistoryProps) {
  const history = await getPlanHistory(planId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Alterações</CardTitle>
        <CardDescription>Mudanças realizadas neste plano</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma alteração registrada.
            </p>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="border-l-2 pl-4 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">
                    {entry.changed_by_name}
                  </span>{" "}
                  alterou o plano
                </p>
                <div className="text-sm text-muted-foreground space-y-1">
                  {entry.old_plan !== entry.new_plan && (
                    <p>
                      Plano: {entry.old_plan} → {entry.new_plan}
                    </p>
                  )}
                  {entry.price_changed && (
                    <p>
                      Preço mensal: {entry.old_price} → {entry.new_price}
                    </p>
                  )}
                  {entry.features_changed && (
                    <p>Features foram atualizadas</p>
                  )}
                  {entry.modules_changed && (
                    <p>Módulos foram atualizados</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.changed_at).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}