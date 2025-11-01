import { Metadata } from 'next';
import { createPlan } from '../actions';
import PlanForm from '../components/PlanForm';

export const metadata: Metadata = {
  title: 'Novo Plano',
  description: 'Crie um novo plano de assinatura'
};

export default function NewPlanPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">
          Novo Plano
        </h1>

        <PlanForm onSubmit={createPlan} />
      </div>
    </div>
  );
}