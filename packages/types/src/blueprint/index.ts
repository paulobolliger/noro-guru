/**
 * Blueprint Package - Main Entry Point
 * 
 * Exports all blueprint-related types, schemas, and utilities.
 */

export * from './enums';
export * from './schema';
export * from './examples';
export * from './simple-schema';
export * from './adapter';
export * from './simple-examples';

// Re-export commonly used items for convenience
export { BlueprintSchema } from './schema';
export type { Blueprint, Section, Theme } from './schema';
export { SectionType, ButtonVariant } from './enums';

// Simple blueprint (AI output)
export { SimpleBlueprintSchema } from './simple-schema';
export type { SimpleBlueprint } from './simple-schema';

// Adapter
export { adaptSimpleBlueprint, safeAdaptBlueprint, adaptWithFallback } from './adapter';
