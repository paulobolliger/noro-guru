/**
 * Blueprint v1.0 - Enums
 * 
 * Enums for blueprint section types, button variants, and other constants.
 */

export enum SectionType {
  HERO = 'hero',
  FEATURES = 'features',
  CTA = 'cta',
  CONTENT = 'content',
  GALLERY = 'gallery',
  PRICING = 'pricing',
  TESTIMONIALS = 'testimonials',
  FAQ = 'faq',
  CONTACT = 'contact',
  FOOTER = 'footer',
}

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost',
}

export enum AlignmentType {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum ColorScheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum FontFamily {
  INTER = 'Inter',
  ROBOTO = 'Roboto',
  POPPINS = 'Poppins',
  MONTSERRAT = 'Montserrat',
  LATO = 'Lato',
  OPEN_SANS = 'Open Sans',
}

export enum SiteVibe {
  MODERN = 'modern',
  MINIMAL = 'minimal',
  BOLD = 'bold',
  ELEGANT = 'elegant',
  PLAYFUL = 'playful',
  CORPORATE = 'corporate',
  STARTUP = 'startup',
}

export enum HeroVariant {
  CENTERED = 'centered',
  SPLIT = 'split',
  MINIMAL = 'minimal',
  IMMERSIVE = 'immersive',
  VIDEO = 'video',
}

export enum FeaturesVariant {
  GRID = 'grid',
  LIST = 'list',
  BENTO = 'bento',
  CARDS = 'cards',
  MINIMAL = 'minimal',
}

export const BLUEPRINT_VERSION = '1.0' as const;
