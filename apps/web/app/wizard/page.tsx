'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LoadingStep = {
    id: number;
    label: string;
    progress: number;
};

const LOADING_STEPS: LoadingStep[] = [
    { id: 1, label: 'Analisando informações...', progress: 20 },
    { id: 2, label: 'Gerando estrutura do site...', progress: 40 },
    { id: 3, label: 'Criando conteúdo personalizado...', progress: 60 },
    { id: 4, label: 'Aplicando cores e logo...', progress: 80 },
    { id: 5, label: 'Finalizando...', progress: 95 },
];

export default function WizardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [extractingColor, setExtractingColor] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [colorToast, setColorToast] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        agencyName: '',
        email: '',
        language: 'pt',
        countryCode: '+55',
        market: 'Brazil',
        positioning: '',
        services: '',
        logoUrl: '',
        primaryColor: '#FF6B35',
        secondaryColor: '',
        accentColor: '',
        whatsapp: '',
        vibe: 'modern', // Default
    });

    // ... (Loading effect hook remains same)

    async function handleExtractColors() {
        // ... (Remains same)
        if (!formData.logoUrl) {
            setColorToast('❌ Cole a URL do logo primeiro');
            setTimeout(() => setColorToast(null), 3000);
            return;
        }

        setExtractingColor(true);
        setColorToast('🎨 Extraindo cores...');

        try {
            const res = await fetch('/api/colors/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logoUrl: formData.logoUrl }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Falha na extração');
            }

            // Update all colors
            setFormData(prev => ({
                ...prev,
                primaryColor: data.primaryColor || prev.primaryColor,
                secondaryColor: data.secondaryColor || '',
                accentColor: data.accentColor || '',
            }));

            setColorToast('✅ Cores extraídas com sucesso!');
            setTimeout(() => setColorToast(null), 3000);
        } catch (err: any) {
            console.error('Color extraction failed:', err);
            setColorToast(`❌ Erro: ${err.message}`);
            setTimeout(() => setColorToast(null), 4000);
        } finally {
            setExtractingColor(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setLoadingProgress(LOADING_STEPS[0].progress);
        setCurrentStep(0);
        setError(null);

        try {
            const response = await fetch('/api/sites/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agencyName: formData.agencyName,
                    email: formData.email,
                    language: formData.language,
                    market: formData.market,
                    positioning: formData.positioning,
                    services: formData.services.split('\n').filter(s => s.trim()),
                    logoUrl: formData.logoUrl || undefined,
                    primaryColor: formData.primaryColor,
                    secondaryColor: formData.secondaryColor || undefined,
                    accentColor: formData.accentColor || undefined,
                    whatsapp: formData.whatsapp ? `${formData.countryCode}${formData.whatsapp}` : undefined,
                    vibe: formData.vibe,
                }),
            });
            // ... (Rest of submit handler remains same)
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao gerar site');
            }

            // Complete the progress
            setLoadingProgress(100);

            // Small delay to show 100%
            setTimeout(() => {
                router.push(`/dashboard/sites/${data.site_id}/preview`);
            }, 500);
        } catch (err: any) {
            setError(err.message);
            setLoading(false);
            setLoadingProgress(0);
            setCurrentStep(0);
        }
    }

    // ... (Countries array remains same)
    const countries = [
        { code: '+55', flag: '🇧🇷', name: 'Brasil' },
        { code: '+1', flag: '🇺🇸', name: 'EUA/Canadá' },
        { code: '+34', flag: '🇪🇸', name: 'Espanha' },
        { code: '+351', flag: '🇵🇹', name: 'Portugal' },
        { code: '+54', flag: '🇦🇷', name: 'Argentina' },
        { code: '+52', flag: '🇲🇽', name: 'México' },
    ];

    const vibes = [
        { id: 'modern', icon: '✨', label: 'Modern', desc: 'Clean e inovador' },
        { id: 'elegant', icon: '🎩', label: 'Elegant', desc: 'Luxo e sofisticação' },
        { id: 'bold', icon: '🚀', label: 'Bold', desc: 'Impactante e vibrante' },
        { id: 'minimal', icon: '🧘', label: 'Minimal', desc: 'Essencial e focado' },
        { id: 'playful', icon: '🎨', label: 'Playful', desc: 'Criativo e divertido' },
    ];

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', position: 'relative' }}>
            {/* Loading Modal - Remains Same */}
            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.3s ease-out',
                }}>
                    <div style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '24px',
                        padding: '3rem',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        textAlign: 'center',
                    }}>
                        {/* Animated Icon */}
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1.5rem',
                            animation: 'pulse 2s ease-in-out infinite',
                        }}>
                            ✨
                        </div>

                        {/* Progress Circle */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 2rem',
                            position: 'relative',
                        }}>
                            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="#E5E7EB"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke={formData.primaryColor}
                                    strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 54}`}
                                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - loadingProgress / 100)}`}
                                    strokeLinecap="round"
                                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                                />
                            </svg>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: formData.primaryColor,
                            }}>
                                {loadingProgress}%
                            </div>
                        </div>

                        {/* Current Step */}
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            color: '#1F2937',
                        }}>
                            Criando seu site...
                        </h2>

                        <p style={{
                            fontSize: '1.125rem',
                            color: '#6B7280',
                            marginBottom: '2rem',
                        }}>
                            {LOADING_STEPS[currentStep]?.label || 'Preparando...'}
                        </p>

                        {/* Step Indicators */}
                        <div style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                        }}>
                            {LOADING_STEPS.map((step, idx) => (
                                <div
                                    key={step.id}
                                    style={{
                                        width: '40px',
                                        height: '4px',
                                        borderRadius: '2px',
                                        backgroundColor: idx <= currentStep ? formData.primaryColor : '#E5E7EB',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

            {/* Toast Notification */}
            {colorToast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: '#1F2937',
                    color: '#FFFFFF',
                    padding: '1rem 1.5rem',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    animation: 'slideIn 0.3s ease-out',
                }}>
                    {colorToast}
                </div>
            )}

            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>
                ✨ Criar Novo Site
            </h1>
            <p style={{ color: '#6B7280', marginBottom: '2rem', fontSize: '1.125rem' }}>
                Preencha os dados e receba um site profissional em segundos
            </p>

            <form onSubmit={handleSubmit}>
                {/* Nome da Agência */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                        🏢 Nome da Agência *
                    </label>
                    <input
                        type="text"
                        value={formData.agencyName}
                        onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                        placeholder="Ex: Viagens dos Sonhos"
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '8px',
                            border: '2px solid #E5E7EB',
                            fontSize: '1rem',
                        }}
                        required
                    />
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.4rem' }}>
                        URL: <strong>{formData.agencyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'sua-agencia'}.sites.noro.guru</strong>
                    </p>
                </div>

                {/* Email */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                        📧 Seu Email *
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="seuemail@exemplo.com"
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '8px',
                            border: '2px solid #E5E7EB',
                            fontSize: '1rem',
                        }}
                        required
                    />
                </div>

                {/* Idioma & Mercado lado a lado */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                            🌍 Idioma
                        </label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '8px',
                                border: '2px solid #E5E7EB',
                                fontSize: '1rem',
                                cursor: 'pointer',
                            }}
                            required
                        >
                            <option value="pt">🇧🇷 Português</option>
                            <option value="en">🇺🇸 English</option>
                            <option value="es">🇪🇸 Español</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                            🎯 Mercado
                        </label>
                        <select
                            value={formData.market}
                            onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '8px',
                                border: '2px solid #E5E7EB',
                                fontSize: '1rem',
                                cursor: 'pointer',
                            }}
                            required
                        >
                            <option value="Brazil">Brasil</option>
                            <option value="LATAM">LATAM</option>
                            <option value="USA">EUA</option>
                            <option value="Global">Global</option>
                        </select>
                    </div>
                </div>

                {/* Posicionamento */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                        💡 Diferencial da Agência *
                    </label>
                    <input
                        type="text"
                        value={formData.positioning}
                        onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
                        placeholder="Ex: roteiros sob medida com curadoria especializada"
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '8px',
                            border: '2px solid #E5E7EB',
                            fontSize: '1rem',
                        }}
                        required
                    />
                </div>

                {/* VIBE SELECTOR - NEW SECTION */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', fontSize: '0.95rem' }}>
                        🎨 Escolha a Vibe do Site *
                    </label>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                        gap: '0.75rem',
                    }}>
                        {vibes.map((vibe) => (
                            <button
                                key={vibe.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, vibe: vibe.id })}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: formData.vibe === vibe.id ? `2px solid ${formData.primaryColor}` : '2px solid #E5E7EB',
                                    backgroundColor: formData.vibe === vibe.id ? `${formData.primaryColor}10` : 'transparent',
                                    color: formData.vibe === vibe.id ? formData.primaryColor : '#4B5563',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'center',
                                }}
                            >
                                <span style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{vibe.icon}</span>
                                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{vibe.label}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '0.2rem' }}>{vibe.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Logo URL com botão */}
                <div style={{ marginBottom: '1.5rem' }}>
// ... (Rest of format remains the same, until submit button)
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                        🖼️ URL do Logo
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="url"
                            value={formData.logoUrl}
                            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                            placeholder="https://exemplo.com/logo.png"
                            style={{
                                flex: 1,
                                padding: '0.875rem',
                                borderRadius: '8px',
                                border: '2px solid #E5E7EB',
                                fontSize: '1rem',
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleExtractColors}
                            disabled={extractingColor || !formData.logoUrl}
                            style={{
                                padding: '0.875rem 1.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: extractingColor ? '#9CA3AF' : '#10B981',
                                color: '#FFFFFF',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                cursor: extractingColor || !formData.logoUrl ? 'not-allowed' : 'pointer',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                            }}
                        >
                            {extractingColor ? '⏳' : '🎨 Extrair Cores'}
                        </button>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.4rem' }}>
                        JPG, PNG, SVG, WEBP aceitos
                    </p>
                </div>

                {/* Cores - Layout Responsivo Fixado */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
                        🎨 Paleta de Cores
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {/* Primária */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>
                                Primária *
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="color"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '8px',
                                        border: '2px solid #E5E7EB',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                />
                                <input
                                    type="text"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '0.85rem',
                                        fontFamily: 'monospace',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Secundária */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>
                                Secundária
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="color"
                                    value={formData.secondaryColor || '#6B7280'}
                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '8px',
                                        border: '2px solid #E5E7EB',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                />
                                <input
                                    type="text"
                                    value={formData.secondaryColor}
                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                    placeholder="#6B7280"
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '0.85rem',
                                        fontFamily: 'monospace',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Destaque */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>
                                Destaque
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="color"
                                    value={formData.accentColor || '#F59E0B'}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '8px',
                                        border: '2px solid #E5E7EB',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                />
                                <input
                                    type="text"
                                    value={formData.accentColor}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                    placeholder="#F59E0B"
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        padding: '0.5rem',
                                        borderRadius: '6px',
                                        border: '1px solid #E5E7EB',
                                        fontSize: '0.85rem',
                                        fontFamily: 'monospace',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* WhatsApp */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                        📱 WhatsApp
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select
                            value={formData.countryCode}
                            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                            style={{
                                padding: '0.875rem',
                                borderRadius: '8px',
                                border: '2px solid #E5E7EB',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                minWidth: '120px',
                            }}
                        >
                            {countries.map(country => (
                                <option key={country.code} value={country.code}>
                                    {country.flag} {country.code}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                            placeholder="11987654321"
                            style={{
                                flex: 1,
                                padding: '0.875rem',
                                borderRadius: '8px',
                                border: '2px solid #E5E7EB',
                                fontSize: '1rem',
                            }}
                        />
                    </div>
                </div>

                {/* Serviços */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                        ⭐ Principais Serviços *
                    </label>
                    <textarea
                        value={formData.services}
                        onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                        placeholder={'Roteiros personalizados e sob medida\nPacotes nacionais e internacionais\nLua de mel dos sonhos'}
                        rows={5}
                        style={{
                            width: '100%',
                            padding: '0.875rem',
                            borderRadius: '8px',
                            border: '2px solid #E5E7EB',
                            fontSize: '1rem',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            lineHeight: '1.6',
                        }}
                        required
                    />
                </div>

                {error && (
                    <div style={{
                        padding: '1rem 1.25rem',
                        marginBottom: '1.5rem',
                        backgroundColor: '#FEE2E2',
                        color: '#991B1B',
                        borderRadius: '8px',
                        border: '1px solid #FCA5A5',
                    }}>
                        <strong>❌ Erro:</strong> {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '1.125rem',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: loading ? '#9CA3AF' : formData.primaryColor,
                        color: '#FFFFFF',
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: loading ? 'none' : '0 4px 12px rgba(0,0,0,0.15)',
                    }}
                >
                    {loading ? '✨ Gerando...' : '🚀 Criar Meu Site'}
                </button>
            </form>
        </div>
    );
}
