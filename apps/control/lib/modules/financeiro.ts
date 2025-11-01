import { ModuleConfig } from './types';

export const financeiroModule: ModuleConfig = {
  name: 'financeiro',
  routes: {
    index: '/financeiro',
    dashboard: '/financeiro/dashboard',
    transactions: '/financeiro/transactions',
    reports: '/financeiro/reports',
    expenses: '/financeiro/expenses',
    revenue: '/financeiro/revenue',
    cashflow: '/financeiro/cashflow',
    budgets: '/financeiro/budgets'
  },
  api: {
    base: '/api/financeiro',
    endpoints: {
      // Endpoints de Balanço
      getBalance: '/api/financeiro/balance',
      getDashboardMetrics: '/api/financeiro/metrics',
      
      // Endpoints de Transações
      getTransactions: '/api/financeiro/transactions',
      createTransaction: '/api/financeiro/transactions/create',
      updateTransaction: '/api/financeiro/transactions/update',
      deleteTransaction: '/api/financeiro/transactions/delete',
      
      // Endpoints de Relatórios
      getReports: '/api/financeiro/reports',
      generateReport: '/api/financeiro/reports/generate',
      exportReport: '/api/financeiro/reports/export',
      
      // Endpoints de Orçamentos
      getBudgets: '/api/financeiro/budgets',
      createBudget: '/api/financeiro/budgets/create',
      updateBudget: '/api/financeiro/budgets/update',
      deleteBudget: '/api/financeiro/budgets/delete',
      
      // Endpoints de Fluxo de Caixa
      getCashFlow: '/api/financeiro/cashflow',
      getCashFlowProjection: '/api/financeiro/cashflow/projection',
      
      // Endpoints de Categorias
      getCategories: '/api/financeiro/categories',
      manageCategories: '/api/financeiro/categories/manage'
    }
  },
  permissions: [
    'financeiro.view',
    'financeiro.create',
    'financeiro.edit',
    'financeiro.delete',
    'financeiro.reports',
    'financeiro.admin'
  ]
};