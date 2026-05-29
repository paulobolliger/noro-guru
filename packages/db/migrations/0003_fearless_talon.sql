CREATE TABLE "noro"."proposal_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proposal_id" uuid NOT NULL,
	"product_id" uuid,
	"tipo" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"categoria" text,
	"data_inicio" date,
	"data_fim" date,
	"num_pax" integer,
	"moeda_original" text DEFAULT 'BRL' NOT NULL,
	"taxa_cambio" numeric(10, 6),
	"custo_base_cents" bigint,
	"preco_venda_cents" bigint NOT NULL,
	"markup_percentual" numeric(5, 2),
	"snapshot_pricing_rules" jsonb,
	"ordem" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"lead_id" uuid,
	"client_id" uuid,
	"numero" text NOT NULL,
	"titulo" text NOT NULL,
	"versao" integer DEFAULT 1 NOT NULL,
	"data_viagem_inicio" date,
	"data_viagem_fim" date,
	"num_pax" integer,
	"destino_principal" text,
	"moeda_base" text DEFAULT 'BRL' NOT NULL,
	"subtotal_cents" bigint DEFAULT 0,
	"desconto_cents" bigint DEFAULT 0,
	"total_cents" bigint DEFAULT 0,
	"valor_sinal_cents" bigint,
	"condicoes_pagamento" text,
	"taxa_cambio_snapshot" numeric(10, 6),
	"taxa_cambio_at" timestamp with time zone,
	"status" text DEFAULT 'rascunho' NOT NULL,
	"aceite_tipo" text,
	"aceite_token" text,
	"aceita_at" timestamp with time zone,
	"aceita_por_nome" text,
	"validade_ate" date,
	"descricao" text,
	"observacoes" text,
	"termos_condicoes" text,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "noro"."proposal_items" ADD CONSTRAINT "proposal_items_proposal_id_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "noro"."proposals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."proposal_items" ADD CONSTRAINT "proposal_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "noro"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."proposals" ADD CONSTRAINT "proposals_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."proposals" ADD CONSTRAINT "proposals_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "proposal_items_proposal_id_idx" ON "noro"."proposal_items" USING btree ("proposal_id");--> statement-breakpoint
CREATE INDEX "proposal_items_product_id_idx" ON "noro"."proposal_items" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "proposal_items_ordem_idx" ON "noro"."proposal_items" USING btree ("proposal_id","ordem");--> statement-breakpoint
CREATE INDEX "proposals_tenant_id_idx" ON "noro"."proposals" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "proposals_status_idx" ON "noro"."proposals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "proposals_lead_id_idx" ON "noro"."proposals" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "proposals_client_id_idx" ON "noro"."proposals" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "proposals_aceite_token_idx" ON "noro"."proposals" USING btree ("aceite_token");--> statement-breakpoint
CREATE INDEX "proposals_created_at_idx" ON "noro"."proposals" USING btree ("created_at");