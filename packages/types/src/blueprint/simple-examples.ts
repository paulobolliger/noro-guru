/**
 * Blueprint v1.0 - Simple Examples
 * 
 * Examples matching the AI prompt output format
 */

import { SimpleBlueprint } from './simple-schema';

// ===========================
// VALID SIMPLE BLUEPRINT (AI Output)
// ===========================

export const validSimpleBlueprint: SimpleBlueprint = {
  version: '1.0',
  meta: {
    language: 'pt',
    title: 'Agência Viagens Personalizadas - Roteiros Únicos',
    description: 'Criamos experiências de viagem únicas e personalizadas para você e sua família.',
  },
  theme: {
    primaryColor: '#2563EB',
    fontFamily: 'Inter',
  },
  navigation: [
    {
      label: 'Início',
      sectionId: 'hero',
    },
    {
      label: 'Serviços',
      sectionId: 'services',
    },
    {
      label: 'Sobre',
      sectionId: 'about',
    },
    {
      label: 'Contato',
      sectionId: 'contact',
    },
  ],
  sections: [
    {
      id: 'hero',
      type: 'hero',
      config: {
        title: 'Viagens personalizadas que superam expectativas',
        subtitle: 'Experiências únicas pensadas especialmente para você',
        ctaText: 'Fale conosco no WhatsApp',
      },
    },
    {
      id: 'services',
      type: 'services',
      config: {
        items: [
          'Roteiros personalizados',
          'Pacotes nacionais e internacionais',
          'Lua de mel',
          'Viagens em família',
          'Viagens corporativas',
        ],
      },
    },
    {
      id: 'about',
      type: 'about',
      config: {
        text: 'Somos especialistas em criar experiências de viagem inesquecíveis. Com mais de 10 anos de mercado, nossa missão é transformar seus sonhos de viagem em realidade através de roteiros totalmente personalizados.',
      },
    },
    {
      id: 'cta',
      type: 'cta',
      config: {
        title: 'Pronto para sua próxima aventura?',
        buttonText: 'Planejar minha viagem',
      },
    },
    {
      id: 'contact',
      type: 'contact',
      config: {
        headline: 'Entre em contato',
        description: 'Fale conosco pelo WhatsApp e receba um atendimento personalizado',
        contactMethod: 'whatsapp',
      },
    },
  ],
  footer: {
    text: '© 2026 Viagens Personalizadas. Todos os direitos reservados.',
  },
};

// ===========================
// ENGLISH VERSION
// ===========================

export const validSimpleBlueprintEN: SimpleBlueprint = {
  version: '1.0',
  meta: {
    language: 'en',
    title: 'Custom Travel Agency - Unique Experiences',
    description: 'We create unique and personalized travel experiences for you and your family.',
  },
  theme: {
    primaryColor: '#10B981',
    fontFamily: 'Open Sans',
  },
  navigation: [
    {
      label: 'Home',
      sectionId: 'hero',
    },
    {
      label: 'Services',
      sectionId: 'services',
    },
    {
      label: 'About',
      sectionId: 'about',
    },
    {
      label: 'Contact',
      sectionId: 'contact',
    },
  ],
  sections: [
    {
      id: 'hero',
      type: 'hero',
      config: {
        title: 'Personalized travel that exceeds expectations',
        subtitle: 'Unique experiences designed especially for you',
        ctaText: 'Contact us on WhatsApp',
      },
    },
    {
      id: 'services',
      type: 'services',
      config: {
        items: [
          'Custom itineraries',
          'Domestic and international packages',
          'Honeymoon trips',
          'Family vacations',
        ],
      },
    },
    {
      id: 'about',
      type: 'about',
      config: {
        text: 'We specialize in creating unforgettable travel experiences. With over 10 years in the market, our mission is to turn your travel dreams into reality through fully personalized itineraries.',
      },
    },
    {
      id: 'cta',
      type: 'cta',
      config: {
        title: 'Ready for your next adventure?',
        buttonText: 'Plan my trip',
      },
    },
    {
      id: 'contact',
      type: 'contact',
      config: {
        headline: 'Get in touch',
        description: 'Contact us on WhatsApp and receive personalized service',
        contactMethod: 'whatsapp',
      },
    },
  ],
  footer: {
    text: '© 2026 Custom Travel. All rights reserved.',
  },
};

// ===========================
// INVALID EXAMPLES
// ===========================

export const invalidSimpleBlueprints = {
  // Wrong language code
  invalidLanguage: {
    version: '1.0',
    meta: {
      language: 'fr', // Only pt, en, es allowed
      title: 'Test',
      description: 'Test',
    },
    theme: {
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
    },
    navigation: [],
    sections: [
      { id: 'h1', type: 'hero', config: { title: 'Test' } },
      { id: 's1', type: 'services', config: { items: ['A'] } },
      { id: 'c1', type: 'contact', config: { contactMethod: 'whatsapp' } },
    ],
    footer: { text: 'Footer' },
  },

  // Less than 3 sections (minimum)
  tooFewSections: {
    version: '1.0',
    meta: {
      language: 'pt',
      title: 'Test',
      description: 'Test',
    },
    theme: {
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
    },
    navigation: [],
    sections: [
      { id: 'h1', type: 'hero', config: { title: 'Test' } },
    ],
    footer: { text: 'Footer' },
  },

  // Invalid contact method
  invalidContactMethod: {
    version: '1.0',
    meta: {
      language: 'pt',
      title: 'Test',
      description: 'Test',
    },
    theme: {
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
    },
    navigation: [],
    sections: [
      { id: 'h1', type: 'hero', config: { title: 'Test' } },
      { id: 's1', type: 'services', config: { items: ['A'] } },
      { id: 'c1', type: 'contact', config: { contactMethod: 'email' } }, // Must be 'whatsapp'
    ],
    footer: { text: 'Footer' },
  },

  // Services with empty items
  emptyServices: {
    version: '1.0',
    meta: {
      language: 'pt',
      title: 'Test',
      description: 'Test',
    },
    theme: {
      primaryColor: '#3B82F6',
      fontFamily: 'Inter',
    },
    navigation: [],
    sections: [
      { id: 'h1', type: 'hero', config: { title: 'Test' } },
      { id: 's1', type: 'services', config: { items: [] } }, // Min 1 item
      { id: 'c1', type: 'contact', config: { contactMethod: 'whatsapp' } },
    ],
    footer: { text: 'Footer' },
  },

  // Invalid color format
  invalidColor: {
    version: '1.0',
    meta: {
      language: 'pt',
      title: 'Test',
      description: 'Test',
    },
    theme: {
      primaryColor: 'blue', // Must be hex #RRGGBB
      fontFamily: 'Inter',
    },
    navigation: [],
    sections: [
      { id: 'h1', type: 'hero', config: { title: 'Test' } },
      { id: 's1', type: 'services', config: { items: ['A'] } },
      { id: 'c1', type: 'contact', config: { contactMethod: 'whatsapp' } },
    ],
    footer: { text: 'Footer' },
  },
};
