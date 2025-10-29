// components/admin/orcamentos/NovoOrcamentoForm.tsx
'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, User, Plane, DollarSign, Loader2, AlertCircle, CheckCircle2, Plus, Edit2, Trash2, X, Save, Wand2, FileSignature, Info, Settings, FileArchive, Send } from 'lucide-react';
import { createOrcamento } from "@/app/(protected)/orcamentos/orcamentos-actions";
import { getClientes } from "@/app/(protected)/clientes/actions";
import { format, differenceInDays, addDays } from 'date-fns';
import { TERMOS_E_CONDICOES_PADRAO, INTENCOES_VIAGEM } from "@lib/client-data";
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from "@ui/DatePickerWithRange";

// --- Interfaces ---
interface ClienteBase { id: string; nome: string; email: string | null; }
interface OrcamentoItem { id: string; tipo: 'Aéreo' | 'Hospedagem' | 'Transfer' | 'Passeio' | 'Seguro' | 'Outro'; descricao: string; valor_net: number; comissao_percentual: number; valor_final: number; }
const TIPOS_DE_ITEM: OrcamentoItem['tipo'][] = ['Aéreo', 'Hospedagem', 'Transfer', 'Passeio', 'Seguro', 'Outro'];

const initialFormData = {
    titulo: '', lead_id: '', novo_cliente_nome: '', valor_total: '0', valor_sinal: '', status: 'rascunho',
    descricao: '', data_viagem_inicio: '', data_viagem_fim: '', num_pessoas: '1', num_dias: '',
    validade_ate: '', observacoes: '', termos_condicoes: '', incluir_termos: true,
};

// --- Componente do Modal de IA ---
function GerarRoteiroAIModal({ isOpen, onClose, onGenerate, clientes }: { isOpen: boolean; onClose: () => void; onGenerate: (roteiro: string, titulo: string, clienteData: {id: string, nome: string}) => void; clientes: ClienteBase[]; }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ clienteId: '', novoClienteNome: '', destino: '', num_dias: '7', num_pessoas: '2', preferencias: [] as string[], tipo_viagem: 'Lua de Mel' });
    const [clienteSearch, setClienteSearch] = useState('');

    const handleMultiSelect = (value: string) => {
        setFormData(prev => {
            const current = prev.preferencias;
            if (current.length >= 5 && !current.includes(value)) { alert('Selecione no máximo 5 preferências.'); return prev; }
            const newValue = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
            return { ...prev, preferencias: newValue };
        });
    };

    const handleSelectCliente = (cliente: ClienteBase) => {
        setFormData(prev => ({ ...prev, clienteId: cliente.id, novoClienteNome: '' }));
        setClienteSearch(cliente.nome);
    };
    
    const handleGenerate = () => {
        if (!formData.destino || !formData.num_dias || !formData.num_pessoas) { setError('Destino, Nº de Dias e Nº de Pessoas são obrigatórios.'); return; }
        if (formData.preferencias.length < 3) { setError('Selecione pelo menos 3 preferências.'); return; }
        setError(null);
        startTransition(async () => {
            const clienteSelecionado = clientes.find(c => c.id === formData.clienteId);
            const nomeCliente = formData.novoClienteNome || clienteSelecionado?.nome || 'Viajante';
            try {
                const response = await fetch('/api/gerar-roteiro-proposta', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ destino: formData.destino, dias_viagem: formData.num_dias, num_pessoas: formData.num_pessoas, tipo_viagem: formData.tipo_viagem, preferencias: formData.preferencias, nome_cliente: nomeCliente }),
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || 'Falha ao gerar o roteiro.');
                const tituloGerado = `${formData.tipo_viagem} em ${formData.destino} - ${formData.num_dias} dias`;
                onGenerate(result.roteiro, tituloGerado, {id: formData.clienteId, nome: clienteSearch || formData.novoClienteNome});
                onClose();
            } catch (err: any) { setError(err.message); }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="surface-card rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-default flex items-center justify-between"><h3 className="text-xl font-semibold flex items-center gap-2"><Wand2 className="text-purple-600"/> Gerar Proposta com IA</h3><button type="button" onClick={onClose}><X className="w-6 h-6" /></button></div>
                <div className="p-6 space-y-6 overflow-y-auto">
                    <div className="relative"><label className="block text-sm font-medium text-primary mb-2">Nome do Cliente</label><input type="text" value={clienteSearch} onChange={(e) => { setClienteSearch(e.target.value); setFormData(prev => ({ ...prev, clienteId: '', novoClienteNome: e.target.value })); }} placeholder="Buscar cliente existente ou digitar novo nome..." className="w-full px-4 py-2 border rounded-lg"/>{clienteSearch.length > 0 && !formData.clienteId && (<div className="absolute z-10 w-full mt-1 surface-card border rounded-lg shadow-lg max-h-40 overflow-y-auto">{clientes.filter(c => c.nome.toLowerCase().includes(clienteSearch.toLowerCase())).map(c => (<button key={c.id} type="button" onClick={() => handleSelectCliente(c)} className="w-full text-left px-4 py-2 hover:bg-white/10">{c.nome}</button>))}<p className="px-4 py-2 text-sm text-muted">Ou utilize o nome digitado como novo cliente.</p></div>)}</div>
                    <div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-medium text-primary mb-2">Destino *</label><input type="text" value={formData.destino} onChange={(e) => setFormData(prev => ({...prev, destino: e.target.value}))} required className="w-full px-4 py-2 border rounded-lg"/></div><div><label className="block text-sm font-medium text-primary mb-2">Nº de Dias *</label><input type="number" value={formData.num_dias} onChange={(e) => setFormData(prev => ({...prev, num_dias: e.target.value}))} required min="1" className="w-full px-4 py-2 border rounded-lg"/></div><div><label className="block text-sm font-medium text-primary mb-2">Nº de Pessoas *</label><input type="number" value={formData.num_pessoas} onChange={(e) => setFormData(prev => ({...prev, num_pessoas: e.target.value}))} required min="1" className="w-full px-4 py-2 border rounded-lg"/></div></div>
                    <div><label className="block text-sm font-medium text-primary mb-2">Tipo de Viagem *</label><select value={formData.tipo_viagem} onChange={(e) => setFormData(prev => ({...prev, tipo_viagem: e.target.value}))} className="w-full px-4 py-2 border rounded-lg surface-card">{Object.keys(INTENCOES_VIAGEM).map(category => (<optgroup label={category} key={category}>{INTENCOES_VIAGEM[category as keyof typeof INTENCOES_VIAGEM].map(intention => (<option key={intention} value={intention}>{intention}</option>))}</optgroup>))}</select></div>
                    <div><label className="block text-sm font-medium text-primary mb-2">Preferências da Viagem (mínimo 3, máximo 5)</label><div className="p-3 bg-white/5 border rounded-lg flex flex-wrap gap-2">{Object.values(INTENCOES_VIAGEM).flat().map(p => (<button key={p} type="button" onClick={() => handleMultiSelect(p)} className={`px-3 py-1 rounded-full text-xs ${formData.preferencias.includes(p) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-primary'}`}>{p}</button>))}</div></div>
                    {error && <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700"><AlertCircle size={20} /> <p className="text-sm">{error}</p></div>}
                </div>
                <div className="p-6 border-t flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-white/5">Cancelar</button><button onClick={handleGenerate} disabled={isPending || formData.preferencias.length < 3} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">{isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <Wand2 className="w-4 h-4" />}{isPending ? 'Gerando...' : 'Gerar Roteiro'}</button></div>
            </div>
        </div>
    );
}

// --- Componente Principal do Formulário ---
export default function NovoOrcamentoForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState(initialFormData);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const [clientes, setClientes] = useState<ClienteBase[]>([]);
    const [isClientesLoading, setIsClientesLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ success: boolean; message: string; data?: any } | null>(null);
    const [clienteSearch, setClienteSearch] = useState('');
    const [itens, setItens] = useState<OrcamentoItem[]>([]);
    const [isModalItemOpen, setIsModalItemOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<OrcamentoItem | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('ia') === 'true') {
            setIsAiModalOpen(true);
        }
    }, [searchParams]);

    useEffect(() => {
        async function fetchClientes() {
            setIsClientesLoading(true);
            const allClientes = await getClientes() as ClienteBase[]; 
            setClientes(allClientes);
            setIsClientesLoading(false);
        }
        fetchClientes();
    }, []);

    const dataValidadePadrao = useMemo(() => format(addDays(new Date(), 7), 'yyyy-MM-dd'), []);
    useEffect(() => { if (!formData.validade_ate) setFormData(prev => ({ ...prev, validade_ate: dataValidadePadrao })); }, [dataValidadePadrao]);

    useEffect(() => {
        if (dateRange?.from && dateRange?.to) {
            const start = dateRange.from;
            const end = dateRange.to;
            if (end >= start) {
                const days = differenceInDays(end, start) + 1;
                setFormData(prev => ({ 
                    ...prev, 
                    data_viagem_inicio: format(start, 'yyyy-MM-dd'),
                    data_viagem_fim: format(end, 'yyyy-MM-dd'),
                    num_dias: String(days) 
                }));
            }
        } else if (!dateRange) {
             setFormData(prev => ({ ...prev, num_dias: '', data_viagem_inicio: '', data_viagem_fim: '' }));
        }
    }, [dateRange]);
    
    const totalOrcamento = useMemo(() => itens.reduce((acc, item) => acc + item.valor_final, 0), [itens]);
    useEffect(() => { setFormData(prev => ({ ...prev, valor_total: totalOrcamento.toFixed(2) })); }, [totalOrcamento]);

    const termosFormatados = useMemo(() => {
        if (!formData.incluir_termos) return '';
        const saldo = parseFloat(formData.valor_total) - parseFloat(formData.valor_sinal || '0');
        return TERMOS_E_CONDICOES_PADRAO
            .replace('{{data_validade}}', formData.validade_ate ? format(new Date(formData.validade_ate), 'dd/MM/yyyy') : 'N/A')
            .replace('{{valor_sinal}}', parseFloat(formData.valor_sinal || '0').toLocaleString('pt-PT', { minimumFractionDigits: 2 }))
            .replace('{{valor_saldo}}', saldo.toLocaleString('pt-PT', { minimumFractionDigits: 2 }))
            .replace('{{data_pagamento_saldo}}', 'a definir')
            .replace('{{moeda}}', 'EUR');
    }, [formData.incluir_termos, formData.validade_ate, formData.valor_sinal, formData.valor_total]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSelectCliente = (id: string) => {
        const selected = clientes.find(c => c.id === id);
        if (selected) {
            setFormData(prev => ({ ...prev, lead_id: id, novo_cliente_nome: '' }));
            setClienteSearch(selected.nome);
        }
    };
    
    const handleAddItem = (item: Omit<OrcamentoItem, 'id' | 'valor_final'>) => { 
      const valor_final = item.valor_net * (1 + item.comissao_percentual / 100); 
      const newItem: OrcamentoItem = { ...item, id: currentItem ? currentItem.id : crypto.randomUUID(), valor_final }; 
      setItens(prev => currentItem ? prev.map(i => i.id === newItem.id ? newItem : i) : [...prev, newItem]); 
      setCurrentItem(null); 
      setIsModalItemOpen(false); 
    };
    const handleDeleteItem = (id: string) => { if (confirm('Tem certeza?')) setItens(prev => prev.filter(i => i.id !== id)); };
    const handleEditItem = (item: OrcamentoItem) => { setCurrentItem(item); setIsModalItemOpen(true); };
    
    const handleSubmit = (enviar: boolean) => {
        startTransition(async () => {
            setStatus(null);
            if (!formData.titulo || (!formData.lead_id && !formData.novo_cliente_nome)) { setStatus({ success: false, message: 'Título e Cliente são obrigatórios.' }); return; }
            
            const finalStatus = enviar ? 'enviado' : 'rascunho';
            const formDataToSend = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                if(key !== 'incluir_termos') formDataToSend.append(key, String(value));
            });
            
            formDataToSend.set('status', finalStatus);
            formDataToSend.set('termos_condicoes', termosFormatados);
            formDataToSend.append('itens', JSON.stringify(itens));

            const result = await createOrcamento(formDataToSend);
            setStatus(result);
            if (result.success) {
                setTimeout(() => router.push(`/admin/orcamentos/${result.data?.id}`), 1500);
            } else {
                setTimeout(() => setStatus(null), 5000);
            }
        });
    };
    
    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-primary">Nova Proposta</h1>
                    <p className="text-muted mt-1">Crie uma proposta detalhada para o seu cliente.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow text-base"
                >
                    <Wand2 size={20} />
                    Gerar com IA
                </button>
            </div>
            
            <div className="surface-card rounded-xl shadow-lg border border-default">
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
                    <div className="p-8 space-y-10">
                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><FileSignature size={20} className="text-blue-600" /> 1. Proposta</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2"><label className="block text-sm font-medium text-primary mb-2">Título do Orçamento *</label><input type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ex: Lua de Mel em Santorini – 7 dias" required className="w-full px-4 py-3 border border-default rounded-lg"/></div>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-primary mb-2">Cliente *</label>
                                    <input type="text" value={clienteSearch} onChange={(e) => { setClienteSearch(e.target.value); setFormData(prev => ({ ...prev, lead_id: '', novo_cliente_nome: e.target.value })); }} placeholder="🔍 Buscar ou digitar nome de novo cliente..." required className="w-full px-4 py-3 border border-default rounded-lg"/>
                                    {clienteSearch.length > 0 && !formData.lead_id && !isClientesLoading && ( <div className="absolute z-10 w-full mt-1 surface-card border border-default rounded-lg shadow-lg max-h-40 overflow-y-auto">{clientes.filter(c => c.nome.toLowerCase().includes(clienteSearch.toLowerCase())).map(c => (<button key={c.id} type="button" onClick={() => handleSelectCliente(c.id)} className="w-full text-left px-4 py-2 hover:bg-white/10">{c.nome}</button>))}<p className="px-4 py-2 text-sm text-muted">Ou utilize o nome digitado como novo cliente.</p></div>)}
                                    {formData.lead_id && (<span className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"><User size={12} /> Cliente selecionado</span>)}
                                </div>
                                <div><label className="block text-sm font-medium text-primary mb-2">Validade da Proposta</label><input type="date" name="validade_ate" value={formData.validade_ate} onChange={handleChange} className="w-full px-4 py-3 border border-default rounded-lg" /></div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Plane size={20} className="text-blue-600" /> 2. Detalhes da Viagem</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-primary mb-2">Período da Viagem</label>
                                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                                </div>
                                <div><label className="block text-sm font-medium text-primary mb-2">Nº Pessoas</label><input type="number" name="num_pessoas" value={formData.num_pessoas} onChange={handleChange} min="1" className="w-full px-4 py-3 border rounded-lg"/></div>
                                <div><label className="block text-sm font-medium text-primary mb-2">Nº Dias</label><input type="number" name="num_dias" value={formData.num_dias} readOnly className="w-full px-4 py-3 border rounded-lg bg-white/5"/></div>
                            </div>
                        </section>
                        
                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><FileText size={20} className="text-blue-600" /> 3. Roteiro / Resumo da Proposta</h3>
                            <textarea name="descricao" value={formData.descricao} onChange={handleChange} rows={12} placeholder="Descreva o roteiro dia a dia aqui, ou clique em 'Gerar com IA' para que o sistema crie um rascunho." className="w-full px-4 py-3 border border-default rounded-lg resize-y"/>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center justify-between"><div><DollarSign size={20} className="text-blue-600" /> 4. Itens do Orçamento</div><span className="text-xl font-bold text-blue-600">Total: {totalOrcamento.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span></h3>
                            <div className="border border-default rounded-lg overflow-hidden"><table className="min-w-full divide-y divide-white/5"><thead className="bg-white/5"><tr><th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Tipo</th><th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Descrição</th><th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">Valor Venda</th><th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">Ações</th></tr></thead><tbody className="surface-card divide-y divide-white/5">{itens.length === 0 ? (<tr><td colSpan={4} className="text-center py-4 text-sm text-muted">Nenhum item adicionado.</td></tr>) : (itens.map((item) => (<tr key={item.id} className="hover:bg-white/5"><td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">{item.tipo}</span></td><td className="px-6 py-4 text-sm text-primary">{item.descricao}</td><td className="px-6 py-4 text-right text-sm font-bold text-green-600">{item.valor_final.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td><td className="px-6 py-4 text-right text-sm"><button type="button" onClick={() => handleEditItem(item)} className="text-blue-600 hover:text-blue-900 mr-2"><Edit2 size={16}/></button><button type="button" onClick={() => handleDeleteItem(item.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16}/></button></td></tr>)))}</tbody></table></div>
                            <div className="mt-4"><button type="button" onClick={() => { setCurrentItem(null); setIsModalItemOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-semibold"><Plus size={16} /> Adicionar Item/Serviço</button></div>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Info size={20} className="text-blue-600" /> 5. Observações Internas</h3>
                            <textarea name="observacoes" value={formData.observacoes} onChange={handleChange} rows={3} placeholder="Notas internas sobre precificação, fornecedores, etc." className="w-full px-4 py-3 border rounded-lg"/>
                        </section>
                        
                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Settings size={20} className="text-blue-600" /> 6. Fechamento</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium text-primary mb-2">Valor Final (€)</label><input type="text" value={totalOrcamento.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} disabled className="w-full px-4 py-3 border bg-white/5 rounded-lg font-bold"/></div>
                                <div><label className="block text-sm font-medium text-primary mb-2">Sinal / Entrada (€)</label><input type="number" name="valor_sinal" value={formData.valor_sinal} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-3 border rounded-lg"/></div>
                                <div><label className="block text-sm font-medium text-primary mb-2">Status Inicial</label><select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg"><option value="rascunho">Rascunho</option><option value="enviado">Enviado</option></select></div>
                            </div>
                        </section>
                        
                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><FileArchive size={20} className="text-blue-600" /> 7. Termos e Condições</h3>
                            <div className="flex items-start space-x-3">
                                <input type="checkbox" id="incluir_termos" name="incluir_termos" checked={formData.incluir_termos} onChange={handleChange} className="mt-1 h-4 w-4 text-blue-600 border-default rounded"/>
                                <div className="flex-1">
                                    <label htmlFor="incluir_termos" className="font-medium text-primary">Incluir Termos e Condições Padrão</label>
                                    {formData.incluir_termos && <div className="mt-2 p-4 border rounded-lg bg-white/5 text-xs text-muted whitespace-pre-wrap">{termosFormatados}</div>}
                                </div>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-default">
                            {status && (<div className={`mb-6 p-4 rounded-lg ${status.success ? 'bg-green-100' : 'bg-red-100'}`}><p className={`text-sm font-medium ${status.success ? 'text-green-800' : 'text-red-800'}`}>{status.message}</p></div>)}
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => handleSubmit(false)} disabled={isPending} className="flex items-center gap-2 bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50"><Save size={18} /> Salvar Rascunho</button>
                                <button type="button" onClick={() => handleSubmit(true)} disabled={isPending} className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"><Send size={18} /> Enviar Proposta</button>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
            
            {/* CORREÇÃO APLICADA AQUI */}
            <GerarRoteiroAIModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} onGenerate={(roteiro, titulo, clienteData) => { 
                setFormData(prev => ({ 
                    ...prev, 
                    descricao: roteiro, 
                    titulo: titulo, 
                    lead_id: clienteData.id, 
                    novo_cliente_nome: clienteData.id ? '' : clienteData.nome,
                    // Garante que o num_dias seja atualizado se tiver sido gerado pela IA (vem do modal, mas é bom garantir)
                    num_dias: prev.num_dias // Mantém o valor original do form, que é pego do modal de IA.
                })); 
                // Atualiza o campo de busca (o texto visível)
                setClienteSearch(clienteData.nome); 
            }} clientes={clientes} />
            
            {isModalItemOpen && <ItemModal item={currentItem} onClose={() => { setIsModalItemOpen(false); setCurrentItem(null); }} onSave={handleAddItem} />}
        </>
    );
}

// =======================================================================
// MODAL PARA ADIÇÃO/EDIÇÃO DE ITEM (Componente Auxiliar)
// =======================================================================
interface ItemModalProps {
    item: OrcamentoItem | null;
    onClose: () => void;
    onSave: (item: Omit<OrcamentoItem, 'id' | 'valor_final'>) => void;
}

function ItemModal({ item, onClose, onSave }: ItemModalProps) {
    const isEditing = !!item;
    const [itemData, setItemData] = useState<Omit<OrcamentoItem, 'id' | 'valor_final'>>({
        tipo: item?.tipo || 'Hospedagem',
        descricao: item?.descricao || '',
        valor_net: item?.valor_net || 0,
        comissao_percentual: item?.comissao_percentual || 10, // Default 10%
    });

    const valorFinal = useMemo(() => {
        const net = itemData.valor_net || 0;
        const comissao = itemData.comissao_percentual || 0;
        return net * (1 + comissao / 100);
    }, [itemData.valor_net, itemData.comissao_percentual]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'number') {
             setItemData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setItemData(prev => ({ ...prev, [name]: value as OrcamentoItem['tipo'] }));
        }
    };

    const handleInternalSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemData.descricao || itemData.valor_net <= 0) {
            alert("Descrição e Valor Custo devem ser preenchidos e o valor deve ser maior que zero.");
            return;
        }
        // Chamada ao onSave do componente principal
        onSave({ ...itemData, valor_net: itemData.valor_net }); 
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="surface-card rounded-xl w-full max-w-lg">
                <form onSubmit={handleInternalSave}>
                    <div className="p-6 border-b">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{isEditing ? 'Editar Item' : 'Adicionar Item'}</h3>
                            <button type="button" onClick={onClose}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Tipo de Item */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Tipo de Serviço *</label>
                            <select 
                                name="tipo" 
                                value={itemData.tipo} 
                                onChange={handleChange} 
                                className="w-full px-4 py-2 border rounded-lg"
                                required
                            >
                                {TIPOS_DE_ITEM.map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Descrição */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Descrição Detalhada *</label>
                            <textarea 
                                name="descricao" 
                                value={itemData.descricao} 
                                onChange={handleChange}
                                rows={3}
                                placeholder="Ex: Hotel Grand Hyatt - 5 noites, quarto deluxe"
                                className="w-full px-4 py-2 border rounded-lg" 
                                required
                            />
                        </div>

                        {/* Valores */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Valor Net */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Valor Custo (€)</label>
                                <input 
                                    type="number" 
                                    name="valor_net" 
                                    value={itemData.valor_net || ''} 
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg" 
                                />
                            </div>
                            {/* Comissão */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Comissão (%)</label>
                                <input 
                                    type="number" 
                                    name="comissao_percentual" 
                                    value={itemData.comissao_percentual || ''} 
                                    onChange={handleChange}
                                    min="0"
                                    step="0.1"
                                    className="w-full px-4 py-2 border rounded-lg" 
                                />
                            </div>
                            {/* Valor Final Calculado */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Valor Venda (€)</label>
                                <input 
                                    type="text" 
                                    value={valorFinal.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                                    disabled
                                    className="w-full px-4 py-2 border rounded-lg bg-white/10 font-bold"
                                />
                            </div>
                        </div>
                        
                    </div>

                    <div className="p-6 border-t flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-white/5">
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isEditing ? 'Salvar Edição' : 'Adicionar Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}