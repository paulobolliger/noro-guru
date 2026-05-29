import { boolean, index, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const supplierTipoValues = [
  'agencia_receptiva',
  'hotel',
  'operadora',
  'transporte',
  'seguradora',
  'outro',
] as const;

export const supplierApiTipoValues = [
  'manual',
  'hotelbeds',
  'amadeus',
  'outro',
] as const;

export const supplierStatusValues = ['ativo', 'inativo', 'suspenso'] as const;

export type SupplierTipo = (typeof supplierTipoValues)[number];
export type SupplierApiTipo = (typeof supplierApiTipoValues)[number];
export type SupplierStatus = (typeof supplierStatusValues)[number];

export const suppliers = noro.table(
  'suppliers',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    nome: text('nome').notNull(),
    tipo: text('tipo').$type<SupplierTipo>(),
    cnpj: text('cnpj'),
    website: text('website'),
    pais: text('pais'),
    cidade: text('cidade'),

    contatoNome: text('contato_nome'),
    contatoEmail: text('contato_email'),
    contatoPhone: text('contato_phone'),
    contatoWhatsapp: text('contato_whatsapp'),

    observacoes: text('observacoes'),

    // Integração API
    apiTipo: text('api_tipo').$type<SupplierApiTipo>().default('manual'),
    apiAtivo: boolean('api_ativo').default(false),

    status: text('status').$type<SupplierStatus>().notNull().default('ativo'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('suppliers_status_idx').on(table.status),
    index('suppliers_tipo_idx').on(table.tipo),
    index('suppliers_api_tipo_idx').on(table.apiTipo),
  ],
);
