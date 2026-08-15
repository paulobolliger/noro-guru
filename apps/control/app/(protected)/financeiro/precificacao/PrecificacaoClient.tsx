'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Lock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface RateDetail {
  fromCurrency: string;
  toCurrency: string;
  ptaxVenda: number;
  masterSpreadPct: number;
  effectiveRate: number;
  updatedAt: string;
  isLocked: boolean;
  source: string;
}

export default function PrecificacaoClient() {
  const [rates, setRates] = useState<Record<string, RateDetail>>({
    USD: {
      fromCurrency: 'USD',
      toCurrency: 'BRL',
      ptaxVenda: 5.1217,
      masterSpreadPct: 3.5,
      effectiveRate: 5.3009,
      updatedAt: new Date().toISOString(),
      isLocked: true,
      source: 'AwesomeAPI PTAX Oficial (BCB)',
    },
    EUR: {
      fromCurrency: 'EUR',
      toCurrency: 'BRL',
      ptaxVenda: 5.8305,
      masterSpreadPct: 4.0,
      effectiveRate: 6.0637,
      updatedAt: new Date().toISOString(),
      isLocked: true,
      source: 'AwesomeAPI PTAX Oficial (BCB)',
    },
  });

  const [usdSpread, setUsdSpread] = useState<number>(3.5);
  const [eurSpread, setEurSpread] = useState<number>(4.0);
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Simulador
  const [simValue, setSimValue] = useState<number>(1000);
  const [simCurrency, setSimCurrency] = useState<'USD' | 'EUR'>('USD');

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/financeiro/cambio');
      const data = await res.json();
      if (data.success && data.lockedRates) {
        setRates(data.lockedRates);
        if (data.lockedRates.USD) setUsdSpread(data.lockedRates.USD.masterSpreadPct);
        if (data.lockedRates.EUR) setEurSpread(data.lockedRates.EUR.masterSpreadPct);
      }
    } catch (e) {
      console.error('Erro ao carregar taxas:', e);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleUpdateAndLock = async () => {
    setLoading(true);
    setSuccessMessage(null);
    try {
      const res = await fetch('/api/financeiro/cambio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreads: {
            USD: Number(usdSpread),
            EUR: Number(eurSpread),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRates(data.lockedRates);
        setSuccessMessage('Cotação PTAX atualizada via AwesomeAPI e travada com sucesso para o dia!');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (e) {
      console.error('Erro ao atualizar taxas:', e);
    } finally {
      setLoading(false);
    }
  };

  const calculatedUsdTurismo = (rates.USD?.ptaxVenda * (1 + usdSpread / 100)).toFixed(4);
  const calculatedEurTurismo = (rates.EUR?.ptaxVenda * (1 + eurSpread / 100)).toFixed(4);

  const selectedRate = rates[simCurrency];
  const simResult = selectedRate
    ? (simValue * (selectedRate.ptaxVenda * (1 + (simCurrency === 'USD' ? usdSpread : eurSpread) / 100))).toFixed(2)
    : '0.00';

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      {/* Banner de Controle Restrito */}
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-amber-300">
          <Lock className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            <strong>Exclusividade Control Plane Master:</strong> O câmbio é travado diariamente às 09:15 AM via AwesomeAPI (BCB). Os Spreads de câmbio são definidos centralmente e aplicados a todas as agências.
          </p>
        </div>
        <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
          🔒 Lock Diário Ativo
        </span>
      </div>

      {successMessage && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid de Cards de Moedas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* USD Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">🇺🇸 Dólar Americano</span>
              <h3 className="text-2xl font-black text-white mt-1">USD → BRL</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">PTAX Oficial Venda</span>
              <div className="text-2xl font-extrabold text-cyan-400">
                R$ {rates.USD?.ptaxVenda.toFixed(4) || '5.4200'}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 font-medium">Spread Master (%):</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={usdSpread}
                  onChange={(e) => setUsdSpread(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-right font-bold text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <span className="text-slate-400 text-sm font-bold">%</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl flex justify-between items-center border border-slate-800/80">
              <span className="text-xs text-slate-400">Dólar Turismo Final (Com Spread):</span>
              <span className="text-lg font-black text-emerald-400">R$ {calculatedUsdTurismo}</span>
            </div>
          </div>
        </div>

        {/* EUR Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">🇪🇺 Euro</span>
              <h3 className="text-2xl font-black text-white mt-1">EUR → BRL</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">PTAX Oficial Venda</span>
              <div className="text-2xl font-extrabold text-cyan-400">
                R$ {rates.EUR?.ptaxVenda.toFixed(4) || '6.1200'}
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex justify-between items-center">
              <label className="text-sm text-slate-300 font-medium">Spread Master (%):</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.1"
                  value={eurSpread}
                  onChange={(e) => setEurSpread(parseFloat(e.target.value) || 0)}
                  className="w-20 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-right font-bold text-white text-sm focus:border-cyan-500 focus:outline-none"
                />
                <span className="text-slate-400 text-sm font-bold">%</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl flex justify-between items-center border border-slate-800/80">
              <span className="text-xs text-slate-400">Euro Turismo Final (Com Spread):</span>
              <span className="text-lg font-black text-emerald-400">R$ {calculatedEurTurismo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleUpdateAndLock}
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Atualizando Cotação PTAX...' : 'Recarregar PTAX AwesomeAPI & Salvar Spreads'}</span>
        </button>
      </div>

      {/* Simulador de Conversão Master */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h4 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-cyan-400" />
          <span>Simulador de Precificação de Cotação</span>
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Simule o valor final em Reais (BRL) que será cobrado no checkout para qualquer produto cotado em moeda internacional.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Moeda:</label>
            <select
              value={simCurrency}
              onChange={(e) => setSimCurrency(e.target.value as 'USD' | 'EUR')}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-cyan-500"
            >
              <option value="USD">🇺🇸 USD — Dólar Americano</option>
              <option value="EUR">🇪🇺 EUR — Euro</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Valor Neto Fornecedor:</label>
            <input
              type="number"
              value={simValue}
              onChange={(e) => setSimValue(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 font-bold text-sm focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Final Convertido (BRL):</span>
              <span className="text-2xl font-black text-emerald-400">R$ {simResult}</span>
            </div>
            <ArrowRight className="h-6 w-6 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
