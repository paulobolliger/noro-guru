import { ModuleConfig } from './types';

export const billingModule: ModuleConfig = {
  name: 'billing',
  routes: {
    index: '/billing',
    portal: '/billing/portal',
    webhooks: '/billing/webhooks',
    subscriptions: '/billing/subscriptions',
    invoices: '/billing/invoices',
    products: '/billing/products',
    customers: '/billing/customers',
    settings: '/billing/settings'
  },
  api: {
    base: '/api/billing',
    endpoints: {
      // Portal do Stripe
      createPortalSession: '/api/billing/create-portal-session',
      
      // Webhooks
      handleWebhook: '/api/billing/webhooks/stripe',
      getWebhookLogs: '/api/billing/webhooks/logs',
      
      // Assinaturas
      getSubscriptions: '/api/billing/subscriptions',
      createSubscription: '/api/billing/subscriptions/create',
      updateSubscription: '/api/billing/subscriptions/update',
      cancelSubscription: '/api/billing/subscriptions/cancel',
      
      // Faturas
      getInvoices: '/api/billing/invoices',
      createInvoice: '/api/billing/invoices/create',
      payInvoice: '/api/billing/invoices/pay',
      
      // Produtos e Preços
      getProducts: '/api/billing/products',
      createProduct: '/api/billing/products/create',
      updateProduct: '/api/billing/products/update',
      archiveProduct: '/api/billing/products/archive',
      
      // Clientes
      getCustomers: '/api/billing/customers',
      createCustomer: '/api/billing/customers/create',
      updateCustomer: '/api/billing/customers/update',
      
      // Métodos de Pagamento
      getPaymentMethods: '/api/billing/payment-methods',
      attachPaymentMethod: '/api/billing/payment-methods/attach',
      detachPaymentMethod: '/api/billing/payment-methods/detach',
      
      // Configurações
      getSettings: '/api/billing/settings',
      updateSettings: '/api/billing/settings/update'
    }
  },
  permissions: [
    'billing.view',
    'billing.create',
    'billing.edit',
    'billing.delete',
    'billing.webhooks.view',
    'billing.webhooks.manage',
    'billing.settings.view',
    'billing.settings.manage',
    'billing.admin'
  ]
};