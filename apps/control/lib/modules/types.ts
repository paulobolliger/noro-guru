export interface ModuleConfig {
  name: string;
  routes: Record<string, string>;
  api: {
    base: string;
    endpoints: Record<string, string>;
  };
  permissions?: string[];
}

export interface ModuleRegistration {
  module: ModuleConfig;
  initialize?: () => Promise<void>;
  cleanup?: () => Promise<void>;
}