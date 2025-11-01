export default function CancelPage() {
  return (
    <div className="container max-w-lg py-20">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Assinatura cancelada
        </h1>
        <p className="text-muted-foreground">
          O processo de assinatura foi cancelado. Você pode tentar novamente quando quiser.
        </p>
        <div className="mt-8">
          <a
            href="/plans"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            Voltar para Planos
          </a>
        </div>
      </div>
    </div>
  );
}