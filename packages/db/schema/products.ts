import { boolean, index, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { suppliers } from './suppliers';

export const productCategoriaValues = [
  'hospedagem',
  'aereo',
  'transfer',
  'passeio',
  'ingresso',
  'cruzeiro',
  'seguro',
  'servico',
  'outro',
] as const;

export const productPrecoTipoValues = [
  'manual',
  'api_tempo_real',
  'api_cache',
] as const;

export const productStatusValues = ['ativo', 'inativo', 'arquivado'] as const;

export const productMoedaValues = ['BRL', 'USD', 'EUR', 'ARS'] as const;

export type ProductCategoria = (typeof productCategoriaValues)[number];
export type ProductPrecoTipo = (typeof productPrecoTipoValues)[number];
export type ProductStatus = (typeof productStatusValues)[number];
export type ProductMoeda = (typeof productMoedaValues)[number];

export const products = noro.table(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    // FK lógica — null para produtos sem fornecedor formal
    supplierId: uuid('supplier_id').references(() => suppliers.id),

    categoria: text('categoria').$type<ProductCategoria>().notNull(),
    nome: text('nome').notNull(),
    descricao: text('descricao'),

    // Localização
    destinoPais: text('destino_pais'),
    destinoCidade: text('destino_cidade'),
    destinoRegiao: text('destino_regiao'),

    // Operacional
    duracaoMinutos: integer('duracao_minutos'),
    capacidadeMin: integer('capacidade_min'),
    capacidadeMax: integer('capacidade_max'),
    incluiIngresso: boolean('inclui_ingresso'),
    incluiTransfer: boolean('inclui_transfer'),

    // Financeiro — moeda original; custo fica no snapshot da booking
    moeda: text('moeda').$type<ProductMoeda>().notNull().default('BRL'),
    precoTipo: text('preco_tipo').$type<ProductPrecoTipo>().notNull(),

    // Controle
    status: text('status').$type<ProductStatus>().notNull().default('ativo'),
    tags: text('tags').array(),
    observacoesInternas: text('observacoes_internas'),
    precoAtualizadoAt: timestamp('preco_atualizado_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('products_categoria_idx').on(table.categoria),
    index('products_status_idx').on(table.status),
    index('products_supplier_id_idx').on(table.supplierId),
    index('products_preco_tipo_idx').on(table.precoTipo),
    index('products_moeda_idx').on(table.moeda),
  ],
);
