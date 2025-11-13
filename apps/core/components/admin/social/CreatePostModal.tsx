'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Calendar, Send, Loader2, Image as ImageIcon } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  platform: string;
  username?: string;
}

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [publishNow, setPublishNow] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadProfiles();
    }
  }, [isOpen]);

  const loadProfiles = async () => {
    setIsLoadingProfiles(true);
    try {
      const response = await fetch('/api/admin/social/profiles');
      const data = await response.json();

      if (data.success && data.profiles) {
        setProfiles(data.profiles);
        // Auto-select Instagram and Facebook by default
        const defaultSelection = data.profiles
          .filter((p: Profile) => ['instagram', 'facebook'].includes(p.platform))
          .map((p: Profile) => p.id);
        setSelectedProfiles(defaultSelection);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoadingProfiles(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      alert('Por favor, escreva o conteúdo do post');
      return;
    }

    if (selectedProfiles.length === 0) {
      alert('Selecione pelo menos uma plataforma');
      return;
    }

    setIsLoading(true);

    try {
      // Extract platform names from profile IDs
      const platformNames = selectedProfiles.map((profileId) => {
        const parts = profileId.split('_');
        return parts[0]; // 'instagram_nomade_guru' -> 'instagram'
      });

      // Prepare platforms array with proper structure
      const platforms = platformNames.map((platform) => ({
        platform_id: platform,
        platform: platform,
        profile_id: platform,
        status: 'pending',
      }));

      // Create post
      const postData: any = {
        content,
        platforms,
        media_urls: imageUrl ? [imageUrl] : null,
        source_type: 'custom',
        ai_generated: false,
      };

      // Add scheduled_for if not publishing now
      if (!publishNow && scheduledFor) {
        postData.scheduled_for = new Date(scheduledFor).toISOString();
      }

      const response = await fetch('/api/admin/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.success) {
        // If publish now, publish the post
        if (publishNow) {
          const publishResponse = await fetch(
            `/api/admin/social/posts/${data.post.id}/publish`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                pinterest_board_id: 'nomadeguru/destinos',
              }),
            }
          );

          const publishData = await publishResponse.json();

          if (publishData.success) {
            alert('Post publicado com sucesso!');
          } else {
            alert(`Post criado mas houve erro ao publicar: ${publishData.error}`);
          }
        } else {
          alert('Post criado com sucesso!');
        }

        // Reset form
        setContent('');
        setImageUrl('');
        setScheduledFor('');
        setSelectedProfiles([]);
        setPublishNow(true);

        // Close modal and refresh
        onSuccess();
        onClose();
      } else {
        alert(`Erro ao criar post: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Erro ao criar post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Novo Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Conteúdo do Post *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Escreva o conteúdo do seu post..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {content.length} caracteres
            </p>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Imagem (opcional)
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {imageUrl && (
              <div className="mt-3">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Instagram, Pinterest e YouTube requerem imagem/vídeo
            </p>
          </div>

          {/* Platforms Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Plataformas *
            </label>
            {isLoadingProfiles ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : profiles.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Nenhum perfil conectado. Configure o Upload-Post em{' '}
                  <a
                    href="/configuracoes"
                    className="underline font-medium"
                    target="_blank"
                  >
                    Configurações
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => toggleProfile(profile.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
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
                        <p className="text-xs text-gray-600 truncate">
                          {profile.username || profile.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Publishing Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Quando publicar?
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  checked={publishNow}
                  onChange={() => setPublishNow(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <p className="font-medium text-gray-900">Publicar agora</p>
                  <p className="text-xs text-gray-600">
                    Post será publicado imediatamente nas plataformas
                    selecionadas
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  checked={!publishNow}
                  onChange={() => setPublishNow(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Agendar para depois</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Escolha data e hora para publicação automática
                  </p>
                  {!publishNow && (
                    <input
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={(e) => setScheduledFor(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !content.trim() || selectedProfiles.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {publishNow ? 'Publicando...' : 'Criando...'}
                </>
              ) : (
                <>
                  {publishNow ? (
                    <>
                      <Send className="w-5 h-5" />
                      Publicar Agora
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      Agendar Post
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
