CREATE TABLE "noro"."bsp_ingestions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"file_size" bigint NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"error_log" text,
	"processed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bsp_ingestions_tenant_id_id_uq" UNIQUE("tenant_id","id")
);
--> statement-breakpoint
CREATE TABLE "noro"."bsp_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"bsp_ingestion_id" uuid NOT NULL,
	"ticket_number" text NOT NULL,
	"transaction_type" text NOT NULL,
	"issue_date" timestamp with time zone,
	"billing_amount" numeric(14, 2) NOT NULL,
	"tax_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"commission_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"reconciled_state" text DEFAULT 'UNRECONCILED' NOT NULL,
	"reconciled_at" timestamp with time zone,
	"matched_doc_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bsp_records_tenant_id_id_uq" UNIQUE("tenant_id","id")
);
--> statement-breakpoint
CREATE TABLE "noro"."agency_memos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"memo_type" text NOT NULL,
	"memo_number" text NOT NULL,
	"supplier_id" uuid NOT NULL,
	"ticket_number" text,
	"amount" numeric(14, 2) NOT NULL,
	"reason" text,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "agency_memos_tenant_id_id_uq" UNIQUE("tenant_id","id"),
	CONSTRAINT "uq_memo_number" UNIQUE("tenant_id","memo_number")
);
--> statement-breakpoint
ALTER TABLE "noro"."bsp_records" ADD CONSTRAINT "fk_bsp_records_ingestion_tenant" FOREIGN KEY ("tenant_id","bsp_ingestion_id") REFERENCES "noro"."bsp_ingestions"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."bsp_records" ADD CONSTRAINT "fk_bsp_records_doc_tenant" FOREIGN KEY ("tenant_id","matched_doc_id") REFERENCES "noro"."traffic_documents"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."agency_memos" ADD CONSTRAINT "fk_agency_memos_supplier" FOREIGN KEY ("supplier_id") REFERENCES "noro"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_bsp_ingestion_status" ON "noro"."bsp_ingestions" USING btree ("tenant_id","status");--> statement-breakpoint
CREATE INDEX "ix_bsp_records_ticket" ON "noro"."bsp_records" USING btree ("tenant_id","ticket_number");--> statement-breakpoint
CREATE INDEX "ix_bsp_records_reconciled" ON "noro"."bsp_records" USING btree ("tenant_id","reconciled_state");--> statement-breakpoint
CREATE INDEX "ix_memos_supplier" ON "noro"."agency_memos" USING btree ("tenant_id","supplier_id");--> statement-breakpoint
CREATE INDEX "ix_memos_status" ON "noro"."agency_memos" USING btree ("tenant_id","status");