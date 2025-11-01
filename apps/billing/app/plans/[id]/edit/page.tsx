import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPlan, updatePlan } from '../actions';
import PlanForm from '../components/PlanForm';

export const metadata: Metadata = {
  title: 'Editar Plano',
  description: 'Edite as informações do plano'
};

export default async function EditPlanPage({
  params
}: {
  params: { id: string }
}) {
  const plan = await getPlan(params.id);

  if (!plan) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Editar Plano
        </h1>

        <PlanForm
          initialData={plan}
          isEditing
          onSubmit={(data) => updatePlan(plan.id, data)}
        />
      </div>
    </div>
  );
}