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
import { emergencyContacts } from './emergency-contacts';
import { proposalDocuments } from './proposal-documents';
import { proposalItineraryItems } from './proposal-itinerary';
import { proposalMessages } from './proposal-messages';
import { proposalItems, proposals } from './proposals';
import { platformRoleAssignments } from './roles';
import { suppliers } from './suppliers';
import { tenantModules } from './tenant-modules';
import { tenants } from './tenants';
import { users } from './users';
import { bookings } from './bookings';
import { bookingItems } from './booking-items';
import { bookingComponentFinancials } from './booking-component-financials';
import { financialLedgerEntries } from './financial-ledger-entries';
import { trafficDocuments } from './traffic-documents';
import { trafficDocumentCoupons } from './traffic-document-coupons';
import { travelCredits } from './travel-credits';
import { travelCreditMovements } from './travel-credit-movements';
import { fiscalDocuments } from './fiscal-documents';
import { bspIngestions } from './bsp-ingestions';
import { bspRecords } from './bsp-records';
import { agencyMemos } from './agency-memos';
import { exchangeRates } from './exchange-rates';
import { paymentConfigs } from './payment-configs';
import { pricingLogs } from './pricing-logs';
import { integrationLogs } from './integration-logs';

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
export * from './emergency-contacts';
export * from './proposal-documents';
export * from './proposal-itinerary';
export * from './proposal-messages';
export * from './proposals';
export * from './roles';
export * from './suppliers';
export * from './tenant-modules';
export * from './tenants';
export * from './users';
export * from './bookings';
export * from './booking-items';
export * from './booking-component-financials';
export * from './financial-ledger-entries';
export * from './traffic-documents';
export * from './traffic-document-coupons';
export * from './travel-credits';
export * from './travel-credit-movements';
export * from './fiscal-documents';
export * from './bsp-ingestions';
export * from './bsp-records';
export * from './agency-memos';
export * from './vistos';
export * from './partner-api-keys';
export * from './exchange-rates';
export * from './payment-configs';
export * from './pricing-logs';
export * from './integration-logs';





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
  exchangeRates: many(exchangeRates),
  paymentConfigs: many(paymentConfigs),
  pricingLogs: many(pricingLogs),
  integrationLogs: many(integrationLogs),
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
  documents: many(proposalDocuments),
  itineraryItems: many(proposalItineraryItems),
  messages: many(proposalMessages),
  emergencyContacts: many(emergencyContacts),
}));

export const proposalDocumentsRelations = relations(proposalDocuments, ({ one }) => ({
  proposal: one(proposals, {
    fields: [proposalDocuments.proposalId],
    references: [proposals.id],
  }),
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

export const proposalItineraryItemsRelations = relations(proposalItineraryItems, ({ one }) => ({
  proposal: one(proposals, {
    fields: [proposalItineraryItems.proposalId],
    references: [proposals.id],
  }),
  document: one(proposalDocuments, {
    fields: [proposalItineraryItems.documentId],
    references: [proposalDocuments.id],
  }),
}));

export const proposalMessagesRelations = relations(proposalMessages, ({ one }) => ({
  proposal: one(proposals, {
    fields: [proposalMessages.proposalId],
    references: [proposals.id],
  }),
}));

export const emergencyContactsRelations = relations(emergencyContacts, ({ one }) => ({
  proposal: one(proposals, {
    fields: [emergencyContacts.proposalId],
    references: [proposals.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [bookings.tenantId],
    references: [tenants.id],
  }),
  client: one(clients, {
    fields: [bookings.clientId],
    references: [clients.id],
  }),
  items: many(bookingItems),
  financials: many(bookingComponentFinancials),
  ledgerEntries: many(financialLedgerEntries),
}));

export const bookingItemsRelations = relations(bookingItems, ({ one, many }) => ({
  booking: one(bookings, {
    fields: [bookingItems.bookingId],
    references: [bookings.id],
  }),
  supplier: one(suppliers, {
    fields: [bookingItems.supplierId],
    references: [suppliers.id],
  }),
  financials: many(bookingComponentFinancials),
  ledgerEntries: many(financialLedgerEntries),
}));

export const bookingComponentFinancialsRelations = relations(bookingComponentFinancials, ({ one }) => ({
  booking: one(bookings, {
    fields: [bookingComponentFinancials.bookingId],
    references: [bookings.id],
  }),
  component: one(bookingItems, {
    fields: [bookingComponentFinancials.componentId],
    references: [bookingItems.id],
  }),
  supplier: one(suppliers, {
    fields: [bookingComponentFinancials.supplierId],
    references: [suppliers.id],
  }),
}));

export const financialLedgerEntriesRelations = relations(financialLedgerEntries, ({ one }) => ({
  booking: one(bookings, {
    fields: [financialLedgerEntries.bookingId],
    references: [bookings.id],
  }),
  component: one(bookingItems, {
    fields: [financialLedgerEntries.componentId],
    references: [bookingItems.id],
  }),
}));

export const exchangeRatesRelations = relations(exchangeRates, ({ one }) => ({
  tenant: one(tenants, {
    fields: [exchangeRates.tenantId],
    references: [tenants.id],
  }),
  createdByUser: one(users, {
    fields: [exchangeRates.createdById],
    references: [users.id],
  }),
}));

export const paymentConfigsRelations = relations(paymentConfigs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [paymentConfigs.tenantId],
    references: [tenants.id],
  }),
}));

export const pricingLogsRelations = relations(pricingLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [pricingLogs.tenantId],
    references: [tenants.id],
  }),
  product: one(products, {
    fields: [pricingLogs.productId],
    references: [products.id],
  }),
  proposal: one(proposals, {
    fields: [pricingLogs.proposalId],
    references: [proposals.id],
  }),
  booking: one(bookings, {
    fields: [pricingLogs.bookingId],
    references: [bookings.id],
  }),
  supplier: one(suppliers, {
    fields: [pricingLogs.supplierId],
    references: [suppliers.id],
  }),
  exchangeRate: one(exchangeRates, {
    fields: [pricingLogs.exchangeRateId],
    references: [exchangeRates.id],
  }),
  markupRule: one(pricingRules, {
    fields: [pricingLogs.markupRuleId],
    references: [pricingRules.id],
  }),
  createdByUser: one(users, {
    fields: [pricingLogs.createdById],
    references: [users.id],
  }),
}));

export const integrationLogsRelations = relations(integrationLogs, ({ one }) => ({
  tenant: one(tenants, {
    fields: [integrationLogs.tenantId],
    references: [tenants.id],
  }),
  supplier: one(suppliers, {
    fields: [integrationLogs.supplierId],
    references: [suppliers.id],
  }),
  booking: one(bookings, {
    fields: [integrationLogs.bookingId],
    references: [bookings.id],
  }),
}));
