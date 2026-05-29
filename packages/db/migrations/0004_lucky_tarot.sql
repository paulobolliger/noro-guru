ALTER TABLE "noro"."tenants" ADD COLUMN "portal_slug" text;--> statement-breakpoint
ALTER TABLE "noro"."tenants" ADD COLUMN "portal_domain" text;--> statement-breakpoint
ALTER TABLE "noro"."tenants" ADD COLUMN "portal_theme" jsonb;--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_portal_slug_uidx" ON "noro"."tenants" USING btree ("portal_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_portal_domain_uidx" ON "noro"."tenants" USING btree ("portal_domain");