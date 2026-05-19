import type { Blueprint } from '@noro/types/blueprint';
import { SectionRenderer } from './SectionRenderer';
import { FontFamily } from '@noro/types/blueprint';

interface BlueprintRendererProps {
    blueprint: Blueprint;
}

function getGoogleFontUrl(fontFamily: string): string | null {
    // Basic mapping for Google Fonts
    // Ensure we handle spaces for URL (e.g. "Open Sans" -> "Open+Sans")
    const cleanFont = fontFamily.replace(/['"]/g, ''); // Remove quotes if present
    const fontName = cleanFont.replace(/\s+/g, '+');

    // We can explicitly list supported fonts to avoid unnecessary requests for system fonts
    const supportedFonts = Object.values(FontFamily);
    if (!supportedFonts.includes(cleanFont as FontFamily)) {
        // If it's not a known google font enum, maybe return null or try anyway? 
        // For now, let's assume all enums are Google Fonts.
        // Inter and Poppins might already be loaded by Next.js app, but re-loading specific weights 
        // via Google Fonts URL for the preview component isolates it better or ensures it works.
    }

    return `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700;800&display=swap`;
}

export function BlueprintRenderer({ blueprint }: BlueprintRendererProps) {
    const fontUrl = getGoogleFontUrl(blueprint.theme.fontFamily);

    return (
        <div
            style={{
                fontFamily: `'${blueprint.theme.fontFamily}', sans-serif`, // Fallback to sans-serif
                backgroundColor: blueprint.theme.backgroundColor,
                color: blueprint.theme.textColor,
                minHeight: '100vh',
            }}
        >
            {/* Inject Font dynamically */}
            {fontUrl && (
                <link rel="stylesheet" href={fontUrl} />
            )}

            {blueprint.navigation && (
                <nav style={{
                    padding: '1rem 2rem',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: blueprint.theme.backgroundColor,
                    zIndex: 1000,
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        {blueprint.navigation.logo ? (
                            <img
                                src={blueprint.navigation.logo.url}
                                alt={blueprint.navigation.logo.alt}
                                style={{ height: '40px' }}
                            />
                        ) : (
                            // Fallback if no logo
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                                {blueprint.seo?.title?.split(' ')[0] || 'Site'}
                            </h2>
                        )}

                        <ul style={{
                            display: 'flex',
                            gap: '2rem',
                            listStyle: 'none',
                            margin: 0,
                            padding: 0,
                            alignItems: 'center',
                        }}>
                            {blueprint.navigation.items.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={item.url}
                                        style={{
                                            textDecoration: 'none',
                                            color: blueprint.theme.textColor,
                                            fontWeight: '500',
                                        }}
                                    >
                                        {item.text}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {blueprint.navigation.ctaButton && (
                            <a
                                href={blueprint.navigation.ctaButton.url}
                                target={blueprint.navigation.ctaButton.openInNewTab ? '_blank' : undefined}
                                rel={blueprint.navigation.ctaButton.openInNewTab ? 'noopener noreferrer' : undefined}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '50px',
                                    textDecoration: 'none',
                                    backgroundColor: blueprint.theme.primaryColor,
                                    color: '#FFFFFF',
                                    fontWeight: '600',
                                    marginLeft: '1rem',
                                }}
                            >
                                {blueprint.navigation.ctaButton.text}
                            </a>
                        )}
                    </div>
                </nav>
            )}

            <main>
                {blueprint.sections.map((section) => (
                    <SectionRenderer
                        key={section.id}
                        section={section}
                        primaryColor={blueprint.theme.primaryColor}
                    />
                ))}
            </main>
        </div>
    );
}
