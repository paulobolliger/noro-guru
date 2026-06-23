CREATE TYPE "public"."booking_status" AS ENUM('draft', 'quoted', 'confirmed', 'voucher_issued', 'travelling', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('BRL', 'USD', 'EUR', 'GBP');--> statement-breakpoint
CREATE TYPE "public"."item_status" AS ENUM('pending', 'confirmed', 'cancelled', 'modified', 'no_show');--> statement-breakpoint
CREATE TYPE "public"."service_type" AS ENUM('flight', 'hotel', 'transfer', 'ticket', 'insurance', 'tour', 'car_rental', 'visa');--> statement-breakpoint
CREATE TYPE "public"."operation_mode" AS ENUM('INTERMEDIATION', 'OWN_ACCOUNT');--> statement-breakpoint
CREATE TABLE "noro"."bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"reference" varchar(20) NOT NULL,
	"client_id" uuid NOT NULL,
	"buyer_party_id" uuid,
	"payer_party_id" uuid,
	"corporate_account_id" uuid,
	"status" "booking_status" DEFAULT 'draft' NOT NULL,
	"currency" "currency" DEFAULT 'BRL' NOT NULL,
	"sale_date" timestamp with time zone,
	"travel_start_date" date,
	"travel_end_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."booking_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"service_type" "service_type" NOT NULL,
	"supplier_id" uuid NOT NULL,
	"status" "item_status" DEFAULT 'pending' NOT NULL,
	"service_date" timestamp with time zone,
	"supplier_payload_snapshot" jsonb,
	"normalized_snapshot" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."booking_component_financials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"component_id" uuid NOT NULL,
	"operation_mode" "operation_mode" NOT NULL,
	"supplier_net_amount" numeric(14, 2) NOT NULL,
	"supplier_commission_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"markup_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"service_fee_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"discount_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"gross_client_amount" numeric(14, 2) NOT NULL,
	"taxable_service_amount" numeric(14, 2) NOT NULL,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"supplier_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."financial_ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"component_id" uuid,
	"source_type" text NOT NULL,
	"source_id" uuid NOT NULL,
	"entry_type" text NOT NULL,
	"debit_account" text NOT NULL,
	"credit_account" text NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"currency" text NOT NULL,
	"occurred_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "noro"."bookings" ADD CONSTRAINT "bookings_tenant_id_id_uq" UNIQUE ("tenant_id","id");--> statement-breakpoint
ALTER TABLE "noro"."booking_items" ADD CONSTRAINT "booking_items_tenant_id_id_uq" UNIQUE ("tenant_id","id");--> statement-breakpoint
ALTER TABLE "noro"."booking_component_financials" ADD CONSTRAINT "bcf_tenant_id_id_uq" UNIQUE ("tenant_id","id");--> statement-breakpoint
ALTER TABLE "noro"."bookings" ADD CONSTRAINT "bookings_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."bookings" ADD CONSTRAINT "bookings_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "noro"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_items" ADD CONSTRAINT "booking_items_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "noro"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_items" ADD CONSTRAINT "booking_items_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "noro"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_items" ADD CONSTRAINT "fk_booking_items_booking_tenant" FOREIGN KEY ("tenant_id","booking_id") REFERENCES "noro"."bookings"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_component_financials" ADD CONSTRAINT "booking_component_financials_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "noro"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_component_financials" ADD CONSTRAINT "booking_component_financials_component_id_booking_items_id_fk" FOREIGN KEY ("component_id") REFERENCES "noro"."booking_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_component_financials" ADD CONSTRAINT "booking_component_financials_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "noro"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_component_financials" ADD CONSTRAINT "fk_bcf_booking_tenant" FOREIGN KEY ("tenant_id","booking_id") REFERENCES "noro"."bookings"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."booking_component_financials" ADD CONSTRAINT "fk_bcf_component_tenant" FOREIGN KEY ("tenant_id","component_id") REFERENCES "noro"."booking_items"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."financial_ledger_entries" ADD CONSTRAINT "financial_ledger_entries_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "noro"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."financial_ledger_entries" ADD CONSTRAINT "fk_ledger_booking_tenant" FOREIGN KEY ("tenant_id","booking_id") REFERENCES "noro"."bookings"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."financial_ledger_entries" ADD CONSTRAINT "fk_ledger_component_tenant" FOREIGN KEY ("tenant_id","component_id") REFERENCES "noro"."booking_items"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "booking_ref_uq" ON "noro"."bookings" USING btree ("tenant_id","reference");--> statement-breakpoint
CREATE INDEX "booking_tenant_id_idx" ON "noro"."bookings" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "booking_client_idx" ON "noro"."bookings" USING btree ("tenant_id","client_id");--> statement-breakpoint
CREATE INDEX "booking_status_idx" ON "noro"."bookings" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "booking_items_booking_idx" ON "noro"."booking_items" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "booking_items_supplier_idx" ON "noro"."booking_items" USING btree ("tenant_id","supplier_id");--> statement-breakpoint
CREATE INDEX "booking_items_status_idx" ON "noro"."booking_items" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "booking_comp_fin_booking_idx" ON "noro"."booking_component_financials" USING btree ("tenant_id","booking_id");--> statement-breakpoint
CREATE INDEX "financial_ledger_booking_idx" ON "noro"."financial_ledger_entries" USING btree ("tenant_id","booking_id");--> statement-breakpoint
CREATE INDEX "financial_ledger_source_idx" ON "noro"."financial_ledger_entries" USING btree ("tenant_id","source_type","source_id");