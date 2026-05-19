import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import PreviewClient from './PreviewClient';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({
    params,
}: {
    params: { id: string };
}) {
    // Create client inside the function so env vars are read at request time
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: siteData, error } = await supabase
        .from('sites')
        .select('id, slug, name, blueprint_data')
        .eq('id', params.id)
        .single();

    if (error) {
        return (
            <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{
                    maxWidth: '500px',
                    margin: '0 auto',
                    padding: '2rem',
                    backgroundColor: '#FEE2E2',
                    borderRadius: '12px',
                    border: '2px solid #FCA5A5',
                    color: '#991B1B',
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Erro ao carregar preview</h2>
                    <p>{error.message}</p>
                </div>
            </div>
        );
    }

    if (!siteData) {
        notFound();
    }

    return <PreviewClient siteData={siteData} />;
}
