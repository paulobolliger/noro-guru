/**
 * Blueprint v1.0 - Zod Validation Schema
 * 
 * Comprehensive validation for site builder blueprint JSON.
 * Ensures blueprint integrity before saving to database.
 */

import { z } from 'zod';
import { 
  SectionType, 
  ButtonVariant, 
  AlignmentType, 
  ColorScheme, 
  FontFamily,
  SiteVibe,
  HeroVariant,
  FeaturesVariant,
  BLUEPRINT_VERSION 
} from './enums';

// ===========================
// Common Schemas
// ===========================

const ColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color');

const UrlSchema = z.string().url().or(z.string().regex(/^\//, 'Must be absolute URL or path starting with /')).or(z.string().regex(/^#/, 'Must be absolute URL, path starting with /, or anchor starting with #'));

const ButtonSchema = z.object({
  text: z.string().min(1).max(50),
  url: UrlSchema,
  variant: z.nativeEnum(ButtonVariant).default(ButtonVariant.PRIMARY),
  openInNewTab: z.boolean().default(false),
});

const ImageSchema = z.object({
  url: UrlSchema,
  alt: z.string().max(200),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

// ===========================
// Theme Schema
// ===========================

const ThemeSchema = z.object({
  primaryColor: ColorSchema,
  secondaryColor: ColorSchema.optional(),
  accentColor: ColorSchema.optional(),
  backgroundColor: ColorSchema.default('#FFFFFF'),
  textColor: ColorSchema.default('#000000'),
  fontFamily: z.nativeEnum(FontFamily).default(FontFamily.INTER),
  colorScheme: z.nativeEnum(ColorScheme).default(ColorScheme.LIGHT),
  vibe: z.nativeEnum(SiteVibe).default(SiteVibe.MODERN),
});

// ===========================
// Section Config Schemas
// ===========================

const HeroConfigSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().max(200).optional(),
  description: z.string().max(500).optional(),
  backgroundImage: ImageSchema.optional(),
  buttons: z.array(ButtonSchema).max(2).default([]),
  alignment: z.nativeEnum(AlignmentType).default(AlignmentType.CENTER),
  variant: z.nativeEnum(HeroVariant).default(HeroVariant.CENTERED),
});

const FeatureItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(80),
  description: z.string().max(300),
  icon: z.string().max(50).optional(), // Icon name or emoji
  image: ImageSchema.optional(),
});

const FeaturesConfigSchema = z.object({
  title: z.string().max(100).optional(),
  subtitle: z.string().max(200).optional(),
  items: z.array(FeatureItemSchema).min(1).max(12),
  columns: z.number().int().min(1).max(4).default(3),
  variant: z.nativeEnum(FeaturesVariant).default(FeaturesVariant.GRID),
});

const CTAConfigSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(300).optional(),
  buttons: z.array(ButtonSchema).min(1).max(2),
  backgroundImage: ImageSchema.optional(),
  backgroundColor: ColorSchema.optional(),
});

const ContentConfigSchema = z.object({
  title: z.string().max(100).optional(),
  content: z.string().min(1).max(5000), // Rich text or markdown
  alignment: z.nativeEnum(AlignmentType).default(AlignmentType.LEFT),
  image: ImageSchema.optional(),
  imagePosition: z.enum(['left', 'right', 'top', 'bottom']).default('right'),
});

const GalleryConfigSchema = z.object({
  title: z.string().max(100).optional(),
  images: z.array(ImageSchema).min(1).max(50),
  columns: z.number().int().min(1).max(6).default(3),
});

const PricingTierSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
  price: z.string().max(30), // "R$ 99/mês" or "Free"
  description: z.string().max(200).optional(),
  features: z.array(z.string().max(100)).max(20),
  ctaButton: ButtonSchema,
  highlighted: z.boolean().default(false),
});

const PricingConfigSchema = z.object({
  title: z.string().max(100).optional(),
  subtitle: z.string().max(200).optional(),
  tiers: z.array(PricingTierSchema).min(1).max(6),
});

const TestimonialItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(80),
  role: z.string().max(80).optional(),
  company: z.string().max(80).optional(),
  avatar: ImageSchema.optional(),
  content: z.string().min(1).max(500),
  rating: z.number().int().min(1).max(5).optional(),
});

const TestimonialsConfigSchema = z.object({
  title: z.string().max(100).optional(),
  items: z.array(TestimonialItemSchema).min(1).max(20),
});

const FAQItemSchema = z.object({
  id: z.string(),
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(1000),
});

const FAQConfigSchema = z.object({
  title: z.string().max(100).optional(),
  items: z.array(FAQItemSchema).min(1).max(50),
});

const ContactConfigSchema = z.object({
  title: z.string().max(100).optional(),
  subtitle: z.string().max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  address: z.string().max(200).optional(),
  showContactForm: z.boolean().default(true),
  socialLinks: z.array(z.object({
    platform: z.string().max(30),
    url: UrlSchema,
  })).max(10).default([]),
});

const FooterConfigSchema = z.object({
  companyName: z.string().max(100).optional(),
  tagline: z.string().max(200).optional(),
  logo: ImageSchema.optional(),
  links: z.array(z.object({
    text: z.string().max(50),
    url: UrlSchema,
  })).max(20).default([]),
  socialLinks: z.array(z.object({
    platform: z.string().max(30),
    url: UrlSchema,
  })).max(10).default([]),
  copyright: z.string().max(100).optional(),
});

// ===========================
// Section Schema (Discriminated Union)
// ===========================

const BaseSectionSchema = z.object({
  id: z.string().min(1),
  visible: z.boolean().default(true),
});

const SectionSchema = z.discriminatedUnion('type', [
  BaseSectionSchema.extend({
    type: z.literal(SectionType.HERO),
    config: HeroConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.FEATURES),
    config: FeaturesConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.CTA),
    config: CTAConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.CONTENT),
    config: ContentConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.GALLERY),
    config: GalleryConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.PRICING),
    config: PricingConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.TESTIMONIALS),
    config: TestimonialsConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.FAQ),
    config: FAQConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.CONTACT),
    config: ContactConfigSchema,
  }),
  BaseSectionSchema.extend({
    type: z.literal(SectionType.FOOTER),
    config: FooterConfigSchema,
  }),
]);

// ===========================
// Navigation Schema
// ===========================

const NavigationItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1).max(50),
  url: UrlSchema,
  children: z.array(z.object({
    text: z.string().min(1).max(50),
    url: UrlSchema,
  })).max(10).default([]),
});

const NavigationSchema = z.object({
  logo: ImageSchema.optional(),
  items: z.array(NavigationItemSchema).max(10),
  ctaButton: ButtonSchema.optional(),
});

// ===========================
// Main Blueprint Schema
// ===========================

export const BlueprintSchema = z.object({
  version: z.literal(BLUEPRINT_VERSION),
  theme: ThemeSchema,
  navigation: NavigationSchema.optional(),
  sections: z.array(SectionSchema).min(1).max(50),
  seo: z.object({
    title: z.string().max(60).optional(),
    description: z.string().max(160).optional(),
    ogImage: UrlSchema.optional(),
    favicon: UrlSchema.optional(),
  }).optional(),
});

// ===========================
// TypeScript Types (Inferred)
// ===========================

export type Blueprint = z.infer<typeof BlueprintSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type Navigation = z.infer<typeof NavigationSchema>;
export type Button = z.infer<typeof ButtonSchema>;
export type Image = z.infer<typeof ImageSchema>;

// Section-specific config types
export type HeroConfig = z.infer<typeof HeroConfigSchema>;
export type FeaturesConfig = z.infer<typeof FeaturesConfigSchema>;
export type CTAConfig = z.infer<typeof CTAConfigSchema>;
export type ContentConfig = z.infer<typeof ContentConfigSchema>;
export type GalleryConfig = z.infer<typeof GalleryConfigSchema>;
export type PricingConfig = z.infer<typeof PricingConfigSchema>;
export type TestimonialsConfig = z.infer<typeof TestimonialsConfigSchema>;
export type FAQConfig = z.infer<typeof FAQConfigSchema>;
export type ContactConfig = z.infer<typeof ContactConfigSchema>;
export type FooterConfig = z.infer<typeof FooterConfigSchema>;
