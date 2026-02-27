import type { HeroConfig } from '@noro/types/blueprint';
import { ButtonVariant, HeroVariant } from '@noro/types/blueprint';

interface HeroSectionProps {
    config: HeroConfig;
    primaryColor: string;
}

export function HeroSection({ config, primaryColor }: HeroSectionProps) {
    const variant = config.variant || HeroVariant.CENTERED;

    // --- Variant: IMMERSIVE ---
    if (variant === HeroVariant.IMMERSIVE) {
        return (
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                padding: '120px 20px',
                backgroundImage: config.backgroundImage?.url ? `url(${config.backgroundImage.url})` : undefined,
                backgroundColor: config.backgroundImage?.url ? undefined : primaryColor,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#FFFFFF',
            }}>
                {/* Dark Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                    zIndex: 0,
                }} />

                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    maxWidth: '1000px',
                    textAlign: 'center',
                }}>
                    <h1 style={{
                        fontSize: 'clamp(3rem, 6vw, 5rem)',
                        fontWeight: '900',
                        marginBottom: '1.5rem',
                        lineHeight: '1.1',
                        textShadow: '0 4px 30px rgba(0,0,0,0.5)',
                        letterSpacing: '-0.02em',
                    }}>
                        {config.title}
                    </h1>
                    {config.subtitle && (
                        <p style={{
                            fontSize: '1.5rem',
                            fontWeight: '400',
                            marginBottom: '2.5rem',
                            opacity: 0.9,
                            maxWidth: '800px',
                            margin: '0 auto 2.5rem',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                        }}>
                            {config.subtitle}
                        </p>
                    )}
                    {renderButtons(config.buttons, primaryColor, true)}
                </div>
            </section>
        );
    }

    // --- Variant: SPLIT ---
    if (variant === HeroVariant.SPLIT) {
        return (
            <section style={{
                minHeight: '600px',
                display: 'flex',
                alignItems: 'center',
                padding: '80px 0',
                background: '#FFFFFF',
                overflow: 'hidden',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '4rem',
                    alignItems: 'center',
                }}>
                    <div style={{ order: config.alignment === 'right' ? 2 : 1 }}>
                        <h1 style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: '800',
                            marginBottom: '1.5rem',
                            lineHeight: '1.1',
                            color: '#111827',
                            letterSpacing: '-0.02em',
                        }}>
                            {config.title}
                        </h1>
                        {config.subtitle && (
                            <p style={{
                                fontSize: '1.25rem',
                                color: '#4B5563',
                                marginBottom: '2rem',
                                lineHeight: '1.6',
                            }}>
                                {config.subtitle}
                            </p>
                        )}
                        {renderButtons(config.buttons, primaryColor, false)}
                    </div>
                    <div style={{
                        order: config.alignment === 'right' ? 1 : 2,
                        position: 'relative',
                        height: '100%',
                        minHeight: '400px',
                    }}>
                        {config.backgroundImage?.url ? (
                            <img
                                src={config.backgroundImage.url}
                                alt={config.backgroundImage.alt || config.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '24px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                }}
                            />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(135deg, ${primaryColor}10 0%, ${primaryColor}30 100%)`,
                                borderRadius: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <span style={{ fontSize: '4rem', opacity: 0.2 }}>🖼️</span>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }

    // --- Variant: CENTERED (Default) ---
    return (
        <section style={{
            minHeight: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '120px 20px',
            background: config.backgroundImage?.url
                ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${config.backgroundImage.url})`
                : `linear-gradient(135deg, ${primaryColor}05 0%, ${primaryColor}15 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textAlign: 'center',
        }}>
            <div style={{
                maxWidth: '900px',
                width: '100%',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                    fontWeight: '800',
                    marginBottom: '1.5rem',
                    lineHeight: '1.2',
                    color: config.backgroundImage?.url ? '#FFFFFF' : '#1F2937',
                    textShadow: config.backgroundImage?.url ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
                }}>
                    {config.title}
                </h1>

                {config.subtitle && (
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                        fontWeight: '400',
                        marginBottom: '2.5rem',
                        lineHeight: '1.6',
                        color: config.backgroundImage?.url ? '#F3F4F6' : '#4B5563',
                        maxWidth: '800px',
                        margin: '0 auto 2.5rem',
                    }}>
                        {config.subtitle}
                    </h2>
                )}

                {renderButtons(config.buttons, primaryColor, !!config.backgroundImage?.url)}
            </div>
        </section>
    );
}

// Helper to render buttons consistently across variants
function renderButtons(buttons: HeroConfig['buttons'], primaryColor: string, isDarkBackground: boolean) {
    if (!buttons || buttons.length === 0) return null;

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'inherit',
        }}>
            {buttons.map((button, index) => {
                const isPrimary = button.variant === ButtonVariant.PRIMARY;
                return (
                    <a
                        key={index}
                        href={button.url}
                        target={button.openInNewTab ? '_blank' : undefined}
                        rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
                        style={{
                            padding: '16px 32px',
                            borderRadius: '50px',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: isPrimary ? primaryColor : (isDarkBackground ? 'rgba(255,255,255,0.1)' : 'transparent'),
                            color: isPrimary ? '#FFFFFF' : (isDarkBackground ? '#FFFFFF' : primaryColor),
                            border: isPrimary ? 'none' : `2px solid ${isDarkBackground ? '#FFFFFF' : primaryColor}`,
                            backdropFilter: !isPrimary && isDarkBackground ? 'blur(10px)' : 'none',
                            boxShadow: isPrimary ? '0 4px 14px rgba(0,0,0,0.2)' : 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = isPrimary ? '0 4px 14px rgba(0,0,0,0.2)' : 'none';
                        }}
                    >
                        {button.text}
                    </a>
                );
            })}
        </div>
    );
}
