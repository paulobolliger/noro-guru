CREATE TABLE "noro"."client_portal_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"client_id" uuid,
	"client_email" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "client_portal_sessions_token_uidx" ON "noro"."client_portal_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "client_portal_sessions_tenant_id_idx" ON "noro"."client_portal_sessions" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "client_portal_sessions_client_id_idx" ON "noro"."client_portal_sessions" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "client_portal_sessions_client_email_idx" ON "noro"."client_portal_sessions" USING btree ("client_email");--> statement-breakpoint
CREATE INDEX "client_portal_sessions_expires_at_idx" ON "noro"."client_portal_sessions" USING btree ("expires_at");