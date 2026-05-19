'use client';

import type { ContentConfig } from '@noro/types/blueprint';

interface ContentSectionProps {
    config: ContentConfig;
    primaryColor: string;
}

export function ContentSection({ config, primaryColor }: ContentSectionProps) {
    const isReversed = config.imagePosition === 'left';

    return (
        <section style={{
            padding: '100px 20px',
            backgroundColor: '#FFFFFF',
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: config.image ? '1fr 1fr' : '1fr',
                gap: '4rem',
                alignItems: 'center',
                flexDirection: isReversed ? 'row-reverse' : 'row',
            }}>
                <div style={{ order: isReversed ? 2 : 1 }}>
                    {config.title && (
                        <h2 style={{
                            fontSize: 'clamp(2rem, 3.5vw, 2.75rem)',
                            marginBottom: '1.5rem',
                            fontWeight: '800',
                            color: '#1F2937',
                            lineHeight: '1.2',
                        }}>
                            {config.title}
                        </h2>
                    )}

                    <div style={{
                        fontSize: '1.125rem',
                        lineHeight: '1.9',
                        color: '#4B5563',
                    }}>
                        {Array.isArray(config.content) ? (
                            config.content.map((paragraph, index) => (
                                <p key={index} style={{ marginBottom: '1.5rem' }}>
                                    {paragraph}
                                </p>
                            ))
                        ) : (
                            <p>{config.content}</p>
                        )}
                    </div>

                </div>

                {config.image && (
                    <div style={{ order: isReversed ? 1 : 2 }}>
                        <img
                            src={config.image.url}
                            alt={config.image.alt}
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '20px',
                                boxShadow: `0 20px 60px ${primaryColor}15, 0 8px 20px rgba(0,0,0,0.1)`,
                            }}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}
