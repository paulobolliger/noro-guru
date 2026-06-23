CREATE TABLE "noro"."travel_credits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"owner_type" text NOT NULL,
	"owner_passenger_id" uuid,
	"owner_company_id" uuid,
	"source_doc_id" uuid NOT NULL,
	"credit_doc_number" text,
	"original_amount" numeric(14, 2) NOT NULL,
	"remaining_amount" numeric(14, 2) NOT NULL,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"is_refundable" boolean DEFAULT false NOT NULL,
	"issued_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "travel_credits_tenant_id_id_uq" UNIQUE("tenant_id","id")
);
--> statement-breakpoint
CREATE TABLE "noro"."travel_credit_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"travel_credit_id" uuid NOT NULL,
	"movement_type" text NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"related_booking_id" uuid,
	"related_doc_id" uuid,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"idempotency_key" text NOT NULL,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "uq_credit_mvmt_idem" UNIQUE("tenant_id","idempotency_key")
);
--> statement-breakpoint
ALTER TABLE "noro"."travel_credits" ADD CONSTRAINT "fk_travel_credits_source_doc_tenant" FOREIGN KEY ("tenant_id","source_doc_id") REFERENCES "noro"."traffic_documents"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."travel_credit_movements" ADD CONSTRAINT "fk_mvmt_credit_tenant" FOREIGN KEY ("tenant_id","travel_credit_id") REFERENCES "noro"."travel_credits"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."travel_credit_movements" ADD CONSTRAINT "fk_mvmt_booking_tenant" FOREIGN KEY ("tenant_id","related_booking_id") REFERENCES "noro"."bookings"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."travel_credit_movements" ADD CONSTRAINT "fk_mvmt_doc_tenant" FOREIGN KEY ("tenant_id","related_doc_id") REFERENCES "noro"."traffic_documents"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_credit_owner_pax" ON "noro"."travel_credits" USING btree ("tenant_id","owner_passenger_id");--> statement-breakpoint
CREATE INDEX "ix_credit_owner_company" ON "noro"."travel_credits" USING btree ("tenant_id","owner_company_id");--> statement-breakpoint
CREATE INDEX "ix_credit_expiry" ON "noro"."travel_credits" USING btree ("tenant_id","expires_at","status");--> statement-breakpoint
CREATE INDEX "ix_mvmt_credit" ON "noro"."travel_credit_movements" USING btree ("tenant_id","travel_credit_id");