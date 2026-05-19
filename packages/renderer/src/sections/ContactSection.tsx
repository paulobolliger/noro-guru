'use client';

import type { ContactConfig } from '@noro/types/blueprint';

interface ContactSectionProps {
    config: ContactConfig;
    primaryColor: string;
}

export function ContactSection({ config, primaryColor }: ContactSectionProps) {
    const whatsappNumber = config.phone ? config.phone.replace(/\D/g, '') : '';
    const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';

    return (
        <section style={{
            padding: '100px 20px',
            backgroundColor: '#F9FAFB',
            textAlign: 'center',
        }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {config.title && (
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        marginBottom: '1rem',
                        fontWeight: '800',
                        color: '#1F2937',
                    }}>
                        {config.title}
                    </h2>
                )}

                {config.subtitle && (
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '3rem',
                        color: '#6B7280',
                        lineHeight: '1.8',
                    }}>
                        {config.subtitle}
                    </p>
                )}

                {config.phone && (
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '20px 48px',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            backgroundColor: '#25D366',
                            color: '#FFFFFF',
                            boxShadow: '0 10px 30px rgba(37, 211, 102, 0.35)',
                            cursor: 'pointer',
                        }}
                    >
                        Falar no WhatsApp
                    </a>
                )}

                {config.email && (
                    <a
                        href={`mailto:${config.email}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '20px 48px',
                            borderRadius: '16px',
                            textDecoration: 'none',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            backgroundColor: primaryColor,
                            color: '#FFFFFF',
                        }}
                    >
                        📧 {config.email}
                    </a>
                )}

                {config.showContactForm && (
                    <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" placeholder="Seu nome" style={{ padding: '16px', borderRadius: '12px', border: '2px solid #E5E7EB', fontSize: '1rem' }} />
                            <input type="email" placeholder="Seu email" style={{ padding: '16px', borderRadius: '12px', border: '2px solid #E5E7EB', fontSize: '1rem' }} />
                            <textarea placeholder="Sua mensagem" rows={4} style={{ padding: '16px', borderRadius: '12px', border: '2px solid #E5E7EB', fontSize: '1rem', resize: 'vertical' }} />
                            <button type="submit" style={{ padding: '18px', borderRadius: '12px', border: 'none', backgroundColor: primaryColor, color: '#FFFFFF', fontSize: '1.125rem', fontWeight: '700', cursor: 'pointer' }}>
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
}
