'use client';

import { useState, useRef, useTransition } from 'react';
import { sendClientMessageAction } from './actions';

type Message = {
  id: string;
  proposalId: string;
  senderType: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
  proposal: { id: string; titulo: string; destinoPrincipal: string | null } | null;
};

type Props = {
  messages: Message[];
  tenantId: string;
  clientId: string;
};

function formatTime(date: Date) {
  return new Date(date).toLocaleString('pt-BR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MensagensClient({ messages, clientId }: Props) {
  // Agrupa por proposta
  const byProposal = new Map<string, { titulo: string; destino: string | null; msgs: Message[] }>();
  for (const m of messages) {
    if (!m.proposal) continue;
    const pid = m.proposalId;
    if (!byProposal.has(pid)) {
      byProposal.set(pid, {
        titulo: m.proposal.titulo,
        destino: m.proposal.destinoPrincipal,
        msgs: [],
      });
    }
    byProposal.get(pid)!.msgs.push(m);
  }

  const conversations = Array.from(byProposal.entries());
  const [activeProposal, setActiveProposal] = useState<string | null>(
    conversations[0]?.[0] ?? null,
  );

  const currentConv = activeProposal ? byProposal.get(activeProposal) : null;

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Mensagens</h1>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
        Comunicação com a agência
      </p>

      {conversations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>💬</p>
          <p style={{ fontWeight: 600, color: '#64748b' }}>Nenhuma mensagem ainda</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Quando sua agência enviar uma mensagem, ela aparecerá aqui.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: conversations.length > 1 ? '220px 1fr' : '1fr', gap: 16 }}>
          {/* Sidebar de propostas — só aparece se tiver mais de uma */}
          {conversations.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {conversations.map(([pid, conv]) => (
                <button
                  key={pid}
                  onClick={() => setActiveProposal(pid)}
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    borderRadius: 12,
                    border: '1px solid',
                    borderColor: activeProposal === pid ? '#6366f1' : '#e2e8f0',
                    background: activeProposal === pid ? '#eef2ff' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: 13, color: '#1e293b' }}>
                    {conv.destino ?? conv.titulo}
                  </p>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                    {conv.msgs.length} mensagens
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Chat da conversa ativa */}
          {currentConv && activeProposal && (
            <ChatBox
              proposalId={activeProposal}
              messages={currentConv.msgs}
              clientId={clientId}
            />
          )}
        </div>
      )}
    </div>
  );
}

function ChatBox({
  proposalId,
  messages,
  clientId,
}: {
  proposalId: string;
  messages: Message[];
  clientId: string;
}) {
  const [localMessages, setLocalMessages] = useState(messages);
  const [sending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const content = (new FormData(form).get('content') as string)?.trim();
    if (!content) return;

    // Optimistic update
    const optimistic: Message = {
      id: `tmp-${Date.now()}`,
      proposalId,
      senderType: 'client',
      content,
      createdAt: new Date(),
      readAt: null,
      proposal: null,
    };
    setLocalMessages((prev) => [...prev, optimistic]);
    form.reset();

    startTransition(async () => {
      const fd = new FormData();
      fd.set('content', content);
      await sendClientMessageAction(proposalId, fd, clientId);
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 480 }}>
      {/* Mensagens */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        border: '1px solid #e2e8f0',
        borderRadius: '16px 16px 0 0',
        background: '#f8fafc',
      }}>
        {localMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.senderType === 'client' ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '72%',
              padding: '10px 14px',
              borderRadius: msg.senderType === 'client'
                ? '16px 16px 4px 16px'
                : '16px 16px 16px 4px',
              background: msg.senderType === 'client' ? '#6366f1' : '#fff',
              border: msg.senderType === 'client' ? 'none' : '1px solid #e2e8f0',
              color: msg.senderType === 'client' ? '#fff' : '#1e293b',
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>{msg.content}</p>
              <p style={{
                fontSize: 11,
                marginTop: 4,
                color: msg.senderType === 'client' ? 'rgba(255,255,255,0.6)' : '#94a3b8',
                textAlign: 'right',
              }}>
                {formatTime(msg.createdAt)}
                {msg.senderType === 'client' && msg.readAt && ' · lida'}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        ref={formRef}
        onSubmit={handleSend}
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 16px',
          border: '1px solid #e2e8f0',
          borderTop: 'none',
          borderRadius: '0 0 16px 16px',
          background: '#fff',
        }}
      >
        <input
          type="text"
          name="content"
          required
          placeholder="Escreva uma mensagem…"
          style={{
            flex: 1,
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '8px 14px',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={sending}
          style={{
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '8px 18px',
            fontSize: 14,
            fontWeight: 600,
            cursor: sending ? 'not-allowed' : 'pointer',
            opacity: sending ? 0.6 : 1,
          }}
        >
          {sending ? '…' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
