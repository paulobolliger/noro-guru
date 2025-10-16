// app/admin/(protected)/orcamentos/page.tsx
import { FileText } from 'lucide-react';

export default function OrcamentosPage() {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Orçamentos</h1>
            
            <div className="text-center py-20 bg-gray-50 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Página em Construção</h3>
                <p className="mt-1 text-sm text-gray-500">A funcionalidade de gestão de orçamentos será implementada aqui.</p>
            </div>
        </div>
    );
}
