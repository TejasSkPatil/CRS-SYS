--
-- PostgreSQL database dump
--

\restrict i3kuNYgGp5Ob6LM6gqhGxurBPdS2XEbwwhO2Yf6pJdrTYjWbrA9vRg3tMsKf1Mb

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: challan_items; Type: TABLE; Schema: public; Owner: erp_admin
--

CREATE TABLE public.challan_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "challanId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL
);


ALTER TABLE public.challan_items OWNER TO erp_admin;

--
-- Name: challans; Type: TABLE; Schema: public; Owner: erp_admin
--

CREATE TABLE public.challans (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "challanNumber" character varying NOT NULL,
    "customerId" uuid NOT NULL,
    "salesUserId" uuid NOT NULL,
    status character varying DEFAULT 'draft'::character varying NOT NULL,
    "deliveryDate" timestamp without time zone,
    notes text,
    "totalAmount" numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.challans OWNER TO erp_admin;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: erp_admin
--

CREATE TABLE public.customers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "companyName" character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    address text NOT NULL,
    balance numeric(12,2) DEFAULT '0'::numeric NOT NULL,
    "assignedSalesId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    mobile character varying,
    "gstNumber" character varying,
    "customerType" character varying DEFAULT 'Retail'::character varying NOT NULL,
    status character varying DEFAULT 'Lead'::character varying NOT NULL,
    "followUpDate" date,
    notes text
);


ALTER TABLE public.customers OWNER TO erp_admin;

--
-- Name: products; Type: TABLE; Schema: public; Owner: erp_admin
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    sku character varying NOT NULL,
    description text,
    price numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    cost numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "stockQuantity" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    category character varying,
    "minimumStock" integer DEFAULT 0 NOT NULL,
    location character varying
);


ALTER TABLE public.products OWNER TO erp_admin;

--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: erp_admin
--

CREATE TABLE public.stock_movements (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer NOT NULL,
    type character varying DEFAULT 'IN'::character varying NOT NULL,
    reference character varying NOT NULL,
    "userId" uuid,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.stock_movements OWNER TO erp_admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: erp_admin
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    name character varying NOT NULL,
    role character varying DEFAULT 'sales'::character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO erp_admin;

--
-- Data for Name: challan_items; Type: TABLE DATA; Schema: public; Owner: erp_admin
--

COPY public.challan_items (id, "challanId", "productId", quantity, "unitPrice") FROM stdin;
7ff4e702-4ad0-4fb3-bb2f-c5046a9c256b	92efa1bd-f1a1-4bf1-ab52-9b885c542924	aab69f3b-1193-4717-8b91-a63df97c0b32	1	249.99
eaa7b2d9-de3b-4169-a930-e2a4615ad18f	92efa1bd-f1a1-4bf1-ab52-9b885c542924	aab69f3b-1193-4717-8b91-a63df97c0b32	2	249.99
d30b9e9b-b651-48d1-89c1-78f3fd58a47e	d382df5a-a179-4494-8085-9f6868b7e3c3	a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	1	349.99
f3758d2c-0f31-41eb-b6b9-1607be47249c	d382df5a-a179-4494-8085-9f6868b7e3c3	a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	1	349.99
809244d8-c290-43f6-abbd-82b2b3b5b12e	0c7023bd-326f-4c4e-9409-0a266ef3acb1	aab69f3b-1193-4717-8b91-a63df97c0b32	1	249.99
b678790a-34fc-426e-aaa4-430e5a7fd4a2	1e562379-7052-4e68-a66d-4212d8534245	a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	22	349.99
e9f7c416-b179-44b5-b42c-dee4bdc6dc71	1e562379-7052-4e68-a66d-4212d8534245	89b53dfb-2b87-402b-b684-20b9232b4cc9	1	99.99
836a5577-667e-4696-a21a-d54c8bdbe545	8fed7cb9-9c83-4b89-b6a5-6adfb115c407	7437bd32-d100-42e5-a4b5-d8d3f24d1fa1	1	499.99
32826b7d-8b2c-4cb4-8060-5406ba51199a	31a15923-9164-4a41-88ca-ea29f73dc157	aab69f3b-1193-4717-8b91-a63df97c0b32	2	249.99
ef639a06-3ee2-40fe-a9de-276bee97df67	31a15923-9164-4a41-88ca-ea29f73dc157	89b53dfb-2b87-402b-b684-20b9232b4cc9	1	99.99
\.


--
-- Data for Name: challans; Type: TABLE DATA; Schema: public; Owner: erp_admin
--

COPY public.challans (id, "challanNumber", "customerId", "salesUserId", status, "deliveryDate", notes, "totalAmount", "createdAt", "updatedAt") FROM stdin;
92efa1bd-f1a1-4bf1-ab52-9b885c542924	CH-20260810-3479	5a47420e-ae2c-45c0-bcfc-1518fe166b09	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	cancelled	2026-08-11 02:36:26.576	NA	749.97	2026-08-10 21:05:22.537719	2026-08-10 21:31:49.134328
0c7023bd-326f-4c4e-9409-0a266ef3acb1	CH-20260811-8172	9b547c95-8ce3-4442-ac27-d16964774476	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	draft	\N	XTZ	249.99	2026-08-11 16:55:23.454101	2026-08-11 16:55:23.454101
1e562379-7052-4e68-a66d-4212d8534245	CH-20260811-9466	9b547c95-8ce3-4442-ac27-d16964774476	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	draft	\N		7799.77	2026-08-11 17:24:49.764019	2026-08-11 17:24:49.764019
d382df5a-a179-4494-8085-9f6868b7e3c3	CH-20260810-9822	24d92a00-7f04-40ec-b701-e0e1d35762b3	96bab92b-a26b-42cc-b7dc-48a9228daa79	cancelled	2026-08-11 23:11:19.312	cfs	699.98	2026-08-10 21:49:12.112618	2026-08-11 17:41:22.258679
8fed7cb9-9c83-4b89-b6a5-6adfb115c407	CH-20260811-1337	9b547c95-8ce3-4442-ac27-d16964774476	96bab92b-a26b-42cc-b7dc-48a9228daa79	confirmed	\N	Dev High Speed AUS	499.99	2026-08-11 18:14:43.333179	2026-08-11 18:56:50.32495
31a15923-9164-4a41-88ca-ea29f73dc157	CH-20260811-6559	4e2da09e-ad93-4ff3-8683-94dbb3e84d94	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	draft	\N	get in touch	599.97	2026-08-11 19:17:19.27471	2026-08-11 19:17:19.27471
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: erp_admin
--

COPY public.customers (id, name, "companyName", email, phone, address, balance, "assignedSalesId", "createdAt", "updatedAt", mobile, "gstNumber", "customerType", status, "followUpDate", notes) FROM stdin;
51e6d867-4322-4dae-b02a-cc752ea6f6bc	Bruce Banner	Hulk Industries	banner@hulk.com	+919876543211	Shed 12, Avengers Compound	0.00	\N	2026-08-11 18:40:29.477762	2026-08-11 18:40:29.477762	+919876543212	27ABCDE1234F1Z5	Retail	Active	\N	\N
4f36edcb-db52-438d-99b7-70404d4265dc	TEJA	adre indus	tejas.ers@gmail.com	+918264372636	FGHIBBISEGH©Þƒ˙ŒÝRIOLHBJKDSNC ,MX FIO;S	0.00	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	2026-08-11 19:15:07.801952	2026-08-11 19:15:07.801952	+918128766473	27ABCDE1234F1Z5	Retail	Active	2026-08-14	UIUSFHIUSNGK
4e2da09e-ad93-4ff3-8683-94dbb3e84d94	tejas	Sfd tdrec	jsek.terd@gmail.com	+918278563284	gruacbuefiuwger9peflgjkc ewf	473487.00	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	2026-08-11 19:05:23.749958	2026-08-11 19:16:18.516742	+917278563285	27ABCDE1234F1Z4	Retail	Lead	2026-09-03	CONTACT WITH HeadQuaters immdeditaly
24d92a00-7f04-40ec-b701-e0e1d35762b3	Bruce Wayne	Wayne Enterprises	bruce@waynecorp.com	9876543199	1007 Mountain Drive, Gotham City	12500.00	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	2026-08-10 21:03:49.112785	2026-08-10 21:03:49.112785	9876543200	29ABCDE1234F1Z5	Retail	Lead	\N	\N
9b547c95-8ce3-4442-ac27-d16964774476	Tony Stark	Stark Industries	tony@stark.com	9876543142	10880 Malibu Point, Malibu, CA	45000.50	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	2026-08-10 21:03:49.117398	2026-08-10 21:39:17.562951	9876543145	27STARK5678G1Z6	Retail	Lead	\N	\N
5a47420e-ae2c-45c0-bcfc-1518fe166b09	Peter Parker	Daily Bugle	peter.parker@dailybugle.com	9876543133	20 Ingram St, Forest Hills, Queens, NY	0.00	098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	2026-08-10 21:03:49.120749	2026-08-10 21:50:14.488755	9876543135	\N	Retail	Lead	2026-08-11	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: erp_admin
--

COPY public.products (id, name, sku, description, price, cost, "stockQuantity", "createdAt", "updatedAt", category, "minimumStock", location) FROM stdin;
966b5a67-b6f4-41ca-bc76-188403fe9d74	Enterprise Laptop Pro	LAP-PRO-001	High-performance developer laptop with 32GB RAM, 1TB SSD.	1499.99	950.00	45	2026-08-10 21:03:49.038509	2026-08-10 21:03:49.038509	\N	0	\N
aab69f3b-1193-4717-8b91-a63df97c0b32	Wireless Noise-Cancelling Headphones	AUD-HDPH-003	Premium headphones with active noise cancelling and 30-hour battery life.	249.99	120.00	85	2026-08-10 21:03:49.072589	2026-08-10 21:31:49.134328	\N	0	\N
70835f47-55d0-459c-af32-f6881b5a4d29	dell	LAP-2192	Overall struct	2435786.00	231567.00	12	2026-08-11 17:36:27.5814	2026-08-11 17:36:27.5814	audio	2	Pune
89b53dfb-2b87-402b-b684-20b9232b4cc9	Mechanical Keyboard (Red Switches)	KEY-MECH-005	Tactile typing feedback, RGB backlighting, custom keycaps.	99.99	45.00	119	2026-08-10 21:03:49.095849	2026-08-11 17:37:15.301225	\N	0	\N
a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	Ergonomic Office Chair	FUR-CHAIR-004	Lumbar support, breathable mesh, fully adjustable armrests.	349.99	180.00	15	2026-08-10 21:03:49.079755	2026-08-11 17:41:22.258679	\N	0	\N
7437bd32-d100-42e5-a4b5-d8d3f24d1fa1	UltraWide Curved Monitor 34"	MON-CURV-002	Immersive screen with 144Hz refresh rate, HDR support.	499.99	310.00	27	2026-08-10 21:03:49.043138	2026-08-11 18:56:50.32495	\N	0	\N
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: erp_admin
--

COPY public.stock_movements (id, "productId", quantity, type, reference, "userId", "createdAt") FROM stdin;
221799ae-ae73-488a-819e-f0f1a4a11f90	aab69f3b-1193-4717-8b91-a63df97c0b32	2	OUT	Delivery of Challan #CH-20260810-3479	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-10 21:06:26.555711
8f651c41-27bf-44ce-a2e4-b224b4c41f5d	aab69f3b-1193-4717-8b91-a63df97c0b32	1	OUT	Delivery of Challan #CH-20260810-3479	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-10 21:06:26.555711
7efd43c7-238f-4c51-8e39-a29544b88ee3	aab69f3b-1193-4717-8b91-a63df97c0b32	2	IN	Stock reversion for cancelled Challan #CH-20260810-3479	bc829809-d8e8-4b1b-ac2a-38b1c1ece22e	2026-08-10 21:31:49.134328
3a3f2065-89e6-4016-bbc3-1470e32bd550	aab69f3b-1193-4717-8b91-a63df97c0b32	1	IN	Stock reversion for cancelled Challan #CH-20260810-3479	bc829809-d8e8-4b1b-ac2a-38b1c1ece22e	2026-08-10 21:31:49.134328
d8d409a1-8a0d-4608-af2c-2e73e1f516d1	89b53dfb-2b87-402b-b684-20b9232b4cc9	1	OUT	Manual Stock Adjustment	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-11 17:37:15.301225
c01b1b84-74a5-404f-ba92-9c5a9bdb4d4b	a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	1	OUT	Delivery of Challan #CH-20260810-9822	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-11 17:41:19.299262
5d5ee6e7-8441-409c-b1ed-ee8c3e89146f	a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	1	OUT	Delivery of Challan #CH-20260810-9822	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-11 17:41:19.299262
718a399e-5d71-4287-8492-4baac2cf1be3	a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	1	IN	Stock reversion for cancelled Challan #CH-20260810-9822	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-11 17:41:22.258679
edf30377-c035-4936-b9da-2176e55fd474	a14c748f-2dc1-4b2f-a20d-3a0c7cac2c82	1	IN	Stock reversion for cancelled Challan #CH-20260810-9822	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-11 17:41:22.258679
290cb0cd-93b4-4ce1-8e4f-a9d1406cfd04	7437bd32-d100-42e5-a4b5-d8d3f24d1fa1	1	OUT	Confirmed Challan #CH-20260811-1337	96bab92b-a26b-42cc-b7dc-48a9228daa79	2026-08-11 18:56:50.32495
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: erp_admin
--

COPY public.users (id, username, password, name, role, "createdAt", "updatedAt") FROM stdin;
96bab92b-a26b-42cc-b7dc-48a9228daa79	admin	$2b$10$9788cYcnkAn/jRDepN5ZU.w35Ah1f0OZhiGOuvjHpv./rHuiUUu/.	System Administrator	admin	2026-08-10 21:03:48.791504	2026-08-10 21:03:48.791504
098a4c5a-688c-4f5d-82bc-c7dd93e7ea20	sales	$2b$10$9788cYcnkAn/jRDepN5ZU.8S6r9ihv2S.6Jnfker88SMvgrhky89e	Sarah Sales Manager	sales	2026-08-10 21:03:48.883148	2026-08-10 21:03:48.883148
31bef456-b53e-4a5b-8330-6b148ecfe521	warehouse	$2b$10$9788cYcnkAn/jRDepN5ZU.jnYQBa9tKekZtDwsJRM6h4GOVZkYawC	Willy Warehouse Executive	warehouse	2026-08-10 21:03:48.96005	2026-08-10 21:03:48.96005
bc829809-d8e8-4b1b-ac2a-38b1c1ece22e	accounts	$2b$10$9788cYcnkAn/jRDepN5ZU.3uuynGV4hxcTb4hmpIb77D092xqR202	Alex Accounts Officer	accounts	2026-08-10 21:03:49.031983	2026-08-10 21:03:49.031983
\.


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: customers PK_133ec679a801fab5e070f73d3ea; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY (id);


--
-- Name: stock_movements PK_57a26b190618550d8e65fb860e7; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT "PK_57a26b190618550d8e65fb860e7" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: challans PK_d3e25240ed92e82c17441506099; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT "PK_d3e25240ed92e82c17441506099" PRIMARY KEY (id);


--
-- Name: challan_items PK_e3e1674fe6a9f504564f61a59f1; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.challan_items
    ADD CONSTRAINT "PK_e3e1674fe6a9f504564f61a59f1" PRIMARY KEY (id);


--
-- Name: products UQ_c44ac33a05b144dd0d9ddcf9327; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE (sku);


--
-- Name: challans UQ_ebd17f8ef147d13e6963fc1c733; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT "UQ_ebd17f8ef147d13e6963fc1c733" UNIQUE ("challanNumber");


--
-- Name: users UQ_fe0bb3f6520ee0469504521e710; Type: CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE (username);


--
-- Name: challan_items FK_23dfe074e8e78563b370b7d8589; Type: FK CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.challan_items
    ADD CONSTRAINT "FK_23dfe074e8e78563b370b7d8589" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: challans FK_48b1a2e75643f48e6a4617e57d1; Type: FK CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT "FK_48b1a2e75643f48e6a4617e57d1" FOREIGN KEY ("customerId") REFERENCES public.customers(id) ON DELETE RESTRICT;


--
-- Name: stock_movements FK_4fc9f6fc2db22fc301f7c1c918b; Type: FK CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT "FK_4fc9f6fc2db22fc301f7c1c918b" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: challans FK_5e2355efae99be4a4253f030f3c; Type: FK CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT "FK_5e2355efae99be4a4253f030f3c" FOREIGN KEY ("salesUserId") REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: stock_movements FK_a3acb59db67e977be45e382fc56; Type: FK CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT "FK_a3acb59db67e977be45e382fc56" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: customers FK_ebd01ad57c49338f2fac5f0a376; Type: FK CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_ebd01ad57c49338f2fac5f0a376" FOREIGN KEY ("assignedSalesId") REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: challan_items FK_f3bcc481cc656d450bd81285972; Type: FK CONSTRAINT; Schema: public; Owner: erp_admin
--

ALTER TABLE ONLY public.challan_items
    ADD CONSTRAINT "FK_f3bcc481cc656d450bd81285972" FOREIGN KEY ("challanId") REFERENCES public.challans(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict i3kuNYgGp5Ob6LM6gqhGxurBPdS2XEbwwhO2Yf6pJdrTYjWbrA9vRg3tMsKf1Mb

