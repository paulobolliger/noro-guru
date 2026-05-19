/**
 * Blueprint v1.0 - Examples
 * 
 * Valid and invalid blueprint examples for testing validation.
 */

import { BlueprintSchema } from './schema';
import type { z } from 'zod';
import { SectionType, ButtonVariant, AlignmentType, ColorScheme, FontFamily, SiteVibe, HeroVariant, FeaturesVariant } from './enums';

type BlueprintInput = z.input<typeof BlueprintSchema>;

// ===========================
// VALID EXAMPLE
// ===========================

export const validBlueprint: BlueprintInput = {
  version: '1.0',
  theme: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    fontFamily: FontFamily.INTER,
    colorScheme: ColorScheme.LIGHT,
    vibe: SiteVibe.MODERN,
  },
  navigation: {
    logo: {
      url: '/logo.svg',
      alt: 'Company Logo',
    },
    items: [
      {
        id: 'nav-1',
        text: 'Home',
        url: '/',
        children: [],
      },
      {
        id: 'nav-2',
        text: 'Features',
        url: '#features',
        children: [],
      },
      {
        id: 'nav-3',
        text: 'Pricing',
        url: '#pricing',
        children: [],
      },
    ],
    ctaButton: {
      text: 'Get Started',
      url: '/signup',
      variant: ButtonVariant.PRIMARY,
      openInNewTab: false,
    },
  },
  sections: [
    {
      id: 'hero-1',
      type: SectionType.HERO,
      visible: true,
      config: {
        title: 'Build Your Website in Minutes',
        subtitle: 'No code required',
        description: 'Create stunning websites with our intuitive blueprint-based builder.',
        buttons: [
          {
            text: 'Start Free',
            url: '/signup',
            variant: ButtonVariant.PRIMARY,
            openInNewTab: false,
          },
          {
            text: 'Watch Demo',
            url: 'https://youtube.com/demo',
            variant: ButtonVariant.SECONDARY,
            openInNewTab: true,
          },
        ],
        alignment: AlignmentType.CENTER,
        backgroundImage: {
          url: 'https://images.unsplash.com/photo-hero',
          alt: 'Hero background',
        },
      },
    },
    {
      id: 'features-1',
      type: SectionType.FEATURES,
      visible: true,
      config: {
        title: 'Powerful Features',
        subtitle: 'Everything you need to succeed',
        items: [
          {
            id: 'feature-1',
            title: 'Easy to Use',
            description: 'Drag and drop interface that anyone can master',
            icon: '🎨',
          },
          {
            id: 'feature-2',
            title: 'Fast Deployment',
            description: 'Deploy to production in seconds with Vercel',
            icon: '⚡',
          },
          {
            id: 'feature-3',
            title: 'SEO Optimized',
            description: 'Built-in SEO best practices for better rankings',
            icon: '🚀',
          },
        ],
        columns: 3,
      },
    },
    {
      id: 'pricing-1',
      type: SectionType.PRICING,
      visible: true,
      config: {
        title: 'Simple Pricing',
        subtitle: 'Choose the plan that fits your needs',
        tiers: [
          {
            id: 'tier-free',
            name: 'Free',
            price: 'R$ 0',
            description: 'Perfect for getting started',
            features: [
              '1 site',
              '1 language',
              'Default subdomain',
              'Community support',
            ],
            ctaButton: {
              text: 'Start Free',
              url: '/signup',
              variant: ButtonVariant.OUTLINE,
              openInNewTab: false,
            },
            highlighted: false,
          },
          {
            id: 'tier-pro',
            name: 'Pro',
            price: 'R$ 99/mês',
            description: 'For professionals',
            features: [
              'Unlimited sites',
              'Unlimited languages',
              'Custom domains',
              'Priority support',
              'Advanced analytics',
            ],
            ctaButton: {
              text: 'Upgrade to Pro',
              url: '/checkout',
              variant: ButtonVariant.PRIMARY,
              openInNewTab: false,
            },
            highlighted: true,
          },
        ],
      },
    },
    {
      id: 'cta-1',
      type: SectionType.CTA,
      visible: true,
      config: {
        title: 'Ready to Get Started?',
        description: 'Join thousands of satisfied customers building with our platform',
        buttons: [
          {
            text: 'Start Building',
            url: '/signup',
            variant: ButtonVariant.PRIMARY,
            openInNewTab: false,
          },
        ],
        backgroundColor: '#3B82F6',
      },
    },
    {
      id: 'footer-1',
      type: SectionType.FOOTER,
      visible: true,
      config: {
        companyName: 'SiteBuilder Co.',
        tagline: 'Building the future of web',
        links: [
          { text: 'Privacy Policy', url: '/privacy' },
          { text: 'Terms of Service', url: '/terms' },
          { text: 'Contact', url: '/contact' },
        ],
        socialLinks: [
          { platform: 'twitter', url: 'https://twitter.com/company' },
          { platform: 'linkedin', url: 'https://linkedin.com/company/company' },
        ],
        copyright: '© 2026 SiteBuilder Co. All rights reserved.',
      },
    },
  ],
  seo: {
    title: 'SiteBuilder - Create Websites in Minutes',
    description: 'Build stunning websites with our no-code blueprint builder. Fast, easy, and powerful.',
    ogImage: 'https://example.com/og-image.png',
    favicon: '/favicon.ico',
  },
};

// ===========================
// INVALID EXAMPLES
// ===========================

export const invalidBlueprints = {
  // Missing required version
  missingVersion: {
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [],
  },

  // Wrong version
  wrongVersion: {
    version: '2.0', // Only 1.0 is supported
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [],
  },

  // Invalid color format
  invalidColor: {
    version: '1.0',
    theme: {
      primaryColor: 'blue', // Must be hex #RRGGBB
    },
    sections: [],
  },

  // Missing sections
  noSections: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [], // Must have at least 1 section
  },

  // Invalid section type
  invalidSectionType: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [
      {
        id: 'invalid-1',
        type: 'invalid-type', // Not a valid SectionType
        config: {},
      },
    ],
  },

  // Hero without required title
  heroMissingTitle: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        config: {
          // title is required but missing
          subtitle: 'Some subtitle',
        },
      },
    ],
  },

  // Features with empty items
  featuresEmptyItems: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [
      {
        id: 'features-1',
        type: 'features',
        config: {
          items: [], // Must have at least 1 item
        },
      },
    ],
  },

  // Invalid URL format
  invalidUrl: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [
      {
        id: 'cta-1',
        type: 'cta',
        config: {
          title: 'Call to Action',
          buttons: [
            {
              text: 'Click',
              url: 'not-a-valid-url', // Must be URL or start with /
              variant: 'primary',
            },
          ],
        },
      },
    ],
  },

  // Pricing with no tiers
  pricingNoTiers: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [
      {
        id: 'pricing-1',
        type: 'pricing',
        config: {
          tiers: [], // Must have at least 1 tier
        },
      },
    ],
  },

  // String too long
  titleTooLong: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        config: {
          title: 'A'.repeat(101), // Max 100 characters
        },
      },
    ],
  },

  // Invalid button variant
  invalidButtonVariant: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: [
      {
        id: 'cta-1',
        type: 'cta',
        config: {
          title: 'CTA',
          buttons: [
            {
              text: 'Click',
              url: '/signup',
              variant: 'invalid-variant', // Not in ButtonVariant enum
            },
          ],
        },
      },
    ],
  },

  // Too many sections
  tooManySections: {
    version: '1.0',
    theme: {
      primaryColor: '#3B82F6',
    },
    sections: Array.from({ length: 51 }, (_, i) => ({
      id: `section-${i}`,
      type: 'content',
      config: {
        content: 'Content',
      },
    })), // Max 50 sections
  },
};

// ===========================
// Validation Test Helper
// ===========================

export function testBlueprintValidation() {
  const { BlueprintSchema } = require('./schema');

  console.log('Testing VALID blueprint...');
  try {
    BlueprintSchema.parse(validBlueprint);
    console.log('✅ Valid blueprint passed');
  } catch (error) {
    console.error('❌ Valid blueprint failed:', error);
  }

  console.log('\nTesting INVALID blueprints...');
  Object.entries(invalidBlueprints).forEach(([name, blueprint]) => {
    try {
      BlueprintSchema.parse(blueprint);
      console.error(`❌ ${name} should have failed but passed`);
    } catch (error) {
      console.log(`✅ ${name} correctly rejected`);
    }
  });
}
