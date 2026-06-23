import { listB2BPartners } from "./actions";
import PartnersClient from "./PartnersClient";

export const dynamic = "force-dynamic";

export default async function ParceirosPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = typeof searchParams?.q === "string" ? searchParams.q : undefined;

  const partners = await listB2BPartners(query);

  return <PartnersClient initialPartners={partners} query={query} />;
}
