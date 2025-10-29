import Link from "next/link";

export default function SupportTicketPage({ params }: { params: { id: string } }) {
  return (
    <div className="container-app py-8 space-y-4">
      <div className="text-sm text-muted"><Link href="/support" className="text-primary hover:underline">Voltar</Link></div>
      <div className="surface-card border border-dashed border-default rounded-xl p-6 text-sm text-muted">
        Ticket {params.id} ainda nao possui visualizacao.
        Integre este componente quando as APIs estiverem prontas.
      </div>
    </div>
  );
}