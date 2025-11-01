'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useTransition } from 'react';
import { PlanFormData } from './actions';
import { toast } from 'sonner';

const planSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable(),
  price_brl: z.number().min(0, 'Preço em BRL deve ser maior que 0'),
  price_usd: z.number().min(0, 'Preço em USD deve ser maior que 0'),
  interval: z.enum(['monthly', 'quarterly', 'yearly']),
  features: z.record(z.any()).default({}),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).default({})
});

type PlanFormProps = {
  onSubmit: (data: PlanFormData) => Promise<void>;
  initialData?: PlanFormData;
  isEditing?: boolean;
};

export default function PlanForm({ onSubmit, initialData, isEditing = false }: PlanFormProps) {
  const [isPending, startTransition] = useTransition();
  const [features, setFeatures] = useState<{ key: string; value: string }[]>(
    Object.entries(initialData?.features || {}).map(([key, value]) => ({ key, value: String(value) }))
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price_brl: 0,
      price_usd: 0,
      interval: 'monthly',
      features: {},
      is_active: true,
      metadata: {}
    }
  });

  const handleFormSubmit = (data: PlanFormData) => {
    const featuresObject = features.reduce((acc, { key, value }) => {
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);

    startTransition(async () => {
      try {
        await onSubmit({
          ...data,
          features: featuresObject
        });
        toast.success(isEditing ? 'Plano atualizado com sucesso!' : 'Plano criado com sucesso!');
        if (!isEditing) {
          reset();
          setFeatures([]);
        }
      } catch (error) {
        toast.error('Erro ao salvar o plano');
      }
    });
  };

  const addFeature = () => {
    setFeatures([...features, { key: '', value: '' }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: 'key' | 'value', value: string) => {
    const newFeatures = [...features];
    newFeatures[index][field] = value;
    setFeatures(newFeatures);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          {...register('name')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (BRL)</label>
          <input
            type="number"
            step="0.01"
            {...register('price_brl', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
          {errors.price_brl && (
            <p className="mt-1 text-sm text-red-600">{errors.price_brl.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register('price_usd', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
          {errors.price_usd && (
            <p className="mt-1 text-sm text-red-600">{errors.price_usd.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Intervalo</label>
        <select
          {...register('interval')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="monthly">Mensal</option>
          <option value="quarterly">Trimestral</option>
          <option value="yearly">Anual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Recursos</label>
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Nome do recurso"
              value={feature.key}
              onChange={(e) => updateFeature(index, 'key', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Valor"
              value={feature.value}
              onChange={(e) => updateFeature(index, 'value', e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="px-2 py-1 text-red-600 hover:text-red-800"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="mt-2 text-sm text-primary hover:text-primary-dark"
        >
          + Adicionar recurso
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('is_active')}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label className="ml-2 block text-sm text-gray-700">Ativo</label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
}