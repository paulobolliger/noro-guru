'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoadingStep = { id: number; label: string; progress: number };

const LOADING_STEPS: LoadingStep[] = [
  { id: 1, label: 'Analisando informações...', progress: 20 },
  { id: 2, label: 'Gerando estrutura do site...', progress: 40 },
  { id: 3, label: 'Criando conteúdo personalizado...', progress: 60 },
  { id: 4, label: 'Aplicando cores e logo...', progress: 80 },
  { id: 5, label: 'Finalizando...', progress: 95 },
];

const COUNTRIES = [
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+1', flag: '🇺🇸', name: 'EUA/Canadá' },
  { code: '+34', flag: '🇪🇸', name: 'Espanha' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
];

const VIBES = [
  { id: 'modern', icon: '✨', label: 'Modern', desc: 'Clean e inovador' },
  { id: 'elegant', icon: '🎩', label: 'Elegant', desc: 'Luxo e sofisticação' },
  { id: 'bold', icon: '🚀', label: 'Bold', desc: 'Impactante e vibrante' },
  { id: 'minimal', icon: '🧘', label: 'Minimal', desc: 'Essencial e focado' },
  { id: 'playful', icon: '🎨', label: 'Playful', desc: 'Criativo e divertido' },
];

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  fontSize: 14,
  color: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#E0E3FF',
  marginBottom: 8,
};

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
    primaryColor: '#342CA4',
    secondaryColor: '',
    accentColor: '',
    whatsapp: '',
    vibe: 'modern',
  });

  async function handleExtractColors() {
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
      if (!data.success) throw new Error(data.error || 'Falha na extração');
      setFormData((prev) => ({
        ...prev,
        primaryColor: data.primaryColor || prev.primaryColor,
        secondaryColor: data.secondaryColor || '',
        accentColor: data.accentColor || '',
      }));
      setColorToast('✅ Cores extraídas com sucesso!');
      setTimeout(() => setColorToast(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setColorToast(`❌ Erro: ${msg}`);
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

    // Animate steps
    LOADING_STEPS.forEach((step, i) => {
      setTimeout(() => {
        setCurrentStep(i);
        setLoadingProgress(step.progress);
      }, i * 1200);
    });

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
          services: formData.services.split('\n').filter((s) => s.trim()),
          logoUrl: formData.logoUrl || undefined,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor || undefined,
          accentColor: formData.accentColor || undefined,
          whatsapp: formData.whatsapp ? `${formData.countryCode}${formData.whatsapp}` : undefined,
          vibe: formData.vibe,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erro ao gerar site');
      setLoadingProgress(100);
      setTimeout(() => router.push(`/dashboard/sites/${data.site_id}/preview`), 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(msg);
      setLoading(false);
      setLoadingProgress(0);
      setCurrentStep(0);
    }
  }

  const set = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', padding: '80px 24px 96px' }}>

      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11,18,32,0.92)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#12152C',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20,
              padding: '48px 40px',
              maxWidth: 440,
              width: '90%',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 24 }}>✨</div>

            {/* Progress circle */}
            <div style={{ width: 100, height: 100, margin: '0 auto 24px', position: 'relative' }}>
              <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke={formData.primaryColor}
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - loadingProgress / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: 20,
                  fontWeight: 800,
                  color: formData.primaryColor,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {loadingProgress}%
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
              Criando seu site...
            </h2>
            <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px' }}>
              {LOADING_STEPS[currentStep]?.label || 'Preparando...'}
            </p>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {LOADING_STEPS.map((step, idx) => (
                <div
                  key={step.id}
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    background: idx <= currentStep ? formData.primaryColor : 'rgba(255,255,255,0.12)',
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {colorToast && (
        <div
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            zIndex: 1000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          {colorToast}
        </div>
      )}

      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Voltar
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            margin: '0 0 8px',
          }}
        >
          ✨ Criar meu site
        </h1>
        <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 48px', lineHeight: 1.6 }}>
          Preencha os dados abaixo e a IA gera o site profissional da sua agência em segundos.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

          {/* Nome + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>🏢 Nome da agência *</label>
              <input
                type="text"
                value={formData.agencyName}
                onChange={(e) => set('agencyName', e.target.value)}
                placeholder="Ex: Viagens dos Sonhos"
                style={INPUT_STYLE}
                required
              />
              <p style={{ fontSize: 11, color: '#B8C1E0', marginTop: 6, fontFamily: 'var(--font-mono)' }}>
                {formData.agencyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'sua-agencia'}.sites.noro.guru
              </p>
            </div>
            <div>
              <label style={LABEL_STYLE}>📧 Seu e-mail *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="seuemail@exemplo.com"
                style={INPUT_STYLE}
                required
              />
            </div>
          </div>

          {/* Idioma + Mercado */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>🌍 Idioma</label>
              <select
                value={formData.language}
                onChange={(e) => set('language', e.target.value)}
                style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                required
              >
                <option value="pt">🇧🇷 Português</option>
                <option value="en">🇺🇸 English</option>
                <option value="es">🇪🇸 Español</option>
              </select>
            </div>
            <div>
              <label style={LABEL_STYLE}>🎯 Mercado</label>
              <select
                value={formData.market}
                onChange={(e) => set('market', e.target.value)}
                style={{ ...INPUT_STYLE, cursor: 'pointer' }}
                required
              >
                <option value="Brazil">Brasil</option>
                <option value="LATAM">LATAM</option>
                <option value="USA">EUA</option>
                <option value="Global">Global</option>
              </select>
            </div>
          </div>

          {/* Diferencial */}
          <div>
            <label style={LABEL_STYLE}>💡 Diferencial da agência *</label>
            <input
              type="text"
              value={formData.positioning}
              onChange={(e) => set('positioning', e.target.value)}
              placeholder="Ex: roteiros sob medida com curadoria especializada"
              style={INPUT_STYLE}
              required
            />
          </div>

          {/* Vibe */}
          <div>
            <label style={LABEL_STYLE}>🎨 Estilo do site *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
              {VIBES.map((vibe) => (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => set('vibe', vibe.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: '14px 8px',
                    borderRadius: 10,
                    border: formData.vibe === vibe.id
                      ? `2px solid ${formData.primaryColor}`
                      : '2px solid rgba(255,255,255,0.1)',
                    background: formData.vibe === vibe.id
                      ? `${formData.primaryColor}18`
                      : 'rgba(255,255,255,0.04)',
                    color: formData.vibe === vibe.id ? '#fff' : '#B8C1E0',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{vibe.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{vibe.label}</span>
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{vibe.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo URL + extrair cores */}
          <div>
            <label style={LABEL_STYLE}>🖼️ URL do logo</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => set('logoUrl', e.target.value)}
                placeholder="https://exemplo.com/logo.png"
                style={{ ...INPUT_STYLE, flex: 1 }}
              />
              <button
                type="button"
                onClick={handleExtractColors}
                disabled={extractingColor || !formData.logoUrl}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: extractingColor || !formData.logoUrl ? 'rgba(255,255,255,0.1)' : '#1DD3C0',
                  color: extractingColor || !formData.logoUrl ? '#B8C1E0' : '#0B1220',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: extractingColor || !formData.logoUrl ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {extractingColor ? '⏳' : '🎨 Extrair cores'}
              </button>
            </div>
            <p style={{ fontSize: 11, color: '#B8C1E0', marginTop: 6 }}>JPG, PNG, SVG, WEBP aceitos</p>
          </div>

          {/* Cores */}
          <div>
            <label style={LABEL_STYLE}>🎨 Paleta de cores</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { key: 'primaryColor', label: 'Primária *' },
                { key: 'secondaryColor', label: 'Secundária', placeholder: '#6B7280' },
                { key: 'accentColor', label: 'Destaque', placeholder: '#F59E0B' },
              ].map((c) => (
                <div key={c.key}>
                  <span style={{ fontSize: 11, color: '#B8C1E0', display: 'block', marginBottom: 6 }}>{c.label}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="color"
                      value={formData[c.key as keyof typeof formData] || '#6B7280'}
                      onChange={(e) => set(c.key, e.target.value)}
                      style={{ width: 40, height: 40, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', flexShrink: 0, background: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={formData[c.key as keyof typeof formData]}
                      onChange={(e) => set(c.key, e.target.value)}
                      placeholder={c.placeholder || ''}
                      style={{ ...INPUT_STYLE, padding: '8px 10px', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <label style={LABEL_STYLE}>📱 WhatsApp</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={formData.countryCode}
                onChange={(e) => set('countryCode', e.target.value)}
                style={{ ...INPUT_STYLE, width: 'auto', minWidth: 110, cursor: 'pointer' }}
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value.replace(/\D/g, ''))}
                placeholder="11987654321"
                style={INPUT_STYLE}
              />
            </div>
          </div>

          {/* Serviços */}
          <div>
            <label style={LABEL_STYLE}>⭐ Principais serviços *</label>
            <textarea
              value={formData.services}
              onChange={(e) => set('services', e.target.value)}
              placeholder={'Roteiros personalizados e sob medida\nPacotes nacionais e internacionais\nLua de mel dos sonhos'}
              rows={5}
              style={{ ...INPUT_STYLE, resize: 'vertical', lineHeight: 1.6 }}
              required
            />
            <p style={{ fontSize: 11, color: '#B8C1E0', marginTop: 6 }}>Um serviço por linha</p>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#f87171' }}>
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: 12,
              border: 'none',
              background: loading ? 'rgba(255,255,255,0.1)' : formData.primaryColor,
              color: '#fff',
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.01em',
            }}
          >
            {loading ? '✨ Gerando...' : '🚀 Criar meu site'}
          </button>

          <p style={{ fontSize: 12, color: '#B8C1E0', textAlign: 'center', margin: 0 }}>
            Grátis no plano Starter · Sem cartão de crédito
          </p>
        </form>
      </div>
    </div>
  );
}
