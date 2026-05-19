// app/admin/(protected)/social/posts/page.tsx
import { AlertTriangle, Share2 } from 'lucide-react';

export const metadata = {
  title: 'Posts Sociais | NORO',
  description: 'Gerencie posts para redes sociais',
};

export default function SocialPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span>
          <strong>Em Desenvolvimento</strong> — A gestão de posts sociais ainda não está implementada. Use o módulo <strong>Marketing → Redes Sociais</strong> para agendar conteúdo.
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Share2 className="w-8 h-8 text-purple-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts Sociais</h1>
          <p className="text-gray-600">Gerencie e agende posts para suas redes sociais.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-12 text-center">
        <Share2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Módulo em construção</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          A integração com redes sociais está sendo desenvolvida. Em breve você poderá criar e agendar posts diretamente aqui.
        </p>
      </div>
    </div>
  );
}
