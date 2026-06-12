'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function PixQrCode({ pixCopyPaste }: { pixCopyPaste: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(pixCopyPaste);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: 'inline-block',
        padding: 12,
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
      }}>
        <QRCodeSVG value={pixCopyPaste} size={180} />
      </div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <code style={{
          fontSize: 11,
          background: '#f1f5f9',
          padding: '6px 10px',
          borderRadius: 6,
          wordBreak: 'break-all',
          maxWidth: 280,
          display: 'block',
          color: '#475569',
        }}>
          {pixCopyPaste.slice(0, 40)}…
        </code>
        <button
          onClick={handleCopy}
          style={{
            flexShrink: 0,
            padding: '6px 14px',
            background: copied ? '#dcfce7' : '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            color: copied ? '#16a34a' : '#475569',
            transition: 'all .15s',
          }}
        >
          {copied ? 'Copiado!' : 'Copiar código'}
        </button>
      </div>
    </div>
  );
}
