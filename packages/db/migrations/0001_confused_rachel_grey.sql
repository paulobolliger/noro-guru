CREATE TABLE "noro"."clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"lead_id" uuid,
	"tipo" text NOT NULL,
	"nome" text NOT NULL,
	"nome_preferido" text,
	"cpf" text,
	"cnpj" text,
	"data_nascimento" date,
	"genero" text,
	"nacionalidade" text DEFAULT 'brasileira' NOT NULL,
	"email" text,
	"phone" text,
	"whatsapp" text,
	"endereco_cidade" text,
	"endereco_estado" text,
	"endereco_pais" text DEFAULT 'Brasil',
	"passaporte_numero" text,
	"passaporte_pais" text,
	"passaporte_validade" date,
	"passaporte_doc_url" text,
	"rg" text,
	"cnh_numero" text,
	"cnh_validade" date,
	"cnh_categorias" text[],
	"restricoes_alimentares" text[],
	"restricoes_medicas" text,
	"nivel_mobilidade" text,
	"apto_atividade_fisica" boolean,
	"status" text DEFAULT 'ativo' NOT NULL,
	"nivel" text,
	"segmento" text,
	"assigned_to" uuid,
	"total_viagens" integer DEFAULT 0,
	"total_gasto_cents" bigint DEFAULT 0,
	"ultima_viagem_at" date,
	"proxima_viagem_at" date,
	"destinos_visitados" text[],
	"destinos_desejados" text[],
	"tipo_acomodacao_pref" text,
	"classe_voo_pref" text,
	"viaja_com" text[],
	"contato_emergencia_nome" text,
	"contato_emergencia_phone" text,
	"contato_emergencia_parentesco" text,
	"lgpd_aceito" boolean DEFAULT false NOT NULL,
	"lgpd_aceito_at" timestamp with time zone,
	"lgpd_versao" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"observacoes" text
);
--> statement-breakpoint
CREATE TABLE "noro"."leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"email" text,
	"phone" text,
	"whatsapp" text,
	"organization_name" text,
	"source" text NOT NULL,
	"source_detail" text,
	"assigned_to" uuid,
	"budget_min_cents" integer,
	"budget_max_cents" integer,
	"destinos_interesse" text[],
	"data_viagem_inicio" date,
	"data_viagem_fim" date,
	"num_pax" integer,
	"tipo_viagem" text,
	"status" text DEFAULT 'novo' NOT NULL,
	"lost_reason" text,
	"lead_score" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_contact_at" timestamp with time zone,
	"converted_at" timestamp with time zone,
	"converted_to" uuid
);
--> statement-breakpoint
ALTER TABLE "noro"."clients" ADD CONSTRAINT "clients_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."clients" ADD CONSTRAINT "clients_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."leads" ADD CONSTRAINT "leads_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "noro"."tenants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "noro"."leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "noro"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clients_tenant_id_idx" ON "noro"."clients" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "clients_status_idx" ON "noro"."clients" USING btree ("status");--> statement-breakpoint
CREATE INDEX "clients_assigned_to_idx" ON "noro"."clients" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "clients_email_idx" ON "noro"."clients" USING btree ("email");--> statement-breakpoint
CREATE INDEX "clients_created_at_idx" ON "noro"."clients" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "leads_tenant_id_idx" ON "noro"."leads" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "leads_status_idx" ON "noro"."leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "leads_assigned_to_idx" ON "noro"."leads" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "leads_source_idx" ON "noro"."leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "leads_created_at_idx" ON "noro"."leads" USING btree ("created_at");