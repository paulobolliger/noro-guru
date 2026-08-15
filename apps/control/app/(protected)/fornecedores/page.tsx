'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Power,
  Key,
  ShieldCheck,
  Server,
  Plane,
  Building2,
  Car,
  Bus,
  Clock,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';

interface SupplierCardData {
  id: string;
  name: string;
  category: string[];
  description: string;
  status: 'active' | 'inactive' | 'pending';
  healthStatus: 'healthy' | 'degraded' | 'unhealthy' | 'disabled';
  healthColor: 'green' | 'yellow' | 'red' | 'gray';
  latencyMs: number;
  environment: 'sandbox' | 'production';
  keyId: string;
  lastChecked: string;
  mcpServer?: boolean;
}

export default function FornecedoresPage() {
  const [suppliers, setSuppliers] = useState<SupplierCardData[]>([
    {
      id: 'ratehawk',
      name: 'RateHawk (ETG)',
      category: ['Hospedagem', 'Carros', 'Transfers'],
      description: 'Inventário global B2B de hotéis, aluguel de carros e traslados.',
      status: 'active',
      healthStatus: 'healthy',
      healthColor: 'green',
      latencyMs: 853,
      environment: 'sandbox',
      keyId: '203',
      lastChecked: 'Agora mesmo',
      mcpServer: false,
    },
    {
      id: 'liteapi',
      name: 'LiteAPI (Nuitee Connect)',
      category: ['Hospedagem', 'Aéreo GDS/NDC', 'Vouchers', 'Fidelidade'],
      description: 'Infraestrutura de viagens nativa em IA com MCP Server exposto.',
      status: 'active',
      healthStatus: 'healthy',
      healthColor: 'green',
      latencyMs: 938,
      environment: 'production',
      keyId: 'prod_b5135814-dda3-495c-856b-af03a55bd0a6',
      lastChecked: 'Agora mesmo',
      mcpServer: true,
    },
    {
      id: 'expedia',
      name: 'Expedia Rapid (EPS)',
      category: ['Hospedagem Global B2B'],
      description: 'Tarifas B2B Standalone Net Rates e maior cobertura das Américas.',
      status: 'pending',
      healthStatus: 'degraded',
      healthColor: 'yellow',
      latencyMs: 0,
      environment: 'production',
      keyId: 'Solicitação em análise (Net Rates)',
      lastChecked: 'Pendente de aprovação',
      mcpServer: false,
    },
    {
      id: 'travelfusion',
      name: 'Travelfusion',
      category: ['Aéreo Global (250+ LCCs e NDCs)'],
      description: 'Agregador global líder de voos Low Cost e companhias NDC.',
      status: 'pending',
      healthStatus: 'degraded',
      healthColor: 'yellow',
      latencyMs: 0,
      environment: 'production',
      keyId: 'Cadastro submetido',
      lastChecked: 'Pendente de aprovação',
      mcpServer: false,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/fornecedores/health');
      if (res.ok) {
        const data = await res.json();
        const healthList = data.suppliers || [];
        
        setSuppliers(prev =>
          prev.map(sup => {
            const found = healthList.find((h: any) => h.supplierId === sup.id);
            if (found) {
              return {
                ...sup,
                healthStatus: found.status,
                healthColor: found.color,
                latencyMs: found.latencyMs,
                lastChecked: new Date().toLocaleTimeString(),
              };
            }
            return sup;
          })
        );
      }
    } catch (e) {
      console.error('Error refreshing health status:', e);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const toggleSupplierStatus = (id: string) => {
    setSuppliers(prev =>
      prev.map(sup => {
        if (sup.id === id) {
          const newStatus = sup.status === 'active' ? 'inactive' : 'active';
          return {
            ...sup,
            status: newStatus,
            healthColor: newStatus === 'inactive' ? 'gray' : sup.healthColor === 'gray' ? 'green' : sup.healthColor,
          };
        }
        return sup;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-10 font-sans">
      {/* Header section */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                <Server className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                  Gerenciador de Fornecedores & Semáforo de APIs
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Monitore a saúde das integrações, controle chaves API e ative/desative provedores em tempo real.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchHealth}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 shadow-lg shadow-black/40"
            >
              <RefreshCw className={`w-4 h-4 text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Checando...' : 'Atualizar Saúde'}</span>
            </button>
          </div>
        </div>

        {/* Global Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">APIs Conectadas</span>
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">
                {suppliers.filter(s => s.status === 'active').length} / {suppliers.length}
              </span>
              <span className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Ativas
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Semáforo Operacional</span>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-emerald-400">100% OK</span>
              <span className="text-slate-400 text-xs font-medium">Sub-segundo</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Latência Média</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-white">895 ms</span>
              <span className="text-amber-400 text-xs font-medium bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Respostas rápidas
              </span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Recursos IA / MCP</span>
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-purple-300">69 Tools</span>
              <span className="text-purple-400 text-xs font-medium bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                MCP Server Habilitado
              </span>
            </div>
          </div>
        </div>

        {/* Supplier Cards List */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            Provedores & Conectores Ativos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suppliers.map(supplier => {
              const isGreen = supplier.healthColor === 'green';
              const isYellow = supplier.healthColor === 'yellow';
              const isRed = supplier.healthColor === 'red';
              const isGray = supplier.healthColor === 'gray';

              return (
                <div
                  key={supplier.id}
                  className={`bg-slate-900/80 border rounded-2xl p-6 transition-all duration-300 relative overflow-hidden shadow-xl ${
                    supplier.status === 'active'
                      ? 'border-slate-800 hover:border-slate-700'
                      : 'border-slate-800/40 opacity-75 grayscale-[30%]'
                  }`}
                >
                  {/* Card Glow accent */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10 ${
                      isGreen
                        ? 'bg-emerald-500/10'
                        : isYellow
                        ? 'bg-amber-500/10'
                        : isRed
                        ? 'bg-rose-500/10'
                        : 'bg-slate-500/5'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-xl font-bold text-white">{supplier.name}</h3>
                        {supplier.mcpServer && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-md">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            MCP IA
                          </span>
                        )}
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            supplier.environment === 'production'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                          }`}
                        >
                          {supplier.environment === 'production' ? '🚀 Produção' : '🧪 Sandbox'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{supplier.description}</p>
                    </div>

                    {/* Interactive Toggle Button */}
                    <button
                      onClick={() => toggleSupplierStatus(supplier.id)}
                      className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        supplier.status === 'active' ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                      title={supplier.status === 'active' ? 'Clique para desativar' : 'Clique para ativar'}
                    >
                      <span
                        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          supplier.status === 'active' ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Categories Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {supplier.category.map((cat, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-800/80 text-slate-300 border border-slate-700/60 px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        {cat.includes('Hospedagem') && <Building2 className="w-3.5 h-3.5 text-blue-400" />}
                        {cat.includes('Aéreo') && <Plane className="w-3.5 h-3.5 text-indigo-400" />}
                        {cat.includes('Carros') && <Car className="w-3.5 h-3.5 text-emerald-400" />}
                        {cat.includes('Transfers') && <Bus className="w-3.5 h-3.5 text-amber-400" />}
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Semáforo & Health Bar Section */}
                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-400">Semáforo:</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-slate-950/60">
                        {isGreen && (
                          <>
                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-400 font-semibold">Operacional</span>
                          </>
                        )}
                        {isYellow && (
                          <>
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-amber-400 font-semibold">Pendente / Degradado</span>
                          </>
                        )}
                        {isRed && (
                          <>
                            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                            <span className="text-rose-400 font-semibold">Erro de Conexão</span>
                          </>
                        )}
                        {isGray && (
                          <>
                            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                            <span className="text-slate-400 font-semibold">Desativado</span>
                          </>
                        )}
                      </div>
                    </div>

                    {supplier.latencyMs > 0 && (
                      <div className="flex items-center gap-2 text-slate-400 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{supplier.latencyMs} ms</span>
                      </div>
                    )}
                  </div>

                  {/* Credentials Footer */}
                  <div className="mt-4 bg-slate-950/70 border border-slate-800/60 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-400 truncate">
                      <Key className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-300 truncate">{supplier.keyId}</span>
                    </div>

                    <button
                      onClick={fetchHealth}
                      className="text-blue-400 hover:text-blue-300 font-sans font-medium flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Ping</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
