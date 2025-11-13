'use client';

import { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Building2, Calendar, Globe, Briefcase, CreditCard, MapPin } from 'lucide-react';
import { updateCliente } from '@/app/clientes/[id]/actions';
import { useRouter } from 'next/navigation';

interface DadosPessoaisTabProps {
  cliente: any;
  initialEditMode?: boolean; // NOVO: Propriedade para forçar o modo edição inicial
  onToggleEdit?: (isEditing: boolean) => void; // NOVO: Callback para informar o estado de edição
}

export default function DadosPessoaisTab({ cliente, initialEditMode = false, onToggleEdit }: DadosPessoaisTabProps) {
  const router = useRouter();
  // ATUALIZADO: Usa initialEditMode para o estado inicial
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: cliente.nome || '',
    email: cliente.email || '',
    telefone: cliente.telefone || '',
    whatsapp: cliente.whatsapp || '',
    tipo: cliente.tipo || 'pessoa_fisica',
    
    // Pessoa Física
    cpf: cliente.cpf || '',
    data_nascimento: cliente.data_nascimento || '',
    nacionalidade: cliente.nacionalidade || '',
    profissao: cliente.profissao || '',
    passaporte: cliente.passaporte || '',
    
    // Pessoa Jurídica
    cnpj: cliente.cnpj || '',
    razao_social: cliente.razao_social || '',
    nome_fantasia: cliente.nome_fantasia || '',
    inscricao_estadual: cliente.inscricao_estadual || '',
    responsavel_nome: cliente.responsavel_nome || '',
    responsavel_cargo: cliente.responsavel_cargo || '',
    
    // Gerais
    status: cliente.status || 'ativo',
    nivel: cliente.nivel || 'bronze',
    segmento: cliente.segmento || '',
    idioma_preferido: cliente.idioma_preferido || 'pt',
    moeda_preferida: cliente.moeda_preferida || 'EUR',
    observacoes: cliente.observacoes || '',
  });

  // EFEITO: Sincroniza o estado de edição com a prop externa
  useEffect(() => {
      setIsEditing(initialEditMode);
  }, [initialEditMode]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    });

    const result = await updateCliente(cliente.id, formDataToSend);
    
    if (result.success) {
      setIsEditing(false);
      onToggleEdit?.(false); // Chama o callback
      router.refresh();
    } else {
      alert('Erro ao salvar: ' + result.error);
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    // Lógica para reverter o formulário ao estado original do cliente
    setFormData({
      nome: cliente.nome || '',
      email: cliente.email || '',
      telefone: cliente.telefone || '',
      whatsapp: cliente.whatsapp || '',
      tipo: cliente.tipo || 'pessoa_fisica',
      cpf: cliente.cpf || '',
      data_nascimento: cliente.data_nascimento || '',
      nacionalidade: cliente.nacionalidade || '',
      profissao: cliente.profissao || '',
      passaporte: cliente.passaporte || '',
      cnpj: cliente.cnpj || '',
      razao_social: cliente.razao_social || '',
      nome_fantasia: cliente.nome_fantasia || '',
      inscricao_estadual: cliente.inscricao_estadual || '',
      responsavel_nome: cliente.responsavel_nome || '',
      responsavel_cargo: cliente.responsavel_cargo || '',
      status: cliente.status || 'ativo',
      nivel: cliente.nivel || 'bronze',
      segmento: cliente.segmento || '',
      idioma_preferido: cliente.idioma_preferido || 'pt',
      moeda_preferida: cliente.moeda_preferida || 'EUR',
      observacoes: cliente.observacoes || '',
    });
    setIsEditing(false);
    onToggleEdit?.(false); // Chama o callback
  };
  
  const handleEditClick = () => {
      setIsEditing(true);
      onToggleEdit?.(true); // Chama o callback
  };

  const isPessoaFisica = formData.tipo === 'pessoa_fisica';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {isPessoaFisica ? (
            <User className="w-6 h-6 text-blue-600" />
          ) : (
            <Building2 className="w-6 h-6 text-purple-600" />
          )}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Dados Pessoais</h2>
            <p className="text-sm text-gray-600">
              {isPessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </p>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={handleEditClick} // ATUALIZADO
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* DADOS BÁSICOS */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h3>
          </div>

          {/* Nome / Razão Social */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isPessoaFisica ? 'Nome Completo' : 'Razão Social'}
            </label>
            {isEditing ? (
              <input
                type="text"
                name={isPessoaFisica ? 'nome' : 'razao_social'}
                value={isPessoaFisica ? formData.nome : formData.razao_social}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{isPessoaFisica ? cliente.nome : cliente.razao_social || '-'}</p>
            )}
          </div>

          {/* Nome Fantasia (apenas PJ) */}
          {!isPessoaFisica && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Fantasia
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="nome_fantasia"
                  value={formData.nome_fantasia}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{cliente.nome_fantasia || '-'}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{cliente.email || '-'}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{cliente.telefone || '-'}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{cliente.whatsapp || '-'}</p>
            )}
          </div>

          {/* DOCUMENTOS */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
          </div>

          {isPessoaFisica ? (
            <>
              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.cpf || '-'}</p>
                )}
              </div>

              {/* Passaporte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passaporte
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="passaporte"
                    value={formData.passaporte}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.passaporte || '-'}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Nascimento
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {cliente.data_nascimento 
                      ? new Date(cliente.data_nascimento).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                )}
              </div>

              {/* Nacionalidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nacionalidade
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nacionalidade"
                    value={formData.nacionalidade}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.nacionalidade || '-'}</p>
                )}
              </div>

              {/* Profissão */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profissão
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="profissao"
                    value={formData.profissao}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.profissao || '-'}</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* CNPJ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNPJ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.cnpj || '-'}</p>
                )}
              </div>

              {/* Inscrição Estadual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inscrição Estadual
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="inscricao_estadual"
                    value={formData.inscricao_estadual}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.inscricao_estadual || '-'}</p>
                )}
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="responsavel_nome"
                    value={formData.responsavel_nome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.responsavel_nome || '-'}</p>
                )}
              </div>

              {/* Cargo do Responsável */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="responsavel_cargo"
                    value={formData.responsavel_cargo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{cliente.responsavel_cargo || '-'}</p>
                )}
              </div>
            </>
          )}

          {/* CLASSIFICAÇÃO */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Classificação</h3>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ativo">Ativo</option>
                <option value="vip">VIP</option>
                <option value="inativo">Inativo</option>
                <option value="blacklist">Blacklist</option>
              </select>
            ) : (
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                cliente.status === 'ativo' ? 'bg-green-100 text-green-800' :
                cliente.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                cliente.status === 'inativo' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {cliente.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* Nível */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nível
            </label>
            {isEditing ? (
              <select
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bronze">Bronze</option>
                <option value="prata">Prata</option>
                <option value="ouro">Ouro</option>
                <option value="platina">Platina</option>
                <option value="diamante">Diamante</option>
              </select>
            ) : (
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                cliente.nivel === 'bronze' ? 'bg-orange-100 text-orange-800' :
                cliente.nivel === 'prata' ? 'bg-gray-100 text-gray-800' :
                cliente.nivel === 'ouro' ? 'bg-yellow-100 text-yellow-800' :
                cliente.nivel === 'platina' ? 'bg-blue-100 text-blue-800' :
                'bg-indigo-100 text-indigo-800'
              }`}>
                {cliente.nivel.toUpperCase()}
              </span>
            )}
          </div>

          {/* Segmento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segmento
            </label>
            {isEditing ? (
              <select
                name="segmento"
                value={formData.segmento}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="luxo">Luxo</option>
                <option value="familia">Família</option>
                <option value="aventura">Aventura</option>
                <option value="corporativo">Corporativo</option>
                <option value="mochileiro">Mochileiro</option>
                <option value="romantico">Romântico</option>
              </select>
            ) : (
              <p className="text-gray-900">{cliente.segmento || '-'}</p>
            )}
          </div>

          {/* PREFERÊNCIAS */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferências Gerais</h3>
          </div>

          {/* Idioma Preferido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma Preferido
            </label>
            {isEditing ? (
              <select
                name="idioma_preferido"
                value={formData.idioma_preferido}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pt">Português</option>
                <option value="en">Inglês</option>
                <option value="es">Espanhol</option>
                <option value="fr">Francês</option>
                <option value="de">Alemão</option>
                <option value="it">Italiano</option>
              </select>
            ) : (
              <p className="text-gray-900">
                {cliente.idioma_preferido === 'pt' ? 'Português' :
                 cliente.idioma_preferido === 'en' ? 'Inglês' :
                 cliente.idioma_preferido === 'es' ? 'Espanhol' :
                 cliente.idioma_preferido === 'fr' ? 'Francês' :
                 cliente.idioma_preferido === 'de' ? 'Alemão' :
                 cliente.idioma_preferido === 'it' ? 'Italiano' : '-'}
              </p>
            )}
          </div>

          {/* Moeda Preferida */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeda Preferida
            </label>
            {isEditing ? (
              <select
                name="moeda_preferida"
                value={formData.moeda_preferida}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="EUR">Euro (€)</option>
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="GBP">Libra (£)</option>
              </select>
            ) : (
              <p className="text-gray-900">{cliente.moeda_preferida}</p>
            )}
          </div>

          {/* Observações */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observações
            </label>
            {isEditing ? (
              <textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">{cliente.observacoes || '-'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}