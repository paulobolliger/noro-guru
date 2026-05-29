import { asc, eq, ne } from 'drizzle-orm';
import { modules, type ModuleKey } from '../schema';
import type { NoroDatabase } from '../index';

export async function getModuleByKey(db: NoroDatabase, key: ModuleKey) {
  return db.query.modules.findFirst({
    where: eq(modules.key, key),
  });
}

export async function listModules(db: NoroDatabase) {
  return db.query.modules.findMany({
    orderBy: [asc(modules.key)],
  });
}

export async function listAvailableModules(db: NoroDatabase) {
  return db.query.modules.findMany({
    where: ne(modules.status, 'future'),
    orderBy: [asc(modules.key)],
  });
}

export async function isModuleAvailable(db: NoroDatabase, key: ModuleKey) {
  const module = await getModuleByKey(db, key);
  return Boolean(module && module.status === 'active');
}
