'use client';

import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, MapPin } from 'lucide-react';

interface CepAutocompleteProps {
  name?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  // IDs ou nomes dos campos a serem preenchidos automaticamente no formulário
  targetLogradouro?: string;
  targetBairro?: string;
  targetCidade?: string;
  targetEstado?: string;
  targetNumero?: string;
  onAddressFound?: (address: {
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  }) => void;
}

export default function CepAutocompleteField({
  name = 'cep',
  defaultValue = '',
  placeholder = '00000-000',
  className = 'w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition-all',
  targetLogradouro = 'logradouro',
  targetBairro = 'bairro',
  targetCidade = 'cidade',
  targetEstado = 'estado',
  targetNumero = 'numero',
  onAddressFound,
}: CepAutocompleteProps) {
  const [cep, setCep] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [sourceInfo, setSourceInfo] = useState<string | null>(null);

  const formatInputCep = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 8);
    if (clean.length > 5) {
      return `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    return clean;
  };

  const handleLookup = async (cepValue: string) => {
    const clean = cepValue.replace(/\D/g, '');
    if (clean.length !== 8) return;

    setLoading(true);
    setSourceInfo(null);

    try {
      const res = await fetch(`/api/cep/${clean}`);
      const data = await res.json();

      if (data.success && data.address) {
        const { logradouro, bairro, cidade, estado, cep: formattedCep, source } = data.address;

        setSourceInfo(`Endereço localizado via ${source}`);
        setCep(formattedCep);

        // Preenche campos no DOM se existirem no mesmo formulário
        const fillField = (fieldNameOrId: string, val: string) => {
          const el =
            (document.getElementsByName(fieldNameOrId)[0] as HTMLInputElement) ||
            (document.getElementById(fieldNameOrId) as HTMLInputElement);
          if (el) {
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        };

        if (targetLogradouro) fillField(targetLogradouro, logradouro);
        if (targetBairro) fillField(targetBairro, bairro);
        if (targetCidade) fillField(targetCidade, cidade);
        if (targetEstado) fillField(targetEstado, estado);

        // Foca automaticamente no campo de número
        if (targetNumero) {
          const numEl =
            (document.getElementsByName(targetNumero)[0] as HTMLInputElement) ||
            (document.getElementById(targetNumero) as HTMLInputElement);
          if (numEl) numEl.focus();
        }

        if (onAddressFound) {
          onAddressFound({ logradouro, bairro, cidade, estado, cep: formattedCep });
        }
      }
    } catch (e) {
      console.error('[CepAutocompleteField] Erro ao buscar CEP:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatInputCep(e.target.value);
    setCep(formatted);
    if (formatted.replace(/\D/g, '').length === 8) {
      handleLookup(formatted);
    }
  };

  return (
    <div className="relative space-y-1">
      <div className="relative flex items-center">
        <input
          type="text"
          name={name}
          value={cep}
          onChange={handleChange}
          onBlur={() => handleLookup(cep)}
          placeholder={placeholder}
          className={className}
          maxLength={9}
        />
        <div className="absolute right-3 text-slate-400">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          ) : (
            <MapPin className="h-4 w-4 text-slate-400" />
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
