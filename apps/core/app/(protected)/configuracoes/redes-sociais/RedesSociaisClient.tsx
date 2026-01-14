'use client';

import { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import NetworkConfigCard from '@/components/admin/social/NetworkConfigCard';
import type { SocialNetworkConfig, SocialNetworkType } from '@/lib/types';

interface RedesSociaisClientProps {
  initialConfigs: SocialNetworkConfig[];
}

export default function RedesSociaisClient({ initialConfigs }: RedesSociaisClientProps) {
  const [configs, setConfigs] = useState<SocialNetworkConfig[]>(initialConfigs);

  // Find config for a specific network
  const getConfigForNetwork = (network: SocialNetworkType): SocialNetworkConfig | null => {
    return configs.find((c) => c.network === network) || null;
  };

  // Refresh configs from server
  const refreshConfigs = async () => {
    try {
      const response = await fetch('/api/admin/social/config');
      const result = await response.json();

      if (result.success) {
        setConfigs(result.configs);
      }
    } catch (error) {
      console.error('Error refreshing configs:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/configuracoes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Configurações
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Redes Sociais</h1>
            <p className="text-gray-600 mt-1">
              Configure as conexões com as redes sociais para publicação automática de conteúdo.
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Sobre a Integração
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                As credenciais das redes sociais são armazenadas de forma <strong>criptografada</strong> no
                banco de dados Supabase, garantindo a segurança dos seus dados.
              </p>
              <p>
                Os tokens de acesso de longa duração (60 dias) serão renovados automaticamente pelo
                sistema antes de expirarem.
              </p>
              <p className="font-medium">
                Atualmente disponível: <span className="text-purple-600">Instagram</span>. Outras
                redes sociais serão adicionadas em breve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Network Cards */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Redes Disponíveis</h2>
          <div className="grid grid-cols-1 gap-6">
            {/* Instagram Card */}
            <NetworkConfigCard
              network="instagram"
              config={getConfigForNetwork('instagram')}
              onConfigUpdate={refreshConfigs}
            />

            {/* Placeholder cards for other networks */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📘</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">Facebook</h3>
                <p className="text-sm text-gray-500">
                  Integração em desenvolvimento. Em breve você poderá conectar sua Página do Facebook.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🎵</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">TikTok</h3>
                <p className="text-sm text-gray-500">
                  Integração em desenvolvimento. Em breve você poderá conectar sua conta do TikTok.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📺</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">YouTube</h3>
                <p className="text-sm text-gray-500">
                  Integração em desenvolvimento. Em breve você poderá conectar seu Canal do YouTube.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">📌</span>
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">Pinterest</h3>
                <p className="text-sm text-gray-500">
                  Integração em desenvolvimento. Em breve você poderá conectar seu Board do Pinterest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Precisa de Ajuda?</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Onde encontrar as credenciais?</strong> Clique no botão "Conectar" de cada rede
            social para ver instruções detalhadas sobre como obter as credenciais necessárias.
          </p>
          <p>
            <strong>Os tokens expiram?</strong> Sim, mas não se preocupe. O sistema renovará
            automaticamente os tokens antes de expirarem.
          </p>
          <p>
            <strong>É seguro?</strong> Sim. Todas as credenciais são criptografadas com AES-256 antes
            de serem armazenadas no banco de dados.
          </p>
        </div>
      </div>
    </div>
  );
}
