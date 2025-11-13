// components/dashboard/BulkGenerateForm.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, Play, StopCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { estimateCost, formatCost } from '@/lib/utils/cost-calculator';

interface BulkGenerateFormProps {
  type: 'roteiros' | 'artigos';
  apiEndpoint: string;
  placeholder: string;
  optionsConfig?: {
    label: string;
    name: string;
    options: readonly string[] | string[];
  }[];
}

export default function BulkGenerateForm({
  type,
  apiEndpoint,
  placeholder,
  optionsConfig = [],
}: BulkGenerateFormProps) {
  const [items, setItems] = useState('');
  const [options, setOptions] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll dos logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const itemsList = items.split('\n').filter(i => i.trim());
  const itemCount = itemsList.length;
  const estimatedTime = itemCount * 30; // 30 segundos por item
  const costEstimate = estimateCost(itemCount, 1000, true);

  const handleGenerate = async () => {
    if (itemCount === 0) {
      alert('Por favor, adicione pelo menos um item');
      return;
    }

    setIsGenerating(true);
    setLogs([]);
    setIsDone(false);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [type === 'roteiros' ? 'destinos' : 'topicos']: itemsList,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('Reader não disponível');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.substring(6);
            try {
              const { message } = JSON.parse(jsonStr);
              if (message === '[DONE]') {
                setIsDone(true);
              } else {
                setLogs(prev => [...prev, message]);
              }
            } catch (e) {
              console.error('Erro ao parsear log:', e);
            }
          }
        }
      }

    } catch (error) {
      console.error('Erro:', error);
      setLogs(prev => [...prev, `❌ ERRO: ${error instanceof Error ? error.message : 'Erro desconhecido'}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    // Note: Não é possível parar uma stream SSE facilmente
    // Isso apenas para UI feedback
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Geração em Massa de {type === 'roteiros' ? 'Roteiros' : 'Artigos'}
        </h2>

        {/* Textarea */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Lista de {type === 'roteiros' ? 'Destinos' : 'Tópicos'} (um por linha)
          </label>
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            placeholder={placeholder}
            className="w-full h-64 p-3 border rounded-lg font-mono text-sm"
            disabled={isGenerating}
          />
        </div>

        {/* Opções configuráveis */}
        {optionsConfig.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {optionsConfig.map((config) => (
              <div key={config.name}>
                <label className="block text-sm font-medium mb-2">
                  {config.label}
                </label>
                <select
                  value={options[config.name] || ''}
                  onChange={(e) => setOptions({ ...options, [config.name]: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  disabled={isGenerating}
                >
                  <option value="">Selecione...</option>
                  {config.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <div className="text-sm text-gray-600">Itens</div>
            <div className="text-2xl font-bold">{itemCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Tempo Estimado</div>
            <div className="text-2xl font-bold">
              {Math.ceil(estimatedTime / 60)}min
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Custo Estimado</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCost(costEstimate.estimatedTotalCost)}
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          {!isGenerating ? (
            <button
              onClick={handleGenerate}
              disabled={itemCount === 0}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} />
              Iniciar Geração
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <StopCircle size={20} />
              Parar
            </button>
          )}

          {isDone && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle size={20} />
              <span className="font-semibold">Concluído!</span>
            </div>
          )}
        </div>
      </div>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="bg-gray-900 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Logs de Geração</h3>
            {isGenerating && (
              <Loader2 className="animate-spin text-blue-400" size={20} />
            )}
          </div>

          <div className="bg-black rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`mb-1 ${
                  log.includes('❌') || log.includes('ERRO')
                    ? 'text-red-400'
                    : log.includes('✅') || log.includes('✨')
                    ? 'text-green-400'
                    : log.includes('⏸️')
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
