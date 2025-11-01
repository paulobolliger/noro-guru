'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { updateStripeConfig } from './actions';

const stripeConfigSchema = z.object({
  enabled: z.boolean(),
  liveMode: z.boolean(),
  publishableKey: z.string().min(1, 'Chave publicável é obrigatória'),
  secretKey: z.string().min(1, 'Chave secreta é obrigatória'),
  webhookSecret: z.string().min(1, 'Chave do webhook é obrigatória'),
  successUrl: z.string().url('URL inválida').optional(),
  cancelUrl: z.string().url('URL inválida').optional()
});

type StripeConfigFormData = z.infer<typeof stripeConfigSchema>;

interface StripeConfigPageProps {
  initialData?: StripeConfigFormData;
}

export default function StripeConfigPage({ initialData }: StripeConfigPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<StripeConfigFormData>({
    resolver: zodResolver(stripeConfigSchema),
    defaultValues: initialData || {
      enabled: false,
      liveMode: false,
      publishableKey: '',
      secretKey: '',
      webhookSecret: '',
      successUrl: 'https://app.noroguru.com.br/billing/success',
      cancelUrl: 'https://app.noroguru.com.br/billing/cancel'
    }
  });

  const enabled = watch('enabled');
  const liveMode = watch('liveMode');

  const onSubmit = async (data: StripeConfigFormData) => {
    try {
      setIsLoading(true);
      await updateStripeConfig(data);
      toast.success('Configurações do Stripe atualizadas com sucesso');
      router.refresh();
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast.error('Erro ao atualizar configurações');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Stripe</h1>
        <p className="text-muted-foreground">
          Configure as chaves de API e outras opções do Stripe
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>
              Habilite ou desabilite a integração com o Stripe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={enabled}
                onCheckedChange={(checked) => {
                  register('enabled').onChange({
                    target: { name: 'enabled', value: checked }
                  });
                }}
              />
              <Label htmlFor="enabled">Integração ativa</Label>
            </div>

            {enabled && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="liveMode"
                  checked={liveMode}
                  onCheckedChange={(checked) => {
                    register('liveMode').onChange({
                      target: { name: 'liveMode', value: checked }
                    });
                  }}
                />
                <Label htmlFor="liveMode">Modo produção</Label>
              </div>
            )}
          </CardContent>
        </Card>

        {enabled && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Chaves de API</CardTitle>
                <CardDescription>
                  Configure as chaves de API do Stripe para {liveMode ? 'produção' : 'teste'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="publishableKey">Chave publicável</Label>
                  <Input
                    id="publishableKey"
                    {...register('publishableKey')}
                    placeholder={`${liveMode ? 'pk_live_' : 'pk_test_'}...`}
                    className="font-mono"
                  />
                  {errors.publishableKey && (
                    <p className="text-sm text-red-600">{errors.publishableKey.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secretKey">Chave secreta</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    {...register('secretKey')}
                    placeholder={`${liveMode ? 'sk_live_' : 'sk_test_'}...`}
                    className="font-mono"
                  />
                  {errors.secretKey && (
                    <p className="text-sm text-red-600">{errors.secretKey.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookSecret">Chave do webhook</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    {...register('webhookSecret')}
                    placeholder="whsec_..."
                    className="font-mono"
                  />
                  {errors.webhookSecret && (
                    <p className="text-sm text-red-600">{errors.webhookSecret.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>URLs de redirecionamento</CardTitle>
                <CardDescription>
                  Configure as URLs para redirecionamento após o checkout
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="successUrl">URL de sucesso</Label>
                  <Input
                    id="successUrl"
                    {...register('successUrl')}
                    placeholder="https://..."
                  />
                  {errors.successUrl && (
                    <p className="text-sm text-red-600">{errors.successUrl.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cancelUrl">URL de cancelamento</Label>
                  <Input
                    id="cancelUrl"
                    {...register('cancelUrl')}
                    placeholder="https://..."
                  />
                  {errors.cancelUrl && (
                    <p className="text-sm text-red-600">{errors.cancelUrl.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar configurações'}
          </Button>
        </div>
      </form>
    </div>
  );
}