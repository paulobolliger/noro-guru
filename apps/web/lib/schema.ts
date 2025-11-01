// Schema.org JSON-LD types for SEO

export function getOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': 'https://noro.guru/#organization',
    name: 'NORO',
    legalName: 'NORO Tecnologia LTDA',
    url: 'https://noro.guru',
    logo: 'https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969739/edited-photo_4_txwuti.png',
    description: 'Plataforma completa de gestão empresarial com CRM, ERP, Financeiro e Automação integrados.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'BR',
      addressRegion: 'SP',
      addressLocality: 'São Paulo',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+55-11-99999-9999',
      contactType: 'customer service',
      email: 'contato@noro.guru',
      availableLanguage: ['Portuguese', 'English'],
    },
    sameAs: [
      'https://www.linkedin.com/company/noro',
      'https://twitter.com/noro',
      'https://www.instagram.com/noro',
    ],
  };
}

export function getWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': 'https://noro.guru/#website',
    url: 'https://noro.guru',
    name: 'NORO - Gestão Empresarial Inteligente',
    description: 'Transforme sua gestão com inteligência artificial e automação. CRM, ERP, Financeiro tudo integrado.',
    publisher: {
      '@id': 'https://noro.guru/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://noro.guru/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getWebPageSchema(params: {
  url: string;
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    '@type': 'WebPage',
    '@id': `${params.url}#webpage`,
    url: params.url,
    name: params.title,
    description: params.description,
    isPartOf: {
      '@id': 'https://noro.guru/#website',
    },
    about: {
      '@id': 'https://noro.guru/#organization',
    },
    datePublished: params.datePublished || new Date().toISOString(),
    dateModified: params.dateModified || new Date().toISOString(),
    inLanguage: 'pt-BR',
  };
}

export function getSoftwareApplicationSchema() {
  return {
    '@type': 'SoftwareApplication',
    name: 'NORO Platform',
    operatingSystem: 'Web',
    applicationCategory: 'BusinessApplication',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      lowPrice: '297',
      highPrice: '997',
      offerCount: '3',
    },
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
