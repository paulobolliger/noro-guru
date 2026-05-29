import { and, asc, eq } from 'drizzle-orm';
import { pricingRules, type PricingRuleEscopo, type PricingRuleTipo } from '../schema';
import type { NoroDatabase } from '../index';

export type CreatePricingRuleInput = {
  nome: string;
  escopo: PricingRuleEscopo;
  tenantId?: string | null;
  categoria?: string | null;
  planId?: string | null;
  canal?: string | null;
  tipoRegra: PricingRuleTipo;
  valor: string;
  moeda?: string;
  prioridade?: number;
  ativo?: boolean;
};

export type UpdatePricingRuleInput = Partial<CreatePricingRuleInput>;

export async function createPricingRule(db: NoroDatabase, input: CreatePricingRuleInput) {
  const [created] = await db.insert(pricingRules).values(input).returning();
  return created ?? null;
}

export async function getPricingRuleById(db: NoroDatabase, ruleId: string) {
  return db.query.pricingRules.findFirst({
    where: eq(pricingRules.id, ruleId),
  });
}

export async function getPricingRulesByEscopo(
  db: NoroDatabase,
  escopo: PricingRuleEscopo,
  tenantId?: string,
) {
  const conditions = [eq(pricingRules.escopo, escopo), eq(pricingRules.ativo, true)];
  if (escopo === 'tenant' && tenantId) {
    conditions.push(eq(pricingRules.tenantId, tenantId));
  }

  return db.query.pricingRules.findMany({
    where: and(...conditions),
    orderBy: [asc(pricingRules.prioridade), asc(pricingRules.createdAt)],
  });
}

export async function getAllActivePricingRules(db: NoroDatabase, tenantId?: string) {
  // Retorna regras de plataforma + regras do tenant, ordenadas por prioridade
  const conditions = [eq(pricingRules.ativo, true)];

  if (tenantId) {
    // plataforma ou do tenant específico
    const { or } = await import('drizzle-orm');
    const tenantCondition = or(
      eq(pricingRules.escopo, 'plataforma'),
      and(eq(pricingRules.escopo, 'tenant'), eq(pricingRules.tenantId, tenantId)),
    );
    if (tenantCondition) conditions.push(tenantCondition);
  } else {
    conditions.push(eq(pricingRules.escopo, 'plataforma'));
  }

  return db.query.pricingRules.findMany({
    where: and(...conditions),
    orderBy: [asc(pricingRules.prioridade), asc(pricingRules.createdAt)],
  });
}

export async function updatePricingRule(
  db: NoroDatabase,
  ruleId: string,
  input: UpdatePricingRuleInput,
) {
  const [updated] = await db
    .update(pricingRules)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(pricingRules.id, ruleId))
    .returning();
  return updated ?? null;
}

export async function deletePricingRule(db: NoroDatabase, ruleId: string) {
  const [deleted] = await db
    .delete(pricingRules)
    .where(eq(pricingRules.id, ruleId))
    .returning();
  return deleted ?? null;
}
