import { relations } from 'drizzle-orm';
import { auditEvents } from './audit';
import { clientPortalSessions } from './client-portal-sessions';
import { clients } from './clients';
import { identityLinks } from './identity-links';
import { leads } from './leads';
import { tenantMemberships } from './memberships';
import { modules } from './modules';
import { planModules, plans } from './plans';
import { paymentCharges } from './payment-charges';
import { paymentCustomers } from './payment-customers';
import { paymentProviderAccounts } from './payment-provider-accounts';
import { paymentWebhookEvents } from './payment-webhook-events';
import { pricingRules } from './pricing-rules';
import { products } from './products';
import { proposalItems, proposals } from './proposals';
import { platformRoleAssignments } from './roles';
import { suppliers } from './suppliers';
import { tenantModules } from './tenant-modules';
import { tenants } from './tenants';
import { users } from './users';

export * from './_schema';
export * from './audit';
export * from './client-portal-sessions';
export * from './clients';
export * from './identity-links';
export * from './leads';
export * from './memberships';
export * from './modules';
export * from './plans';
export * from './payment-charges';
export * from './payment-customers';
export * from './payment-provider-accounts';
export * from './payment-webhook-events';
export * from './pricing-rules';
export * from './products';
export * from './proposals';
export * from './roles';
export * from './suppliers';
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

export const leadsRelations = relations(leads, ({ one }) => ({
  tenant: one(tenants, {
    fields: [leads.tenantId],
    references: [tenants.id],
  }),
  assignedToUser: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
  }),
  convertedClient: one(clients, {
    fields: [leads.convertedTo],
    references: [clients.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one }) => ({
  tenant: one(tenants, {
    fields: [clients.tenantId],
    references: [tenants.id],
  }),
  originLead: one(leads, {
    fields: [clients.leadId],
    references: [leads.id],
  }),
  assignedToUser: one(users, {
    fields: [clients.assignedTo],
    references: [users.id],
  }),
}));

export const tenantsLeadsRelations = relations(tenants, ({ many }) => ({
  leads: many(leads),
  clients: many(clients),
  pricingRules: many(pricingRules),
}));

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
}));

export const proposalsRelations = relations(proposals, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [proposals.tenantId],
    references: [tenants.id],
  }),
  createdByUser: one(users, {
    fields: [proposals.createdBy],
    references: [users.id],
  }),
  items: many(proposalItems),
}));

export const proposalItemsRelations = relations(proposalItems, ({ one }) => ({
  proposal: one(proposals, {
    fields: [proposalItems.proposalId],
    references: [proposals.id],
  }),
  product: one(products, {
    fields: [proposalItems.productId],
    references: [products.id],
  }),
}));

export const paymentCustomersRelations = relations(paymentCustomers, ({ many }) => ({
  charges: many(paymentCharges),
}));

export const paymentChargesRelations = relations(paymentCharges, ({ one }) => ({
  customer: one(paymentCustomers, {
    fields: [paymentCharges.paymentCustomerId],
    references: [paymentCustomers.id],
  }),
}));

export const pricingRulesRelations = relations(pricingRules, ({ one }) => ({
  tenant: one(tenants, {
    fields: [pricingRules.tenantId],
    references: [tenants.id],
  }),
  plan: one(plans, {
    fields: [pricingRules.planId],
    references: [plans.id],
  }),
}));
