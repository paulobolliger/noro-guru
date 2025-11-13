'use client';

import { useState } from 'react';
import { Instagram, Loader2, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import type {
  SocialNetworkConfig,
  InstagramCredentials,
  ConnectionStatus,
  SocialAccountInfo,
} from '@/lib/types';

interface NetworkConfigCardProps {
  network: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'pinterest';
  config?: SocialNetworkConfig | null;
  onConfigUpdate: () => void;
}

export default function NetworkConfigCard({
  network,
  config,
  onConfigUpdate,
}: NetworkConfigCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isExchangingToken, setIsExchangingToken] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    account_info?: SocialAccountInfo;
  } | null>(null);

  // Form state for Instagram
  const [formData, setFormData] = useState<InstagramCredentials>({
    app_id: '',
    app_secret: '',
    access_token: '',
    refresh_token: '',
    account_id: '',
    user_id: '',
  });

  const networkConfig = {
    instagram: {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500',
      textColor: 'text-purple-600',
      docsUrl: 'https://developers.facebook.com/docs/instagram-api',
    },
  };

  const currentConfig = networkConfig[network];
  const Icon = currentConfig.icon;

  const getStatusConfig = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected':
        return {
          icon: CheckCircle,
          text: 'Conectado',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        };
      case 'error':
        return {
          icon: XCircle,
          text: 'Erro',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
        };
      case 'expired':
        return {
          icon: AlertCircle,
          text: 'Expirado',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        };
      default:
        return {
          icon: XCircle,
          text: 'Desconectado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const statusConfig = getStatusConfig(config?.status || 'disconnected');
  const StatusIcon = statusConfig.icon;

  const handleExchangeToken = async () => {
    setIsExchangingToken(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/social/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: formData.app_id,
          app_secret: formData.app_secret,
          short_lived_token: formData.access_token,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Update form with long-lived token
        setFormData({
          ...formData,
          access_token: result.access_token,
        });

        setTestResult({
          success: true,
          message: result.message,
        });
      } else {
        setTestResult({
          success: false,
          message: result.error || 'Erro ao converter token',
        });
      }
    } catch (error: any) {
      console.error('Exchange token error:', error);
      setTestResult({
        success: false,
        message: 'Erro ao converter token',
      });
    } finally {
      setIsExchangingToken(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/admin/social/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network,
          credentials: formData,
        }),
      });

      const result = await response.json();

      setTestResult({
        success: result.success,
        message: result.message,
        account_info: result.account_info,
      });

      if (!result.success) {
        console.error('Connection test failed:', result.error);
      }
    } catch (error: any) {
      console.error('Test connection error:', error);
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // First save the configuration
      const saveResponse = await fetch('/api/admin/social/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          network,
          credentials: formData,
          enabled: true,
        }),
      });

      const saveResult = await saveResponse.json();

      if (!saveResult.success) {
        throw new Error('Failed to save configuration');
      }

      // Then test the connection and update status
      const testResponse = await fetch(
        `/api/admin/social/test-connection?update_config=true&config_id=${saveResult.config.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            network,
            credentials: formData,
          }),
        }
      );

      const testResult = await testResponse.json();

      setTestResult({
        success: testResult.success,
        message: testResult.message,
        account_info: testResult.account_info,
      });

      // Refresh parent component
      onConfigUpdate();

      if (testResult.success) {
        setIsExpanded(false);
      }
    } catch (error: any) {
      console.error('Save error:', error);
      setTestResult({
        success: false,
        message: 'Erro ao salvar configuração',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!config?.id) return;

    if (!confirm(`Tem certeza que deseja desconectar do ${currentConfig.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/social/config?id=${config.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        onConfigUpdate();
        setIsExpanded(false);
        setTestResult(null);
      }
    } catch (error: any) {
      console.error('Disconnect error:', error);
      alert('Erro ao desconectar');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl ${currentConfig.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{currentConfig.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bgColor}`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                  <span className={`text-sm font-medium ${statusConfig.color}`}>
                    {statusConfig.text}
                  </span>
                </div>
                {config?.account_info?.username && (
                  <span className="text-sm text-gray-500">
                    @{config.account_info.username}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {config?.status === 'connected' ? (
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Desconectar
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isExpanded
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isExpanded ? 'Cancelar' : 'Conectar'}
              </button>
            )}
          </div>
        </div>

        {/* Account Info - Only show when connected */}
        {config?.status === 'connected' && config.account_info && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              {config.account_info.display_name && (
                <div>
                  <p className="text-xs text-gray-500">Nome</p>
                  <p className="text-sm font-medium text-gray-900">
                    {config.account_info.display_name}
                  </p>
                </div>
              )}
              {config.account_info.follower_count !== undefined && (
                <div>
                  <p className="text-xs text-gray-500">Seguidores</p>
                  <p className="text-sm font-medium text-gray-900">
                    {config.account_info.follower_count.toLocaleString()}
                  </p>
                </div>
              )}
              {config.account_info.account_id && (
                <div>
                  <p className="text-xs text-gray-500">ID da Conta</p>
                  <p className="text-sm font-mono text-gray-900">
                    {config.account_info.account_id}
                  </p>
                </div>
              )}
              {config.connected_at && (
                <div>
                  <p className="text-xs text-gray-500">Conectado em</p>
                  <p className="text-sm text-gray-900">
                    {new Date(config.connected_at).toLocaleDateString('pt-PT')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Form - Only show when disconnected and expanded */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Como obter as credenciais:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Acesse o Meta Developers e crie um app</li>
                    <li>Adicione o produto "Instagram Basic Display" ou "Instagram Graph API"</li>
                    <li>Copie o App ID e App Secret</li>
                    <li>Gere um Access Token de longa duração (60 dias)</li>
                  </ol>
                  <a
                    href={currentConfig.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Ver documentação
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App ID *
                </label>
                <input
                  type="text"
                  value={formData.app_id}
                  onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123456789012345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  App Secret *
                </label>
                <input
                  type="password"
                  value={formData.app_secret}
                  onChange={(e) => setFormData({ ...formData, app_secret: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="abc123def456..."
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Access Token *
                </label>
                <button
                  type="button"
                  onClick={handleExchangeToken}
                  disabled={
                    isExchangingToken || !formData.app_id || !formData.app_secret || !formData.access_token
                  }
                  className="text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
                >
                  {isExchangingToken ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Convertendo...
                    </>
                  ) : (
                    <>
                      🔄 Converter para Long-Lived
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={formData.access_token}
                onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="IGQVJXa1BjZAWNDZAlNqZA..."
              />
              <div className="mt-1 text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="font-medium text-yellow-800 mb-1">⚠️ Importante:</p>
                <p className="text-yellow-700">
                  Se o token foi gerado agora no Graph API Explorer, clique em <strong>"Converter para Long-Lived"</strong> para
                  transformá-lo em um token de longa duração (60 dias). Tokens normais expiram em 1 hora.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account ID (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.account_id}
                  onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instagram Business Account ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User ID (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Instagram User ID"
                />
              </div>
            </div>

            {/* Test Result */}
            {testResult && (
              <div
                className={`p-4 rounded-lg ${
                  testResult.success
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        testResult.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {testResult.message}
                    </p>
                    {testResult.account_info && (
                      <div className="mt-2 text-xs text-green-700">
                        <p>
                          <strong>Conta:</strong> @{testResult.account_info.username}
                        </p>
                        {testResult.account_info.follower_count !== undefined && (
                          <p>
                            <strong>Seguidores:</strong>{' '}
                            {testResult.account_info.follower_count.toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleTestConnection}
                disabled={
                  isTesting || !formData.app_id || !formData.app_secret || !formData.access_token
                }
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  'Testar Conexão'
                )}
              </button>

              <button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  isTesting ||
                  !formData.app_id ||
                  !formData.app_secret ||
                  !formData.access_token
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar e Conectar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
