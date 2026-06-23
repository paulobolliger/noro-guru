import { listVisaRules } from "./actions";
import VisaCatalogClient from "./VisaCatalogClient";

export const dynamic = "force-dynamic";

export default async function VistosPage({
  searchParams,
}: {
  searchParams?: { q?: string; continent?: string };
}) {
  const query = typeof searchParams?.q === "string" ? searchParams.q : undefined;
  const continent = typeof searchParams?.continent === "string" ? searchParams.continent : undefined;

  const rules = await listVisaRules(query, continent);

  return (
    <VisaCatalogClient
      initialRules={rules}
      query={query}
      continent={continent}
    />
  );
}
