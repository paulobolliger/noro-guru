import type { FeaturesConfig } from '@noro/types/blueprint';
import { FeaturesVariant } from '@noro/types/blueprint';

interface FeaturesSectionProps {
    config: FeaturesConfig;
    primaryColor: string;
}

export function FeaturesSection({ config, primaryColor }: FeaturesSectionProps) {
    const variant = config.variant || FeaturesVariant.GRID;

    // --- Variant: LIST ---
    if (variant === FeaturesVariant.LIST) {
        return (
            <section style={{ padding: '100px 20px', backgroundColor: '#F3F4F6' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {renderHeader(config)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {config.items.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '2rem',
                                padding: '2rem',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            }}>
                                <div style={{
                                    flexShrink: 0,
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '12px',
                                    backgroundColor: `${primaryColor}15`,
                                    color: primaryColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                }}>
                                    {item.icon || '✨'}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111827' }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ fontSize: '1.125rem', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // --- Variant: BENTO (Simulated with Grid) ---
    if (variant === FeaturesVariant.BENTO) {
        return (
            <section style={{ padding: '100px 20px', backgroundColor: '#000000', color: '#FFFFFF' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {renderHeader(config, true)}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        gridAutoRows: 'minmax(250px, auto)',
                    }}>
                        {config.items.map((item, index) => {
                            // Make some items span 2 columns/rows for "Bento" feel based on index
                            const isLarge = index === 0 || index === 3;
                            return (
                                <div key={item.id} style={{
                                    gridColumn: isLarge ? 'span 2' : 'span 1',
                                    gridRow: isLarge ? 'span 2' : 'span 1',
                                    backgroundColor: '#111111',
                                    borderRadius: '24px',
                                    padding: '2.5rem',
                                    border: '1px solid #333',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0, right: 0,
                                        width: '100px', height: '100px',
                                        background: `radial-gradient(circle at top right, ${primaryColor}40, transparent)`,
                                        filter: 'blur(40px)',
                                    }} />
                                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: isLarge ? '2rem' : '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#FFFFFF' }}>
                                            {item.title}
                                        </h3>
                                        <p style={{ fontSize: '1rem', color: '#9CA3AF', lineHeight: '1.6', margin: 0 }}>
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }

    // --- Variant: GRID (Default) ---
    return (
        <section style={{
            padding: '100px 20px',
            backgroundColor: '#F9FAFB',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {renderHeader(config)}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(auto-fit, minmax(${config.columns === 4 ? '250px' : config.columns === 3 ? '300px' : '350px'}, 1fr))`,
                    gap: '2rem',
                }}>
                    {config.items.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '16px',
                                padding: '2.5rem',
                                textAlign: 'center',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'default',
                                border: '1px solid #E5E7EB',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-8px)';
                                e.currentTarget.style.boxShadow = `0 12px 32px ${primaryColor}20, 0 4px 8px rgba(0,0,0,0.08)`;
                                e.currentTarget.style.borderColor = `${primaryColor}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = '#E5E7EB';
                            }}
                        >
                            {item.icon && (
                                <div style={{
                                    fontSize: '3.5rem',
                                    marginBottom: '1.5rem',
                                    filter: `drop-shadow(0 4px 8px ${primaryColor}20)`,
                                }}>
                                    {item.icon}
                                </div>
                            )}

                            {item.image && (
                                <img
                                    src={item.image.url}
                                    alt={item.image.alt}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        marginBottom: '1.5rem',
                                    }}
                                />
                            )}

                            <h3 style={{
                                fontSize: '1.5rem',
                                marginBottom: '1rem',
                                fontWeight: '700',
                                color: primaryColor,
                                lineHeight: '1.3',
                            }}>
                                {item.title}
                            </h3>

                            <p style={{
                                fontSize: '1rem',
                                color: '#6B7280',
                                lineHeight: '1.8',
                                margin: 0,
                            }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section >
    );
}

function renderHeader(config: FeaturesConfig, dark = false) {
    if (!config.title && !config.subtitle) return null;
    return (
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
            {config.title && (
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    marginBottom: '1rem',
                    fontWeight: '800',
                    color: dark ? '#FFFFFF' : '#1F2937',
                }}>
                    {config.title}
                </h2>
            )}
            {config.subtitle && (
                <p style={{
                    fontSize: '1.25rem',
                    color: dark ? '#9CA3AF' : '#6B7280',
                    maxWidth: '700px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                }}>
                    {config.subtitle}
                </p>
            )}
        </div>
    );
}
