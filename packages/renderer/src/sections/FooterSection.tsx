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
                    gridTemplateColumns: config.columns && config.columns.length > 0
                        ? `repeat(${config.columns.length + 1}, 1fr)`
                        : '2fr 1fr 1fr 1fr',
                    gap: '3rem',
                    marginBottom: '3rem',
                }}>
                    {/* Logo/Brand Column */}
                    <div>
                        {config.logo && (
                            <img
                                src={config.logo.url}
                                alt={config.logo.alt}
                                style={{
                                    height: '40px',
                                    marginBottom: '1rem',
                                }}
                            />
                        )}

                        {config.description && (
                            <p style={{
                                fontSize: '0.95rem',
                                lineHeight: '1.7',
                                color: '#9CA3AF',
                                marginBottom: '1.5rem',
                            }}>
                                {config.description}
                            </p>
                        )}

                        {config.social && config.social.length > 0 && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {config.social.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: `${primaryColor}20`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: primaryColor,
                                            textDecoration: 'none',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = primaryColor;
                                            e.currentTarget.style.color = '#FFFFFF';
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = `${primaryColor}20`;
                                            e.currentTarget.style.color = primaryColor;
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        {social.icon || social.platform.charAt(0).toUpperCase()}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Link Columns */}
                    {config.columns && config.columns.map((column, colIndex) => (
                        <div key={colIndex}>
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '700',
                                marginBottom: '1.5rem',
                                color: '#FFFFFF',
                            }}>
                                {column.title}
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {column.links.map((link, linkIndex) => (
                                    <li key={linkIndex} style={{ marginBottom: '0.75rem' }}>
                                        <a
                                            href={link.url}
                                            style={{
                                                color: '#9CA3AF',
                                                textDecoration: 'none',
                                                fontSize: '0.95rem',
                                                transition: 'color 0.2s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = primaryColor;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#9CA3AF';
                                            }}
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
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
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#9CA3AF',
                        margin: 0,
                    }}>
                        {config.copyright || `© ${new Date().getFullYear()} Todos os direitos reservados`}
                    </p>

                    {config.legalLinks && config.legalLinks.length > 0 && (
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            {config.legalLinks.map((link, index) => (
                                <a
                                    key={index}
                                    href={link.url}
                                    style={{
                                        fontSize: '0.875rem',
                                        color: '#9CA3AF',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = primaryColor;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#9CA3AF';
                                    }}
                                >
                                    {link.text}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
