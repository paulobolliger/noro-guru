import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@noro/ui/card"
import { getTenantSubscriptions } from "../../actions"
import Link from "next/link"

interface PlanSubscribersProps {
  planId: string
}

export async function PlanSubscribers({ planId }: PlanSubscribersProps) {
  const subscribers = await getTenantSubscriptions(planId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Assinantes</CardTitle>
            <CardDescription>Empresas que assinam este plano</CardDescription>
          </div>
          <div className="text-2xl font-bold">{subscribers.length}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {subscribers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum assinante ainda.
            </p>
          ) : (
            subscribers.map((sub) => (
              <Link
                key={sub.tenant_id}
                href={`/configuracoes/tenants/${sub.tenant_id}`}
                className="flex items-center justify-between p-2 hover:bg-muted rounded"
              >
                <div>
                  <p className="font-medium">{sub.tenant_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Desde {new Date(sub.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-sm">
                  {sub.status === 'active' ? (
                    <span className="text-green-600">Ativo</span>
                  ) : sub.status === 'trialing' ? (
                    <span className="text-blue-600">Trial</span>
                  ) : (
                    <span className="text-red-600">Inativo</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}