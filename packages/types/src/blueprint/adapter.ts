/**
 * Blueprint v1.0 - Adapter
 * 
 * Transforms simple AI-generated blueprints into full Blueprint schema.
 * 
 * Flow: AI generates → Simple schema validates → Adapter transforms → Full schema validates → Save to DB
 */

import { SimpleBlueprint, SimpleSection } from './simple-schema';
import { 
  Blueprint, 
  Section, 
  HeroConfig, 
  FeaturesConfig, 
  ContentConfig, 
  CTAConfig, 
  ContactConfig,
  FooterConfig,
} from './schema';
import { 
  SectionType, 
  ButtonVariant, 
  AlignmentType, 
  ColorScheme, 
  FontFamily,
  SiteVibe,
  HeroVariant,
  FeaturesVariant
} from './enums';

/**
 * Maps simple font family string to FontFamily enum
 */
function mapFontFamily(font: string): FontFamily {
  const normalized = font.toLowerCase().replace(/\s+/g, '');
  
  const mapping: Record<string, FontFamily> = {
    'inter': FontFamily.INTER,
    'roboto': FontFamily.ROBOTO,
    'poppins': FontFamily.POPPINS,
    'montserrat': FontFamily.MONTSERRAT,
    'lato': FontFamily.LATO,
    'opensans': FontFamily.OPEN_SANS,
  };
  
  return mapping[normalized] || FontFamily.INTER;
}

/**
 * Maps simple vibe string to SiteVibe enum
 */
function mapSiteVibe(vibe?: string): SiteVibe {
  if (!vibe) return SiteVibe.MODERN;
  
  const normalized = vibe.toLowerCase();
  const mapping: Record<string, SiteVibe> = {
    'modern': SiteVibe.MODERN,
    'minimal': SiteVibe.MINIMAL,
    'bold': SiteVibe.BOLD,
    'elegant': SiteVibe.ELEGANT,
    'playful': SiteVibe.PLAYFUL,
    'corporate': SiteVibe.CORPORATE,
    'startup': SiteVibe.STARTUP,
  };
  
  return mapping[normalized] || SiteVibe.MODERN;
}

/**
 * Maps simple hero variant string to HeroVariant enum
 */
function mapHeroVariant(variant?: string): HeroVariant {
  if (!variant) return HeroVariant.CENTERED;
  
  const normalized = variant.toLowerCase();
  const mapping: Record<string, HeroVariant> = {
    'centered': HeroVariant.CENTERED,
    'split': HeroVariant.SPLIT,
    'minimal': HeroVariant.MINIMAL,
    'immersive': HeroVariant.IMMERSIVE,
    'video': HeroVariant.VIDEO,
  };
  
  return mapping[normalized] || HeroVariant.CENTERED;
}

/**
 * Maps simple features variant string to FeaturesVariant enum
 */
function mapFeaturesVariant(variant?: string): FeaturesVariant {
  if (!variant) return FeaturesVariant.GRID;

  const normalized = variant.toLowerCase();
  const mapping: Record<string, FeaturesVariant> = {
    'grid': FeaturesVariant.GRID,
    'list': FeaturesVariant.LIST,
    'bento': FeaturesVariant.BENTO,
    'cards': FeaturesVariant.CARDS,
    'minimal': FeaturesVariant.MINIMAL,
  };

  return mapping[normalized] || FeaturesVariant.GRID;
}

/**
 * Converts a simple section to a full section
 */
function adaptSection(section: SimpleSection, language: string): Section {
  switch (section.type) {
    case 'hero': {
      const config: HeroConfig = {
        title: section.config.title,
        subtitle: section.config.subtitle,
        alignment: AlignmentType.CENTER,
        variant: mapHeroVariant(section.config.variant),
        buttons: section.config.ctaText ? [{
          text: section.config.ctaText,
          url: 'https://wa.me/', // Will be filled with actual number
          variant: ButtonVariant.PRIMARY,
          openInNewTab: false,
        }] : [],
      };
      
      return {
        id: section.id,
        type: SectionType.HERO,
        visible: true,
        config,
      };
    }
    
    case 'services': {
      const config: FeaturesConfig = {
        title: language === 'pt' ? 'Nossos Serviços' : 
               language === 'es' ? 'Nuestros Servicios' : 
               'Our Services',
        variant: mapFeaturesVariant(section.config.variant),
        items: section.config.items.map((item, index) => ({
          id: `service-${index}`,
          title: item,
          description: '', // AI didn't provide descriptions
        })),
        columns: 3,
      };
      
      return {
        id: section.id,
        type: SectionType.FEATURES,
        visible: true,
        config,
      };
    }
    
    case 'about': {
      const config: ContentConfig = {
        content: section.config.text,
        alignment: AlignmentType.LEFT,
        imagePosition: 'right',
      };
      
      return {
        id: section.id,
        type: SectionType.CONTENT,
        visible: true,
        config,
      };
    }
    
    case 'cta': {
      const config: CTAConfig = {
        title: section.config.title,
        buttons: [{
          text: section.config.buttonText,
          url: 'https://wa.me/', // Will be filled with actual number
          variant: ButtonVariant.PRIMARY,
          openInNewTab: false,
        }],
      };
      
      return {
        id: section.id,
        type: SectionType.CTA,
        visible: true,
        config,
      };
    }
    
    case 'contact': {
      const config: ContactConfig = {
        title: section.config.headline,
        subtitle: section.config.description,
        showContactForm: false, // Using WhatsApp only
        socialLinks: [],
      };
      
      return {
        id: section.id,
        type: SectionType.CONTACT,
        visible: true,
        config,
      };
    }
    
    default:
      // This should never happen due to discriminated union
      throw new Error(`Unknown section type: ${(section as any).type}`);
  }
}

/**
 * Main adapter function: Simple → Full Blueprint
 */
export function adaptSimpleBlueprint(simple: SimpleBlueprint): Blueprint {
  // Convert all sections
  const sections = simple.sections.map(s => adaptSection(s, simple.meta.language));
  
  // Add footer section from top-level footer
  const footerConfig: FooterConfig = {
    copyright: simple.footer.text,
    links: [],
    socialLinks: [],
  };
  
  sections.push({
    id: 'footer',
    type: SectionType.FOOTER,
    visible: true,
    config: footerConfig,
  });
  
  // Build navigation from simple navigation
  const navigation = {
    items: simple.navigation.map((nav, index) => ({
      id: `nav-${index}`,
      text: nav.label,
      url: `#${nav.sectionId}`,
      children: [],
    })),
  };
  
  // Assemble full blueprint
  const blueprint: Blueprint = {
    version: '1.0',
    theme: {
      primaryColor: simple.theme.primaryColor,
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      fontFamily: mapFontFamily(simple.theme.fontFamily),
      colorScheme: ColorScheme.LIGHT,
      vibe: mapSiteVibe(simple.theme.vibe),
    },
    navigation,
    sections,
    seo: {
      title: simple.meta.title,
      description: simple.meta.description,
    },
  };
  
  return blueprint;
}

/**
 * Safe adapter with validation on both ends
 */
export async function safeAdaptBlueprint(rawAiOutput: unknown): Promise<Blueprint> {
  const { SimpleBlueprintSchema } = await import('./simple-schema');
  const { BlueprintSchema } = await import('./schema');
  
  // Step 1: Validate AI output against simple schema
  const simpleBlueprint = SimpleBlueprintSchema.parse(rawAiOutput);
  
  // Step 2: Adapt to full blueprint
  const fullBlueprint = adaptSimpleBlueprint(simpleBlueprint);
  
  // Step 3: Validate adapted blueprint against full schema
  const validatedBlueprint = BlueprintSchema.parse(fullBlueprint);
  
  return validatedBlueprint;
}

/**
 * Adapter with error handling and fallback
 */
export async function adaptWithFallback(
  rawAiOutput: unknown,
  fallbackBlueprint?: Blueprint
): Promise<{ blueprint: Blueprint; usedFallback: boolean }> {
  try {
    const blueprint = await safeAdaptBlueprint(rawAiOutput);
    return { blueprint, usedFallback: false };
  } catch (error) {
    console.error('Blueprint adaptation failed:', error);
    
    if (fallbackBlueprint) {
      return { blueprint: fallbackBlueprint, usedFallback: true };
    }
    
    throw error;
  }
}
