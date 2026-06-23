import { notFound } from 'next/navigation';
import { createDatabaseClient } from '@noro/db';
import PreviewClient from './PreviewClient';

export const dynamic = 'force-dynamic';

export default async function PreviewPage({
    params,
}: {
    params: { id: string };
}) {
    const { client, close } = createDatabaseClient();
    let siteData: any = null;
    let dbError: string | null = null;

    try {
        const rows = await client`
            SELECT id, slug, name, blueprint_data
            FROM sites.agency_sites
            WHERE id = ${params.id}
            LIMIT 1
        `;
        if (rows && rows.length > 0) {
            siteData = rows[0];
        }
    } catch (error: any) {
        console.error('Error fetching preview site:', error);
        dbError = error.message || 'Erro de banco de dados';
    } finally {
        await close();
    }

    if (dbError) {
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
                    <p>{dbError}</p>
                </div>
            </div>
        );
    }

    if (!siteData) {
        notFound();
    }

    return <PreviewClient siteData={siteData} />;
}
