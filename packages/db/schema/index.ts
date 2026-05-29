import { relations } from 'drizzle-orm';
import { auditEvents } from './audit';
import { identityLinks } from './identity-links';
import { tenantMemberships } from './memberships';
import { modules } from './modules';
import { planModules, plans } from './plans';
import { platformRoleAssignments } from './roles';
import { tenantModules } from './tenant-modules';
import { tenants } from './tenants';
import { users } from './users';

export * from './_schema';
export * from './audit';
export * from './identity-links';
export * from './memberships';
export * from './modules';
export * from './plans';
export * from './roles';
export * from './tenant-modules';
export * from './tenants';
export * from './users';

export const usersRelations = relations(users, ({ many }) => ({
  identityLinks: many(identityLinks),
  tenantMemberships: many(tenantMemberships),
  platformRoleAssignments: many(platformRoleAssignments),
  auditEvents: many(auditEvents),
}));

export const identityLinksRelations = relations(identityLinks, ({ one }) => ({
  user: one(users, {
    fields: [identityLinks.userId],
    references: [users.id],
  }),
}));

export const tenantsRelations = relations(tenants, ({ one, many }) => ({
  plan: one(plans, {
    fields: [tenants.planId],
    references: [plans.id],
  }),
  tenantMemberships: many(tenantMemberships),
  tenantModules: many(tenantModules),
  auditEvents: many(auditEvents),
}));

export const tenantMembershipsRelations = relations(tenantMemberships, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantMemberships.tenantId],
    references: [tenants.id],
  }),
  user: one(users, {
    fields: [tenantMemberships.userId],
    references: [users.id],
  }),
  invitedByUser: one(users, {
    fields: [tenantMemberships.invitedByUserId],
    references: [users.id],
  }),
}));

export const platformRoleAssignmentsRelations = relations(platformRoleAssignments, ({ one }) => ({
  user: one(users, {
    fields: [platformRoleAssignments.userId],
    references: [users.id],
  }),
  grantedByUser: one(users, {
    fields: [platformRoleAssignments.grantedByUserId],
    references: [users.id],
  }),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  planModules: many(planModules),
  tenantModules: many(tenantModules),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  planModules: many(planModules),
  tenants: many(tenants),
}));

export const planModulesRelations = relations(planModules, ({ one }) => ({
  plan: one(plans, {
    fields: [planModules.planId],
    references: [plans.id],
  }),
  module: one(modules, {
    fields: [planModules.moduleId],
    references: [modules.id],
  }),
}));

export const tenantModulesRelations = relations(tenantModules, ({ one }) => ({
  tenant: one(tenants, {
    fields: [tenantModules.tenantId],
    references: [tenants.id],
  }),
  module: one(modules, {
    fields: [tenantModules.moduleId],
    references: [modules.id],
  }),
}));

export const auditEventsRelations = relations(auditEvents, ({ one }) => ({
  actorUser: one(users, {
    fields: [auditEvents.actorUserId],
    references: [users.id],
  }),
  tenant: one(tenants, {
    fields: [auditEvents.tenantId],
    references: [tenants.id],
  }),
}));
