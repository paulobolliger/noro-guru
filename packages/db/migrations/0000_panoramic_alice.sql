CREATE SCHEMA "noro";
--> statement-breakpoint
CREATE TABLE "noro"."audit_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"tenant_id" uuid,
	"event_type" text NOT NULL,
	"target_type" text,
	"target_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."identity_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"provider_subject" text NOT NULL,
	"provider_email" text,
	"legacy_supabase_user_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."tenant_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'invited' NOT NULL,
	"invited_by_user_id" uuid,
	"joined_at" timestamp with time zone,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'future' NOT NULL,
	"default_limits" jsonb,
	"default_settings" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."plan_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"module_id" uuid NOT NULL,
	"status" text DEFAULT 'enabled' NOT NULL,
	"limits" jsonb,
	"settings" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"billing_interval" text,
	"price_cents" integer,
	"currency" text,
	"limits" jsonb,
	"settings" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."platform_role_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"granted_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."tenant_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"module_id" uuid NOT NULL,
	"status" text DEFAULT 'disabled' NOT NULL,
	"source" text DEFAULT 'manual' NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"limits" jsonb,
	"settings" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."tenants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"legal_name" text,
	"document" text,
	"email" text,
	"phone" text,
	"status" text DEFAULT 'active' NOT NULL,
	"plan_id" uuid,
	"billing_status" text DEFAULT 'trialing' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text,
	"email" text NOT NULL,
	"phone" text,
	"avatar_url" text,
	"status" text DEFAULT 'active' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "noro"."audit_events" ADD CONSTRAINT "audit_events_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."audit_events" ADD CONSTRAINT "audit_events_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."identity_links" ADD CONSTRAINT "identity_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."tenant_memberships" ADD CONSTRAINT "tenant_memberships_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."tenant_memberships" ADD CONSTRAINT "tenant_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."tenant_memberships" ADD CONSTRAINT "tenant_memberships_invited_by_user_id_users_id_fk" FOREIGN KEY ("invited_by_user_id") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."plan_modules" ADD CONSTRAINT "plan_modules_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "noro"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."plan_modules" ADD CONSTRAINT "plan_modules_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "noro"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."platform_role_assignments" ADD CONSTRAINT "platform_role_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."platform_role_assignments" ADD CONSTRAINT "platform_role_assignments_granted_by_user_id_users_id_fk" FOREIGN KEY ("granted_by_user_id") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."tenant_modules" ADD CONSTRAINT "tenant_modules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."tenant_modules" ADD CONSTRAINT "tenant_modules_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "noro"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."tenants" ADD CONSTRAINT "tenants_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "noro"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_events_actor_user_id_idx" ON "noro"."audit_events" USING btree ("actor_user_id");--> statement-breakpoint
CREATE INDEX "audit_events_tenant_id_idx" ON "noro"."audit_events" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "audit_events_event_type_idx" ON "noro"."audit_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "audit_events_created_at_idx" ON "noro"."audit_events" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "identity_links_provider_subject_uidx" ON "noro"."identity_links" USING btree ("provider","provider_subject");--> statement-breakpoint
CREATE INDEX "identity_links_user_id_idx" ON "noro"."identity_links" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "identity_links_legacy_supabase_user_id_idx" ON "noro"."identity_links" USING btree ("legacy_supabase_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_memberships_tenant_user_uidx" ON "noro"."tenant_memberships" USING btree ("tenant_id","user_id");--> statement-breakpoint
CREATE INDEX "tenant_memberships_tenant_id_idx" ON "noro"."tenant_memberships" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_memberships_user_id_idx" ON "noro"."tenant_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "tenant_memberships_role_idx" ON "noro"."tenant_memberships" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "modules_key_uidx" ON "noro"."modules" USING btree ("key");--> statement-breakpoint
CREATE INDEX "modules_status_idx" ON "noro"."modules" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_modules_plan_module_uidx" ON "noro"."plan_modules" USING btree ("plan_id","module_id");--> statement-breakpoint
CREATE INDEX "plan_modules_plan_id_idx" ON "noro"."plan_modules" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "plan_modules_module_id_idx" ON "noro"."plan_modules" USING btree ("module_id");--> statement-breakpoint
CREATE UNIQUE INDEX "plans_key_uidx" ON "noro"."plans" USING btree ("key");--> statement-breakpoint
CREATE INDEX "plans_status_idx" ON "noro"."plans" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "platform_role_assignments_user_role_uidx" ON "noro"."platform_role_assignments" USING btree ("user_id","role");--> statement-breakpoint
CREATE INDEX "platform_role_assignments_user_id_idx" ON "noro"."platform_role_assignments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "platform_role_assignments_role_idx" ON "noro"."platform_role_assignments" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "tenant_modules_tenant_module_uidx" ON "noro"."tenant_modules" USING btree ("tenant_id","module_id");--> statement-breakpoint
CREATE INDEX "tenant_modules_tenant_id_idx" ON "noro"."tenant_modules" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_modules_module_id_idx" ON "noro"."tenant_modules" USING btree ("module_id");--> statement-breakpoint
CREATE INDEX "tenant_modules_status_idx" ON "noro"."tenant_modules" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "tenants_slug_uidx" ON "noro"."tenants" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tenants_status_idx" ON "noro"."tenants" USING btree ("status");--> statement-breakpoint
CREATE INDEX "tenants_plan_id_idx" ON "noro"."tenants" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX "tenants_billing_status_idx" ON "noro"."tenants" USING btree ("billing_status");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "noro"."users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "noro"."users" USING btree ("status");