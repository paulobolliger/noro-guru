CREATE TABLE "noro"."pricing_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"escopo" text NOT NULL,
	"tenant_id" uuid,
	"categoria" text,
	"plan_id" uuid,
	"canal" text,
	"tipo_regra" text NOT NULL,
	"valor" numeric(10, 4) NOT NULL,
	"moeda" text DEFAULT 'BRL',
	"prioridade" integer DEFAULT 0,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid,
	"categoria" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text,
	"destino_pais" text,
	"destino_cidade" text,
	"destino_regiao" text,
	"duracao_minutos" integer,
	"capacidade_min" integer,
	"capacidade_max" integer,
	"inclui_ingresso" boolean,
	"inclui_transfer" boolean,
	"moeda" text DEFAULT 'BRL' NOT NULL,
	"preco_tipo" text NOT NULL,
	"status" text DEFAULT 'ativo' NOT NULL,
	"tags" text[],
	"observacoes_internas" text,
	"preco_atualizado_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "noro"."suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"tipo" text,
	"cnpj" text,
	"website" text,
	"pais" text,
	"cidade" text,
	"contato_nome" text,
	"contato_email" text,
	"contato_phone" text,
	"contato_whatsapp" text,
	"observacoes" text,
	"api_tipo" text DEFAULT 'manual',
	"api_ativo" boolean DEFAULT false,
	"status" text DEFAULT 'ativo' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "noro"."pricing_rules" ADD CONSTRAINT "pricing_rules_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."pricing_rules" ADD CONSTRAINT "pricing_rules_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "noro"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."products" ADD CONSTRAINT "products_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "noro"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pricing_rules_escopo_idx" ON "noro"."pricing_rules" USING btree ("escopo");--> statement-breakpoint
CREATE INDEX "pricing_rules_tenant_id_idx" ON "noro"."pricing_rules" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "pricing_rules_tipo_regra_idx" ON "noro"."pricing_rules" USING btree ("tipo_regra");--> statement-breakpoint
CREATE INDEX "pricing_rules_ativo_idx" ON "noro"."pricing_rules" USING btree ("ativo");--> statement-breakpoint
CREATE INDEX "pricing_rules_prioridade_idx" ON "noro"."pricing_rules" USING btree ("prioridade");--> statement-breakpoint
CREATE INDEX "products_categoria_idx" ON "noro"."products" USING btree ("categoria");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "noro"."products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_supplier_id_idx" ON "noro"."products" USING btree ("supplier_id");--> statement-breakpoint
CREATE INDEX "products_preco_tipo_idx" ON "noro"."products" USING btree ("preco_tipo");--> statement-breakpoint
CREATE INDEX "products_moeda_idx" ON "noro"."products" USING btree ("moeda");--> statement-breakpoint
CREATE INDEX "suppliers_status_idx" ON "noro"."suppliers" USING btree ("status");--> statement-breakpoint
CREATE INDEX "suppliers_tipo_idx" ON "noro"."suppliers" USING btree ("tipo");--> statement-breakpoint
CREATE INDEX "suppliers_api_tipo_idx" ON "noro"."suppliers" USING btree ("api_tipo");