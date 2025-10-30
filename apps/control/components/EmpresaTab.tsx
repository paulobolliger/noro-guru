// components/admin/EmpresaTab.tsx
'use client';

import { useState, useTransition } from 'react';
import { Building, UserCircle, Link as LinkIcon, AtSign, Phone, MapPin, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { updateEmpresaDados, type EmpresaDados } from "@/app/(protected)/configuracoes/empresa-actions";

interface EmpresaTabProps {
  empresaDados: EmpresaDados;
}

export default function EmpresaTab({ empresaDados }: EmpresaTabProps) {
  const [isSaving, startSavingTransition] = useTransition();
  const [status, setStatus] = useState<{success: boolean, message: string} | null>(null);

  const handleSubmit = (formData: FormData) => {
    setStatus(null);
    formData.append('empresa_id', empresaDados.id); // Adiciona o ID para a action saber qual linha atualizar

    startSavingTransition(async () => {
      const result = await updateEmpresaDados(formData);
      setStatus(result);
      setTimeout(() => setStatus(null), 4000);
    });
  };

  return (
    <form action={handleSubmit} className="surface-card rounded-xl p-6 border border-default">
      <h2 className="text-2xl font-bold text-primary mb-2">Dados da Empresa</h2>
      <p className="text-muted mb-8">Informações centrais que serão usadas em documentos e comunicações.</p>

      {/* Seção de Informações Básicas */}
      <section className="border-b border-default border-default border-default pb-6 mb-6">
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Building size={20} /> Informações Básicas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nome_empresa" className="block text-sm font-medium text-primary mb-1">Nome da Empresa</label>
            <input type="text" name="nome_empresa" id="nome_empresa" defaultValue={empresaDados.nome_empresa || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
          </div>
          <div>
            <label htmlFor="documento" className="block text-sm font-medium text-primary mb-1">CNPJ / Documento</label>
            <input type="text" name="documento" id="documento" defaultValue={empresaDados.documento || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
          </div>
          <div>
            <label htmlFor="email_principal" className="block text-sm font-medium text-primary mb-1">E-mail Principal</label>
            <input type="email" name="email_principal" id="email_principal" defaultValue={empresaDados.email_principal || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
          </div>
          <div>
            <label htmlFor="telefone_comercial" className="block text-sm font-medium text-primary mb-1">Telefone Comercial</label>
            <input type="tel" name="telefone_comercial" id="telefone_comercial" defaultValue={empresaDados.telefone_comercial || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
          </div>
        </div>
      </section>

      {/* Seção de Redes Sociais */}
      <section className="border-b border-default border-default border-default pb-6 mb-6">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><LinkIcon size={20} /> Redes Sociais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="social.instagram" className="block text-sm font-medium text-primary mb-1">Instagram</label>
                  <input type="text" name="social.instagram" id="social.instagram" placeholder="https://instagram.com/seu_usuario" defaultValue={empresaDados.redes_sociais?.instagram || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
              </div>
              <div>
                  <label htmlFor="social.facebook" className="block text-sm font-medium text-primary mb-1">Facebook</label>
                  <input type="text" name="social.facebook" id="social.facebook" placeholder="https://facebook.com/sua_pagina" defaultValue={empresaDados.redes_sociais?.facebook || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
              </div>
              <div>
                  <label htmlFor="social.linkedin" className="block text-sm font-medium text-primary mb-1">LinkedIn</label>
                  <input type="text" name="social.linkedin" id="social.linkedin" placeholder="https://linkedin.com/company/sua_empresa" defaultValue={empresaDados.redes_sociais?.linkedin || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
              </div>
              <div>
                  <label htmlFor="social.whatsapp" className="block text-sm font-medium text-primary mb-1">WhatsApp Business</label>
                  <input type="text" name="social.whatsapp" id="social.whatsapp" placeholder="Link ou número" defaultValue={empresaDados.redes_sociais?.whatsapp || ''} className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"/>
              </div>
          </div>
      </section>

      {/* Botão de Salvar */}
      <div className="flex items-center justify-end gap-4 mt-8">
        {status && (
          <div className={`flex items-center gap-2 text-sm ${status.success ? 'text-success' : 'text-rose-400'}`}>
            {status.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {status.message}
          </div>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-transform duration-200 ease-in-out disabled:opacity-60"
        >
          {isSaving && <Loader2 className="animate-spin" size={18} />}
          {isSaving ? 'Salvando...' : 'Salvar Dados da Empresa'}
        </button>
      </div>
    </form>
  );
}


