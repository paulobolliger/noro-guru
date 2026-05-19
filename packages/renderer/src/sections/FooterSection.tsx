'use client';

import type { FooterConfig } from '@noro/types/blueprint';

interface FooterSectionProps {
    config: FooterConfig;
    primaryColor: string;
}

export function FooterSection({ config, primaryColor }: FooterSectionProps) {
    return (
        <footer style={{
            padding: '60px 20px 30px',
            backgroundColor: '#1F2937',
            color: '#E5E7EB',
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '3rem',
                    marginBottom: '3rem',
                }}>
                    {/* Brand column */}
                    <div>
                        {config.logo && (
                            <img
                                src={config.logo.url}
                                alt={config.logo.alt}
                                style={{ height: '40px', marginBottom: '1rem' }}
                            />
                        )}
                        {config.companyName && !config.logo && (
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#fff' }}>
                                {config.companyName}
                            </h2>
                        )}
                        {config.tagline && (
                            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#9CA3AF', marginBottom: '1.5rem', maxWidth: '360px' }}>
                                {config.tagline}
                            </p>
                        )}
                        {config.socialLinks && config.socialLinks.length > 0 && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {config.socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '36px', height: '36px',
                                            borderRadius: '50%',
                                            backgroundColor: `${primaryColor}20`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: primaryColor, textDecoration: 'none', fontSize: '0.8rem', fontWeight: '700',
                                        }}
                                    >
                                        {social.platform.charAt(0).toUpperCase()}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Links column */}
                    {config.links && config.links.length > 0 && (
                        <div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>
                                Links
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {config.links.map((link, i) => (
                                    <li key={i} style={{ marginBottom: '0.75rem' }}>
                                        <a href={link.url} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.95rem' }}>
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid #374151',
                    paddingTop: '2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <p style={{ fontSize: '0.875rem', color: '#9CA3AF', margin: 0 }}>
                        {config.copyright || `© ${new Date().getFullYear()} ${config.companyName || 'Todos os direitos reservados'}`}
                    </p>
                </div>
            </div>
        </footer>
    );
}
