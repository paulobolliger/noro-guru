// components/admin/orcamentos/EditOrcamentoForm.tsx
'use client';

import { useState, useTransition, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, User, Plane, Calendar, DollarSign, Loader2, AlertCircle, CheckCircle2, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { NButton, NAlert } from '@/components/ui';
import { updateOrcamento } from "@/app/(protected)/orcamentos/orcamentos-actions";
import { format } from 'date-fns';
import type { Database } from "@noro-types/supabase";

// Tipos baseados nas estruturas do projeto
type OrcamentoRow = Database['public']['Tables']['noro_orcamentos']['Row'];
type OrcamentoStatus = Database['public']['Enums']['orcamento_status'];

interface ClienteBase {
    id: string;
    nome: string;
    email: string | null;
}

interface OrcamentoItem {
    id: string;
    tipo: 'Aéreo' | 'Hospedagem' | 'Transfer' | 'Passeio' | 'Seguro' | 'Outro';
    descricao: string;
    valor_net: number;
    comissao_percentual: number;
    valor_final: number;
}

interface EditOrcamentoFormProps {
    orcamentoInicial: OrcamentoRow;
    clientes: ClienteBase[];
}

// --- Listas de opções ---
const TIPOS_DE_ITEM: OrcamentoItem['tipo'][] = ['Aéreo', 'Hospedagem', 'Transfer', 'Passeio', 'Seguro', 'Outro'];
const STATUS_OPTIONS: OrcamentoStatus[] = ['rascunho', 'enviado', 'visualizado', 'aceito', 'recusado', 'expirado', 'revisao'];


export default function EditOrcamentoForm({ orcamentoInicial, clientes }: EditOrcamentoFormProps) {
    const router = useRouter();
    
    // Inicialização do estado com os dados do orçamento existente
    const [formData, setFormData] = useState({
        titulo: orcamentoInicial.titulo || '',
        lead_id: orcamentoInicial.lead_id || '',
        roteiro_base_id: orcamentoInicial.roteiro_base_id || '',
        valor_total: String(orcamentoInicial.valor_total) || '0',
        valor_sinal: String(orcamentoInicial.valor_sinal) || '',
        status: (orcamentoInicial.status as string) || 'rascunho',
        descricao: orcamentoInicial.descricao || '',
        data_viagem_inicio: orcamentoInicial.data_viagem_inicio ? format(new Date(orcamentoInicial.data_viagem_inicio), 'yyyy-MM-dd') : '',
        data_viagem_fim: orcamentoInicial.data_viagem_fim ? format(new Date(orcamentoInicial.data_viagem_fim), 'yyyy-MM-dd') : '',
        num_pessoas: String(orcamentoInicial.num_pessoas) || '1',
        num_dias: String(orcamentoInicial.num_dias) || '7',
        validade_ate: orcamentoInicial.validade_ate ? format(new Date(orcamentoInicial.validade_ate), 'yyyy-MM-dd') : '',
        observacoes: orcamentoInicial.observacoes || '',
        termos_condicoes: orcamentoInicial.termos_condicoes || '',
    });
    
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ success: boolean; message: string; data?: any } | null>(null);
    
    // Inicializa o campo de busca do cliente com o nome do cliente atual
    const initialClient = clientes.find(c => c.id === orcamentoInicial.lead_id);
    const [clienteSearch, setClienteSearch] = useState(initialClient?.nome || '');
    
    // Inicializa os itens (JSONB)
    const [itens, setItens] = useState<OrcamentoItem[]>(() => {
        try {
            // Garante que o campo itens é um array ou faz o parse
            const data = orcamentoInicial.itens as OrcamentoItem[] | string;
            if (typeof data === 'string') {
                return JSON.parse(data) as OrcamentoItem[] || [];
            }
            return data || [];
        } catch {
            return [];
        }
    });

    const [isModalItemOpen, setIsModalItemOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<OrcamentoItem | null>(null);

    // LÓGICA DO VALOR TOTAL E ATUALIZAÇÃO AUTOMÁTICA
    const totalOrcamento = useMemo(() => {
        return itens.reduce((acc, item) => acc + item.valor_final, 0);
    }, [itens]);

    useEffect(() => {
        setFormData(prev => ({ ...prev, valor_total: totalOrcamento.toFixed(2) }));
    }, [totalOrcamento]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectCliente = (id: string) => {
        const selected = clientes.find(c => c.id === id);
        if (selected) {
            setFormData(prev => ({ ...prev, lead_id: id }));
            setClienteSearch(selected.nome);
        }
    };

    // --- LÓGICA DE ITENS ---
    const handleAddItem = (item: Omit<OrcamentoItem, 'id' | 'valor_final'>) => {
        const valor_net = item.valor_net;
        const comissao_percentual = item.comissao_percentual;
        const valor_final = valor_net * (1 + comissao_percentual / 100);
        
        const newItem: OrcamentoItem = {
            ...item,
            id: currentItem ? currentItem.id : crypto.randomUUID(), 
            valor_final,
        };

        if (currentItem) {
            setItens(prev => prev.map(i => i.id === newItem.id ? newItem : i));
        } else {
            setItens(prev => [...prev, newItem]);
        }
        
        setCurrentItem(null);
        setIsModalItemOpen(false);
    };

    const handleDeleteItem = (id: string) => {
        if (confirm('Tem certeza que deseja remover este item?')) {
            setItens(prev => prev.filter(i => i.id !== id));
        }
    };
    
    const handleEditItem = (item: OrcamentoItem) => {
        setCurrentItem(item);
        setIsModalItemOpen(true);
    };

    // --- LÓGICA DE SUBMISSÃO FINAL (UPDATE) ---
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus(null);

        if (!formData.titulo || !formData.lead_id) {
            setStatus({ success: false, message: 'Título do orçamento e Cliente são obrigatórios.' });
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });
        
        // Adiciona os itens do orçamento (JSON stringificado)
        formDataToSend.append('itens', JSON.stringify(itens)); 

        startTransition(async () => {
            // Chama a função de UPDATE
            const result = await updateOrcamento(orcamentoInicial.id, formDataToSend);

            if (result.success) {
                setStatus({ success: true, message: `Orçamento ${orcamentoInicial.numero_orcamento || 'atualizado'} com sucesso!` });
                
                // Redireciona para a página de detalhes após a edição
                setTimeout(() => {
                    router.push(`/admin/orcamentos/${orcamentoInicial.id}`);
                }, 1500);
            } else {
                setStatus(result);
                setTimeout(() => setStatus(null), 5000);
            }
        });
    };

    return (
        <>
            <div className="surface-card rounded-xl shadow-lg border border-default">
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-8">
                        {status && (
                          <NAlert variant={status.success ? 'success' : 'error'} title={status.success ? 'Sucesso' : 'Erro'}>
                            {status.message}
                          </NAlert>
                        )}
                        
                        {/* SEÇÃO 1: Cliente e Título */}
                        <section>
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                                <FileText size={20} /> Detalhes da Proposta
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Título do Orçamento */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-primary mb-2">Título do Orçamento *</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={handleChange}
                                        placeholder="Ex: Lua de Mel em Santorini - 7 dias"
                                        required
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary"
                                    />
                                </div>

                                {/* Seleção do Cliente (Autocomplete Simulado) */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-primary mb-2">Cliente *</label>
                                    <input
                                        type="text"
                                        value={clienteSearch}
                                        onChange={(e) => {
                                            setClienteSearch(e.target.value);
                                            setFormData(prev => ({ ...prev, lead_id: '' })); // Limpa o ID ao digitar
                                        }}
                                        placeholder={'Buscar cliente por nome...'}
                                        required
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary"
                                    />
                                    {/* Dropdown de sugestões (simples) */}
                                    {clienteSearch.length > 0 && !formData.lead_id && (
                                        <div className="absolute z-10 w-full mt-1 surface-card border border-default rounded-lg shadow-lg max-h-40 overflow-y-auto">
                                            {clientes
                                                .filter(c => c.nome.toLowerCase().includes(clienteSearch.toLowerCase()))
                                                .slice(0, 5)
                                                .map(c => (
                                                    <button
                                                        key={c.id}
                                                        type="button"
                                                        onClick={() => handleSelectCliente(c.id)}
                                                        className="w-full text-left px-4 py-2 hover:bg-white/10 text-sm"
                                                    >
                                                        {c.nome} ({c.email})
                                                    </button>
                                                ))}
                                            {clientes.filter(c => c.nome.toLowerCase().includes(clienteSearch.toLowerCase())).length === 0 && (
                                                <div className="px-4 py-2 text-sm text-muted">Nenhum cliente encontrado.</div>
                                            )}
                                        </div>
                                    )}
                                    {/* Badge de Cliente Selecionado */}
                                    {formData.lead_id && (
                                        <span className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                            <User size={12} /> Cliente selecionado: {clienteSearch}
                                        </span>
                                    )}
                                </div>

                                {/* Validade */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Validade até</label>
                                    <input
                                        type="date"
                                        name="validade_ate"
                                        value={formData.validade_ate}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary"
                                    />
                                </div>
                                
                                {/* Descrição */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-primary mb-2">Resumo da Proposta</label>
                                    <textarea
                                        name="descricao"
                                        value={formData.descricao}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Breve descrição sobre o que o orçamento inclui."
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary resize-none"
                                    />
                                </div>
                            </div>
                        </section>
                        
                        {/* SEÇÃO 2: Detalhes da Viagem */}
                        <section className="border-t border-default pt-6">
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                                <Plane size={20} /> Detalhes da Viagem
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                
                                {/* Data Início */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Data Início</label>
                                    <input
                                        type="date"
                                        name="data_viagem_inicio"
                                        value={formData.data_viagem_inicio}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary"
                                    />
                                </div>

                                {/* Data Fim */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Data Fim</label>
                                    <input
                                        type="date"
                                        name="data_viagem_fim"
                                        value={formData.data_viagem_fim}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary"
                                    />
                                </div>

                                {/* Nº Pessoas */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Nº Pessoas</label>
                                    <input
                                        type="number"
                                        name="num_pessoas"
                                        value={formData.num_pessoas}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary"
                                    />
                                </div>
                                
                                {/* Nº Dias */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Nº Dias</label>
                                    <input
                                        type="number"
                                        name="num_dias"
                                        value={formData.num_dias}
                                        onChange={handleChange}
                                        min="1"
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/5 text-primary"
                                    />
                                </div>
                            </div>
                        </section>
                        
                        {/* SEÇÃO 3: Itens do Orçamento */}
                        <section className="border-t border-default pt-6">
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center justify-between">
                                <div><DollarSign size={20} className="inline-block mr-2" /> Itens do Orçamento</div>
                                <span className="text-xl font-bold text-blue-600">Total: {totalOrcamento.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</span>
                            </h3>
                            
                            {/* Tabela de Itens */}
                            <div className="border border-default rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-white/5">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Tipo</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Descrição</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">Valor Venda</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="surface-card divide-y divide-white/5">
                                        {itens.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-sm text-muted">
                                                    Nenhum item adicionado.
                                                </td>
                                            </tr>
                                        ) : (
                                            itens.map((item) => (
                                                <tr key={item.id} className="hover:bg-white/10">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                            {item.tipo}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-muted">{item.descricao}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                                                        {item.valor_final.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleEditItem(item)}
                                                            className="text-blue-600 hover:text-blue-900 mr-2"
                                                            title="Editar Item"
                                                        >
                                                            <Edit2 size={16} className="inline-block" />
                                                        </button>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Remover Item"
                                                        >
                                                            <Trash2 size={16} className="inline-block" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Botão Adicionar Item */}
                            <div className="mt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentItem(null);
                                        setIsModalItemOpen(true);
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-semibold transition-colors"
                                >
                                    <Plus size={16} /> Adicionar Item/Serviço
                                </button>
                            </div>
                            
                            <div className="md:col-span-2 md:col-start-2">
                                <label className="block text-sm font-medium text-primary mb-2 mt-4">Observações (Internas)</label>
                                <textarea
                                    name="observacoes"
                                    value={formData.observacoes}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Notas internas sobre precificação, concorrência ou riscos."
                                    className="w-full px-4 py-3 border border-default rounded-lg resize-none"
                                />
                            </div>
                            
                        </section>

                        {/* SEÇÃO 4: Fechamento */}
                        <section className="border-t border-default pt-6">
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                                <DollarSign size={20} /> Fechamento
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                
                                {/* Valor Total (controlado por JS) */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Valor Final (€)</label>
                                    <input
                                        type="text"
                                        name="valor_total_display"
                                        value={totalOrcamento.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                                        disabled
                                        className="w-full px-4 py-3 border border-default rounded-lg bg-white/10 text-primary font-bold"
                                    />
                                    {/* Campo escondido com o valor real para o Server Action */}
                                    <input type="hidden" name="valor_total" value={formData.valor_total} />
                                </div>
                                
                                {/* Valor Sinal */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Valor Sinal / Entrada (€)</label>
                                    <input
                                        type="number"
                                        name="valor_sinal"
                                        value={formData.valor_sinal}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-3 border border-default rounded-lg"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-2">Status do Orçamento</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-default rounded-lg"
                                    >
                                        {STATUS_OPTIONS.map(status => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </section>
                        
                        {/* Termos e Condições (Simplificado) */}
                        <section className="border-t border-default pt-6">
                            <label className="block text-sm font-medium text-primary mb-2">Termos e Condições</label>
                            <textarea
                                name="termos_condicoes"
                                value={formData.termos_condicoes}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Insira aqui os termos específicos deste orçamento."
                                className="w-full px-4 py-3 border border-default rounded-lg resize-none"
                            />
                        </section>


                        {/* Feedback e Ação */}
                        {status && (
                            <div className={`mt-6 flex items-center gap-2 p-4 rounded-lg ${
                                status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {status.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                <p className="text-sm font-medium">{status.message}</p>
                            </div>
                        )}

                        <div className="pt-6 border-t border-default">
                            <button
                                type="submit"
                                disabled={isPending || !formData.titulo || !formData.lead_id || itens.length === 0}
                                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                {isPending ? 'A Guardar Alterações...' : 'Salvar Alterações'}
                            </button>
                            {itens.length === 0 && (
                                <p className="text-red-500 text-xs mt-2 text-center">É necessário adicionar pelo menos um Item ao orçamento para salvar.</p>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Modal de Adição/Edição de Item (Componente Auxiliar) */}
            {isModalItemOpen && (
                <ItemModal 
                    item={currentItem}
                    onClose={() => {
                        setIsModalItemOpen(false);
                        setCurrentItem(null);
                    }}
                    onSave={handleAddItem}
                />
            )}
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
            setItemData(prev => ({ ...prev, [name]: value }));
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
            <div className="surface-card border border-default rounded-xl w-full max-w-lg">
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
                            <label className="block text-sm font-medium mb-2 text-primary">Descrição Detalhada *</label>
                            <textarea 
                                name="descricao" 
                                value={itemData.descricao} 
                                onChange={handleChange}
                                rows={3}
                                placeholder="Ex: Hotel Grand Hyatt - 5 noites, quarto deluxe"
                                className="w-full px-4 py-2 border border-default rounded-lg bg-white/5 text-primary" 
                                required
                            />
                        </div>

                        {/* Valores */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* Valor Net */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-primary">Valor Custo (€)</label>
                                <input 
                                    type="number" 
                                    name="valor_net" 
                                    value={itemData.valor_net || ''} 
                                    onChange={handleChange}
                                    min="0.01"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-2 border border-default rounded-lg bg-white/5 text-primary" 
                                />
                            </div>
                            {/* Comissão */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-primary">Comissão (%)</label>
                                <input 
                                    type="number" 
                                    name="comissao_percentual" 
                                    value={itemData.comissao_percentual || ''} 
                                    onChange={handleChange}
                                    min="0"
                                    step="0.1"
                                    className="w-full px-4 py-2 border border-default rounded-lg bg-white/5 text-primary" 
                                />
                            </div>
                            {/* Valor Final Calculado */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-primary">Valor Venda (€)</label>
                                <input 
                                    type="text" 
                                    value={valorFinal.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
                                    disabled
                                    className="w-full px-4 py-2 border border-default rounded-lg bg-white/10 font-bold"
                                />
                            </div>
                        </div>
                        
                    </div>

                    <div className="p-6 border-t border-default flex justify-end gap-3">
                        <NButton type="button" variant="secondary" onClick={onClose}>Cancelar</NButton>
                        <NButton type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>{isEditing ? 'Salvar Edição' : 'Adicionar Item'}</NButton>
                    </div>
                </form>
            </div>
        </div>
    );
}
