'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Calendar,
  Send,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import CreatePostModal from './CreatePostModal';
import { useScheduledPostsProcessor } from '@/lib/hooks/use-scheduled-posts-processor';

interface SocialPost {
  id: string;
  created_at: string;
  updated_at: string;
  content: string;
  media_urls: string[] | null;
  status: 'draft' | 'scheduled' | 'publishing' | 'published' | 'failed';
  scheduled_for: string | null;
  published_at: string | null;
  platforms: any[];
  source_type: 'roteiro' | 'artigo' | 'custom';
  source_id: string | null;
  error_message: string | null;
}

interface SocialPostsClientProps {
  initialPosts: SocialPost[];
  isUploadPostConnected: boolean;
}

export default function SocialPostsClient({
  initialPosts,
  isUploadPostConnected,
}: SocialPostsClientProps) {
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [filter, setFilter] = useState<string>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);

  // Enable automatic processing of scheduled posts
  useScheduledPostsProcessor(isUploadPostConnected);

  // Auto-refresh posts every 30 seconds to see status updates
  useEffect(() => {
    if (!isUploadPostConnected) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/admin/social/posts');
        const data = await response.json();
        if (data.success) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Error refreshing posts:', error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isUploadPostConnected]);

  const filteredPosts = posts.filter((post) => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="w-4 h-4 text-gray-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'publishing':
        return <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />;
      case 'published':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Rascunho';
      case 'scheduled':
        return 'Agendado';
      case 'publishing':
        return 'Publicando';
      case 'published':
        return 'Publicado';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'publishing':
        return 'bg-purple-100 text-purple-700';
      case 'published':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const response = await fetch(`/api/admin/social/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((p) => p.id !== postId));
      } else {
        alert('Erro ao excluir post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erro ao excluir post');
    }
  };

  const handlePublish = async (postId: string) => {
    if (!confirm('Publicar este post agora?')) return;

    try {
      const response = await fetch(`/api/admin/social/posts/${postId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pinterest_board_id: 'nomadeguru/destinos',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Reload posts
        const postsResponse = await fetch('/api/admin/social/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData.posts);
        alert('Post publicado com sucesso!');
      } else {
        alert(`Erro ao publicar: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Error publishing post:', error);
      alert('Erro ao publicar post');
    }
  };

  const handlePostCreated = async () => {
    // Reload posts after successful creation
    try {
      const response = await fetch('/api/admin/social/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error reloading posts:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Posts para Redes Sociais
        </h1>
        <p className="text-gray-600">
          Gerencie e agende posts para Instagram, Facebook, Pinterest e outras plataformas
        </p>
      </div>

      {/* Upload-Post Connection Warning */}
      {!isUploadPostConnected && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Upload-Post não conectado
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Configure a integração com Upload-Post em{' '}
                <a
                  href="/configuracoes"
                  className="underline font-medium hover:text-yellow-900"
                >
                  Configurações → Integrações
                </a>{' '}
                para publicar posts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({posts.length})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'draft'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rascunhos ({posts.filter((p) => p.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'scheduled'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Agendados ({posts.filter((p) => p.status === 'scheduled').length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'published'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Publicados ({posts.filter((p) => p.status === 'published').length})
          </button>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Novo Post
        </button>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum post encontrado
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {filter === 'all'
              ? 'Crie seu primeiro post para as redes sociais'
              : `Nenhum post com status "${getStatusLabel(filter)}"`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Criar Primeiro Post
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        post.status
                      )}`}
                    >
                      {getStatusIcon(post.status)}
                      {getStatusLabel(post.status)}
                    </span>
                    {post.source_type !== 'custom' && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                        {post.source_type === 'roteiro' ? 'Roteiro' : 'Artigo'}
                      </span>
                    )}
                  </div>

                  {/* Content Preview */}
                  <p className="text-gray-900 mb-3 line-clamp-3">
                    {post.content}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      Criado:{' '}
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    {post.scheduled_for && (
                      <span>
                        Agendado para:{' '}
                        {new Date(post.scheduled_for).toLocaleString('pt-BR')}
                      </span>
                    )}
                    {post.published_at && (
                      <span>
                        Publicado:{' '}
                        {new Date(post.published_at).toLocaleString('pt-BR')}
                      </span>
                    )}
                    {post.platforms && post.platforms.length > 0 && (
                      <span>
                        {post.platforms.length}{' '}
                        {post.platforms.length === 1
                          ? 'plataforma'
                          : 'plataformas'}
                      </span>
                    )}
                  </div>

                  {/* Error Message */}
                  {post.error_message && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-800">
                        <strong>Erro:</strong> {post.error_message}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {(post.status === 'draft' || post.status === 'failed') && (
                    <button
                      onClick={() => handlePublish(post.id)}
                      disabled={!isUploadPostConnected}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Publicar agora"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Ver detalhes"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSuccess={handlePostCreated}
      />
    </div>
  );
}
