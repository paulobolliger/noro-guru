// components/admin/content/AIFieldGenerator.tsx
'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Check } from 'lucide-react';
import { formatCost } from '@/lib/utils/cost-calculator';

interface AIFieldGeneratorProps {
  contentId: string;
  contentType: 'roteiro' | 'artigo';
  onGenerated: (fields: any, cost: number) => void;
  disabled?: boolean;
}

export default function AIFieldGenerator({
  contentId,
  contentType,
  onGenerated,
  disabled = false
}: AIFieldGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/content/generate-seo-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: contentId,
          type: contentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao gerar campos');
      }

      const data = await response.json();
      onGenerated(data.fields, data.costs.text_cost);
      setSuccess(true);

      // Reset success state após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro ao gerar campos com IA:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleGenerate}
        disabled={disabled || generating}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
          success
            ? 'bg-green-600 text-white'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {generating ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Gerando com IA...
          </>
        ) : success ? (
          <>
            <Check size={18} />
            Campos Gerados!
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Gerar Campos com IA
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="font-medium">Erro ao gerar:</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
