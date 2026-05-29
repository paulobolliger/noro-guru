import { bigint, boolean, date, index, integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { users } from './users';

export const clientTipoValues = ['pessoa_fisica', 'pessoa_juridica'] as const;
export const clientGeneroValues = ['masculino', 'feminino', 'outro', 'nao_informado'] as const;
export const clientStatusValues = ['ativo', 'inativo', 'vip', 'bloqueado', 'prospecto'] as const;
export const clientNivelValues = ['standard', 'silver', 'gold', 'platinum'] as const;
export const clientSegmentoValues = ['lazer', 'corporativo', 'grupos', 'incentivo'] as const;
export const clientNivelMobilidadeValues = ['sem_restricao', 'mobilidade_reduzida', 'cadeirante'] as const;
export const clientTipoAcomodacaoPrefValues = [
  'hotel', 'pousada', 'resort', 'all_inclusive', 'hostel',
] as const;
export const clientClasseVooPrefValues = ['economica', 'executiva', 'primeira'] as const;

export type ClientTipo = (typeof clientTipoValues)[number];
export type ClientStatus = (typeof clientStatusValues)[number];
export type ClientNivel = (typeof clientNivelValues)[number];
export type ClientSegmento = (typeof clientSegmentoValues)[number];

export const clients = noro.table(
  'clients',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    // FK lógica para noro.leads — sem .references() para evitar dependência circular
    leadId: uuid('lead_id'),

    // PESSOA FÍSICA / JURÍDICA
    tipo: text('tipo').$type<ClientTipo>().notNull(),
    nome: text('nome').notNull(),
    nomePreferido: text('nome_preferido'),
    cpf: text('cpf'),
    cnpj: text('cnpj'),
    dataNascimento: date('data_nascimento'),
    genero: text('genero'),
    nacionalidade: text('nacionalidade').notNull().default('brasileira'),

    // CONTATO
    email: text('email'),
    phone: text('phone'),
    whatsapp: text('whatsapp'),
    enderecoCidade: text('endereco_cidade'),
    enderecoEstado: text('endereco_estado'),
    enderecoPais: text('endereco_pais').default('Brasil'),

    // DOCUMENTOS DE VIAGEM
    passaporteNumero: text('passaporte_numero'),
    passaportePais: text('passaporte_pais'),
    passaporteValidade: date('passaporte_validade'),
    passaporteDocUrl: text('passaporte_doc_url'),
    rg: text('rg'),
    cnhNumero: text('cnh_numero'),
    cnhValidade: date('cnh_validade'),
    cnhCategorias: text('cnh_categorias').array(),

    // SAÚDE E RESTRIÇÕES
    restricoesAlimentares: text('restricoes_alimentares').array(),
    restricoesMedicas: text('restricoes_medicas'),
    nivelMobilidade: text('nivel_mobilidade'),
    aptoAtividadeFisica: boolean('apto_atividade_fisica'),

    // RELACIONAMENTO COMERCIAL
    status: text('status').$type<ClientStatus>().notNull().default('ativo'),
    nivel: text('nivel').$type<ClientNivel>(),
    segmento: text('segmento').$type<ClientSegmento>(),
    assignedTo: uuid('assigned_to').references(() => users.id),

    // HISTÓRICO FINANCEIRO (calculado por automação)
    totalViagens: integer('total_viagens').default(0),
    totalGastoCents: bigint('total_gasto_cents', { mode: 'number' }).default(0),
    ultimaViagemAt: date('ultima_viagem_at'),
    proximaViagemAt: date('proxima_viagem_at'),

    // PREFERÊNCIAS DE VIAGEM
    destinosVisitados: text('destinos_visitados').array(),
    destinosDesejados: text('destinos_desejados').array(),
    tipoAcomodacaoPref: text('tipo_acomodacao_pref'),
    classeVooPref: text('classe_voo_pref'),
    viajacom: text('viaja_com').array(),

    // EMERGÊNCIA
    contatoEmergenciaNome: text('contato_emergencia_nome'),
    contatoEmergenciaPhone: text('contato_emergencia_phone'),
    contatoEmergenciaParentesco: text('contato_emergencia_parentesco'),

    // LGPD
    lgpdAceito: boolean('lgpd_aceito').notNull().default(false),
    lgpdAceitoAt: timestamp('lgpd_aceito_at', { withTimezone: true }),
    lgpdVersao: text('lgpd_versao'),

    // TEMPORAIS
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    observacoes: text('observacoes'),
  },
  (table) => [
    index('clients_tenant_id_idx').on(table.tenantId),
    index('clients_status_idx').on(table.status),
    index('clients_assigned_to_idx').on(table.assignedTo),
    index('clients_email_idx').on(table.email),
    index('clients_created_at_idx').on(table.createdAt),
  ],
);
