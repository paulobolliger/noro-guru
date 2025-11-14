'use client';

import { useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import {
  User,
  Building2,
  Mail,
  Phone,
  Loader2,
  Calendar,
  Globe,
  Briefcase,
  CreditCard,
  FileText,
} from 'lucide-react';
import { createClienteAction } from '@/app/clientes/actions';
import type {
  ClienteStatus,
  ClienteTipo,
  ClienteSegmento,
  ClienteNivel,
} from '@/types/clientes';
import { PROFISSOES, PAISES_E_NACIONALIDADES } from '@/lib/client-data';

// Novos componentes do Sprint 2
import { FormField, FormSection, FormGrid, FormActions } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SimpleSelect } from '@/components/ui/select';
import { useFormValidation } from '@/lib/hooks/useFormValidation';
import { useErrorHandler } from '@/lib/hooks/useErrorHandler';

// --- Constantes para as opções de Select ---
const STATUS_OPTIONS: ClienteStatus[] = [
  'ativo',
  'vip',
  'inativo',
  'blacklist',
];
const NIVEL_OPTIONS: ClienteNivel[] = [
  'bronze',
  'prata',
  'ouro',
  'platina',
  'diamante',
];
const SEGMENTO_OPTIONS: ClienteSegmento[] = [
  'luxo',
  'familia',
  'aventura',
  'corporativo',
  'mochileiro',
  'romantico',
];

// Schema de validação com Zod
const clienteSchema = z.object({
  // Básico
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  tipo: z.enum(['pessoa_fisica', 'pessoa_juridica']),
  observacoes: z.string().optional(),

  // Classificação
  status: z.enum(['ativo', 'vip', 'inativo', 'blacklist']),
  nivel: z.enum(['bronze', 'prata', 'ouro', 'platina', 'diamante']),
  segmento: z.string().optional(),
  idioma_preferido: z.string(),
  moeda_preferida: z.string(),

  // Pessoa Física
  cpf: z.string().optional(),
  passaporte: z.string().optional(),
  data_nascimento: z.string().optional(),
  nacionalidade: z.string().optional(),
  profissao: z.string().optional(),

  // Pessoa Jurídica
  cnpj: z.string().optional(),
  razao_social: z.string().optional(),
  nome_fantasia: z.string().optional(),
  responsavel_nome: z.string().optional(),
  responsavel_cargo: z.string().optional(),
});

// Define o estado inicial unificado
const initialFormData = {
  // Básico
  nome: '',
  email: '',
  telefone: '',
  whatsapp: '',
  tipo: 'pessoa_fisica' as ClienteTipo,
  observacoes: '',

  // Classificação
  status: 'ativo' as ClienteStatus,
  nivel: 'bronze' as ClienteNivel,
  segmento: '',
  idioma_preferido: 'pt',
  moeda_preferida: 'EUR',

  // Pessoa Física
  cpf: '',
  passaporte: '',
  data_nascimento: '',
  nacionalidade: '',
  profissao: '',

  // Pessoa Jurídica
  cnpj: '',
  razao_social: '',
  nome_fantasia: '',
  responsavel_nome: '',
  responsavel_cargo: '',
};

export default function NovoClienteForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { handleSuccess, handleError } = useErrorHandler();

  // Usa o hook de validação
  const {
    values: formData,
    errors,
    handleChange,
    handleSubmit,
    setFormValues,
  } = useFormValidation({
    schema: clienteSchema,
    initialValues: initialFormData,
    mode: 'onBlur',
    onSubmit: async (data) => {
      // Converter estado para FormData
      const formDataToSend = new FormData();
      Object.keys(data).forEach((key) => {
        const value = data[key as keyof typeof data];
        if (value) {
          formDataToSend.append(key, String(value));
        }
      });

      startTransition(async () => {
        const result = await createClienteAction(formDataToSend);

        if (result.success) {
          handleSuccess(
            `Cliente ${result.data?.nome} criado com sucesso!`,
            { duration: 3000 }
          );

          // Redireciona para a página de detalhes do novo cliente
          setTimeout(() => {
            if (result.data?.id) {
              router.push(`/admin/clientes/${result.data.id}`);
            } else {
              router.push('/clientes');
            }
          }, 1500);
        } else {
          handleError(new Error(result.message || 'Erro ao criar cliente'), {
            context: 'Criar Cliente',
            userMessage: result.message,
          });
        }
      });
    },
  });

  const isPessoaFisica = useMemo(
    () => formData.tipo === 'pessoa_fisica',
    [formData.tipo]
  );

  // Handler especial para mudança de tipo (limpa campos)
  const handleTipoChange = (value: string) => {
    setFormValues({
      tipo: value as ClienteTipo,
      // Resetar campos não-aplicáveis
      cpf: '',
      passaporte: '',
      data_nascimento: '',
      nacionalidade: '',
      profissao: '',
      cnpj: '',
      razao_social: '',
      nome_fantasia: '',
      responsavel_nome: '',
      responsavel_cargo: '',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="p-8 space-y-8">
          {/* Seletor de Tipo */}
          <FormSection title="Tipo de Cliente">
            <div className="flex space-x-4">
              <label
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 transition-all ${
                  isPessoaFisica
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="pessoa_fisica"
                  checked={isPessoaFisica}
                  onChange={(e) => handleTipoChange(e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <User size={18} aria-hidden="true" /> Pessoa Física
              </label>
              <label
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer flex-1 transition-all ${
                  !isPessoaFisica
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="pessoa_juridica"
                  checked={!isPessoaFisica}
                  onChange={(e) => handleTipoChange(e.target.value)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <Building2 size={18} aria-hidden="true" /> Pessoa Jurídica
              </label>
            </div>
          </FormSection>

          {/* DADOS BÁSICOS */}
          <FormSection
            title="Informações de Contato"
            description="Dados principais para contato com o cliente"
          >
            <FormGrid columns={2}>
              {/* Nome */}
              <div className="md:col-span-2">
                <FormField
                  label={isPessoaFisica ? 'Nome Completo' : 'Nome Fantasia'}
                  name="nome"
                  required
                  error={errors.nome}
                  help="Nome usado para identificação do cliente"
                >
                  <Input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    placeholder={
                      isPessoaFisica ? 'Ex: João da Silva' : 'Ex: Agência XYZ'
                    }
                    error={!!errors.nome}
                    leftIcon={<User size={20} />}
                  />
                </FormField>
              </div>

              {/* Email */}
              <FormField
                label="E-mail"
                name="email"
                required
                error={errors.email}
              >
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="exemplo@email.com"
                  error={!!errors.email}
                  leftIcon={<Mail size={20} />}
                />
              </FormField>

              {/* Telefone */}
              <FormField label="Telefone" name="telefone" error={errors.telefone}>
                <Input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  placeholder="+55 (11) 99999-9999"
                  leftIcon={<Phone size={20} />}
                />
              </FormField>

              {/* WhatsApp */}
              <FormField label="WhatsApp" name="whatsapp" error={errors.whatsapp}>
                <Input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  placeholder="+55 (11) 99999-9999"
                  leftIcon={<Phone size={20} />}
                />
              </FormField>
            </FormGrid>
          </FormSection>

          {/* DADOS ESPECÍFICOS (PF/PJ) */}
          <FormSection
            title="Dados de Documentação"
            description={
              isPessoaFisica
                ? 'Documentos e informações pessoais'
                : 'Documentos e informações da empresa'
            }
          >
            <FormGrid columns={2}>
              {isPessoaFisica ? (
                <>
                  {/* PF: CPF */}
                  <FormField label="CPF" name="cpf" error={errors.cpf}>
                    <Input
                      type="text"
                      name="cpf"
                      value={formData.cpf}
                      onChange={(e) => handleChange('cpf', e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </FormField>

                  {/* PF: Passaporte */}
                  <FormField
                    label="Passaporte"
                    name="passaporte"
                    error={errors.passaporte}
                  >
                    <Input
                      type="text"
                      name="passaporte"
                      value={formData.passaporte}
                      onChange={(e) =>
                        handleChange('passaporte', e.target.value)
                      }
                      placeholder="AB123456"
                    />
                  </FormField>

                  {/* PF: Data de Nascimento */}
                  <FormField
                    label="Data de Nascimento"
                    name="data_nascimento"
                    error={errors.data_nascimento}
                  >
                    <Input
                      type="date"
                      name="data_nascimento"
                      value={formData.data_nascimento}
                      onChange={(e) =>
                        handleChange('data_nascimento', e.target.value)
                      }
                      leftIcon={<Calendar size={20} />}
                    />
                  </FormField>

                  {/* PF: Nacionalidade */}
                  <FormField
                    label="Nacionalidade"
                    name="nacionalidade"
                    error={errors.nacionalidade}
                  >
                    <SimpleSelect
                      name="nacionalidade"
                      value={formData.nacionalidade}
                      onChange={(e) =>
                        handleChange('nacionalidade', e.target.value)
                      }
                      placeholder="Selecione a nacionalidade..."
                      options={PAISES_E_NACIONALIDADES.map((p) => ({
                        value: p.gentilico,
                        label: `${p.gentilico} (${p.nome_pais})`,
                      }))}
                    />
                  </FormField>

                  {/* PF: Profissão */}
                  <FormField
                    label="Profissão"
                    name="profissao"
                    error={errors.profissao}
                  >
                    <SimpleSelect
                      name="profissao"
                      value={formData.profissao}
                      onChange={(e) =>
                        handleChange('profissao', e.target.value)
                      }
                      placeholder="Selecione a profissão..."
                      options={PROFISSOES.map((p) => ({
                        value: p,
                        label: p,
                      }))}
                    />
                  </FormField>
                </>
              ) : (
                <>
                  {/* PJ: Razão Social */}
                  <div className="md:col-span-2">
                    <FormField
                      label="Razão Social"
                      name="razao_social"
                      error={errors.razao_social}
                    >
                      <Input
                        type="text"
                        name="razao_social"
                        value={formData.razao_social}
                        onChange={(e) =>
                          handleChange('razao_social', e.target.value)
                        }
                        placeholder="Ex: Nomade Guru Viagens e Turismo Ltda"
                        leftIcon={<Building2 size={20} />}
                      />
                    </FormField>
                  </div>

                  {/* PJ: CNPJ */}
                  <FormField label="CNPJ" name="cnpj" error={errors.cnpj}>
                    <Input
                      type="text"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => handleChange('cnpj', e.target.value)}
                      placeholder="00.000.000/0000-00"
                    />
                  </FormField>

                  {/* PJ: Responsável */}
                  <FormField
                    label="Nome do Responsável"
                    name="responsavel_nome"
                    error={errors.responsavel_nome}
                  >
                    <Input
                      type="text"
                      name="responsavel_nome"
                      value={formData.responsavel_nome}
                      onChange={(e) =>
                        handleChange('responsavel_nome', e.target.value)
                      }
                      placeholder="Ex: Maria Santos"
                      leftIcon={<User size={20} />}
                    />
                  </FormField>

                  {/* PJ: Cargo do Responsável */}
                  <FormField
                    label="Cargo do Responsável"
                    name="responsavel_cargo"
                    error={errors.responsavel_cargo}
                  >
                    <Input
                      type="text"
                      name="responsavel_cargo"
                      value={formData.responsavel_cargo}
                      onChange={(e) =>
                        handleChange('responsavel_cargo', e.target.value)
                      }
                      placeholder="Ex: CEO"
                      leftIcon={<Briefcase size={20} />}
                    />
                  </FormField>
                </>
              )}
            </FormGrid>
          </FormSection>

          {/* CLASSIFICAÇÃO E PREFERÊNCIAS */}
          <FormSection
            title="Classificação e Preferências"
            description="Informações para segmentação e personalização do atendimento"
          >
            <FormGrid columns={3}>
              {/* Status */}
              <FormField label="Status" name="status" error={errors.status}>
                <SimpleSelect
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  options={STATUS_OPTIONS.map((opt) => ({
                    value: opt,
                    label: opt.charAt(0).toUpperCase() + opt.slice(1),
                  }))}
                />
              </FormField>

              {/* Nível */}
              <FormField label="Nível" name="nivel" error={errors.nivel}>
                <SimpleSelect
                  name="nivel"
                  value={formData.nivel}
                  onChange={(e) => handleChange('nivel', e.target.value)}
                  options={NIVEL_OPTIONS.map((opt) => ({
                    value: opt,
                    label: opt.charAt(0).toUpperCase() + opt.slice(1),
                  }))}
                />
              </FormField>

              {/* Segmento */}
              <FormField
                label="Segmento"
                name="segmento"
                error={errors.segmento}
              >
                <SimpleSelect
                  name="segmento"
                  value={formData.segmento}
                  onChange={(e) => handleChange('segmento', e.target.value)}
                  placeholder="(Não definido)"
                  options={SEGMENTO_OPTIONS.map((opt) => ({
                    value: opt,
                    label: opt.charAt(0).toUpperCase() + opt.slice(1),
                  }))}
                />
              </FormField>

              {/* Idioma */}
              <FormField
                label="Idioma Preferido"
                name="idioma_preferido"
                error={errors.idioma_preferido}
              >
                <SimpleSelect
                  name="idioma_preferido"
                  value={formData.idioma_preferido}
                  onChange={(e) =>
                    handleChange('idioma_preferido', e.target.value)
                  }
                  options={[
                    { value: 'pt', label: 'Português' },
                    { value: 'en', label: 'Inglês' },
                    { value: 'es', label: 'Espanhol' },
                  ]}
                  leftIcon={<Globe size={20} />}
                />
              </FormField>

              {/* Moeda */}
              <FormField
                label="Moeda Preferida"
                name="moeda_preferida"
                error={errors.moeda_preferida}
              >
                <SimpleSelect
                  name="moeda_preferida"
                  value={formData.moeda_preferida}
                  onChange={(e) =>
                    handleChange('moeda_preferida', e.target.value)
                  }
                  options={[
                    { value: 'EUR', label: 'Euro (€)' },
                    { value: 'BRL', label: 'Real (R$)' },
                    { value: 'USD', label: 'Dólar ($)' },
                  ]}
                />
              </FormField>
            </FormGrid>
          </FormSection>

          {/* Observações */}
          <FormSection
            title="Observações"
            description="Notas internas sobre o cliente"
          >
            <FormField
              label="Observações Internas"
              name="observacoes"
              error={errors.observacoes}
              help="Histórico de leads, preferências, informações relevantes"
            >
              <Textarea
                name="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  handleChange('observacoes', e.target.value)
                }
                rows={4}
                placeholder="Notas internas sobre o cliente, histórico de leads, etc."
                maxLength={1000}
                showCharCount
              />
            </FormField>
          </FormSection>

          {/* Botão de Submit */}
          <FormActions align="right">
            <button
              type="submit"
              disabled={isPending || !formData.nome || !formData.email}
              className="flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-w-[200px]"
            >
              {isPending && <Loader2 className="animate-spin" size={20} />}
              {isPending ? 'Criando Cliente...' : 'Adicionar Cliente'}
            </button>
          </FormActions>
        </div>
      </form>
    </div>
  );
}
