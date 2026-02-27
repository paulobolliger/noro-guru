'use client';

import { BlueprintRenderer } from '@noro/renderer';
import type { Blueprint } from '@noro/types/blueprint';

interface PreviewClientProps {
    siteData: {
        id: string;
        slug: string;
        name: string;
        blueprint_data: any;
    };
}

export default function PreviewClient({ siteData }: PreviewClientProps) {
    const publicUrl = `http://localhost:3001/${siteData.slug}`;

    return (
        <div>
            {/* Modern Preview Banner */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '1.25rem 2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                borderBottom: '3px solid rgba(255,255,255,0.2)',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            backdropFilter: 'blur(10px)',
                        }}>
                            👁️
                        </div>
                        <div>
                            <p style={{
                                margin: 0,
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                color: '#FFFFFF',
                                letterSpacing: '-0.02em',
                            }}>
                                Modo Preview
                            </p>
                            <p style={{
                                margin: 0,
                                fontSize: '0.875rem',
                                color: 'rgba(255,255,255,0.85)',
                            }}>
                                {siteData.name || 'Site em visualização'}
                            </p>
                        </div>
                    </div>

                    <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1.75rem',
                            borderRadius: '10px',
                            background: '#FFFFFF',
                            color: '#667eea',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            border: 'none',
                        }}
                    >
                        <span>🌐</span>
                        <span>Ver Site Público</span>
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Rendered Site */}
            <BlueprintRenderer blueprint={siteData.blueprint_data as Blueprint} />
        </div>
    );
}
