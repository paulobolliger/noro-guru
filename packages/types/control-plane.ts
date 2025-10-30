export interface ConfiguracaoGlobal {
  limites: {
    max_usuarios_por_tenant: number;
    max_leads_por_tenant: number;
    max_armazenamento_por_tenant: number; // em MB
    max_requisicoes_api_por_dia: number;
  };
  instancia: {
    modo_manutencao: boolean;
    versao_minima_cli: string;
    versao_atual_api: string;
    dominios_permitidos: string[];
  };
  cache: {
    tempo_cache_api: number; // em segundos
    cache_habilitado: boolean;
  };
  servicos: {
    // Flags de features
    api_publica_habilitada: boolean;
    registro_publico_habilitado: boolean;
    convites_habilitados: boolean;
    oauth_habilitado: boolean;
  };
  recursos: {
    endpoints_desabilitados: string[];
    features_beta: string[];
    features_desativadas: string[];
  };
}

export interface ConfiguracaoGlobalActions {
  atualizarLimites: (limites: ConfiguracaoGlobal['limites']) => Promise<void>;
  atualizarInstancia: (instancia: ConfiguracaoGlobal['instancia']) => Promise<void>;
  atualizarCache: (cache: ConfiguracaoGlobal['cache']) => Promise<void>;
  atualizarServicos: (servicos: ConfiguracaoGlobal['servicos']) => Promise<void>;
  atualizarRecursos: (recursos: ConfiguracaoGlobal['recursos']) => Promise<void>;
}