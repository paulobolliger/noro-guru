CREATE TABLE "noro"."proposal_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"proposal_id" uuid,
	"name" text NOT NULL,
	"tipo" text DEFAULT 'outro' NOT NULL,
	"file_url" text NOT NULL,
	"mime_type" text,
	"size_bytes" bigint,
	"uploaded_by" uuid,
	"visible_to_client" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "noro"."proposal_documents" ADD CONSTRAINT "proposal_documents_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "noro"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pd_tenant_id_idx" ON "noro"."proposal_documents" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "pd_proposal_id_idx" ON "noro"."proposal_documents" USING btree ("proposal_id");--> statement-breakpoint
CREATE INDEX "pd_visible_to_client_idx" ON "noro"."proposal_documents" USING btree ("visible_to_client");
