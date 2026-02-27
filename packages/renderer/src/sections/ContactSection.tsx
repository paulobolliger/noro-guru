'use client';

import type { ContactConfig } from '@noro/types/blueprint';

interface ContactSectionProps {
    config: ContactConfig;
    primaryColor: string;
}

export function ContactSection({ config, primaryColor }: ContactSectionProps) {
    const whatsappNumber = config.contactMethod === 'whatsapp' && config.phone
        ? config.phone.replace(/\D/g, '')
        : '';
    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber}`
        : '#';

    return (
        <section style={{
            padding: '100px 20px',
            backgroundColor: '#F9FAFB',
            textAlign: 'center',
        }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                {config.headline && (
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        marginBottom: '1rem',
                        fontWeight: '800',
                        color: '#1F2937',
                    }}>
                        {config.headline}
                    </h2>
                )}

                {config.description && (
                    <p style={{
                        fontSize: '1.25rem',
                        marginBottom: '3rem',
                        color: '#6B7280',
                        lineHeight: '1.8',
                    }}>
                        {config.description}
                    </p>
                )}

                {config.contactMethod === 'whatsapp' && (
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
                            boxShadow: '0 10px 30px rgba(37, 211, 102, 0.35), 0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 16px 40px rgba(37, 211, 102, 0.4), 0 8px 16px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(37, 211, 102, 0.35), 0 4px 12px rgba(0,0,0,0.1)';
                        }}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Falar no WhatsApp
                    </a>
                )}

                {config.contactMethod === 'email' && config.email && (
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
                            boxShadow: `0 10px 30px ${primaryColor}35, 0 4px 12px rgba(0,0,0,0.1)`,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        📧 {config.email}
                    </a>
                )}

                {config.contactMethod === 'form' && (
                    <div style={{
                        maxWidth: '500px',
                        margin: '0 auto',
                        textAlign: 'left',
                    }}>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Seu nome"
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '2px solid #E5E7EB',
                                    fontSize: '1rem',
                                }}
                            />
                            <input
                                type="email"
                                placeholder="Seu email"
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '2px solid #E5E7EB',
                                    fontSize: '1rem',
                                }}
                            />
                            <textarea
                                placeholder="Sua mensagem"
                                rows={4}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    border: '2px solid #E5E7EB',
                                    fontSize: '1rem',
                                    resize: 'vertical',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    padding: '18px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: primaryColor,
                                    color: '#FFFFFF',
                                    fontSize: '1.125rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: `0 8px 20px ${primaryColor}40`,
                                }}
                            >
                                Enviar Mensagem
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </section>
    );
}
