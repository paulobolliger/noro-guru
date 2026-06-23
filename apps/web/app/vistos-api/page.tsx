'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { registerB2BPartnerAction } from './actions';

const CODE_EXAMPLES = {
  curl: `curl -X GET "https://api.noro.guru/v1/visas/US" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  js: `fetch("https://api.noro.guru/v1/visas/US", {
  headers: {
    "Authorization": "Bearer YOUR_API_KEY"
  }
})
.then(res => res.json())
.then(data => console.log(data));`,
  python: `import requests

url = "https://api.noro.guru/v1/visas/US"
headers = {"Authorization": "Bearer YOUR_API_KEY"}

response = requests.get(url, headers=headers)
print(response.json())`
};

const MOCK_RESPONSES = {
  US: {
    country: "Estados Unidos",
    country_code: "US",
    flag_emoji: "🇺🇸",
    is_visa_exempt: false,
    e_visa_available: false,
    visa_on_arrival: false,
    allowed_stay_days: 180,
    travel_insurance_required: false,
    financial_proof_required: true,
    official_language: "Inglês",
    general_info: {
      processingTime: "30-60 dias",
      cost: "US$ 185",
      validity: "Até 10 anos"
    },
    health_info: {
      vaccines: "Nenhuma vacina obrigatória",
      notes: "Febre amarela recomendada em conexões"
    }
  },
  CA: {
    country: "Canadá",
    country_code: "CA",
    flag_emoji: "🇨🇦",
    is_visa_exempt: false,
    e_visa_available: true,
    visa_on_arrival: false,
    allowed_stay_days: 180,
    travel_insurance_required: false,
    financial_proof_required: true,
    official_language: "Inglês e Francês",
    general_info: {
      processingTime: "15-30 dias",
      cost: "CAD$ 100",
      validity: "Até 10 anos"
    },
    health_info: {
      vaccines: "Nenhuma obrigatória",
      notes: "Seguro saúde internacional altamente recomendado"
    }
  },
  FR: {
    country: "França",
    country_code: "FR",
    flag_emoji: "🇫🇷",
    is_visa_exempt: true,
    e_visa_available: false,
    visa_on_arrival: false,
    allowed_stay_days: 90,
    travel_insurance_required: true,
    financial_proof_required: true,
    official_language: "Francês",
    general_info: {
      processingTime: "Isento",
      cost: "Isento",
      validity: "90 dias a cada período de 180 dias"
    },
    health_info: {
      vaccines: "Nenhuma obrigatória",
      notes: "Seguro do Tratado de Schengen com cobertura mínima de €30.000 é obrigatório"
    }
  }
};

export default function VistosApiLandingPage() {
  const [selectedCountry, setSelectedCountry] = useState<'US' | 'CA' | 'FR'>('US');
  const [codeLang, setCodeLang] = useState<'curl' | 'js' | 'python'>('curl');
  
  // States para o cadastro
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ apiKey: string; companyName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessResult(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await registerB2BPartnerAction(formData);
      if (res.ok) {
        setSuccessResult({ apiKey: res.apiKey, companyName: res.companyName });
      } else {
        setErrorMsg(res.error);
      }
    } catch (err) {
      setErrorMsg('Erro inesperado de conexão.');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (successResult) {
      navigator.clipboard.writeText(successResult.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(11, 18, 32, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>🛂</span>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Noro Vistos API
          </span>
        </div>
        <Link href="/" style={{
          color: '#B8C1E0',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          transition: 'color 0.2s',
        }} onMouseEnter={(e: any) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e: any) => e.currentTarget.style.color = '#B8C1E0'}>
          ← Voltar ao Início
        </Link>
      </header>

      {/* Hero & Sandbox */}
      <section style={{
        position: 'relative',
        padding: '80px 24px 100px',
        background: 'radial-gradient(circle at 50% 0%, rgba(29, 211, 192, 0.08) 0%, transparent 60%)',
        overflow: 'hidden'
      }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" style={{ maxWidth: 1200, margin: '0 auto' }}>
          
          {/* Headline */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(29, 211, 192, 0.08)',
              border: '1px solid rgba(29, 211, 192, 0.15)',
              padding: '8px 16px',
              borderRadius: 100,
              fontSize: 13,
              color: '#1DD3C0',
              fontWeight: 600,
              marginBottom: 24,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              ⚡ API Geopolítica B2B para Consultas Globais
            </div>
            
            <h1 style={{
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: '0 0 20px',
              background: 'linear-gradient(180deg, #FFFFFF 0%, #D2D6E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              A base de vistos e requisitos de entrada <br />
              <span style={{ background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                pronta para seu sistema
              </span>
            </h1>

            <p style={{
              fontSize: 18,
              color: '#B8C1E0',
              lineHeight: 1.6,
              margin: '0 0 36px',
              maxWidth: 580
            }}>
              Integre regras de visto atualizadas, exigências de vacinas, validade de passaporte e controle de seguros obrigatórios diretamente no fluxo de reservas da sua OTA, CRM ou sistema de viagens.
            </p>

            <div style={{ display: 'flex', gap: 16 }}>
              <a href="#obter-chave" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)',
                color: '#0B1220',
                borderRadius: 10,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(29, 211, 192, 0.2)',
                transition: 'transform 0.2s',
              }}>
                Criar Chave de API Grátis
              </a>
              <a href="#documentacao" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                padding: '14px 24px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}>
                Ver Documentação
              </a>
            </div>
          </div>

          {/* Sandbox Visualizer */}
          <div style={{
            background: '#121926',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}>
            {/* Header com os botões de controle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['US', 'CA', 'FR'] as const).map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedCountry(code)}
                    style={{
                      background: selectedCountry === code ? 'rgba(29, 211, 192, 0.15)' : 'transparent',
                      border: `1px solid ${selectedCountry === code ? '#1DD3C0' : 'rgba(255,255,255,0.1)'}`,
                      color: selectedCountry === code ? '#1DD3C0' : '#B8C1E0',
                      borderRadius: 6,
                      padding: '4px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {code === 'US' ? 'EUA 🇺🇸' : code === 'CA' ? 'Canadá 🇨🇦' : 'França 🇫🇷'}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor de código */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {(['curl', 'js', 'python'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCodeLang(lang)}
                  style={{
                    background: codeLang === lang ? 'rgba(255,255,255,0.08)' : 'transparent',
                    border: 'none',
                    color: codeLang === lang ? '#fff' : '#64748b',
                    borderRadius: 4,
                    padding: '2px 8px',
                    fontSize: 11,
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                  }}
                >
                  {lang === 'curl' ? 'cURL' : lang === 'js' ? 'JavaScript' : 'Python'}
                </button>
              ))}
            </div>

            <pre style={{
              background: '#0B0F17',
              borderRadius: 8,
              padding: 16,
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#34d399',
              overflowX: 'auto',
              margin: '0 0 16px 0',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              {CODE_EXAMPLES[codeLang]}
            </pre>

            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 8, letterSpacing: '0.05em' }}>
              Response (JSON)
            </div>
            
            <pre style={{
              background: '#0B0F17',
              borderRadius: 8,
              padding: 16,
              fontSize: 12,
              fontFamily: 'monospace',
              color: '#38bdf8',
              overflowX: 'auto',
              maxHeight: 220,
              overflowY: 'auto',
              margin: 0,
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
              {JSON.stringify(MOCK_RESPONSES[selectedCountry], null, 2)}
            </pre>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 48 }}>
          Recursos da API de Vistos
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {[
            { icon: '🗺️', title: '190+ Países Monitorados', desc: 'Mapeamento de vistos consulares, e-visas, prazos e custos oficiais atualizados.' },
            { icon: '💉', title: 'Certificado de Vacinas', desc: 'Alertas automáticos de vacinas obrigatórias (ex: Febre Amarela) e recomendadas.' },
            { icon: '🛡️', title: 'Seguro Viagem Obrigatório', desc: 'Identifica destinos regulados (ex: Tratado de Schengen, Cuba) para cross-selling.' },
            { icon: '💻', title: 'Fácil Integração', desc: 'Endpoints RESTful simples retornando JSON, com documentação clara e SDKs.' },
          ].map((item) => (
            <div key={item.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: '#B8C1E0', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Registration/API Key Section */}
      <section id="obter-chave" style={{
        background: 'linear-gradient(180deg, #121926 0%, #0B1220 100%)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '80px 24px 100px',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Cadastre-se e obtenha sua chave
          </h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', lineHeight: 1.6, marginBottom: 32 }}>
            Preencha os dados abaixo e gere sua credencial imediatamente. Chaves de teste possuem limite padrão de 60 requisições por minuto.
          </p>

          {/* Form ou Success Message */}
          {!successResult ? (
            <form onSubmit={handleRegister} style={{
              background: '#121926',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '32px 28px',
              textAlign: 'left',
            }}>
              {errorMsg && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', padding: '12px 16px', borderRadius: 8, fontSize: 14, marginBottom: 20 }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#B8C1E0', marginBottom: 6 }}>Nome da Empresa / Projeto</label>
                <input name="companyName" required placeholder="Ex: Minha Agência Viagens ou Projeto Vistos" style={{
                  width: '100%',
                  background: '#0B0F17',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '12px',
                  color: '#fff',
                  fontSize: 14,
                  boxSizing: 'border-box',
                }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#B8C1E0', marginBottom: 6 }}>CNPJ ou CPF</label>
                <input name="document" required placeholder="Apenas números" style={{
                  width: '100%',
                  background: '#0B0F17',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '12px',
                  color: '#fff',
                  fontSize: 14,
                  boxSizing: 'border-box',
                }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#B8C1E0', marginBottom: 6 }}>E-mail de Contato</label>
                <input type="email" name="email" required placeholder="dev@empresa.com" style={{
                  width: '100%',
                  background: '#0B0F17',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  padding: '12px',
                  color: '#fff',
                  fontSize: 14,
                  boxSizing: 'border-box',
                }} />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%',
                background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)',
                color: '#0B1220',
                border: 'none',
                borderRadius: 8,
                padding: '14px',
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
              }}>
                {loading ? 'Gerando Credencial...' : '🚀 Solicitar Chave de API'}
              </button>
            </form>
          ) : (
            <div style={{
              background: 'rgba(29, 211, 192, 0.05)',
              border: '1px solid #1DD3C0',
              borderRadius: 20,
              padding: '36px 28px',
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>🎉</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1DD3C0', margin: '0 0 8px 0' }}>
                Parceria criada com sucesso!
              </h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 24px 0', lineHeight: 1.5 }}>
                Aqui está a sua chave de API para <strong>{successResult.companyName}</strong>. Guarde-a em local seguro. Por motivos de segurança, você não poderá vê-la novamente.
              </p>

              <div style={{
                background: '#0B0F17',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 24,
              }}>
                <code style={{
                  color: '#34d399',
                  fontFamily: 'monospace',
                  fontSize: 'clamp(11px, 2.5vw, 14px)',
                  wordBreak: 'break-all',
                }}>
                  {successResult.apiKey}
                </code>
                <button onClick={handleCopy} style={{
                  background: copied ? '#059669' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}>
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>

              <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
                Seu limite inicial é de 60 chamadas por minuto (Rate limit). Para limites maiores, entre em contato.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Basic Documentation Segment */}
      <section id="documentacao" style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 100px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Documentação Simplificada</h2>
        
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1DD3C0', margin: '0 0 8px 0' }}>GET /v1/visas/:countryCode</h3>
          <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.5, margin: 0 }}>
            Retorna todas as informações geopolíticas, requisitos de vacinas, necessidade de seguro viagem internacional e tipos de visto disponíveis para cidadãos brasileiros no país especificado (ISO 3166-1 alpha-2, ex: <code>US</code>, <code>CA</code>, <code>FR</code>).
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1DD3C0', margin: '0 0 8px 0' }}>Autenticação</h3>
          <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.5, margin: 0 }}>
            Insira sua chave no header HTTP de autorização como Bearer token:
            <br />
            <code style={{ background: '#121926', padding: '2px 6px', borderRadius: 4, display: 'inline-block', marginTop: 6, color: '#34d399', fontFamily: 'monospace' }}>
              Authorization: Bearer YOUR_API_KEY
            </code>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        textAlign: 'center',
        fontSize: 13,
        color: '#B8C1E0',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <p>© 2026 Noro Guru. Todos os direitos reservados. Termos de Uso · Política de Privacidade.</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
          Desenvolvido com tecnologia Noro Guru — ERP, CRM e Integrações para Turismo.
        </p>
      </footer>

    </div>
  );
}
