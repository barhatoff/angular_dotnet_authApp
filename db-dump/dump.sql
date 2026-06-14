--
-- PostgreSQL database dump
--

\restrict oregrYdSzXrr43GDPhPdq8bxxAqNmthZ2QeC8KFWB2gOTvhfNFF3UnPmX76xzdU

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Audits" (
    "Id" uuid NOT NULL,
    "User" character varying(60) NOT NULL,
    "Role" text NOT NULL,
    "Method" character varying(10) NOT NULL,
    "StatusCode" integer NOT NULL,
    "Url" character varying(255) NOT NULL,
    "Ip" character varying(45) NOT NULL,
    "Body" text NOT NULL,
    "Time" timestamp with time zone NOT NULL,
    "ProcessedMs" bigint NOT NULL
);


ALTER TABLE public."Audits" OWNER TO postgres;

--
-- Name: RefreshTokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RefreshTokens" (
    "Id" uuid NOT NULL,
    "TokenHash" text NOT NULL,
    "IpAddress" character varying(45) NOT NULL,
    "ExpiresAt" timestamp with time zone NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "RevokedAt" timestamp with time zone,
    "UserId" uuid NOT NULL
);


ALTER TABLE public."RefreshTokens" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" uuid NOT NULL,
    "Email" character varying(60) NOT NULL,
    "PasswordHash" text NOT NULL,
    "Nickname" character varying(60) NOT NULL,
    "Avatar" text NOT NULL,
    "Role" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Data for Name: Audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Audits" ("Id", "User", "Role", "Method", "StatusCode", "Url", "Ip", "Body", "Time", "ProcessedMs") FROM stdin;
\.


--
-- Data for Name: RefreshTokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RefreshTokens" ("Id", "TokenHash", "IpAddress", "ExpiresAt", "CreatedAt", "RevokedAt", "UserId") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" ("Id", "Email", "PasswordHash", "Nickname", "Avatar", "Role", "CreatedAt") FROM stdin;
c36b66c3-2d8f-4796-8365-e59d17f0c3ae	root@root.com	$2a$11$ve7VpzHPJ9rywoiUaU/xC.Pcta7BaQj8Osfwt.JyztT9b6ei6czYq	root	https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=	Admin	2026-06-14 11:10:30.003598+00
\.


--
-- Data for Name: __EFMigrationsHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."__EFMigrationsHistory" ("MigrationId", "ProductVersion") FROM stdin;
20260614110554_AddAppTables	9.0.9
\.


--
-- Name: Audits PK_Audits; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Audits"
    ADD CONSTRAINT "PK_Audits" PRIMARY KEY ("Id");


--
-- Name: RefreshTokens PK_RefreshTokens; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id");


--
-- Name: Users PK_Users; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "PK_Users" PRIMARY KEY ("Id");


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: IX_RefreshTokens_UserId; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IX_RefreshTokens_UserId" ON public."RefreshTokens" USING btree ("UserId");


--
-- Name: RefreshTokens FK_RefreshTokens_Users_UserId; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RefreshTokens"
    ADD CONSTRAINT "FK_RefreshTokens_Users_UserId" FOREIGN KEY ("UserId") REFERENCES public."Users"("Id") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict oregrYdSzXrr43GDPhPdq8bxxAqNmthZ2QeC8KFWB2gOTvhfNFF3UnPmX76xzdU

