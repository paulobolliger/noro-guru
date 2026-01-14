import { headers } from 'next/headers';

export default function TenantSitePage({ params }: { params: { slug: string } }) {
    const headersList = headers();
    const host = headersList.get('host');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">White Label Works! 🚀</h1>
            <p className="text-lg text-gray-600 mb-8">
                Você acessou este sistema através do domínio personalizado:
            </p>
            <div className="bg-white px-8 py-4 rounded-xl shadow-sm border border-gray-200">
                <code className="text-2xl font-mono text-purple-600 font-bold">{host}</code>
            </div>
            <p className="mt-8 text-sm text-gray-400">
                Tenant Slug: <span className="font-mono text-gray-600">{params.slug}</span>
            </p>
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-800 text-sm max-w-md mx-auto">
                Próximos passos: Mover a pasta <code>(protected)</code> para dentro desta rota <code>/site/[slug]</code> para que todo o sistema funcione sob este domínio.
            </div>
        </div>
    );
}
