'use client';

import { useState } from 'react';
import { Upload, Loader2, CheckCircle, XCircle, ExternalLink, Info } from 'lucide-react';

interface UploadPostConfigCardProps {
  initialApiKey?: string | null;
  initialStatus?: 'connected' | 'disconnected';
  onConfigUpdate: () => void;
}

export default function UploadPostConfigCard({
  initialApiKey,
  initialStatus = 'disconnected',
  onConfigUpdate,
}: UploadPostConfigCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [userProfile, setUserProfile] = useState('nomade_guru');
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'error'>(initialStatus);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestResult({
        success: false,
        message: 'Por favor, insira uma API Key',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      console.log('🔍 Testing Upload-Post connection:', {
        userProfile,
        apiKeyLength: apiKey.length,
        apiKeyPrefix: apiKey.substring(0, 30) + '...',
      });

      const response = await fetch('/api/admin/social/config/upload-post/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, user_profile: userProfile }),
      });

      const result = await response.json();
      console.log('📡 Upload-Post test response:', result);

      setTestResult({
        success: result.success,
        message: result.error ? `${result.message} - ${result.error}` : result.message,
      });

      if (result.success) {
        setStatus('connected');
      } else {
        setStatus('error');
        console.error('❌ Upload-Post test failed:', result);
      }
    } catch (error: any) {
      console.error('❌ Upload-Post test exception:', error);
      setTestResult({
        success: false,
        message: 'Erro ao testar conexão: ' + error.message,
      });
      setStatus('error');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim() || !userProfile.trim()) {
      setTestResult({
        success: false,
        message: 'Por favor, insira a API Key e o User Profile',
      });
      return;
    }

    setIsSaving(true);

    try {
      console.log('💾 Saving Upload-Post config...');

      // First test connection
      const testResponse = await fetch('/api/admin/social/config/upload-post/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, user_profile: userProfile }),
      });

      const testResult = await testResponse.json();
      console.log('💾 Test result:', testResult);

      if (!testResult.success) {
        setTestResult({
          success: false,
          message: testResult.message || 'Falha ao testar conexão',
        });
        setStatus('error');
        setIsSaving(false);
        return;
      }

      // Then save
      console.log('💾 Test passed, now saving to database...');
      const saveResponse = await fetch('/api/admin/social/config/upload-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: apiKey, user_profile: userProfile }),
      });

      const saveResult = await saveResponse.json();
      console.log('💾 Save result:', saveResult);

      if (saveResult.success) {
        setTestResult({
          success: true,
          message: 'Configuração salva com sucesso!',
        });
        setStatus('connected');
        setIsExpanded(false);
        console.log('✅ Config saved successfully, reloading page...');
        onConfigUpdate();
      } else {
        setTestResult({
          success: false,
          message: saveResult.error || 'Erro ao salvar configuração',
        });
        setStatus('error');
      }
    } catch (error: any) {
      console.error('❌ Save error:', error);
      setTestResult({
        success: false,
        message: 'Erro ao salvar configuração',
      });
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Tem certeza que deseja desconectar do Upload-Post?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/social/config/upload-post', {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setStatus('disconnected');
        setApiKey('');
        setTestResult(null);
        onConfigUpdate();
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const getStatusConfig = () => {
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
      default:
        return {
          icon: XCircle,
          text: 'Desconectado',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Upload-Post</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bgColor}`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                  <span className={`text-sm font-medium ${statusConfig.color}`}>
                    {statusConfig.text}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {status === 'connected' ? (
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

        {/* Connected Info */}
        {status === 'connected' && !isExpanded && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Upload-Post conectado com sucesso!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Pronto para publicar em 9 redes sociais: Instagram, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Threads, Reddit, Twitter
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Form */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="pt-6 space-y-4">
            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Como obter a API Key:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Acesse <a href="https://upload-post.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">upload-post.com</a> e faça login</li>
                    <li>Vá em "Settings" → "API Keys"</li>
                    <li>Gere uma nova API Key</li>
                    <li>Cole aqui e clique em "Testar Conexão"</li>
                  </ol>
                  <a
                    href="https://docs.upload-post.com"
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

            {/* User Profile Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Profile *
              </label>
              <input
                type="text"
                value={userProfile}
                onChange={(e) => setUserProfile(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="nomade_guru"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome do perfil criado no Upload-Post (case sensitive)
              </p>
            </div>

            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key (JWT Token) *
              </label>
              <textarea
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              />
              <p className="text-xs text-gray-500 mt-1">
                JWT Bearer token do Upload-Post (será criptografado no banco)
              </p>
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
                  <p
                    className={`text-sm font-medium ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {testResult.message}
                  </p>
                </div>
              </div>
            )}

            {/* Pricing Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 mb-2">💰 Planos Upload-Post:</p>
              <ul className="text-xs text-purple-800 space-y-1">
                <li><strong>Gratuito:</strong> 10 uploads/mês</li>
                <li><strong>Basic (€14/mês):</strong> Uploads ilimitados, 5 perfis, analytics</li>
                <li><strong>Add-ons:</strong> +5 perfis (€9/mês) | +10 perfis (€15/mês)</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleTest}
                disabled={isTesting || !apiKey.trim()}
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
                disabled={isSaving || isTesting || !apiKey.trim()}
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
