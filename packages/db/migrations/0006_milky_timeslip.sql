CREATE TABLE "noro"."payment_charges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"proposal_id" uuid,
	"payment_customer_id" uuid,
	"provider" text DEFAULT 'asaas' NOT NULL,
	"provider_payment_id" text,
	"repasse_modelo" text NOT NULL,
	"amount_cents" bigint NOT NULL,
	"net_amount_cents" bigint,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"taxa_cambio_snapshot" numeric(10, 6),
	"billing_type" text NOT NULL,
	"installments" integer DEFAULT 1,
	"status" text DEFAULT 'draft' NOT NULL,
	"due_date" date,
	"paid_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"received_at" timestamp with time zone,
	"escrow_status" text,
	"escrow_release_at" timestamp with time zone,
	"escrow_released_at" timestamp with time zone,
	"split_noro_pct" numeric(5, 2),
	"split_noro_cents" bigint,
	"split_tenant_cents" bigint,
	"checkout_url" text,
	"invoice_url" text,
	"bank_slip_url" text,
	"pix_qr_code" text,
	"pix_copy_paste" text,
	"sinal_valor_cents" bigint,
	"sinal_pago_at" timestamp with time zone,
	"sinal_meio" text,
	"provider_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."payment_customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"client_id" uuid,
	"provider" text DEFAULT 'asaas' NOT NULL,
	"provider_customer_id" text NOT NULL,
	"name" text,
	"email" text,
	"cpf_cnpj" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."payment_provider_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"provider" text DEFAULT 'asaas' NOT NULL,
	"provider_account_id" text,
	"provider_wallet_id" text,
	"onboarding_status" text DEFAULT 'pending' NOT NULL,
	"consent_registered_at" timestamp with time zone,
	"consent_registered_by" uuid,
	"status" text DEFAULT 'inactive' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."payment_webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text DEFAULT 'asaas' NOT NULL,
	"provider_event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"charge_id" uuid,
	"payload" jsonb NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "noro"."payment_charges" ADD CONSTRAINT "payment_charges_payment_customer_id_payment_customers_id_fk" FOREIGN KEY ("payment_customer_id") REFERENCES "noro"."payment_customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pch_tenant_id_idx" ON "noro"."payment_charges" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "pch_proposal_id_idx" ON "noro"."payment_charges" USING btree ("proposal_id");--> statement-breakpoint
CREATE INDEX "pch_status_idx" ON "noro"."payment_charges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "pch_repasse_modelo_idx" ON "noro"."payment_charges" USING btree ("repasse_modelo");--> statement-breakpoint
CREATE INDEX "pch_provider_payment_id_idx" ON "noro"."payment_charges" USING btree ("provider_payment_id");--> statement-breakpoint
CREATE INDEX "pch_escrow_status_idx" ON "noro"."payment_charges" USING btree ("escrow_status");--> statement-breakpoint
CREATE UNIQUE INDEX "pc_tenant_provider_customer_uidx" ON "noro"."payment_customers" USING btree ("tenant_id","provider","provider_customer_id");--> statement-breakpoint
CREATE INDEX "pc_tenant_id_idx" ON "noro"."payment_customers" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "pc_client_id_idx" ON "noro"."payment_customers" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "ppa_tenant_provider_uidx" ON "noro"."payment_provider_accounts" USING btree ("tenant_id","provider");--> statement-breakpoint
CREATE INDEX "ppa_status_idx" ON "noro"."payment_provider_accounts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ppa_onboarding_status_idx" ON "noro"."payment_provider_accounts" USING btree ("onboarding_status");--> statement-breakpoint
CREATE UNIQUE INDEX "pwe_provider_event_uidx" ON "noro"."payment_webhook_events" USING btree ("provider","provider_event_id");--> statement-breakpoint
CREATE INDEX "pwe_charge_id_idx" ON "noro"."payment_webhook_events" USING btree ("charge_id");--> statement-breakpoint
CREATE INDEX "pwe_processed_idx" ON "noro"."payment_webhook_events" USING btree ("processed");--> statement-breakpoint
CREATE INDEX "pwe_event_type_idx" ON "noro"."payment_webhook_events" USING btree ("event_type");