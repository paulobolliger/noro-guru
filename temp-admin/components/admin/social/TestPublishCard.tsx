'use client';

import { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  platform: string;
  username?: string;
}

export default function TestPublishCard() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [content, setContent] = useState('✨ Viaje com propósito. Viva com liberdade.\n\nA Nomade Guru nasceu do encontro entre tecnologia e alma viajante.\n\n🌍 Porque viajar é muito mais do que sair do lugar.\nÉ se reencontrar no caminho.\n\n💜 NOMADE GURU — liberdade, autenticidade e propósito em cada viagem.\n\n🔗 www.nomade.guru\n\n#NomadeGuru #ViajarComPropósito #TurismoInteligente');
  const [imageUrl, setImageUrl] = useState('https://res.cloudinary.com/dhqvjxgue/image/upload/v1761253870/489776388_122159521412373048_2876451361470870637_n_qew867.png');
  const [pinterestBoardId, setPinterestBoardId] = useState('nomadeguru/destinos');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    statusId?: string;
  } | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setIsLoadingProfiles(true);
    try {
      console.log('📋 Loading connected profiles...');
      const response = await fetch('/api/admin/social/profiles');
      const data = await response.json();

      console.log('📋 Profiles data:', data);

      if (data.success && data.profiles) {
        console.log('📋 Profiles array:', data.profiles);
        console.log('📋 First profile:', data.profiles[0]);
        setProfiles(data.profiles);
        // Auto-select first profile if available
        if (data.profiles.length > 0 && data.profiles[0]?.id) {
          setSelectedProfiles([data.profiles[0].id]);
        }
      } else {
        console.error('❌ Failed to load profiles:', data);
      }
    } catch (error) {
      console.error('❌ Error loading profiles:', error);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      setResult({
        success: false,
        message: 'Por favor, escreva algum conteúdo para publicar',
      });
      return;
    }

    if (selectedProfiles.length === 0) {
      setResult({
        success: false,
        message: 'Selecione pelo menos um perfil',
      });
      return;
    }

    setIsPublishing(true);
    setResult(null);

    try {
      console.log('🚀 Publishing test post...', {
        content,
        profiles: selectedProfiles,
      });

      const response = await fetch('/api/admin/social/test-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          platforms: selectedProfiles,
          imageUrl: imageUrl || undefined,
          pinterest_board_id: pinterestBoardId || undefined,
        }),
      });

      const data = await response.json();
      console.log('📡 Publish response:', data);

      setResult({
        success: data.success,
        message: data.message,
        statusId: data.status_id,
      });
    } catch (error: any) {
      console.error('❌ Publish error:', error);
      setResult({
        success: false,
        message: 'Erro ao publicar: ' + error.message,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const toggleProfile = (profileId: string) => {
    setSelectedProfiles((prev) =>
      prev.includes(profileId)
        ? prev.filter((p) => p !== profileId)
        : [...prev, profileId]
    );
  };

  const getPlatformColor = (platform: string) => {
    if (!platform) return 'from-gray-500 to-gray-600';

    const colors: Record<string, string> = {
      instagram: 'from-purple-500 to-pink-500',
      facebook: 'from-blue-600 to-blue-700',
      youtube: 'from-red-600 to-red-700',
      pinterest: 'from-red-500 to-red-600',
      tiktok: 'from-gray-900 to-black',
      linkedin: 'from-blue-700 to-blue-800',
      twitter: 'from-blue-400 to-blue-500',
      threads: 'from-gray-800 to-gray-900',
    };
    return colors[platform.toLowerCase()] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">🧪 Testar Publicação</h3>
            <p className="text-sm text-gray-600 mt-1">
              Publique um post de teste para verificar se tudo está funcionando
            </p>
          </div>
        </div>

        {/* Content Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo do Post
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Escreva o conteúdo do seu post..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length} caracteres
            </p>
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Instagram, Pinterest e YouTube requerem imagem/vídeo
            </p>
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Pinterest Board ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pinterest Board ID
            </label>
            <input
              type="text"
              value={pinterestBoardId}
              onChange={(e) => setPinterestBoardId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="nomadeguru/destinos"
            />
            <p className="text-xs text-gray-500 mt-1">
              Obrigatório para publicar no Pinterest (formato: username/board)
            </p>
          </div>

          {/* Profile Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Selecione os Perfis
              </label>
              <button
                onClick={loadProfiles}
                disabled={isLoadingProfiles}
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingProfiles ? 'animate-spin' : ''}`} />
                Recarregar
              </button>
            </div>

            {isLoadingProfiles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : profiles.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Nenhum perfil conectado encontrado. Conecte suas redes sociais no{' '}
                  <a
                    href="https://upload-post.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium"
                  >
                    Upload-Post
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => toggleProfile(profile.id)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedProfiles.includes(profile.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getPlatformColor(
                          profile.platform
                        )} flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-white text-xs font-bold uppercase">
                          {profile.platform?.substring(0, 2) || '??'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              selectedProfiles.includes(profile.id)
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                          />
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {profile.platform || 'Unknown'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate mt-0.5">
                          {profile.username || profile.name || profile.id}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.statusId && (
                    <p className="text-xs text-green-700 mt-1 font-mono">
                      Status ID: {result.statusId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            disabled={isPublishing || !content.trim() || selectedProfiles.length === 0 || isLoadingProfiles}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Publicar Post de Teste
              </>
            )}
          </button>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Atenção:</strong> Este post será publicado de verdade nas plataformas selecionadas!
              Certifique-se de que o conteúdo está adequado antes de publicar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
