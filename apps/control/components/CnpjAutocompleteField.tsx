'use client';

import React, { useState } from 'react';
import { Building2, Loader2, CheckCircle2 } from 'lucide-react';

interface CnpjAutocompleteProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  targetRazaoSocial?: string;
  targetNomeFantasia?: string;
  targetTelefone?: string;
  targetEmail?: string;
  targetCep?: string;
  targetLogradouro?: string;
  targetNumero?: string;
  targetBairro?: string;
  targetCidade?: string;
  targetEstado?: string;
  onCompanyFound?: (company: any) => void;
}

export default function CnpjAutocompleteField({
  name = 'cnpj',
  defaultValue = '',
  placeholder = '00.000.000/0000-00',
  className = 'w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-all',
  targetRazaoSocial = 'razao_social',
  targetNomeFantasia = 'nome_fantasia',
  targetTelefone = 'telefone',
  targetEmail = 'email',
  targetCep = 'cep',
  targetLogradouro = 'logradouro',
  targetNumero = 'numero',
  targetBairro = 'bairro',
  targetCidade = 'cidade',
  targetEstado = 'estado',
  onCompanyFound,
}: CnpjAutocompleteProps) {
  const [cnpj, setCnpj] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [sourceInfo, setSourceInfo] = useState<string | null>(null);

  const formatInputCnpj = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 14);
    if (clean.length > 12) {
      return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12)}`;
    } else if (clean.length > 8) {
      return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8)}`;
    } else if (clean.length > 5) {
      return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5)}`;
    } else if (clean.length > 2) {
      return `${clean.slice(0, 2)}.${clean.slice(2)}`;
    }
    return clean;
  };

  const handleLookup = async (cnpjValue: string) => {
    const clean = cnpjValue.replace(/\D/g, '');
    if (clean.length !== 14) return;

    setLoading(true);
    setSourceInfo(null);

    try {
      const res = await fetch(`/api/cnpj/${clean}`);
      const data = await res.json();

      if (data.success && data.company) {
        const comp = data.company;
        setSourceInfo(`Dados da empresa carregados via ${comp.source}`);
        setCnpj(comp.cnpj);

        const fillField = (fieldNameOrId: string, val: string) => {
          if (!fieldNameOrId || !val) return;
          const el =
            (document.getElementsByName(fieldNameOrId)[0] as HTMLInputElement) ||
            (document.getElementById(fieldNameOrId) as HTMLInputElement);
          if (el) {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };

        fillField(targetRazaoSocial, comp.razaoSocial);
        fillField(targetNomeFantasia, comp.nomeFantasia);
        fillField(targetTelefone, comp.telefone || '');
        fillField(targetEmail, comp.email || '');

        if (comp.endereco) {
          fillField(targetCep, comp.endereco.cep || '');
          fillField(targetLogradouro, comp.endereco.logradouro || '');
          fillField(targetNumero, comp.endereco.numero || '');
          fillField(targetBairro, comp.endereco.bairro || '');
          fillField(targetCidade, comp.endereco.cidade || '');
          fillField(targetEstado, comp.endereco.estado || '');
        }

        if (onCompanyFound) {
          onCompanyFound(comp);
        }
      }
    } catch (e) {
      console.error('[CnpjAutocompleteField] Erro ao buscar CNPJ:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputCnpj(e.target.value);
    setCnpj(formatted);
    if (formatted.replace(/\D/g, '').length === 14) {
      handleLookup(formatted);
    }
  };

  return (
    <div className="relative space-y-1">
      <div className="relative flex items-center">
        <input
          type="text"
          name={name}
          value={cnpj}
          onChange={handleChange}
          onBlur={() => handleLookup(cnpj)}
          placeholder={placeholder}
          className={className}
          maxLength={18}
        />
        <div className="absolute right-3 text-slate-400">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <Building2 className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {sourceInfo && (
        <span className="text-[11px] font-medium text-emerald-500 flex items-center space-x-1">
          <CheckCircle2 className="h-3 w-3" />
          <span>{sourceInfo}</span>
        </span>
      )}
    </div>
  );
}
