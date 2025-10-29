'use client';
import { useEffect, useState } from 'react';

function getUTM() {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k => {
    const v = params.get(k); if (v) utm[k] = v;
  });
  return utm;
}

export default function LeadCapturePage() {
  const [form, setForm] = useState({ organization_name: '', contact_name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    // noop
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('Enviando...');
    const payload = {
      tenant_slug: 'noro',
      ...form,
      source: 'web',
      consent: true,
      page_url: typeof window !== 'undefined' ? window.location.href : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      ...getUTM(),
      captcha_token: 'dev-mock'
    };
    const r = await fetch('/api/ingest-lead', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await r.json().catch(()=>({}));
    if (r.status === 202) setStatus('Recebido!');
    else setStatus('Falha: ' + (data?.error || r.status));
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Novo Lead</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Empresa" value={form.organization_name} onChange={e=>setForm({...form, organization_name:e.target.value})} required />
        <input className="w-full border p-2 rounded" placeholder="Contato" value={form.contact_name} onChange={e=>setForm({...form, contact_name:e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input className="w-full border p-2 rounded" placeholder="Telefone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <textarea className="w-full border p-2 rounded" placeholder="Mensagem" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
        <button className="btn-primary px-4 py-2 rounded" type="submit">Enviar</button>
      </form>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}
