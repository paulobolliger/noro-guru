import { eq, desc, or, ilike } from 'drizzle-orm';
import { visaInfo } from '../schema';
import type { NoroDatabase } from '../index';

export async function getVisaInfoByCountryCode(db: NoroDatabase, countryCode: string) {
  return db.query.visaInfo.findFirst({
    where: eq(visaInfo.countryCode, countryCode.toUpperCase()),
  });
}

export async function searchVisaInfo(db: NoroDatabase, query: string) {
  const cleanQuery = query.trim();
  return db.query.visaInfo.findFirst({
    where: or(
      ilike(visaInfo.country, `%${cleanQuery}%`),
      ilike(visaInfo.slug, `%${cleanQuery}%`),
      eq(visaInfo.countryCode, cleanQuery.toUpperCase())
    ),
  });
}

export async function listPopularVisaCountries(db: NoroDatabase, limit = 10) {
  return db.query.visaInfo.findMany({
    orderBy: [desc(visaInfo.priorityLevel), visaInfo.country],
    limit,
  });
}
