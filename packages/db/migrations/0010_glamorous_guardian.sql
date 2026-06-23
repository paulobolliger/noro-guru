CREATE TYPE "public"."doc_state" AS ENUM('DRAFT', 'ISSUED', 'VOIDED', 'EXCHANGED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FLOWN');--> statement-breakpoint
CREATE TYPE "public"."doc_type" AS ENUM('TKTT', 'EMDA', 'EMDS', 'MCO', 'HOTEL_VOUCHER', 'SVC');--> statement-breakpoint
CREATE TABLE "noro"."traffic_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"booking_id" uuid NOT NULL,
	"booking_item_id" uuid NOT NULL,
	"pax_id" uuid NOT NULL,
	"doc_type" "doc_type" NOT NULL,
	"doc_number" text NOT NULL,
	"check_digit" text,
	"validating_carrier" text,
	"state" "doc_state" DEFAULT 'DRAFT' NOT NULL,
	"exchanged_from_doc_id" uuid,
	"original_issue_doc_number" text,
	"original_issue_date" timestamp with time zone,
	"original_issue_agent" text,
	"issued_at" timestamp with time zone,
	"void_deadline" timestamp with time zone,
	"fare_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"tax_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'BRL' NOT NULL,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "traffic_docs_tenant_id_id_uq" UNIQUE("tenant_id","id"),
	CONSTRAINT "uq_doc_number" UNIQUE("tenant_id","doc_number")
);
--> statement-breakpoint
CREATE TABLE "noro"."traffic_document_coupons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"traffic_document_id" uuid NOT NULL,
	"coupon_number" integer NOT NULL,
	"segment_id" uuid,
	"origin" varchar(3) NOT NULL,
	"destination" varchar(3) NOT NULL,
	"departure_at" timestamp with time zone,
	"status" "doc_state" NOT NULL,
	"fare_basis" varchar(30),
	"booking_class" varchar(5),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_doc_coupon" UNIQUE("tenant_id","traffic_document_id","coupon_number")
);
--> statement-breakpoint
ALTER TABLE "noro"."traffic_documents" ADD CONSTRAINT "fk_traffic_docs_booking_tenant" FOREIGN KEY ("tenant_id","booking_id") REFERENCES "noro"."bookings"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."traffic_documents" ADD CONSTRAINT "fk_traffic_docs_item_tenant" FOREIGN KEY ("tenant_id","booking_item_id") REFERENCES "noro"."booking_items"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."traffic_document_coupons" ADD CONSTRAINT "fk_coupons_doc_tenant" FOREIGN KEY ("tenant_id","traffic_document_id") REFERENCES "noro"."traffic_documents"("tenant_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_doc_booking" ON "noro"."traffic_documents" USING btree ("tenant_id","booking_id");--> statement-breakpoint
CREATE INDEX "ix_doc_item" ON "noro"."traffic_documents" USING btree ("tenant_id","booking_item_id");--> statement-breakpoint
CREATE INDEX "ix_doc_state" ON "noro"."traffic_documents" USING btree ("tenant_id","state");--> statement-breakpoint
CREATE INDEX "ix_coupon_doc" ON "noro"."traffic_document_coupons" USING btree ("tenant_id","traffic_document_id");