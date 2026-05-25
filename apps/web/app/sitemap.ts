import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://noro.guru';
  const now = new Date();

  const route = (
    path: string,
    priority: number = 0.7,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly'
  ) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    // Core
    route('/', 1.0, 'weekly'),
    route('/pricing', 0.9, 'weekly'),
    route('/demo', 0.9, 'monthly'),
    route('/wizard', 0.8, 'monthly'),

    // Features
    route('/features', 0.85, 'monthly'),
    route('/features/crm', 0.8, 'monthly'),
    route('/features/financeiro', 0.8, 'monthly'),
    route('/features/ia', 0.8, 'monthly'),
    route('/features/sites', 0.8, 'monthly'),
    route('/features/atendimento', 0.8, 'monthly'),

    // Ecosystem
    route('/ecosystem', 0.8, 'monthly'),
    route('/ecosystem/intelligent-crm-erp', 0.75, 'monthly'),
    route('/ecosystem/intelligent-websites', 0.75, 'monthly'),
    route('/ecosystem/dados-de-vistos', 0.75, 'monthly'),
    route('/ecosystem/ittd', 0.6, 'monthly'),
    route('/ecosystem/control', 0.75, 'monthly'),
    route('/ecosystem/parceiros', 0.7, 'monthly'),

    // About / Company
    route('/about', 0.8, 'monthly'),
    route('/manifesto', 0.7, 'monthly'),
    route('/carreiras', 0.75, 'monthly'),
    route('/imprensa', 0.6, 'monthly'),

    // Blog
    route('/blog', 0.8, 'daily'),
    route('/blog/crm-agencias-turismo', 0.7, 'monthly'),
    route('/blog/ia-propostas-comerciais', 0.7, 'monthly'),
    route('/blog/whatsapp-atendimento-agencias', 0.7, 'monthly'),

    // Cases
    route('/cases', 0.85, 'monthly'),
    route('/case-studies/viagens-experienza', 0.75, 'monthly'),
    route('/case-studies/destinos-do-mundo', 0.75, 'monthly'),
    route('/case-studies/terra-mar-viagens', 0.75, 'monthly'),
    route('/case-studies/sol-e-lua-turismo', 0.75, 'monthly'),

    // Partners & Affiliates
    route('/partners', 0.75, 'monthly'),
    route('/affiliate', 0.75, 'monthly'),

    // Support & Help
    route('/ajuda', 0.8, 'weekly'),
    route('/seguranca', 0.7, 'monthly'),
    route('/status', 0.7, 'daily'),
    route('/changelog', 0.6, 'weekly'),

    // Legal
    route('/terms-of-service', 0.6, 'monthly'),
    route('/privacy-policy', 0.6, 'monthly'),
    route('/cookies', 0.5, 'monthly'),
    route('/lgpd', 0.5, 'monthly'),
    route('/sla', 0.6, 'monthly'),
  ];
}
