import React from 'react';
import Link from 'next/link';
import { DatabaseIcon } from '@/components/icons/DatabaseIcon';

// ITTD — Internet Travel & Tourism Database
// Conceito futuro: banco de dados global de turismo, estilo IMDB.
// Em desenvolvimento — não anunciar publicamente ainda.
// Esta rota existe apenas para fins internos.

export default function IttdPage() {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-center">
            <div className="max-w-2xl mx-auto">
                <div className="inline-block p-4 bg-noro-dark-2 rounded-xl mb-6 border border-noro-gray-future">
                    <DatabaseIcon className="w-16 h-16 text-noro-turquoise opacity-40" />
                </div>
                <h1 className="font-display text-4xl font-bold text-white mb-4">
                    Em Breve
                </h1>
                <p className="text-noro-text-secondary text-lg mb-8">
                    Este produto ainda está em desenvolvimento.
                </p>
                <Link href="/ecosystem" className="text-noro-turquoise hover:underline">
                    ← Voltar ao Ecossistema
                </Link>
            </div>
        </div>
    );
}
