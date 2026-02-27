'use client';

import type { CtaConfig } from '@noro/types/blueprint';
import { ButtonVariant } from '@noro/types/blueprint';

interface CtaSectionProps {
    config: CtaConfig;
    primaryColor: string;
}

export function CtaSection({ config, primaryColor }: CtaSectionProps) {
    return (
        <section style={{
            padding: '100px 20px',
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                filter: 'blur(80px)',
            }} />

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1,
            }}>
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    marginBottom: '1.5rem',
                    fontWeight: '800',
                    lineHeight: '1.2',
                }}>
                    {config.title}
                </h2>

                {config.description && (
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '3rem',
                        opacity: 0.95,
                        lineHeight: '1.8',
                        maxWidth: '600px',
                        margin: '0 auto 3rem',
                    }}>
                        {config.description}
                    </p>
                )}

                {config.buttons.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        justifyContent: 'center',
                    }}>
                        {config.buttons.map((button, index) => (
                            <a
                                key={index}
                                href={button.url}
                                target={button.openInNewTab ? '_blank' : undefined}
                                rel={button.openInNewTab ? 'noopener noreferrer' : undefined}
                                style={{
                                    padding: '18px 40px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    fontSize: '1.125rem',
                                    fontWeight: '700',
                                    display: 'inline-block',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: button.variant === ButtonVariant.PRIMARY || button.variant === ButtonVariant.SECONDARY
                                        ? '#FFFFFF'
                                        : 'transparent',
                                    color: button.variant === ButtonVariant.PRIMARY || button.variant === ButtonVariant.SECONDARY
                                        ? primaryColor
                                        : '#FFFFFF',
                                    border: button.variant === ButtonVariant.OUTLINE
                                        ? '3px solid #FFFFFF'
                                        : 'none',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                                }}
                            >
                                {button.text}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
