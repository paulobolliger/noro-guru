// components/admin/orcamentos/GerarRoteiroAIModal.tsx
'use client';

import { useState, useTransition } from 'react';
import { X, Wand2, Loader2, AlertCircle } from 'lucide-react';
import { INTENCOES_VIAGEM } from "@lib/client-data";
import type { Database } from "@types/supabase";

type Cliente = Database['public']['Tables']['noro_clientes']['Row'];

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (roteiro: string, titulo: string, clienteData: {id: string, nome: string}) => void;
  clientes: Cliente[];
}

export default function GerarRoteiroAIModal({ isOpen, onClose, onGenerate, clientes }: AIModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    clienteId: '',
    novoClienteNome: '',
    destino: '',
    num_dias: '7',
    num_pessoas: '2',
    preferencias: [] as string[],
    tipo_viagem: 'Lua de Mel',
  });

  const [clienteSearch, setClienteSearch] = useState('');

  const handleMultiSelect = (value: string) => {
    setFormData(prev => {
      const current = prev.preferencias;
      if (current.length >= 5 && !current.includes(value)) {
        alert('Selecione no máximo 5 preferências.');
        return prev;
      }
      const newValue = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
      return { ...prev, preferencias: newValue };
    });
  };
  
  const handleSelectCliente = (cliente: Cliente) => {
    setFormData(prev => ({ ...prev, clienteId: cliente.id, novoClienteNome: '' }));
    setClienteSearch(cliente.nome);
  };
  
  const handleGenerate = () => {
    if (!formData.destino || !formData.num_dias || !formData.num_pessoas) {
      setError('Destino, Nº de Dias e Nº de Pessoas são obrigatórios.');
      return;
    }
     if (formData.preferencias.length < 3) {
      setError('Selecione pelo menos 3 preferências.');
      return;
    }
    setError(null);
    startTransition(async () => {
      const clienteSelecionado = clientes.find(c => c.id === formData.clienteId);
      const nomeCliente = formData.novoClienteNome || clienteSelecionado?.nome || 'Viajante';

      try {
        const response = await fetch('/api/gerar-roteiro-proposta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destino: formData.destino,
            dias_viagem: formData.num_dias,
            num_pessoas: formData.num_pessoas,
            tipo_viagem: formData.tipo_viagem,
            preferencias: formData.preferencias,
            nome_cliente: nomeCliente
          }),
        });
        
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Falha ao gerar o roteiro.');
        
        const tituloGerado = `${formData.tipo_viagem} em ${formData.destino} - ${formData.num_dias} dias`;
        onGenerate(result.roteiro, tituloGerado, {id: formData.clienteId, nome: clienteSearch || formData.novoClienteNome});
        onClose();
      } catch (err: any) {
        setError(err.message);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center gap-2"><Wand2 className="text-purple-600"/> Gerar Proposta com IA</h3>
          <button type="button" onClick={onClose}><X className="w-6 h-6" /></button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Cliente (Opcional)</label>
            <input type="text" value={clienteSearch} onChange={(e) => { setClienteSearch(e.target.value); setFormData(prev => ({ ...prev, clienteId: '', novoClienteNome: e.target.value })); }} placeholder="Buscar cliente existente ou digitar novo nome..." className="w-full px-4 py-2 border rounded-lg"/>
            {clienteSearch.length > 0 && !formData.clienteId && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {clientes.filter(c => c.nome.toLowerCase().includes(clienteSearch.toLowerCase())).map(c => (
                  <button key={c.id} type="button" onClick={() => handleSelectCliente(c)} className="w-full text-left px-4 py-2 hover:bg-gray-100">{c.nome}</button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Destino *</label><input type="text" value={formData.destino} onChange={(e) => setFormData(prev => ({...prev, destino: e.target.value}))} required className="w-full px-4 py-2 border rounded-lg"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Nº de Dias *</label><input type="number" value={formData.num_dias} onChange={(e) => setFormData(prev => ({...prev, num_dias: e.target.value}))} required min="1" className="w-full px-4 py-2 border rounded-lg"/></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">Nº de Pessoas *</label><input type="number" value={formData.num_pessoas} onChange={(e) => setFormData(prev => ({...prev, num_pessoas: e.target.value}))} required min="1" className="w-full px-4 py-2 border rounded-lg"/></div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Viagem *</label>
              <select value={formData.tipo_viagem} onChange={(e) => setFormData(prev => ({...prev, tipo_viagem: e.target.value}))} className="w-full px-4 py-2 border rounded-lg bg-white">
                  {Object.keys(INTENCOES_VIAGEM).map(category => (
                      <optgroup label={category} key={category}>
                          {INTENCOES_VIAGEM[category as keyof typeof INTENCOES_VIAGEM].map(intention => (
                              <option key={intention} value={intention}>{intention}</option>
                          ))}
                      </optgroup>
                  ))}
              </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferências da Viagem (mínimo 3, máximo 5)</label>
            <div className="p-3 bg-gray-50 border rounded-lg flex flex-wrap gap-2">
              {Object.values(INTENCOES_VIAGEM).flat().map(p => (<button key={p} type="button" onClick={() => handleMultiSelect(p)} className={`px-3 py-1 rounded-full text-xs ${formData.preferencias.includes(p) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>{p}</button>))}
            </div>
          </div>
          {error && <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700"><AlertCircle size={20} /> <p className="text-sm">{error}</p></div>}
        </div>
        <div className="p-6 border-t flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
          <button onClick={handleGenerate} disabled={isPending || formData.preferencias.length < 3} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
            {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
            {isPending ? 'Gerando...' : 'Gerar Roteiro'}
          </button>
        </div>
      </div>
    </div>
  );
}