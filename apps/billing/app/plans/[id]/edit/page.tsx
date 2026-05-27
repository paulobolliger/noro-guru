import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Editar Plano',
  description: 'Planos são editados no Stripe',
};

export default async function EditPlanPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Editar Plano</h1>
        <p className="text-gray-600 mb-6">
          Planos de assinatura devem ser editados no Stripe. O Appwrite não possui
          uma collection oficial para planos neste projeto.
        </p>
        <Link
          href="/plans"
          className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-white"
        >
          Voltar para planos
        </Link>
      </div>
    </div>
  );
}
