SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict OcZbPDQeG2eLvRx1YQSGAtqpY8pXDjpvS8pd7vcub9vCamQ2mMamJ0HsmtdPIwa

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: tenants; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."tenants" ("id", "name", "slug", "status", "created_at", "updated_at", "plan", "billing_email", "next_invoice_date", "notes") FROM stdin;
0762ebb7-311e-494f-80fd-cc14400cac6a	Nomade Guru	nomade	active	2025-10-21 15:18:46.469764+00	2025-10-21 15:38:26.355699+00	pro	financeiro@nomade.guru	\N	Tenant principal de produção
d43ef2d2-cbf1-4133-b805-77c3f6444bc2	Noro Guru	noro	active	2025-10-27 09:42:56.770597+00	2025-10-27 09:42:56.770597+00	pro	billing@noro.guru	\N	\N
\.


--
-- Data for Name: api_keys; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."api_keys" ("id", "tenant_id", "name", "hash", "last4", "scope", "expires_at", "created_at", "key_hash") FROM stdin;
\.


--
-- Data for Name: api_key_logs; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."api_key_logs" ("id", "key_id", "tenant_id", "route", "country_from", "country_to", "purpose", "duration", "status", "elapsed_ms", "created_at") FROM stdin;
\.


--
-- Data for Name: billing_events; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."billing_events" ("id", "tenant_id", "period_start", "period_end", "amount_cents", "currency", "status", "items", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."contacts" ("id", "tenant_id", "name", "email", "phone", "role", "is_primary", "created_at") FROM stdin;
\.


--
-- Data for Name: domains; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."domains" ("id", "tenant_id", "domain", "is_default", "created_at") FROM stdin;
d7c49ff1-a3a2-4f4e-9ce2-4dc974095171	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	noro.guru	t	2025-10-27 09:42:56.770597+00
f930caea-5e4f-4c0f-add2-5bb48f23e9dc	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	control.noro.guru	f	2025-10-27 09:42:56.770597+00
e8ee8a9d-96e7-4330-a51d-bf3ab0235e91	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	core.noro.guru	f	2025-10-27 09:42:56.770597+00
4a0043e8-7d6a-4242-8783-e8aba5c43991	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	visa-api.noro.guru	f	2025-10-27 09:42:56.770597+00
\.


--
-- Data for Name: plans; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."plans" ("id", "code", "name", "price_cents", "currency", "is_active", "sort_order", "metadata") FROM stdin;
7ca47109-82f9-411d-b2df-d7fc78163bbe	starter	Starter	0	BRL	t	10	{}
0b86a26a-a806-4084-8e75-8d56680adf84	pro	Pro	9900	BRL	t	20	{}
c18cc730-7853-4ef0-a69a-f2e8a6b578c2	enterprise	Enterprise	0	BRL	t	30	{}
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."subscriptions" ("id", "tenant_id", "plan_id", "status", "current_period_start", "current_period_end", "stripe_subscription_id", "created_at") FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."invoices" ("id", "subscription_id", "tenant_id", "amount_cents", "currency", "status", "issued_at", "due_at", "paid_at", "stripe_invoice_id", "created_at") FROM stdin;
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."leads" ("id", "organization_name", "email", "phone", "source", "stage", "value_cents", "owner_id", "tenant_id", "created_at", "updated_at", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "capture_channel", "consent", "page_url", "referrer", "tags", "position") FROM stdin;
1ab51f53-5aa2-47b9-8d48-ffd2bd210ba8	Empresa XYZ	contato@xyz.com	\N	\N	qualified	0	\N	\N	2025-10-27 23:32:33.362705+00	2025-10-28 19:16:10.644629+00	\N	\N	\N	\N	\N	web	f	\N	\N	{}	1
dae9ef5f-9d25-4cf6-a9d3-c009a1f1bd4a	Teste UI	t@ui.com	\N	\N	todo	0	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	\N	2025-10-27 22:22:56.106673+00	2025-10-29 20:27:10.567753+00	\N	\N	\N	\N	\N	web	f	\N	\N	{}	1
\.


--
-- Data for Name: lead_activity; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."lead_activity" ("id", "lead_id", "actor_id", "action", "details", "created_at") FROM stdin;
82a53b40-a6d8-4646-a3ef-003cee747afe	1ab51f53-5aa2-47b9-8d48-ffd2bd210ba8	\N	status_changed	{"to": "qualificado", "from": "novo"}	2025-10-28 18:10:25.014253+00
51bc4d5f-0c95-4eff-ad71-888b288bb848	1ab51f53-5aa2-47b9-8d48-ffd2bd210ba8	\N	status_changed	{"to": "in_progress", "from": "qualificado"}	2025-10-28 19:15:24.035473+00
dff9d066-7f3f-4bbb-bfad-c0bf66964419	1ab51f53-5aa2-47b9-8d48-ffd2bd210ba8	\N	status_changed	{"to": "qualified", "from": "in_progress"}	2025-10-28 19:16:10.768433+00
f8e6c33d-ae4c-487c-83c7-0870e9755db8	dae9ef5f-9d25-4cf6-a9d3-c009a1f1bd4a	\N	status_changed	{"to": "in_progress", "from": "novo"}	2025-10-29 20:27:09.09286+00
419a9c1b-4905-4949-926c-40b195bebfc9	dae9ef5f-9d25-4cf6-a9d3-c009a1f1bd4a	\N	status_changed	{"to": "todo", "from": "in_progress"}	2025-10-29 20:27:10.649109+00
\.


--
-- Data for Name: lead_stages; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."lead_stages" ("id", "tenant_id", "slug", "label", "ord", "is_won", "is_lost", "created_at") FROM stdin;
4ae90a36-cac7-4744-b6f9-c4f3b68e2aca	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	todo	To Do	10	f	f	2025-10-28 14:09:44.13602+00
178e42e1-dbb4-42a1-9fe2-6b45adc987cc	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	in_progress	In Progress	20	f	f	2025-10-28 14:09:44.13602+00
9bdb1f4d-ddf1-45a7-9e7d-93495f666ca0	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	qualified	Qualified	30	f	f	2025-10-28 14:09:44.13602+00
c7a6e79f-3f0e-4f7a-9c45-d48cd8ccf464	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	negotiation	Negotiation	40	f	f	2025-10-28 14:09:44.13602+00
2a65d146-847c-4509-9c18-b6717fbec76a	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	won	Won	90	t	f	2025-10-28 14:09:44.13602+00
00f0f03a-309a-4cfe-a959-cff0a461b5d5	d43ef2d2-cbf1-4133-b805-77c3f6444bc2	lost	Lost	99	f	t	2025-10-28 14:09:44.13602+00
\.


--
-- Data for Name: ledger_accounts; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."ledger_accounts" ("id", "code", "name", "type", "created_at") FROM stdin;
3133962d-f44d-4411-aede-26739466a0e0	1000	Caixa	asset	2025-10-27 23:32:33.362705+00
bb1bd833-b520-47db-8d90-4d7586f9b721	2000	Impostos a Recolher	liability	2025-10-27 23:32:33.362705+00
80d6f031-b9ee-4792-bb3f-55c5f66d16bd	3000	Taxas de Processamento	expense	2025-10-27 23:32:33.362705+00
bb38432b-379b-4a44-8eca-71926eac3d04	4000	Receita Plataforma	revenue	2025-10-27 23:32:33.362705+00
\.


--
-- Data for Name: ledger_entries; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."ledger_entries" ("id", "account_id", "tenant_id", "amount_cents", "memo", "occurred_at", "created_at") FROM stdin;
\.


--
-- Data for Name: modules_registry; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."modules_registry" ("id", "code", "name", "is_core", "is_active", "metadata") FROM stdin;
5fe67426-04da-42fc-b155-4f55c0f3c0fc	crm	CRM	t	t	{}
55370d36-4657-47d3-b0b3-fc5e19718e0d	sales	Vendas & Orçamentos	t	t	{}
f04ac79b-b892-49d1-a551-79a3d30d8831	finance	Financeiro	t	t	{}
738e8370-39ac-4eb9-af9f-b2f56aaee2bf	projects	Projetos & Tarefas	f	t	{}
41ae22ac-7fdb-4e31-abe4-e557af72f088	docs	Documentos & Contratos	f	t	{}
a4c80f54-9ee6-41fc-9011-55d3d1f4fd2a	catalog	Catálogo & Fornecedores	f	t	{}
f141dd17-51d7-41d1-82f6-77fc5b5880e0	ai	IA Assist	f	t	{}
72af377b-95b9-4c26-bd97-ff2fdfb00d3d	integrations	Integrações Externas	f	t	{}
a74a81b8-9c85-4df6-a35c-4719bbabbb32	leads	Leads	t	t	{}
d6dddb20-8511-4632-b714-7ecab08759f4	billing	Billing	t	t	{}
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."notes" ("id", "tenant_id", "entity_type", "entity_id", "content", "created_by", "created_at") FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."payments" ("id", "billing_event_id", "provider", "provider_ref", "amount_cents", "currency", "status", "payload", "created_at") FROM stdin;
\.


--
-- Data for Name: plan_features; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."plan_features" ("id", "plan_id", "key", "value") FROM stdin;
5bf409ff-eb4d-4dee-a247-3f6324d6e6ed	7ca47109-82f9-411d-b2df-d7fc78163bbe	users.max	3
82752bfc-c13d-4d9a-b516-c04743e4f4f8	7ca47109-82f9-411d-b2df-d7fc78163bbe	automations.daily	100
518aff27-dd5c-4757-bbb6-b31dae0f7d2d	7ca47109-82f9-411d-b2df-d7fc78163bbe	storage.gb	5
e7a9c922-0e08-4db7-9d79-f8b615d279da	7ca47109-82f9-411d-b2df-d7fc78163bbe	ai.tokens.month	200k
fbcd611b-38c7-40b8-9098-bf65dea9eb23	0b86a26a-a806-4084-8e75-8d56680adf84	users.max	10
0f7f0d8f-9b4b-4f36-9f3e-b68378dc99a7	0b86a26a-a806-4084-8e75-8d56680adf84	automations.daily	1000
292b9979-b52e-4390-8dfb-ee5ebdfe90f7	0b86a26a-a806-4084-8e75-8d56680adf84	storage.gb	20
920bceb9-9eb6-4a15-a16e-5ec4a1a4154f	0b86a26a-a806-4084-8e75-8d56680adf84	ai.tokens.month	2M
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."support_tickets" ("id", "tenant_id", "subject", "summary", "status", "priority", "channel", "requester_id", "requester_email", "assigned_to", "tags", "first_response_at", "last_message_at", "closed_at", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: support_events; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."support_events" ("id", "tenant_id", "ticket_id", "type", "actor_id", "metadata", "created_at") FROM stdin;
\.


--
-- Data for Name: support_messages; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."support_messages" ("id", "tenant_id", "ticket_id", "sender_id", "sender_role", "body", "attachments", "internal", "created_at") FROM stdin;
\.


--
-- Data for Name: support_sla; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."support_sla" ("ticket_id", "tenant_id", "policy", "target_at", "breached_at", "resolved_at", "created_at") FROM stdin;
\.


--
-- Data for Name: system_events; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."system_events" ("id", "actor_user_id", "tenant_id", "type", "message", "data", "created_at") FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."tasks" ("id", "tenant_id", "title", "status", "due_date", "assigned_to", "entity_type", "entity_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: tenant_modules; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."tenant_modules" ("tenant_id", "module_id", "enabled", "metadata") FROM stdin;
\.


--
-- Data for Name: tenant_plan; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."tenant_plan" ("id", "tenant_id", "plan_id", "starts_at", "ends_at", "auto_renew", "status", "metadata") FROM stdin;
\.


--
-- Data for Name: tenant_settings; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."tenant_settings" ("tenant_id", "locale", "timezone", "color_primary", "logo_url", "metadata", "created_at", "updated_at") FROM stdin;
d43ef2d2-cbf1-4133-b805-77c3f6444bc2	pt-BR	America/Sao_Paulo	#5053C4	\N	{}	2025-10-28 14:09:44.13602+00	2025-10-28 14:09:44.13602+00
\.


--
-- Data for Name: usage_counters; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."usage_counters" ("id", "tenant_id", "period_start", "period_end", "metric", "value", "updated_at") FROM stdin;
\.


--
-- Data for Name: user_tenant_roles; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."user_tenant_roles" ("user_id", "tenant_id", "role", "created_at") FROM stdin;
\.


--
-- Data for Name: webhook_logs; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."webhook_logs" ("id", "tenant_id", "source", "event", "status", "payload", "response", "created_at") FROM stdin;
\.


--
-- Data for Name: webhooks; Type: TABLE DATA; Schema: cp; Owner: postgres
--

COPY "cp"."webhooks" ("id", "tenant_id", "code", "url", "secret", "is_active", "created_at") FROM stdin;
\.


--
-- Name: system_events_id_seq; Type: SEQUENCE SET; Schema: cp; Owner: postgres
--

SELECT pg_catalog.setval('"cp"."system_events_id_seq"', 1, false);


--
-- Name: usage_counters_id_seq; Type: SEQUENCE SET; Schema: cp; Owner: postgres
--

SELECT pg_catalog.setval('"cp"."usage_counters_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict OcZbPDQeG2eLvRx1YQSGAtqpY8pXDjpvS8pd7vcub9vCamQ2mMamJ0HsmtdPIwa

RESET ALL;
