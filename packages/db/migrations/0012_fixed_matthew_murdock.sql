CREATE TYPE "public"."fiscal_doc_status" AS ENUM('PENDING', 'EMITTED', 'CANCELLED', 'ERROR');--> statement-breakpoint
CREATE TYPE "public"."fiscal_doc_type" AS ENUM('NFSE', 'DEBIT_NOTE');--> statement-breakpoint
CREATE TABLE "noro"."fiscal_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"doc_type" "fiscal_doc_type" NOT NULL,
	"doc_number" text,
	"serie" text,
	"amount" numeric(14, 2) NOT NULL,
	"taxable_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"tax_rate" numeric(5, 4) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"status" "fiscal_doc_status" DEFAULT 'PENDING' NOT NULL,
	"pdf_url" text,
	"xml_url" text,
	"external_id" text,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "fiscal_documents_tenant_id_id_uq" UNIQUE("tenant_id","id")
);
--> statement-breakpoint
ALTER TABLE "noro"."fiscal_documents" ADD CONSTRAINT "fk_fiscal_docs_booking_tenant" FOREIGN KEY ("tenant_id","booking_id") REFERENCES "noro"."bookings"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_fiscal_booking" ON "noro"."fiscal_documents" USING btree ("tenant_id","booking_id");--> statement-breakpoint
CREATE INDEX "ix_fiscal_status" ON "noro"."fiscal_documents" USING btree ("tenant_id","status");