'use client';

import { useState, useEffect } from 'react';
import { Edit2, Save, X, User, Building2, Calendar, Globe, Briefcase, CreditCard, MapPin } from 'lucide-react';
import { NInput, NButton, NSelect, NTextarea } from '@/components/ui';
import { updateCliente } from "@/app/(protected)/clientes/[id]/actions";
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
    <div className="surface-card rounded-xl shadow-sm border border-default">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-default border-default">
        <div className="flex items-center gap-3">
          {isPessoaFisica ? (
            <User className="w-6 h-6 text-blue-600" />
          ) : (
            <Building2 className="w-6 h-6 text-purple-600" />
          )}
          <div>
            <h2 className="text-xl font-semibold text-primary">Dados Pessoais</h2>
            <p className="text-sm text-muted">
              {isPessoaFisica ? 'Pessoa Física' : 'Pessoa Jurídica'}
            </p>
          </div>
        </div>
        
        {!isEditing ? (
          <NButton
            onClick={handleEditClick} // ATUALIZADO
            variant="tertiary"
            leftIcon={<Edit2 className="w-4 h-4" />}
          >
            Editar
          </NButton>
        ) : (
          <div className="flex gap-2">
            <NButton
              onClick={handleCancel}
              disabled={isSaving}
              variant="secondary"
            >
              <X className="w-4 h-4" />
              Cancelar
            </NButton>
            <NButton
              onClick={handleSave}
              disabled={isSaving}
              variant="primary"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </NButton>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* DADOS BÁSICOS */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-primary mb-4">Informações Básicas</h3>
          </div>

          {/* Nome / Razão Social */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {isPessoaFisica ? 'Nome Completo' : 'Razão Social'}
            </label>
            {isEditing ? (
              <NInput
                type="text"
                name={isPessoaFisica ? 'nome' : 'razao_social'}
                value={isPessoaFisica ? formData.nome : formData.razao_social}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-indigo-400/40"
              />
            ) : (
              <p className="text-primary">{isPessoaFisica ? cliente.nome : cliente.razao_social || '-'}</p>
            )}
          </div>

          {/* Nome Fantasia (apenas PJ) */}
          {!isPessoaFisica && (
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Nome Fantasia
              </label>
              {isEditing ? (
                <NInput
                  type="text"
                  name="nome_fantasia"
                  value={formData.nome_fantasia}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-indigo-400/40"
                />
              ) : (
                <p className="text-primary">{cliente.nome_fantasia || '-'}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Email
            </label>
            {isEditing ? (
              <NInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-indigo-400/40"
              />
            ) : (
              <p className="text-primary">{cliente.email || '-'}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Telefone
            </label>
            {isEditing ? (
              <NInput
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-indigo-400/40"
              />
            ) : (
              <p className="text-primary">{cliente.telefone || '-'}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              WhatsApp
            </label>
            {isEditing ? (
              <NInput
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="focus:ring-2 focus:ring-indigo-400/40"
              />
            ) : (
              <p className="text-primary">{cliente.whatsapp || '-'}</p>
            )}
          </div>

          {/* DOCUMENTOS */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Documentos</h3>
          </div>

          {isPessoaFisica ? (
            <>
              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  CPF
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.cpf || '-'}</p>
                )}
              </div>

              {/* Passaporte */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Passaporte
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="passaporte"
                    value={formData.passaporte}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.passaporte || '-'}</p>
                )}
              </div>

              {/* Data de Nascimento */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Data de Nascimento
                </label>
                {isEditing ? (
                  <NInput
                    type="date"
                    name="data_nascimento"
                    value={formData.data_nascimento}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">
                    {cliente.data_nascimento 
                      ? new Date(cliente.data_nascimento).toLocaleDateString('pt-BR')
                      : '-'}
                  </p>
                )}
              </div>

              {/* Nacionalidade */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Nacionalidade
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="nacionalidade"
                    value={formData.nacionalidade}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.nacionalidade || '-'}</p>
                )}
              </div>

              {/* Profissão */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Profissão
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="profissao"
                    value={formData.profissao}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.profissao || '-'}</p>
                )}
              </div>
            </>
          ) : (
            <>
              {/* CNPJ */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  CNPJ
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.cnpj || '-'}</p>
                )}
              </div>

              {/* Inscrição Estadual */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Inscrição Estadual
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="inscricao_estadual"
                    value={formData.inscricao_estadual}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.inscricao_estadual || '-'}</p>
                )}
              </div>

              {/* Responsável */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Responsável
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="responsavel_nome"
                    value={formData.responsavel_nome}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.responsavel_nome || '-'}</p>
                )}
              </div>

              {/* Cargo do Responsável */}
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Cargo
                </label>
                {isEditing ? (
                  <NInput
                    type="text"
                    name="responsavel_cargo"
                    value={formData.responsavel_cargo}
                    onChange={handleChange}
                    className="focus:ring-2 focus:ring-indigo-400/40"
                  />
                ) : (
                  <p className="text-primary">{cliente.responsavel_cargo || '-'}</p>
                )}
              </div>
            </>
          )}

          {/* CLASSIFICAÇÃO */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Classificação</h3>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Status
            </label>
            {isEditing ? (
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-default rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                cliente.status === 'inativo' ? 'bg-white/10 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {cliente.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* Nível */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Nível
            </label>
            {isEditing ? (
              <NSelect
                name="nivel"
                value={formData.nivel}
                onChange={handleChange}
                className="w-full"
              >
                <option value="bronze">Bronze</option>
                <option value="prata">Prata</option>
                <option value="ouro">Ouro</option>
                <option value="platina">Platina</option>
                <option value="diamante">Diamante</option>
              </NSelect>
            ) : (
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                cliente.nivel === 'bronze' ? 'bg-orange-100 text-orange-800' :
                cliente.nivel === 'prata' ? 'bg-white/10 text-gray-800' :
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
            <label className="block text-sm font-medium text-primary mb-2">
              Segmento
            </label>
            {isEditing ? (
              <NSelect
                name="segmento"
                value={formData.segmento}
                onChange={handleChange}
                className="w-full"
              >
                <option value="">Selecione...</option>
                <option value="luxo">Luxo</option>
                <option value="familia">Família</option>
                <option value="aventura">Aventura</option>
                <option value="corporativo">Corporativo</option>
                <option value="mochileiro">Mochileiro</option>
                <option value="romantico">Romântico</option>
              </NSelect>
            ) : (
              <p className="text-primary">{cliente.segmento || '-'}</p>
            )}
          </div>

          {/* PREFERÊNCIAS */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Preferências Gerais</h3>
          </div>

          {/* Idioma Preferido */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Idioma Preferido
            </label>
            {isEditing ? (
              <NSelect
                name="idioma_preferido"
                value={formData.idioma_preferido}
                onChange={handleChange}
                className="w-full"
              >
                <option value="pt">Português</option>
                <option value="en">Inglês</option>
                <option value="es">Espanhol</option>
                <option value="fr">Francês</option>
                <option value="de">Alemão</option>
                <option value="it">Italiano</option>
              </NSelect>
            ) : (
              <p className="text-primary">
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
            <label className="block text-sm font-medium text-primary mb-2">
              Moeda Preferida
            </label>
            {isEditing ? (
              <NSelect
                name="moeda_preferida"
                value={formData.moeda_preferida}
                onChange={handleChange}
                className="w-full"
              >
                <option value="EUR">Euro (€)</option>
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="GBP">Libra (£)</option>
              </NSelect>
            ) : (
              <p className="text-primary">{cliente.moeda_preferida}</p>
            )}
          </div>

          {/* Observações */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-primary mb-2">
              Observações
            </label>
            {isEditing ? (
              <NTextarea
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                rows={4}
                className=""
              />
            ) : (
              <p className="text-primary whitespace-pre-wrap">{cliente.observacoes || '-'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
