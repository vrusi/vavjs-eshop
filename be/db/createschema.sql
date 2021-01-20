--
-- PostgreSQL database dump
--
-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1
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
-- Name: customer; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.customer (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    street character varying(255) NOT NULL,
    street_number character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    postcode character varying(255) NOT NULL,
    counter integer NOT NULL DEFAULT 0
);
ALTER TABLE public.customer OWNER TO postgres;
--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.customer_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.customer_id_seq OWNER TO postgres;
--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.customer_id_seq OWNED BY public.customer.id;
--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.order (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    status character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT now()
);
ALTER TABLE public.order OWNER TO postgres;
--
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.order_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.order_id_seq OWNER TO postgres;
--
-- Name: order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.order_id_seq OWNED BY public.order.id;
--
-- Name: order_product; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.order_product (
    product_id integer NOT NULL,
    order_id integer NOT NULL,
    quantity integer NOT NULL
);
ALTER TABLE public.order_product OWNER TO postgres;
--
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.product (
    id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    image_path character varying(255) NOT NULL,
    price numeric NOT NULL
);
ALTER TABLE public.product OWNER TO postgres;
--
-- Name: product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.product_id_seq AS integer START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;
ALTER TABLE public.product_id_seq OWNER TO postgres;
--
-- Name: product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.product_id_seq OWNED BY public.product.id;
--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.customer
ALTER COLUMN id
SET DEFAULT nextval('public.customer_id_seq'::regclass);
--
-- Name: order id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.order
ALTER COLUMN id
SET DEFAULT nextval('public.order_id_seq'::regclass);
--
-- Name: product id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.product
ALTER COLUMN id
SET DEFAULT nextval('public.product_id_seq'::regclass);
--
-- Name: customer pk_customer; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.customer
ADD CONSTRAINT pk_customer PRIMARY KEY (id);
--
-- Name: order pk_order; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.order
ADD CONSTRAINT pk_order PRIMARY KEY (id);
--
-- Name: product pk_product; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.product
ADD CONSTRAINT pk_product PRIMARY KEY (id);
--
-- Name: order fk_order_customer_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.order
ADD CONSTRAINT fk_order_customer_id FOREIGN KEY (customer_id) REFERENCES public.customer(id) on delete cascade;
--
-- Name: order_product fk_order_product_order_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.order_product
ADD CONSTRAINT fk_order_product_order_id FOREIGN KEY (order_id) REFERENCES public.order(id) on delete cascade;
--
-- Name: order_product fk_order_product_product_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.order_product
ADD CONSTRAINT fk_order_product_product_id FOREIGN KEY (product_id) REFERENCES public.product(id) on delete cascade;
--
-- PostgreSQL database dump complete
--