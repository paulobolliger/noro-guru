import { notFound } from 'next/navigation';
import { getSiteBySlug } from '@/lib/get-site';
import { BlueprintRenderer } from '@noro/renderer';

export default async function SitePage({
    params,
}: {
    params: { slug: string };
}) {
    const site = await getSiteBySlug(params.slug);

    if (!site) {
        notFound();
    }

    return <BlueprintRenderer blueprint={site.blueprint_data} />;
}
