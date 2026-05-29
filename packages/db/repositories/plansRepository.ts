import { asc, eq } from 'drizzle-orm';
import { planModules, plans, type PlanKey } from '../schema';
import type { NoroDatabase } from '../index';

export async function getPlanByKey(db: NoroDatabase, key: PlanKey) {
  return db.query.plans.findFirst({
    where: eq(plans.key, key),
  });
}

export async function getPlanById(db: NoroDatabase, planId: string) {
  return db.query.plans.findFirst({
    where: eq(plans.id, planId),
  });
}

export async function listPlans(db: NoroDatabase) {
  return db.query.plans.findMany({
    orderBy: [asc(plans.key)],
  });
}

export async function listPlanModules(db: NoroDatabase, planId: string) {
  return db.query.planModules.findMany({
    where: eq(planModules.planId, planId),
    with: {
      module: true,
    },
  });
}

export async function getPlanDefaults(db: NoroDatabase, planId: string) {
  const plan = await getPlanById(db, planId);
  const modulesForPlan = await listPlanModules(db, planId);

  return {
    plan,
    modules: modulesForPlan,
  };
}
