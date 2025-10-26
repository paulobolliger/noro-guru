'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, Building2, Mail, Phone, MapPin, DollarSign, FileText, 
  Loader2, AlertCircle, CheckCircle2, Calendar, Globe, Briefcase, CreditCard
} from 'lucide-react';
import { createClienteAction } from '@/app/admin/(protected)/clientes/actions';
import type { ClienteStatus, ClienteTipo, ClienteSegmento, ClienteNivel } from "@types/clientes";
// NOVO: Importa as listas de dados
import { PROFISSOES, PAISES_E_NACIONALIDADES } from "@lib/client-data";

// --- Constantes para as opções de Select ---
const STATUS_OPTIONS: ClienteStatus[] = ['ativo', 'vip', 'inativo', 'blacklist'];
const NIVEL_OPTIONS: ClienteNivel[] = ['bronze', 'prata', 'ouro', 'platina', 'diamante'];
const SEGMENTO_OPTIONS: ClienteSegmento[] = ['luxo', 'familia', 'aventura', 'corporativo', 'mochileiro', 'romantico'];

// Define o estado inicial unificado
const initialFormData = {
  // Básico
  nome: '',
  email: '',
  telefone: '',
  whatsapp: '',
  tipo: 'pessoa_fisica' as ClienteTipo, // Default
  observacoes: '',
  
  // Classificação
  status: 'ativo' as ClienteStatus,
  nivel: 'bronze' as ClienteNivel,
  segmento: '' as ClienteSegmento | '', // Vazio se não selecionado
  idioma_preferido: 'pt',
  moeda_preferida: 'EUR',

  // Pessoa Física
  cpf: '',
  passaporte: '',
  data_nascimento: '',
  nacionalidade: '', // Será o valor da nacionalidade
  profissao: '', // Será o valor da profissão
  
  // Pessoa Jurídica
  cnpj: '',
  razao_social: '',
  nome_fantasia: '',
  responsavel_nome: '',
  responsavel_cargo: '',
};

export default function NovoClienteForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success: boolean; message: string; data?: any } | null>(null);

  const isPessoaFisica = useMemo(() => formData.tipo === 'pessoa_fisica', [formData.tipo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Se o tipo for alterado, reinicia os campos específicos do outro tipo para evitar dados misturados.
    if (name === 'tipo') {
        setFormData(prev => ({
            ...prev,
            [name]: value as ClienteTipo,
            // Resetar campos não-aplicáveis (opcional, mas boa prática)
            cpf: '', passaporte: '', data_nascimento: '', nacionalidade: '', profissao: '',
            cnpj: '', razao_social: '', nome_fantasia: '', responsavel_nome: '', responsavel_cargo: '',
        }));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    // Validação básica
    if (!formData.nome || !formData.email) {
        setStatus({ success: false, message: 'Nome e E-mail são obrigatórios.' });
        return;
    }
    
    // Converter estado para FormData
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
        // Envia apenas o que não for vazio para manter o payload limpo
        const value = formData[key as keyof typeof formData];
        if (value) {
            formDataToSend.append(key, value);
        }
    });

    startTransition(async () => {
      const result = await createClienteAction(formDataToSend);

      if (result.success) {
        setStatus({ success: true, message: `Cliente ${result.data?.nome} criado com sucesso!`, data: result.data });
        
        // Redireciona para a página de detalhes do novo cliente
        setTimeout(() => {
          if (result.data?.id) {
            router.push(`/admin/clientes/${result.data.id}`);
          } else {
            router.push('/admin/clientes'); // Fallback para a lista
          }
        }, 1500);

      } else {
        setStatus(result);
        setTimeout(() => setStatus(null), 5000);
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="p-8 space-y-8">
          
          {/* Seletor de Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Cliente *
            </label>
            <div className="flex space-x-4">
              <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 transition-all ${
                isPessoaFisica ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="tipo"
                  value="pessoa_fisica"
                  checked={isPessoaFisica}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <User size={18} /> Pessoa Física
              </label>
              <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 transition-all ${
                !isPessoaFisica ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="tipo"
                  value="pessoa_juridica"
                  checked={!isPessoaFisica}
                  onChange={handleChange}
                  className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                />
                <Building2 size={18} /> Pessoa Jurídica
              </label>
            </div>
          </div>

          {/* DADOS BÁSICOS */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} /> Informações de Contato
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isPessoaFisica ? 'Nome Completo' : 'Nome Fantasia'} *
                </label>
                <input
                  type="text"
                  name="nome" // Usamos 'nome' como campo principal para exibição em listas
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder={isPessoaFisica ? 'Ex: João da Silva' : 'Ex: Agência XYZ'}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemplo@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="+55 (11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
              
              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+55 (11) 99999-9999"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* DADOS ESPECÍFICOS (PF/PJ) */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} /> Dados de Documentação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {isPessoaFisica ? (
                <>
                  {/* PF: CPF */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                    <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  {/* PF: Passaporte */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passaporte</label>
                    <input type="text" name="passaporte" value={formData.passaporte} onChange={handleChange} placeholder="AB123456" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  {/* PF: Data de Nascimento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Calendar size={14} /> Data de Nascimento</label>
                    <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  
                  {/* PF: Nacionalidade (NOVO SELECT) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Globe size={14} /> Nacionalidade</label>
                    <select name="nacionalidade" value={formData.nacionalidade} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                        <option value="">Selecione a Nacionalidade...</option>
                        {PAISES_E_NACIONALIDADES.map(p => (
                            <option key={p.sigla} value={p.gentilico}>
                                {p.gentilico} ({p.nome_pais})
                            </option>
                        ))}
                    </select>
                  </div>
                  
                  {/* PF: Profissão (NOVO SELECT) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Briefcase size={14} /> Profissão</label>
                    <select name="profissao" value={formData.profissao} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                        <option value="">Selecione a Profissão...</option>
                        {PROFISSOES.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  {/* PJ: Razão Social */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Razão Social</label>
                    <input type="text" name="razao_social" value={formData.razao_social} onChange={handleChange} placeholder="Ex: Nomade Guru Viagens e Turismo Ltda" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  {/* PJ: CNPJ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                    <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  {/* PJ: Responsável */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Responsável</label>
                    <input type="text" name="responsavel_nome" value={formData.responsavel_nome} onChange={handleChange} placeholder="Ex: Maria Santos" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                  {/* PJ: Cargo do Responsável */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cargo do Responsável</label>
                    <input type="text" name="responsavel_cargo" value={formData.responsavel_cargo} onChange={handleChange} placeholder="Ex: CEO" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                  </div>
                </>
              )}
            </div>
          </section>

          {/* CLASSIFICAÇÃO E PREFERÊNCIAS GERAIS */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} /> Classificação e Preferências
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                  {STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Nível */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível</label>
                <select name="nivel" value={formData.nivel} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                  {NIVEL_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              {/* Segmento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Segmento</label>
                <select name="segmento" value={formData.segmento} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                    <option value="">(Não definido)</option>
                    {SEGMENTO_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                </select>
              </div>
              
              {/* Idioma Preferido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                <select name="idioma_preferido" value={formData.idioma_preferido} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                  <option value="pt">Português</option>
                  <option value="en">Inglês</option>
                  <option value="es">Espanhol</option>
                </select>
              </div>

              {/* Moeda Preferida */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Moeda</label>
                <select name="moeda_preferida" value={formData.moeda_preferida} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                  <option value="EUR">Euro (€)</option>
                  <option value="BRL">Real (R$)</option>
                  <option value="USD">Dólar ($)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Observações */}
          <section className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} /> Observações
            </h3>
            <textarea
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              rows={4}
              placeholder="Notas internas sobre o cliente, histórico de leads, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
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

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isPending || !formData.nome || !formData.email}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
            >
              {isPending && <Loader2 className="animate-spin" size={20} />}
              {isPending ? 'Criando Cliente...' : 'Adicionar Cliente'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}