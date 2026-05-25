import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Manifesto | Noro Guru',
  description: 'Acreditamos que a agência de turismo moderna merece uma plataforma à sua altura. Este é o nosso compromisso.',
  openGraph: {
    title: 'Manifesto Noro Guru',
    description: 'O que acreditamos sobre o futuro das agências de turismo no Brasil.',
  },
};

export default function ManifestoPage() {
  return (
    <div
      style={{
        background: '#0B1220',
        minHeight: '100vh',
        padding: '96px 24px 120px',
      }}
    >
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <Link
          href="/about"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: '#B8C1E0',
            textDecoration: 'none',
            marginBottom: 64,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Sobre
        </Link>

        {/* Label */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#342CA4',
            fontFamily: 'var(--font-mono)',
            marginBottom: 24,
          }}
        >
          Manifesto · Mai 2026
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 6vw, 60px)',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            margin: '0 0 64px',
          }}
        >
          A agência que sobrevive<br />
          não é a maior.<br />
          <span style={{ color: '#342CA4' }}>É a que opera melhor.</span>
        </h1>

        {/* Body */}
        <div
          style={{
            fontSize: 18,
            lineHeight: 1.85,
            color: '#D1D5F0',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          }}
        >
          <p>
            Existe uma geração de agências de turismo no Brasil que atravessou uma pandemia, reorganizou o negócio do zero e saiu do outro lado mais forte — mas ainda operando com as mesmas ferramentas de antes: planilhas, WhatsApp pessoal, e-mail avulso e sistemas que nunca foram feitos para o turismo.
          </p>

          <p>
            Não é por falta de vontade de evoluir. É porque as opções disponíveis no mercado são genéricas, caras, complicadas ou, no pior caso, as três coisas ao mesmo tempo.
          </p>

          <p style={{ color: '#fff', fontWeight: 600 }}>
            A Noro Guru nasceu da convicção de que isso pode ser diferente.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />

          <p>
            Acreditamos que um consultor de viagens não deveria gastar 3 horas do dia editando planilhas. Que o dono de uma agência não deveria descobrir no fim do mês que as contas não fecham. Que uma equipe de 5 pessoas pode atender como uma equipe de 15 — desde que tenha as ferramentas certas.
          </p>

          <p>
            Acreditamos que tecnologia, quando bem feita, é invisível. Ela não exige adaptação — ela se adapta a você. Ela não impõe um processo genérico — ela abraça o jeito como sua agência trabalha.
          </p>

          <blockquote
            style={{
              borderLeft: '3px solid #342CA4',
              paddingLeft: 24,
              margin: '16px 0',
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            "Construímos para o consultor que está atendendo 12 clientes ao mesmo tempo no WhatsApp e ainda precisa fechar o orçamento para o grupo que viaja sexta-feira."
          </blockquote>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />

          <p>
            Não somos uma plataforma de CRM adaptada ao turismo. Não somos um ERP que "também funciona" para agências. Somos uma plataforma construída do zero para o ciclo real de uma venda de viagem — desde o lead que chega pelo Instagram até o cliente que volta para a terceira viagem e indica a agência para os amigos.
          </p>

          <p>
            Cada funcionalidade que construímos começa com uma pergunta simples: <em style={{ color: '#fff' }}>"Isso vai fazer um consultor de viagens trabalhar melhor hoje?"</em> Se a resposta for sim, a funcionalidade entra. Se não, não importa o quanto seja tecnicamente impressionante.
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', margin: '8px 0' }} />

          <p>
            O turismo é um setor de confiança. O cliente está entregando para você a sua viagem dos sonhos, as suas férias, talvez a lua de mel da vida. Quando uma agência usa a Noro Guru, o cliente não vê o sistema — ele sente o resultado: respostas mais rápidas, propostas mais claras, experiências mais cuidadas.
          </p>

          <p>
            É isso que nos move. Não a tecnologia pela tecnologia. A tecnologia como meio para que agências de turismo brasileiras possam fazer o que fazem de melhor: transformar sonhos em viagens.
          </p>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.01em',
            }}
          >
            Este é o nosso compromisso. Esse é o Noro Guru.
          </p>

          {/* Signature */}
          <div
            style={{
              marginTop: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(52,44,164,0.2)',
                border: '1px solid rgba(52,44,164,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 18,
                color: '#342CA4',
              }}
            >
              PB
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Paulo Bolliger</div>
              <div style={{ fontSize: 13, color: '#B8C1E0' }}>Co-fundador & CEO, Noro Guru</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
