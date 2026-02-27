/**
 * Blueprint v1.0 - Simple Schema
 * 
 * Lightweight schema for AI-generated blueprints.
 * This is what the AI prompt generates - simpler, cheaper, fewer errors.
 * Use the adapter to convert to full Blueprint schema.
 */

import { z } from 'zod';

// ===========================
// Simple Types
// ===========================

const ColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be valid hex color');

const UrlSchema = z.string().url().or(z.string().regex(/^\//, 'Must be absolute URL or path starting with /'));

// ===========================
// Simple Section Configs
// ===========================

// ===========================
// Simple Section Configs
// ===========================

const SimpleHeroConfigSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().max(200).optional(),
  ctaText: z.string().max(50).optional(),
  variant: z.string().optional(), // 'centered', 'split', 'immersive', etc.
});

const SimpleServicesConfigSchema = z.object({
  items: z.array(z.string().min(1).max(100)).min(1).max(20),
  variant: z.string().optional(), // 'grid', 'list', 'bento'
});

const SimpleAboutConfigSchema = z.object({
  text: z.string().min(1).max(2000),
});

const SimpleCTAConfigSchema = z.object({
  title: z.string().min(1).max(100),
  buttonText: z.string().min(1).max(50),
});

const SimpleContactConfigSchema = z.object({
  headline: z.string().max(100).optional(),
  description: z.string().max(300).optional(),
  contactMethod: z.literal('whatsapp'),
});

// ===========================
// Simple Section (Discriminated Union)
// ===========================

const SimpleSectionSchema = z.discriminatedUnion('type', [
  z.object({
    id: z.string().min(1),
    type: z.literal('hero'),
    config: SimpleHeroConfigSchema,
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('services'),
    config: SimpleServicesConfigSchema,
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('about'),
    config: SimpleAboutConfigSchema,
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('cta'),
    config: SimpleCTAConfigSchema,
  }),
  z.object({
    id: z.string().min(1),
    type: z.literal('contact'),
    config: SimpleContactConfigSchema,
  }),
]);

// ===========================
// Simple Blueprint Schema
// ===========================

export const SimpleBlueprintSchema = z.object({
  version: z.literal('1.0'),
  meta: z.object({
    language: z.enum(['pt', 'en', 'es']),
    title: z.string().min(1).max(60),
    description: z.string().min(1).max(160),
  }),
  theme: z.object({
    primaryColor: ColorSchema,
    fontFamily: z.string().min(1).max(50),
    vibe: z.string().optional(), // 'modern', 'minimal', 'bold', etc.
  }),
  navigation: z.array(z.object({
    label: z.string().min(1).max(50),
    sectionId: z.string().min(1),
  })).max(10),
  sections: z.array(SimpleSectionSchema).min(3).max(20),
  footer: z.object({
    text: z.string().max(200),
  }),
});

// ===========================
// TypeScript Types
// ===========================

export type SimpleBlueprint = z.infer<typeof SimpleBlueprintSchema>;
export type SimpleSection = z.infer<typeof SimpleSectionSchema>;

// Section-specific config types
export type SimpleHeroConfig = z.infer<typeof SimpleHeroConfigSchema>;
export type SimpleServicesConfig = z.infer<typeof SimpleServicesConfigSchema>;
export type SimpleAboutConfig = z.infer<typeof SimpleAboutConfigSchema>;
export type SimpleCTAConfig = z.infer<typeof SimpleCTAConfigSchema>;
export type SimpleContactConfig = z.infer<typeof SimpleContactConfigSchema>;
