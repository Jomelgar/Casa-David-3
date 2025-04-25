--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)

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
-- Name: enum_cama_tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_cama_tipo AS ENUM (
    'INDIVIDUAL',
    'MATRIMONIAL',
    'CAMAROTE'
);


ALTER TYPE public.enum_cama_tipo OWNER TO postgres;

--
-- Name: enum_habitacion_genero; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_habitacion_genero AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'OTRO'
);


ALTER TYPE public.enum_habitacion_genero OWNER TO postgres;

--
-- Name: enum_persona_genero; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_persona_genero AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'OTRO'
);


ALTER TYPE public.enum_persona_genero OWNER TO postgres;

--
-- Name: enum_usuario_rol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_usuario_rol AS ENUM (
    'admin',
    'usuario',
    'otro'
);


ALTER TYPE public.enum_usuario_rol OWNER TO postgres;

--
-- Name: genero; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.genero AS ENUM (
    'MASCULINO',
    'FEMENINO',
    'OTRO'
);


ALTER TYPE public.genero OWNER TO postgres;

--
-- Name: rol; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rol AS ENUM (
    'ADMIN',
    'USUARIO',
    'OTRO'
);


ALTER TYPE public.rol OWNER TO postgres;

--
-- Name: tipo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo AS ENUM (
    'INDIVIDUAL',
    'MATRIMONIAL',
    'CAMAROTE'
);


ALTER TYPE public.tipo OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: afiliado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.afiliado (
    id_afiliado integer NOT NULL,
    condicion character varying(60),
    dni character varying(20),
    nombre character varying(100)
);


ALTER TABLE public.afiliado OWNER TO postgres;

--
-- Name: afiliado_huesped; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.afiliado_huesped (
    id_afiliado_huesped integer NOT NULL,
    id_afiliado integer NOT NULL,
    id_huesped integer NOT NULL
);


ALTER TABLE public.afiliado_huesped OWNER TO postgres;

--
-- Name: afiliado_reservacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.afiliado_reservacion (
    id_afiliado_reservacion integer NOT NULL,
    id_afiliado integer NOT NULL,
    id_reservacion integer NOT NULL
);


ALTER TABLE public.afiliado_reservacion OWNER TO postgres;

--
-- Name: afiliado_huesped_id_afiliado_huesped_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.afiliado_huesped_id_afiliado_huesped_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.afiliado_huesped_id_afiliado_huesped_seq OWNER TO postgres;

--
-- Name: afiliado_huesped_id_afiliado_huesped_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.afiliado_huesped_id_afiliado_huesped_seq OWNED BY public.afiliado_reservacion.id_afiliado_reservacion;


--
-- Name: afiliado_huesped_id_afiliado_huesped_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.afiliado_huesped_id_afiliado_huesped_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.afiliado_huesped_id_afiliado_huesped_seq1 OWNER TO postgres;

--
-- Name: afiliado_huesped_id_afiliado_huesped_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.afiliado_huesped_id_afiliado_huesped_seq1 OWNED BY public.afiliado_huesped.id_afiliado_huesped;


--
-- Name: afiliado_id_afiliado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.afiliado_id_afiliado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.afiliado_id_afiliado_seq OWNER TO postgres;

--
-- Name: afiliado_id_afiliado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.afiliado_id_afiliado_seq OWNED BY public.afiliado.id_afiliado;


--
-- Name: cama; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cama (
    id_cama integer NOT NULL,
    id_habitacion integer NOT NULL,
    nomre character varying(30) NOT NULL,
    tipo public.enum_cama_tipo NOT NULL,
    disponible boolean DEFAULT true
);


ALTER TABLE public.cama OWNER TO postgres;

--
-- Name: cama_id_cama_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cama_id_cama_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cama_id_cama_seq OWNER TO postgres;

--
-- Name: cama_id_cama_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cama_id_cama_seq OWNED BY public.cama.id_cama;


--
-- Name: causa_visita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.causa_visita (
    id_causa_visita integer NOT NULL,
    causa character varying(255)
);


ALTER TABLE public.causa_visita OWNER TO postgres;

--
-- Name: causa_visita_id_causa_visita_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.causa_visita_id_causa_visita_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.causa_visita_id_causa_visita_seq OWNER TO postgres;

--
-- Name: causa_visita_id_causa_visita_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.causa_visita_id_causa_visita_seq OWNED BY public.causa_visita.id_causa_visita;


--
-- Name: hospital; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hospital (
    id_hospital integer NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion text NOT NULL
);


ALTER TABLE public.hospital OWNER TO postgres;

--
-- Name: huesped; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.huesped (
    id_huesped integer NOT NULL,
    id_persona integer NOT NULL,
    activo boolean,
    reingreso boolean NOT NULL
);


ALTER TABLE public.huesped OWNER TO postgres;

--
-- Name: iglesia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iglesia (
    id_iglesia integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.iglesia OWNER TO postgres;

--
-- Name: iglesia_huesped; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iglesia_huesped (
    id_iglesia_huesped integer NOT NULL,
    id_iglesia integer NOT NULL,
    id_huesped integer NOT NULL
);


ALTER TABLE public.iglesia_huesped OWNER TO postgres;

--
-- Name: ocupacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ocupacion (
    id_ocupacion integer NOT NULL,
    descripcion text NOT NULL
);


ALTER TABLE public.ocupacion OWNER TO postgres;

--
-- Name: paciente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paciente (
    id_paciente integer NOT NULL,
    id_hospital integer,
    id_piso integer,
    id_sala integer,
    observacion text,
    id_person integer NOT NULL,
    id_causa_visita integer NOT NULL
);


ALTER TABLE public.paciente OWNER TO postgres;

--
-- Name: paciente_huesped; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paciente_huesped (
    id_paciente_huesped integer NOT NULL,
    id_paciente integer NOT NULL,
    id_huesped integer NOT NULL,
    parentesco_paciente character varying(50)
);


ALTER TABLE public.paciente_huesped OWNER TO postgres;

--
-- Name: patrono; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patrono (
    id_patrono integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.patrono OWNER TO postgres;

--
-- Name: patrono_afiliado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patrono_afiliado (
    id_patrono_afiliado integer NOT NULL,
    id_patrono integer NOT NULL,
    id_afiliado integer NOT NULL
);


ALTER TABLE public.patrono_afiliado OWNER TO postgres;

--
-- Name: persona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persona (
    id_persona integer NOT NULL,
    id_ocupacion integer,
    id_procedencia integer NOT NULL,
    id_lugar integer NOT NULL,
    dni character varying(20),
    primer_nombre character varying(30) NOT NULL,
    segundo_nombre character varying(30),
    primer_apellido character varying(30) NOT NULL,
    segundo_apellido character varying(30),
    direccion text,
    telefono character varying(15),
    genero public.enum_persona_genero NOT NULL,
    fecha_nacimiento date NOT NULL
);


ALTER TABLE public.persona OWNER TO postgres;

--
-- Name: procedencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.procedencia (
    id_procedencia integer NOT NULL,
    departamento character varying(50) NOT NULL,
    municipio character varying(50) NOT NULL
);


ALTER TABLE public.procedencia OWNER TO postgres;

--
-- Name: reservacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservacion (
    id_reservacion integer NOT NULL,
    id_paciente_huesped integer NOT NULL,
    id_cama integer,
    id_hospital integer NOT NULL,
    activa boolean DEFAULT true,
    fecha_entrada date NOT NULL,
    fecha_salida date,
    becado boolean DEFAULT false NOT NULL
);


ALTER TABLE public.reservacion OWNER TO postgres;

--
-- Name: vista_reservacion_huesped_paciente; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_reservacion_huesped_paciente AS
 SELECT a.id_reservacion,
    a.id_paciente_huesped,
    a.fecha_entrada,
    a.id_paciente,
    a.id_huesped,
    a.parentesco_paciente,
    a.id_hospital,
    a.observacion,
    a.id_causa_visita,
    a.id_persona_paciente,
    a.id_persona_huesped,
    a.reingreso,
    ph.primer_nombre AS primer_nombre_huesped,
    ph.segundo_nombre AS segundo_nombre_huesped,
    ph.primer_apellido AS primer_apellido_huesped,
    ph.segundo_apellido AS segundo_apellido_huesped,
    ph.telefono AS telefono_huesped,
    ph.dni AS dni_huesped,
    ph.genero AS genero_huesped,
    ph.fecha_nacimiento AS fecha_nacimiento_huesped,
    ph.id_ocupacion AS id_ocupacion_huesped,
    ph.id_procedencia AS id_procedencia_huesped,
    pp.primer_nombre AS primer_nombre_paciente,
    pp.segundo_nombre AS segundo_nombre_paciente,
    pp.primer_apellido AS primer_apellido_paciente,
    pp.segundo_apellido AS segundo_apellido_paciente,
    pp.telefono AS telefono_paciente,
    h.nombre AS hospital_nombre,
    c.causa AS causa_visita
   FROM ((((( SELECT a_1.id_reservacion,
            a_1.id_paciente_huesped,
            a_1.fecha_entrada,
            a_1.id_paciente,
            a_1.id_huesped,
            a_1.parentesco_paciente,
            p.id_hospital,
            p.observacion,
            p.id_causa_visita,
            p.id_person AS id_persona_paciente,
            h_1.id_persona AS id_persona_huesped,
            h_1.reingreso
           FROM ((( SELECT r.id_reservacion,
                    r.id_paciente_huesped,
                    r.fecha_entrada,
                    ph_1.id_paciente,
                    ph_1.id_huesped,
                    ph_1.parentesco_paciente
                   FROM (public.reservacion r
                     JOIN public.paciente_huesped ph_1 ON ((r.id_paciente_huesped = ph_1.id_paciente_huesped)))) a_1
             JOIN public.paciente p ON ((a_1.id_paciente = p.id_paciente)))
             JOIN public.huesped h_1 ON ((a_1.id_huesped = h_1.id_huesped)))) a
     JOIN public.persona pp ON ((a.id_persona_paciente = pp.id_persona)))
     JOIN public.persona ph ON ((a.id_persona_huesped = ph.id_persona)))
     JOIN public.hospital h ON ((a.id_hospital = h.id_hospital)))
     JOIN public.causa_visita c ON ((a.id_causa_visita = c.id_causa_visita)));


ALTER TABLE public.vista_reservacion_huesped_paciente OWNER TO postgres;

--
-- Name: vista_huesped_paciente_con_persona; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_huesped_paciente_con_persona AS
 SELECT v.id_huesped,
    v.id_paciente,
    v.fecha_entrada,
    v.primer_nombre_huesped,
    v.segundo_nombre_huesped,
    v.primer_apellido_huesped,
    v.segundo_apellido_huesped,
    v.telefono_huesped,
    v.dni_huesped,
    v.genero_huesped,
    v.fecha_nacimiento_huesped,
    o.descripcion AS ocupacion_huesped,
    p.departamento AS departamento_huesped,
    p.municipio AS municipio_huesped,
    v.reingreso,
    v.primer_nombre_paciente,
    v.segundo_nombre_paciente,
    v.primer_apellido_paciente,
    v.segundo_apellido_paciente,
    v.telefono_paciente,
    v.hospital_nombre,
    v.parentesco_paciente,
    v.causa_visita,
    v.observacion
   FROM ((public.vista_reservacion_huesped_paciente v
     JOIN public.ocupacion o ON ((v.id_ocupacion_huesped = o.id_ocupacion)))
     JOIN public.procedencia p ON ((v.id_procedencia_huesped = p.id_procedencia)));


ALTER TABLE public.vista_huesped_paciente_con_persona OWNER TO postgres;

--
-- Name: withiglesia; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.withiglesia AS
 SELECT v.id_huesped,
    v.id_paciente,
    v.fecha_entrada,
    v.primer_nombre_huesped,
    v.segundo_nombre_huesped,
    v.primer_apellido_huesped,
    v.segundo_apellido_huesped,
    v.telefono_huesped,
    v.dni_huesped,
    v.genero_huesped,
    v.fecha_nacimiento_huesped,
    v.ocupacion_huesped,
    v.departamento_huesped,
    v.municipio_huesped,
    v.reingreso,
    i.nombre AS iglesia,
    v.primer_nombre_paciente,
    v.segundo_nombre_paciente,
    v.primer_apellido_paciente,
    v.segundo_apellido_paciente,
    v.telefono_paciente,
    v.hospital_nombre,
    v.parentesco_paciente,
    v.causa_visita,
    v.observacion
   FROM (( SELECT v_1.id_huesped,
            v_1.id_paciente,
            v_1.fecha_entrada,
            v_1.primer_nombre_huesped,
            v_1.segundo_nombre_huesped,
            v_1.primer_apellido_huesped,
            v_1.segundo_apellido_huesped,
            v_1.telefono_huesped,
            v_1.dni_huesped,
            v_1.genero_huesped,
            v_1.fecha_nacimiento_huesped,
            v_1.ocupacion_huesped,
            v_1.departamento_huesped,
            v_1.municipio_huesped,
            v_1.reingreso,
            v_1.primer_nombre_paciente,
            v_1.segundo_nombre_paciente,
            v_1.primer_apellido_paciente,
            v_1.segundo_apellido_paciente,
            v_1.telefono_paciente,
            v_1.hospital_nombre,
            v_1.parentesco_paciente,
            v_1.causa_visita,
            v_1.observacion,
            i_1.id_iglesia
           FROM (public.vista_huesped_paciente_con_persona v_1
             LEFT JOIN public.iglesia_huesped i_1 ON ((v_1.id_huesped = i_1.id_huesped)))) v
     LEFT JOIN public.iglesia i ON ((v.id_iglesia = i.id_iglesia)));


ALTER TABLE public.withiglesia OWNER TO postgres;

--
-- Name: data_excel; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.data_excel AS
 SELECT v.id_huesped,
    v.id_paciente,
    v.fecha_entrada,
    v.primer_nombre_huesped,
    v.segundo_nombre_huesped,
    v.primer_apellido_huesped,
    v.segundo_apellido_huesped,
    v.telefono_huesped,
    v.dni_huesped,
    v.genero_huesped,
    v.fecha_nacimiento_huesped,
    v.ocupacion_huesped,
    v.departamento_huesped,
    v.municipio_huesped,
    v.reingreso,
    v.iglesia,
    v.primer_nombre_paciente,
    v.segundo_nombre_paciente,
    v.primer_apellido_paciente,
    v.segundo_apellido_paciente,
    v.telefono_paciente,
    v.hospital_nombre,
    v.parentesco_paciente,
    v.causa_visita,
    v.observacion,
    v.nombre_afiliado,
    v.dni_afiliado,
    v.condicion_afiliado,
    p.nombre AS nombre_patrono
   FROM (( SELECT v_1.id_huesped,
            v_1.id_paciente,
            v_1.fecha_entrada,
            v_1.primer_nombre_huesped,
            v_1.segundo_nombre_huesped,
            v_1.primer_apellido_huesped,
            v_1.segundo_apellido_huesped,
            v_1.telefono_huesped,
            v_1.dni_huesped,
            v_1.genero_huesped,
            v_1.fecha_nacimiento_huesped,
            v_1.ocupacion_huesped,
            v_1.departamento_huesped,
            v_1.municipio_huesped,
            v_1.reingreso,
            v_1.iglesia,
            v_1.primer_nombre_paciente,
            v_1.segundo_nombre_paciente,
            v_1.primer_apellido_paciente,
            v_1.segundo_apellido_paciente,
            v_1.telefono_paciente,
            v_1.hospital_nombre,
            v_1.parentesco_paciente,
            v_1.causa_visita,
            v_1.observacion,
            a.nombre AS nombre_afiliado,
            a.dni AS dni_afiliado,
            a.condicion AS condicion_afiliado,
            p_1.id_patrono
           FROM ((( SELECT v_2.id_huesped,
                    v_2.id_paciente,
                    v_2.fecha_entrada,
                    v_2.primer_nombre_huesped,
                    v_2.segundo_nombre_huesped,
                    v_2.primer_apellido_huesped,
                    v_2.segundo_apellido_huesped,
                    v_2.telefono_huesped,
                    v_2.dni_huesped,
                    v_2.genero_huesped,
                    v_2.fecha_nacimiento_huesped,
                    v_2.ocupacion_huesped,
                    v_2.departamento_huesped,
                    v_2.municipio_huesped,
                    v_2.reingreso,
                    v_2.iglesia,
                    v_2.primer_nombre_paciente,
                    v_2.segundo_nombre_paciente,
                    v_2.primer_apellido_paciente,
                    v_2.segundo_apellido_paciente,
                    v_2.telefono_paciente,
                    v_2.hospital_nombre,
                    v_2.parentesco_paciente,
                    v_2.causa_visita,
                    v_2.observacion,
                    a_1.id_afiliado
                   FROM (public.withiglesia v_2
                     LEFT JOIN public.afiliado_huesped a_1 ON ((v_2.id_huesped = a_1.id_huesped)))) v_1
             LEFT JOIN public.afiliado a ON ((v_1.id_afiliado = a.id_afiliado)))
             LEFT JOIN public.patrono_afiliado p_1 ON ((v_1.id_afiliado = p_1.id_afiliado)))) v
     LEFT JOIN public.patrono p ON ((v.id_patrono = p.id_patrono)));


ALTER TABLE public.data_excel OWNER TO postgres;

--
-- Name: habitacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habitacion (
    id_habitacion integer NOT NULL,
    id_lugar integer NOT NULL,
    nombre character varying(30) NOT NULL,
    genero public.enum_habitacion_genero NOT NULL,
    disponible boolean DEFAULT true
);


ALTER TABLE public.habitacion OWNER TO postgres;

--
-- Name: habitacion_id_habitacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habitacion_id_habitacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.habitacion_id_habitacion_seq OWNER TO postgres;

--
-- Name: habitacion_id_habitacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habitacion_id_habitacion_seq OWNED BY public.habitacion.id_habitacion;


--
-- Name: hospital_id_hospital_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hospital_id_hospital_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.hospital_id_hospital_seq OWNER TO postgres;

--
-- Name: hospital_id_hospital_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hospital_id_hospital_seq OWNED BY public.hospital.id_hospital;


--
-- Name: huesped_id_huesped_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.huesped_id_huesped_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.huesped_id_huesped_seq OWNER TO postgres;

--
-- Name: huesped_id_huesped_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.huesped_id_huesped_seq OWNED BY public.huesped.id_huesped;


--
-- Name: iglesia_huesped_id_iglesia_huesped_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.iglesia_huesped_id_iglesia_huesped_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.iglesia_huesped_id_iglesia_huesped_seq OWNER TO postgres;

--
-- Name: iglesia_huesped_id_iglesia_huesped_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.iglesia_huesped_id_iglesia_huesped_seq OWNED BY public.iglesia_huesped.id_iglesia_huesped;


--
-- Name: iglesia_id_iglesia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.iglesia_id_iglesia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.iglesia_id_iglesia_seq OWNER TO postgres;

--
-- Name: iglesia_id_iglesia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.iglesia_id_iglesia_seq OWNED BY public.iglesia.id_iglesia;


--
-- Name: lista_espera; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_espera (
    id_lista_espera integer NOT NULL,
    id_persona integer NOT NULL,
    observacion text,
    fecha_entrada timestamp with time zone NOT NULL
);


ALTER TABLE public.lista_espera OWNER TO postgres;

--
-- Name: lista_espera_id_lista_espera_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lista_espera_id_lista_espera_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lista_espera_id_lista_espera_seq OWNER TO postgres;

--
-- Name: lista_espera_id_lista_espera_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lista_espera_id_lista_espera_seq OWNED BY public.lista_espera.id_lista_espera;


--
-- Name: lista_negra; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_negra (
    id_lista_negra integer NOT NULL,
    id_persona integer NOT NULL,
    id_regla integer NOT NULL,
    observacion text
);


ALTER TABLE public.lista_negra OWNER TO postgres;

--
-- Name: lista_negra_id_lista_negra_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lista_negra_id_lista_negra_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lista_negra_id_lista_negra_seq OWNER TO postgres;

--
-- Name: lista_negra_id_lista_negra_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lista_negra_id_lista_negra_seq OWNED BY public.lista_negra.id_lista_negra;


--
-- Name: lista_solicitud; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lista_solicitud (
    id_lista_solicitud integer NOT NULL,
    id_paciente_huesped integer NOT NULL,
    observacion text,
    becada boolean,
    fecha_entrada date NOT NULL,
    fecha_salida date,
    id_afiliado integer
);


ALTER TABLE public.lista_solicitud OWNER TO postgres;

--
-- Name: lista_solicitud_id_lista_solicitud; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lista_solicitud_id_lista_solicitud
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lista_solicitud_id_lista_solicitud OWNER TO postgres;

--
-- Name: lista_solicitud_id_lista_solicitud_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lista_solicitud_id_lista_solicitud_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lista_solicitud_id_lista_solicitud_seq OWNER TO postgres;

--
-- Name: lista_solicitud_id_lista_solicitud_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lista_solicitud_id_lista_solicitud_seq OWNED BY public.lista_solicitud.id_lista_solicitud;


--
-- Name: lugar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lugar (
    id_lugar integer NOT NULL,
    codigo character varying(10) NOT NULL
);


ALTER TABLE public.lugar OWNER TO postgres;

--
-- Name: lugar_id_lugar_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_id_lugar_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.lugar_id_lugar_seq OWNER TO postgres;

--
-- Name: lugar_id_lugar_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_id_lugar_seq OWNED BY public.lugar.id_lugar;


--
-- Name: ocupacion_id_ocupacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ocupacion_id_ocupacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ocupacion_id_ocupacion_seq OWNER TO postgres;

--
-- Name: ocupacion_id_ocupacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ocupacion_id_ocupacion_seq OWNED BY public.ocupacion.id_ocupacion;


--
-- Name: ofrenda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ofrenda (
    id_ofrenda integer NOT NULL,
    id_reservacion integer,
    valor numeric(10,2) NOT NULL,
    fecha date NOT NULL
);


ALTER TABLE public.ofrenda OWNER TO postgres;

--
-- Name: ofrenda_id_ofrenda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ofrenda_id_ofrenda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ofrenda_id_ofrenda_seq OWNER TO postgres;

--
-- Name: ofrenda_id_ofrenda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ofrenda_id_ofrenda_seq OWNED BY public.ofrenda.id_ofrenda;


--
-- Name: paciente_huesped_id_paciente_huesped_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paciente_huesped_id_paciente_huesped_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.paciente_huesped_id_paciente_huesped_seq OWNER TO postgres;

--
-- Name: paciente_huesped_id_paciente_huesped_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paciente_huesped_id_paciente_huesped_seq OWNED BY public.paciente_huesped.id_paciente_huesped;


--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.paciente_id_paciente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.paciente_id_paciente_seq OWNER TO postgres;

--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.paciente_id_paciente_seq OWNED BY public.paciente.id_paciente;


--
-- Name: pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pago (
    id_pago integer NOT NULL,
    id_reservacion integer,
    saldo_pendiente integer NOT NULL,
    fecha timestamp with time zone NOT NULL
);


ALTER TABLE public.pago OWNER TO postgres;

--
-- Name: pago_id_pago; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pago_id_pago
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pago_id_pago OWNER TO postgres;

--
-- Name: pago_id_pago_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pago_id_pago_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pago_id_pago_seq OWNER TO postgres;

--
-- Name: pago_id_pago_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pago_id_pago_seq OWNED BY public.pago.id_pago;


--
-- Name: patrono_afiliado_id_patrono_afiliado_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patrono_afiliado_id_patrono_afiliado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patrono_afiliado_id_patrono_afiliado_seq OWNER TO postgres;

--
-- Name: patrono_afiliado_id_patrono_afiliado_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patrono_afiliado_id_patrono_afiliado_seq OWNED BY public.patrono_afiliado.id_patrono_afiliado;


--
-- Name: patrono_id_patrono_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patrono_id_patrono_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.patrono_id_patrono_seq OWNER TO postgres;

--
-- Name: patrono_id_patrono_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patrono_id_patrono_seq OWNED BY public.patrono.id_patrono;


--
-- Name: persona_id_persona_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.persona_id_persona_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.persona_id_persona_seq OWNER TO postgres;

--
-- Name: persona_id_persona_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.persona_id_persona_seq OWNED BY public.persona.id_persona;


--
-- Name: piso; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.piso (
    id_piso integer NOT NULL,
    id_hospital integer NOT NULL,
    nombre_piso character varying(25) NOT NULL
);


ALTER TABLE public.piso OWNER TO postgres;

--
-- Name: piso_id_piso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.piso_id_piso_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.piso_id_piso_seq OWNER TO postgres;

--
-- Name: piso_id_piso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.piso_id_piso_seq OWNED BY public.piso.id_piso;


--
-- Name: privilegio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.privilegio (
    id_privilegio integer NOT NULL,
    descripcion character varying(355) NOT NULL
);


ALTER TABLE public.privilegio OWNER TO postgres;

--
-- Name: procedencia_id_procedencia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.procedencia_id_procedencia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.procedencia_id_procedencia_seq OWNER TO postgres;

--
-- Name: procedencia_id_procedencia_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.procedencia_id_procedencia_seq OWNED BY public.procedencia.id_procedencia;


--
-- Name: reglamento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reglamento (
    id_regla integer NOT NULL,
    descripcion_regla text NOT NULL
);


ALTER TABLE public.reglamento OWNER TO postgres;

--
-- Name: reglamento_id_regla_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reglamento_id_regla_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reglamento_id_regla_seq OWNER TO postgres;

--
-- Name: reglamento_id_regla_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reglamento_id_regla_seq OWNED BY public.reglamento.id_regla;


--
-- Name: reservacion_id_reservacion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservacion_id_reservacion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reservacion_id_reservacion_seq OWNER TO postgres;

--
-- Name: reservacion_id_reservacion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservacion_id_reservacion_seq OWNED BY public.reservacion.id_reservacion;


--
-- Name: sala; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sala (
    id_sala integer NOT NULL,
    id_piso integer NOT NULL,
    nombre_sala character varying(25) NOT NULL
);


ALTER TABLE public.sala OWNER TO postgres;

--
-- Name: sala_id_sala_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sala_id_sala_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sala_id_sala_seq OWNER TO postgres;

--
-- Name: sala_id_sala_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sala_id_sala_seq OWNED BY public.sala.id_sala;


--
-- Name: transaccion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaccion (
    id_transaccion integer NOT NULL,
    id_huesped integer,
    valor numeric(6,2) NOT NULL,
    fecha timestamp with time zone NOT NULL,
    becada boolean DEFAULT false
);


ALTER TABLE public.transaccion OWNER TO postgres;

--
-- Name: transaccion_id_transaccion_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaccion_id_transaccion_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaccion_id_transaccion_seq OWNER TO postgres;

--
-- Name: transaccion_id_transaccion_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaccion_id_transaccion_seq OWNED BY public.transaccion.id_transaccion;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    id_persona integer NOT NULL,
    id_hospital integer,
    nickname character varying(25) NOT NULL,
    contrasena character varying(100) NOT NULL,
    rol public.enum_usuario_rol NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- Name: usuario_privilegio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_privilegio (
    id_usuario_privilegio integer NOT NULL,
    id_usuario integer NOT NULL,
    id_privilegio integer NOT NULL
);


ALTER TABLE public.usuario_privilegio OWNER TO postgres;

--
-- Name: usuario_privilegio_id_usuario_privilegio_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_privilegio_id_usuario_privilegio_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.usuario_privilegio_id_usuario_privilegio_seq OWNER TO postgres;

--
-- Name: usuario_privilegio_id_usuario_privilegio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_privilegio_id_usuario_privilegio_seq OWNED BY public.usuario_privilegio.id_usuario_privilegio;


--
-- Name: vista_huespedes_afiliados; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vista_huespedes_afiliados AS
 SELECT h.id_huesped,
    p.primer_nombre AS nombre_huesped,
    p.primer_apellido AS apellido_huesped,
    af.id_afiliado,
    af.condicion
   FROM (((public.huesped h
     JOIN public.persona p ON ((h.id_persona = p.id_persona)))
     LEFT JOIN public.afiliado_reservacion ah ON ((h.id_huesped = ah.id_reservacion)))
     LEFT JOIN public.afiliado af ON ((ah.id_afiliado = af.id_afiliado)));


ALTER TABLE public.vista_huespedes_afiliados OWNER TO postgres;

--
-- Name: afiliado id_afiliado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado ALTER COLUMN id_afiliado SET DEFAULT nextval('public.afiliado_id_afiliado_seq'::regclass);


--
-- Name: afiliado_huesped id_afiliado_huesped; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_huesped ALTER COLUMN id_afiliado_huesped SET DEFAULT nextval('public.afiliado_huesped_id_afiliado_huesped_seq1'::regclass);


--
-- Name: afiliado_reservacion id_afiliado_reservacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_reservacion ALTER COLUMN id_afiliado_reservacion SET DEFAULT nextval('public.afiliado_huesped_id_afiliado_huesped_seq'::regclass);


--
-- Name: cama id_cama; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama ALTER COLUMN id_cama SET DEFAULT nextval('public.cama_id_cama_seq'::regclass);


--
-- Name: causa_visita id_causa_visita; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.causa_visita ALTER COLUMN id_causa_visita SET DEFAULT nextval('public.causa_visita_id_causa_visita_seq'::regclass);


--
-- Name: habitacion id_habitacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitacion ALTER COLUMN id_habitacion SET DEFAULT nextval('public.habitacion_id_habitacion_seq'::regclass);


--
-- Name: hospital id_hospital; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital ALTER COLUMN id_hospital SET DEFAULT nextval('public.hospital_id_hospital_seq'::regclass);


--
-- Name: huesped id_huesped; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huesped ALTER COLUMN id_huesped SET DEFAULT nextval('public.huesped_id_huesped_seq'::regclass);


--
-- Name: iglesia id_iglesia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iglesia ALTER COLUMN id_iglesia SET DEFAULT nextval('public.iglesia_id_iglesia_seq'::regclass);


--
-- Name: iglesia_huesped id_iglesia_huesped; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iglesia_huesped ALTER COLUMN id_iglesia_huesped SET DEFAULT nextval('public.iglesia_huesped_id_iglesia_huesped_seq'::regclass);


--
-- Name: lista_espera id_lista_espera; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_espera ALTER COLUMN id_lista_espera SET DEFAULT nextval('public.lista_espera_id_lista_espera_seq'::regclass);


--
-- Name: lista_negra id_lista_negra; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_negra ALTER COLUMN id_lista_negra SET DEFAULT nextval('public.lista_negra_id_lista_negra_seq'::regclass);


--
-- Name: lista_solicitud id_lista_solicitud; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_solicitud ALTER COLUMN id_lista_solicitud SET DEFAULT nextval('public.lista_solicitud_id_lista_solicitud_seq'::regclass);


--
-- Name: lugar id_lugar; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar ALTER COLUMN id_lugar SET DEFAULT nextval('public.lugar_id_lugar_seq'::regclass);


--
-- Name: ocupacion id_ocupacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocupacion ALTER COLUMN id_ocupacion SET DEFAULT nextval('public.ocupacion_id_ocupacion_seq'::regclass);


--
-- Name: ofrenda id_ofrenda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ofrenda ALTER COLUMN id_ofrenda SET DEFAULT nextval('public.ofrenda_id_ofrenda_seq'::regclass);


--
-- Name: paciente id_paciente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente ALTER COLUMN id_paciente SET DEFAULT nextval('public.paciente_id_paciente_seq'::regclass);


--
-- Name: paciente_huesped id_paciente_huesped; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente_huesped ALTER COLUMN id_paciente_huesped SET DEFAULT nextval('public.paciente_huesped_id_paciente_huesped_seq'::regclass);


--
-- Name: pago id_pago; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago ALTER COLUMN id_pago SET DEFAULT nextval('public.pago_id_pago_seq'::regclass);


--
-- Name: patrono id_patrono; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrono ALTER COLUMN id_patrono SET DEFAULT nextval('public.patrono_id_patrono_seq'::regclass);


--
-- Name: patrono_afiliado id_patrono_afiliado; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrono_afiliado ALTER COLUMN id_patrono_afiliado SET DEFAULT nextval('public.patrono_afiliado_id_patrono_afiliado_seq'::regclass);


--
-- Name: persona id_persona; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona ALTER COLUMN id_persona SET DEFAULT nextval('public.persona_id_persona_seq'::regclass);


--
-- Name: piso id_piso; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piso ALTER COLUMN id_piso SET DEFAULT nextval('public.piso_id_piso_seq'::regclass);


--
-- Name: procedencia id_procedencia; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedencia ALTER COLUMN id_procedencia SET DEFAULT nextval('public.procedencia_id_procedencia_seq'::regclass);


--
-- Name: reglamento id_regla; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reglamento ALTER COLUMN id_regla SET DEFAULT nextval('public.reglamento_id_regla_seq'::regclass);


--
-- Name: reservacion id_reservacion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservacion ALTER COLUMN id_reservacion SET DEFAULT nextval('public.reservacion_id_reservacion_seq'::regclass);


--
-- Name: sala id_sala; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala ALTER COLUMN id_sala SET DEFAULT nextval('public.sala_id_sala_seq'::regclass);


--
-- Name: transaccion id_transaccion; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaccion ALTER COLUMN id_transaccion SET DEFAULT nextval('public.transaccion_id_transaccion_seq'::regclass);


--
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- Name: usuario_privilegio id_usuario_privilegio; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_privilegio ALTER COLUMN id_usuario_privilegio SET DEFAULT nextval('public.usuario_privilegio_id_usuario_privilegio_seq'::regclass);


--
-- Data for Name: afiliado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.afiliado (id_afiliado, condicion, dni, nombre) FROM stdin;
1	\N	3412341234	Juan Melendez
2	\N	124123412	Juan Merdo
3	\N	3213-2132-32133	Edgar
4	\N	0511-2004-00559	Francisco Melendez
5	\N	0511-2004-00552	Juan Roberto
6	\N	0511-2004-00557	melquiades lopez
7	\N	0511-2004-00558	Fransico Roberto
8	\N	0511-2004-0051234	Juan Melendez
\.


--
-- Data for Name: afiliado_huesped; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.afiliado_huesped (id_afiliado_huesped, id_afiliado, id_huesped) FROM stdin;
\.


--
-- Data for Name: afiliado_reservacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.afiliado_reservacion (id_afiliado_reservacion, id_afiliado, id_reservacion) FROM stdin;
5	7	40
6	8	41
\.


--
-- Data for Name: cama; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cama (id_cama, id_habitacion, nomre, tipo, disponible) FROM stdin;
62	28	cama 2	INDIVIDUAL	f
56	28	1	CAMAROTE	f
72	37	Cama A23	CAMAROTE	t
6	6	Cama A6	CAMAROTE	t
73	37	Cama A24	CAMAROTE	t
55	5	10	INDIVIDUAL	t
60	10	Cama1	CAMAROTE	t
61	10	Cama2	CAMAROTE	t
64	4	Cama505	INDIVIDUAL	t
59	10	Cama A20	INDIVIDUAL	t
74	38	4564	CAMAROTE	t
75	38	5433	CAMAROTE	t
77	40	Cama T3	CAMAROTE	t
78	40	Cama T4	CAMAROTE	t
76	36	Cama T1	INDIVIDUAL	f
66	4	Cama21	CAMAROTE	f
68	6	35	CAMAROTE	t
69	28	23	CAMAROTE	t
70	5	A18	INDIVIDUAL	t
65	4	Cama20	CAMAROTE	f
5	5	Cama A5	MATRIMONIAL	t
58	6	2	CAMAROTE	t
57	6	1	CAMAROTE	t
53	28	A15	INDIVIDUAL	t
67	6	34	CAMAROTE	t
4	4	Cama A4	INDIVIDUAL	t
63	28	400	INDIVIDUAL	f
10	10	Cama A10	INDIVIDUAL	f
\.


--
-- Data for Name: causa_visita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.causa_visita (id_causa_visita, causa) FROM stdin;
1	Revision Medica
35	Quebradura de Un Hueso
36	Quemaduras
\.


--
-- Data for Name: habitacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.habitacion (id_habitacion, id_lugar, nombre, genero, disponible) FROM stdin;
6	1	Habitación 106	FEMENINO	t
10	1	Habitación 110	FEMENINO	t
4	1	Habitación 104	FEMENINO	t
37	1	Habitacion 123	FEMENINO	t
5	1	Habitación 105	MASCULINO	t
38	1	uh	MASCULINO	t
39	2	Tegus Dos	FEMENINO	t
40	2	Tegus 3	MASCULINO	t
36	2	tegus one	FEMENINO	f
28	1	Habitacion 111	MASCULINO	t
\.


--
-- Data for Name: hospital; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hospital (id_hospital, nombre, direccion) FROM stdin;
1	Hospital General	Calle Principal 123
2	Hospital Universitario	Avenida de la Ciencia 45
3	Clínica San Lucas	Bulevar del Pinar 78
4	Centro Médico Concordia	Calle del Olmo 9
5	Hospital del Norte	Avenida Norte 101
6	Hospital Metropolitano	Calle Central 200
7	Hospital de la Costa	Avenida Marina 300
8	Hospital Infantil	Calle de los Niños 150
9	Hospital de la Mujer	Avenida Mujeres 333
10	Centro de Salud Sol	Calle Sol 400
12	Seguro Social - IHSS	
13	Centro Medico Pueblo Nuevo	 Villanueva
17	probando	 1
18	Centro De Salud	 Villa Sol
19	Centro	 Villa
20	Probando	 hospital
21	Nuevo	 Puevo
\.


--
-- Data for Name: huesped; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.huesped (id_huesped, id_persona, activo, reingreso) FROM stdin;
1	1	f	f
2	2	f	f
3	3	f	f
4	4	f	f
6	14	t	t
8	18	t	t
9	15	t	t
10	19	t	t
7	17	t	t
13	26	t	f
14	30	t	f
12	25	t	t
15	16	t	f
11	23	t	t
16	32	t	f
17	33	t	t
18	34	t	f
19	36	t	f
20	38	t	f
21	40	t	t
22	42	t	f
23	44	t	f
24	45	t	f
25	46	t	f
26	28	t	f
\.


--
-- Data for Name: iglesia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.iglesia (id_iglesia, nombre) FROM stdin;
1	Iglesia San Juan Bautista
2	Iglesia La Sagrada Familia
3	Iglesia de San Pedro
4	Iglesia de Santa Clara
5	Iglesia del Sagrado Corazón
6	Iglesia de San Francisco de Asís
7	Iglesia de Santa Teresa
8	Iglesia del Buen Pastor
9	Iglesia de San Mateo
10	Iglesia de Santa María de la Paz
\.


--
-- Data for Name: iglesia_huesped; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.iglesia_huesped (id_iglesia_huesped, id_iglesia, id_huesped) FROM stdin;
\.


--
-- Data for Name: lista_espera; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_espera (id_lista_espera, id_persona, observacion, fecha_entrada) FROM stdin;
\.


--
-- Data for Name: lista_negra; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_negra (id_lista_negra, id_persona, id_regla, observacion) FROM stdin;
7	17	6	\N
8	46	2	\N
\.


--
-- Data for Name: lista_solicitud; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lista_solicitud (id_lista_solicitud, id_paciente_huesped, observacion, becada, fecha_entrada, fecha_salida, id_afiliado) FROM stdin;
\.


--
-- Data for Name: lugar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lugar (id_lugar, codigo) FROM stdin;
1	SPS
2	TGU
\.


--
-- Data for Name: ocupacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ocupacion (id_ocupacion, descripcion) FROM stdin;
1	Ingeniero
2	Médico
3	Abogado
4	Arquitecto
5	Programador
6	Profesor
7	Científico
8	Contador
9	Diseñador Gráfico
10	Psicólogo
12	Licenciado
13	Pionero
14	Obrero
15	Carpintero
16	Zapatero
17	Albañil
18	ninguna
19	Florero
29	
30	
31	probando
32	Otra mas
33	Vamo
34	proband 1
35	probando2
\.


--
-- Data for Name: ofrenda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ofrenda (id_ofrenda, id_reservacion, valor, fecha) FROM stdin;
10	22	50.00	2024-06-17
11	27	50.00	2024-06-17
12	29	120.00	2024-06-17
13	31	50.00	2024-06-17
14	31	50.00	2024-06-17
15	31	12.00	2024-06-17
16	31	234.00	2024-06-17
17	35	24.00	2024-06-18
18	32	20.00	2024-06-18
19	36	100.00	2024-06-18
20	38	32.00	2024-06-18
21	37	10.00	2024-06-18
22	37	67.00	2024-06-18
23	40	58.00	2024-06-18
24	44	120.00	2024-06-19
\.


--
-- Data for Name: paciente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paciente (id_paciente, id_hospital, id_piso, id_sala, observacion, id_person, id_causa_visita) FROM stdin;
19	10	2	4	Paciente	15	1
22	10	1	5		16	35
23	12	2	5	\N	16	1
24	7	1	4	\N	16	1
25	9	1	5	\N	17	1
26	10	1	5	\N	16	35
27	3	2	6	\N	15	35
28	3	1	5	\N	14	35
29	10	1	5	\N	14	1
30	7	1	4	\N	14	35
31	9	2	5	\N	14	35
32	10	2	5	\N	14	1
33	10	1	6	\N	14	1
34	10	2	5	\N	14	35
35	13	1	5	\N	14	1
36	13	1	5	\N	14	35
37	10	1	5	\N	14	35
38	13	4	9	\N	14	1
39	7	7	10	\N	18	1
40	5	8	11	Normal	20	1
41	13	5	8	Obseravcon del pciente	14	1
42	13	5	8	\N	18	35
43	13	4	9	a	14	35
44	4	9	12	A	18	1
45	13	5	8	Ola	18	36
46	10	6	14	Ninguna	14	36
47	13	5	8	\N	19	1
48	1	1	6	\N	15	36
49	9	10	13	\N	14	36
50	5	8	11	\N	15	36
51	13	4	9	\N	19	36
52	4	9	12	Ninguna	14	35
53	13	4	9	Ninguna	16	36
54	13	5	8	Ningua	24	35
55	2	2	\N	no	27	1
56	12	11	15	\N	31	1
57	12	11	15	\N	14	36
58	12	11	15	ninguan	23	36
59	10	6	14	\N	14	1
60	12	12	16	\N	14	36
61	12	12	16	\N	14	35
62	12	12	16	\N	14	36
65	4	9	12	Mutilado	35	36
66	13	5	8	\N	39	35
70	3	3	18	\N	15	36
71	5	8	11	Por ahi	43	36
72	13	5	8	Ninguna	14	36
73	4	9	12	Ninguna	49	36
\.


--
-- Data for Name: paciente_huesped; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paciente_huesped (id_paciente_huesped, id_paciente, id_huesped, parentesco_paciente) FROM stdin;
36	19	6	Hermanos
39	22	6	Primos
40	22	7	\N
41	23	6	Primos
42	24	6	Hermanos
43	25	6	Tio
44	26	6	Hermanos
45	27	8	Hermanos
46	28	8	Tia
47	29	8	Tios
48	30	8	nose
49	31	8	Madre
50	32	8	Primos
51	33	8	Nose
52	34	8	Ola
53	35	8	Paciente
54	36	8	Hola
55	37	8	a
56	38	9	Hermanos
57	39	9	Hermanos
58	40	10	Hermanos
59	41	9	Primos
60	42	9	Ola
61	43	8	ads
62	44	6	Padre
63	45	6	Hermanos
64	46	8	Hermanos
65	47	8	Hermanos
66	48	10	Ola
67	49	7	Hola
68	50	10	Ola
69	51	9	Hermanos
70	52	10	Hermanos
71	52	7	\N
72	53	6	Hermanos
73	54	11	Primos
74	54	12	Primos
75	55	13	Madre
76	56	14	Hermanos
77	57	12	Padre
78	58	6	Primos
79	59	15	Hermanos
80	60	9	Sobrion
81	61	11	Hermanos
82	62	16	Hola
85	65	18	Hermanos
86	65	19	Hermanos
87	66	20	Primos
91	70	10	Hola
92	71	22	Hermanos
93	71	23	Hermanos
94	72	24	Hermanos
95	72	25	Hermanos
96	73	26	Hermanos
\.


--
-- Data for Name: pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pago (id_pago, id_reservacion, saldo_pendiente, fecha) FROM stdin;
\.


--
-- Data for Name: patrono; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patrono (id_patrono, nombre) FROM stdin;
1	HBI
2	RKI
\.


--
-- Data for Name: patrono_afiliado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patrono_afiliado (id_patrono_afiliado, id_patrono, id_afiliado) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	2	6
7	1	7
8	2	8
\.


--
-- Data for Name: persona; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.persona (id_persona, id_ocupacion, id_procedencia, id_lugar, dni, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, direccion, telefono, genero, fecha_nacimiento) FROM stdin;
7	7	7	1	78901234T	Jorge	Manuel	Moreno	Castillo	Callejón del Álamo 890	555-6789	MASCULINO	1979-04-17
8	8	8	1	89012345S	Sofía	Patricia	Ruiz	Campos	Paseo Marítimo 345	555-1239	FEMENINO	1992-12-07
9	9	9	1	90123456R	Carlos	Javier	Navarro	Garrido	Ruta Occidental 678	555-4567	MASCULINO	1980-09-05
12	7	8	1	1243-1441-23413	Lola	Le	Lu	js	Ola	3423-4234	FEMENINO	2024-06-25
31	4	13	1	3213-2132-13213	Marck		Romero		Vive conmigo	9321-3213	MASCULINO	2002-07-04
17	7	2	1	0511-2004-00557	Julion		Ramirez		Por venir	4523-5234	MASCULINO	2024-05-28
1	7	302	1	1231-2309-80948	Lucas	Alejandro	Fernandez	Alberto	Calle Falsa 1234, Otra classe	1304-8234	MASCULINO	1985-05-16
6	6	6	1	4234-2342-34234	Isabele	Carmen	Fernández	Romero	Avenida de la Paz 567	3453-4534	MASCULINO	1995-02-28
16	1	11	1	0511-2004-00556	Melquiades		Mal Dia		El Cerro	6475-6745	MASCULINO	2024-06-15
15	8	2	1	0511-2004-00552	Juan		BuenDia		San Francisco	5423-5423	MASCULINO	2024-05-27
13	7	7	1	1324-1234-12341	Tulio	loa	Asi 	Por ahi	Por ahi	3423-4234	MASCULINO	2024-06-12
2	2	2	1	1234-5678-90123	Ana	Maria	Lopez	Diaz	Avenida Principal 456	1234-5678	MASCULINO	1990-07-22
10	10	10	1	3427-3918-73891	Tesli	Lucía	Dominguez	Prieto	Avenida del Río 901	1231-2312	MASCULINO	1972-06-18
20	7	8	1	0511-2005-00551	Juan		Martin		Por ahi	5342-5345	MASCULINO	2024-06-16
32	17	4	1	0512-2412-34122	Melidna		Caballero		San Ramon	4523-4523	FEMENINO	2024-06-19
3	3	3	1	0501-2002-15295	Juan	Keneth	Martinez	Rivera	Ronda Norte 789	1283-9012	MASCULINO	1982-03-09
33	15	3	1	0511-2004-00232	Lenoa		Mcase		Por ahi	7898-7698	FEMENINO	2024-06-19
19	1	4	1	0511-2004-00558	Roberto	Carlos	Slio	Melgar	Por	4523-4523	MASCULINO	2024-06-19
34	4	1	1	0511-2002-00234	Kelvin		Lopez		Por ahi	4523-4523	MASCULINO	2004-05-13
35	4	331	1	0511-2004-03234	Kilon		Juns		Cerca del rio	3412-3412	MASCULINO	2024-06-19
18	7	2	1	0511-2004-99854	Maria		Lequis		Por ahi	3413-4123	FEMENINO	2024-06-05
36	15	4	1	0511-2003-00551	Juan	Mlo	John	\N	Hulis	3451-4123	MASCULINO	2024-06-13
21	15	8	1	0930-4093-94933	kenny		pepper	pops	casa	8888-8888	MASCULINO	2024-05-27
37	15	5	2	0511-2004-00532	Gloria		Quiroz		Los zorzales	3413-4123	FEMENINO	2020-05-06
22	15	6	2	8883-8838-88888	loop	loop	loop	loop	casa	7777-7777	MASCULINO	2024-05-26
4	4	332	1	1123-4123-41233	Elenaa	Beatriz	Sánchez	Molina	Calle Este 101	1341-2341	MASCULINO	1975-11-30
14	7	8	1	0511-2004-00551	Kelvin	Jafeth	Melgar	Quiroz	Esparta as	9620-3737	MASCULINO	2024-05-27
23	17	5	1	0511-2004-00559	Melquiadez		Buen Dia		Por ahi	4311-2341	MASCULINO	2024-06-17
24	9	1	1	0511-2004-00442	Ramon		Amador		nose	3413-4123	MASCULINO	2024-05-30
25	15	5	1	0511-2004-00553	Rafael		Amaya		Por la masicxa	3241-2341	MASCULINO	2024-06-07
26	18	79	1	0501-2000-05471	Rene		Dubon		no	9551-4839	MASCULINO	2000-05-23
27	12	144	1	0502-4560-50434	Carolina		Pascua		no	9549-3005	FEMENINO	1970-11-23
5	5	5	1	0511-2004-00455	David	Enrique	Jimenez	Lozano	Bulevar del Sur 234	2342-3423	MASCULINO	1988-01-19
29	34	5	2	0511-2004-00541	John		Gadoy		Por ahi	1234-1234	FEMENINO	2020-02-05
30	15	79	1	1231-2312-31232	Edgar		Romero		A la par de mi vecino	9123-1231	MASCULINO	2003-06-12
38	15	4	1	2024-03-12	Maria		Lopez		Por ahi	3413-4123	FEMENINO	2024-06-19
39	15	5	1	2020-03-23	Juan		Del Ventura		Por ahi	4525-2345	MASCULINO	2024-05-30
40	5	84	1	0507-2005-01897	Fabrizio	José	Ramos	López	Barrio Copen	9762-7948	MASCULINO	2005-08-20
41	17	4	1	0506-8282-09012	Edgar	Alberto	Romero	Acosta	Juticalpa	7777-7777	MASCULINO	2003-06-12
42	4	5	1	0511-2004-00554	Maria		Tejada		Por ahi	3134-1324	FEMENINO	2024-06-19
43	7	6	1	0511-2004-00343	Lio		Husio		Por ahi	4523-4523	MASCULINO	2024-06-19
44	15	6	1	0511-2004-00344	Jafethm	\N	Elquido	\N	Por ahi	1431-4123	MASCULINO	2024-06-19
45	15	6	1	0511-2004-00454	Mateo		Alvarado		A ladito	3413-4123	MASCULINO	2003-05-22
46	4	5	1	0511-2004-05433	Maria	\N	Salgado	\N	Por ahi	5234-5234	FEMENINO	2020-05-13
47	17	5	1	0511-2003-23423	Kelvon		Salgado		Por ahi	5234-5234	MASCULINO	2024-06-20
48	15	6	2	0511-2004-05423	Salgero	\N	Salgado	\N	Por las lomas	5234-5234	MASCULINO	2020-05-13
28	32	330	2	0511-2004-00523	Melquiadez	Julian	Buendia		Por ahi	1134-1234	FEMENINO	1993-02-17
49	4	4	2	0511-2004-02342	Kilvon		Kilsa		Por ahi	3143-2412	FEMENINO	2024-06-22
\.


--
-- Data for Name: piso; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.piso (id_piso, id_hospital, nombre_piso) FROM stdin;
1	1	Piso A
2	2	Piso B
3	3	Piso C
4	13	Piso 0
5	13	Piso 1
6	10	Piso Salud
7	7	Piso Costa
8	5	Piso Norte
9	4	Piso Concordia
10	9	Piso 2
11	12	1
12	12	Piso B
13	18	Piso 1
\.


--
-- Data for Name: privilegio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.privilegio (id_privilegio, descripcion) FROM stdin;
1	Asignar Camas
2	Administrar Dormitorios
4	Administrar Usuarios
5	Administrar Personas
6	Administrar Lista Negra
7	Administrar Lista de Espera
8	Hospedar
9	Administrar Solicitudes de Hospedaje
10	Administrar Reportes
3	Administrar Huespedes
\.


--
-- Data for Name: procedencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.procedencia (id_procedencia, departamento, municipio) FROM stdin;
1	Atlántida	La Ceiba
2	Atlántida	El Porvenir
3	Atlántida	Tela
4	Atlántida	Jutiapa
5	Atlántida	La Masica
6	Atlántida	San Francisco
7	Atlántida	Arizona
8	Atlántida	Esparta
9	Choluteca	Choluteca
10	Choluteca	Apacilagua
11	Choluteca	Concepción de María
12	Choluteca	Duyure
13	Choluteca	El Corpus
14	Choluteca	El Triunfo
15	Choluteca	Marcovia
16	Choluteca	Morolica
17	Choluteca	Namasigüe
18	Choluteca	Orocuina
19	Choluteca	Pespire
20	Choluteca	San Antonio de Flores
21	Choluteca	San Isidro
22	Choluteca	San José
23	Choluteca	San Marcos de Colón
24	Choluteca	Santa Ana de Yusguare
25	Colón	Trujillo
26	Colón	Balfate
27	Colón	Iriona
28	Colón	Limón
29	Colón	Sabá
30	Colón	Santa Fe
31	Colón	Santa Rosa de Aguán
32	Colón	Sonaguera
33	Colón	Tocoa
34	Colón	Bonito Oriental
35	Comayagua	Comayagua
36	Comayagua	Ajuterique
37	Comayagua	El Rosario
38	Comayagua	Esquías
39	Comayagua	Humuya
40	Comayagua	La Libertad
41	Comayagua	Lamaní
42	Comayagua	La Trinidad
43	Comayagua	Lejamaní
44	Comayagua	Meámbar
45	Comayagua	Minas de Oro
46	Comayagua	Ojos de Agua
47	Comayagua	San Jerónimo
48	Comayagua	San José de Comayagua
49	Comayagua	San José del Potrero
50	Comayagua	San Luis
51	Comayagua	San Sebastián
52	Comayagua	Siguatepeque
53	Comayagua	Villa de San Antonio
54	Comayagua	Las Lajas
55	Comayagua	Taulabé
56	Copán	Santa Rosa de Copán
57	Copán	Cabañas
58	Copán	Concepción
59	Copán	Copán Ruinas
60	Copán	Corquín
61	Copán	Cucuyagua
62	Copán	Dolores
63	Copán	Dulce Nombre
64	Copán	El Paraíso
65	Copán	Florida
66	Copán	La Jigua
67	Copán	La Unión
68	Copán	Nueva Arcadia
69	Copán	San Agustín
70	Copán	San Antonio
71	Copán	San Jerónimo
72	Copán	San José
73	Copán	San Juan de Opoa
74	Copán	San Nicolás
75	Copán	San Pedro
76	Copán	Santa Rita
77	Copán	Trinidad de Copán
78	Copán	Veracruz
79	Cortés	San Pedro Sula
80	Cortés	Choloma
81	Cortés	Omoa
82	Cortés	Pimienta
83	Cortés	Potrerillos
84	Cortés	Puerto Cortés
85	Cortés	San Antonio de Cortés
86	Cortés	San Francisco de Yojoa
87	Cortés	San Manuel
88	Cortés	Santa Cruz de Yojoa
89	Cortés	Villanueva
90	Cortés	La Lima
91	El Paraíso	Yuscarán
92	El Paraíso	Alauca
93	El Paraíso	Danlí
94	El Paraíso	El Paraíso
95	El Paraíso	Güinope
96	El Paraíso	Jacaleapa
97	El Paraíso	Liure
98	El Paraíso	Morocelí
99	El Paraíso	Oropolí
100	El Paraíso	Potrerillos
101	El Paraíso	San Antonio de Flores
102	El Paraíso	San Lucas
103	El Paraíso	San Matías
104	El Paraíso	Soledad
105	El Paraíso	Teupasenti
106	El Paraíso	Texiguat
107	El Paraíso	Vado Ancho
108	El Paraíso	Yauyupe
109	El Paraíso	Trojes
110	Francisco Morazán	Distrito Central (Tegucigalpa y Comayagüela)
111	Francisco Morazán	Alubarén
112	Francisco Morazán	Cedros
113	Francisco Morazán	Curarén
114	Francisco Morazán	El Porvenir
115	Francisco Morazán	Guaimaca
116	Francisco Morazán	La Libertad
117	Francisco Morazán	La Venta
118	Francisco Morazán	Lepaterique
119	Francisco Morazán	Maraita
120	Francisco Morazán	Marale
121	Francisco Morazán	Nueva Armenia
122	Francisco Morazán	Ojojona
123	Francisco Morazán	Orica
124	Francisco Morazán	Reitoca
125	Francisco Morazán	Sabanagrande
126	Francisco Morazán	San Antonio de Oriente
127	Francisco Morazán	San Buenaventura
128	Francisco Morazán	San Ignacio
129	Francisco Morazán	San Juan de Flores
130	Francisco Morazán	San Miguelito
131	Francisco Morazán	Santa Ana
132	Francisco Morazán	Santa Lucía
133	Francisco Morazán	Talanga
134	Francisco Morazán	Tatumbla
135	Francisco Morazán	Valle de Ángeles
136	Francisco Morazán	Villa de San Francisco
137	Francisco Morazán	Vallecillo
138	Gracias a Dios	Puerto Lempira
139	Gracias a Dios	Brus Laguna
140	Gracias a Dios	Ahuas
141	Gracias a Dios	Juan Francisco Bulnes
142	Gracias a Dios	Villeda Morales
143	Gracias a Dios	Wampusirpe
144	Intibucá	La Esperanza
145	Intibucá	Camasca
146	Intibucá	Colomoncagua
147	Intibucá	Concepción
148	Intibucá	Dolores
149	Intibucá	Intibucá
150	Intibucá	Jesús de Otoro
151	Intibucá	Magdalena
152	Intibucá	Masaguara
153	Intibucá	San Antonio
154	Intibucá	San Isidro
155	Intibucá	San Juan
156	Intibucá	San Marcos de la Sierra
157	Intibucá	San Miguelito
158	Intibucá	Santa Lucía
159	Intibucá	Yamaranguila
160	Intibucá	San Francisco de Opalaca
161	Islas de la Bahía	Roatán
162	Islas de la Bahía	Guanaja
163	Islas de la Bahía	José Santos Guardiola
164	Islas de la Bahía	Utila
165	La Paz	La Paz
166	La Paz	Aguanqueterique
167	La Paz	Cabañas
168	La Paz	Cane
169	La Paz	Chinacla
170	La Paz	Guajiquiro
171	La Paz	Lauterique
172	La Paz	Marcala
173	La Paz	Mercedes de Oriente
174	La Paz	Opatoro
175	La Paz	San Antonio del Norte
176	La Paz	San José
177	La Paz	San Juan
178	La Paz	San Pedro de Tutule
179	La Paz	Santa Ana
180	La Paz	Santa Elena
181	La Paz	Santa María
182	La Paz	Santiago de Puringla
183	La Paz	Yarula
184	Lempira	Gracias
185	Lempira	Belén
186	Lempira	Candelaria
187	Lempira	Cololaca
188	Lempira	Erandique
189	Lempira	Gualcince
190	Lempira	Guarita
191	Lempira	La Campa
192	Lempira	La Iguala
193	Lempira	Las Flores
194	Lempira	La Unión
195	Lempira	La Virtud
196	Lempira	Lepaera
197	Lempira	Mapulaca
198	Lempira	Piraera
199	Lempira	San Andrés
200	Lempira	San Francisco
201	Lempira	San Juan Guarita
202	Lempira	San Manuel Colohete
203	Lempira	San Rafael
204	Lempira	San Sebastián
205	Lempira	Santa Cruz
206	Lempira	Talgua
207	Lempira	Tambla
208	Lempira	Tomalá
209	Lempira	Valladolid
210	Lempira	Virginia
211	Lempira	San Marcos de Caiquín
212	Ocotepeque	Ocotepeque
213	Ocotepeque	Belén Gualcho
214	Ocotepeque	Concepción
215	Ocotepeque	Dolores Merendón
216	Ocotepeque	Fraternidad
217	Ocotepeque	La Encarnación
218	Ocotepeque	La Labor
219	Ocotepeque	Lucerna
220	Ocotepeque	Mercedes
221	Ocotepeque	San Fernando
222	Ocotepeque	San Francisco del Valle
223	Ocotepeque	San Jorge
224	Ocotepeque	San Marcos
225	Ocotepeque	Santa Fe
226	Ocotepeque	Sensenti
227	Ocotepeque	Sinuapa
228	Olancho	Juticalpa
229	Olancho	Campamento
230	Olancho	Catacamas
231	Olancho	Concordia
232	Olancho	Dulce Nombre de Culmí
233	Olancho	El Rosario
234	Olancho	Esquipulas del Norte
235	Olancho	Gualaco
236	Olancho	Guarizama
237	Olancho	Guata
238	Olancho	Guayape
239	Olancho	Jano
240	Olancho	La Unión
241	Olancho	Mangulile
242	Olancho	Manto
243	Olancho	Salamá
244	Olancho	San Esteban
245	Olancho	San Francisco de Becerra
246	Olancho	San Francisco de la Paz
247	Olancho	Santa María del Real
248	Olancho	Silca
249	Olancho	Yocón
250	Olancho	Patuca
251	Santa Bárbara	Santa Bárbara
252	Santa Bárbara	Arada
253	Santa Bárbara	Atima
254	Santa Bárbara	Azacualpa
255	Santa Bárbara	Ceguaca
256	Santa Bárbara	Concepción del Norte
257	Santa Bárbara	Concepción del Sur
258	Santa Bárbara	Chinda
259	Santa Bárbara	El Níspero
260	Santa Bárbara	Gualala
261	Santa Bárbara	Ilama
262	Santa Bárbara	Las Vegas
263	Santa Bárbara	Macuelizo
264	Santa Bárbara	Naranjito
265	Santa Bárbara	Nuevo Celilac
266	Santa Bárbara	Nueva Frontera
267	Santa Bárbara	Petoa
268	Santa Bárbara	Protección
269	Santa Bárbara	Quimistán
270	Santa Bárbara	San Francisco de Ojuera
271	Santa Bárbara	San José de las Colinas
272	Santa Bárbara	San Luis
273	Santa Bárbara	San Marcos
274	Santa Bárbara	San Nicolás
275	Santa Bárbara	San Pedro Zacapa
276	Santa Bárbara	San Vicente Centenario
277	Santa Bárbara	Santa Rita
278	Santa Bárbara	Trinidad
279	Valle	Nacaome
280	Valle	Alianza
281	Valle	Amapala
282	Valle	Aramecina
283	Valle	Caridad
284	Valle	Goascorán
285	Valle	Langue
286	Valle	San Francisco de Coray
287	Valle	San Lorenzo
288	Yoro	Yoro
289	Yoro	Arenal
290	Yoro	El Negrito
291	Yoro	El Progreso
292	Yoro	Jocón
293	Yoro	Morazán
294	Yoro	Olanchito
295	Yoro	Santa Rita
296	Yoro	Sulaco
297	Yoro	Victoria
298	Yoro	Yorito
302	Choluteca	 Pajuil
323	Choluteca	 Probando
330	Choluteca	 Juas
331	Choluteca	 Porpus
332	Probando	 P3
\.


--
-- Data for Name: reglamento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reglamento (id_regla, descripcion_regla) FROM stdin;
1	Todos los visitantes deben registrarse en la recepción.
2	No está permitido fumar en las instalaciones.
3	Los visitantes deben mantener un nivel de ruido bajo para no perturbar a los pacientes.
4	Las visitas están limitadas a dos personas por paciente a la vez.
5	No se permite la entrada de alimentos o bebidas externas.
6	El horario de visitas es de 8 a.m. a 8 p.m.
7	Los niños menores de 12 años deben estar acompañados por un adulto en todo momento.
8	No se permite el uso de teléfonos móviles en las salas de examen.
9	Todos los visitantes deben lavarse las manos antes de entrar a las habitaciones de los pacientes.
10	Está prohibido el ingreso de animales, excepto animales de servicio debidamente identificados.
\.


--
-- Data for Name: reservacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservacion (id_reservacion, id_paciente_huesped, id_cama, id_hospital, activa, fecha_entrada, fecha_salida, becado) FROM stdin;
33	73	53	13	f	2024-06-17	2024-06-18	t
32	72	5	13	f	2024-06-18	2024-06-18	t
35	76	55	12	f	2024-06-18	2024-06-18	f
34	75	70	2	f	2024-06-17	2024-06-18	f
12	40	5	10	f	2024-06-15	2024-06-19	f
14	50	6	10	f	2024-06-16	2024-06-25	f
15	51	6	10	f	2024-06-16	2024-06-18	f
16	52	6	10	f	2024-06-16	2024-06-26	t
39	77	63	12	t	2024-06-18	2024-06-27	t
18	55	\N	10	f	2024-06-16	2024-06-18	f
19	54	\N	13	f	2024-06-16	2024-06-25	t
17	53	6	13	f	2024-06-16	2024-06-19	f
41	82	10	12	t	2024-06-19	2024-06-28	t
42	85	62	4	f	2024-06-19	2024-06-19	t
21	57	5	7	f	2024-06-16	2024-06-16	f
24	61	6	13	f	2024-06-24	2024-06-16	f
22	58	5	5	f	2024-06-16	2024-06-17	f
25	59	55	13	f	2024-06-20	2024-06-17	t
26	62	55	4	f	2024-06-17	2024-06-17	t
27	63	5	13	f	2024-06-17	2024-06-17	t
28	64	58	10	f	2024-06-17	2024-06-17	t
46	93	56	5	t	2024-06-19	2024-06-28	t
36	78	55	12	f	2024-06-18	2024-06-19	t
44	95	59	13	f	2024-06-19	2024-06-19	f
47	96	76	4	t	2024-06-22	2024-06-29	t
48	87	66	13	t	2024-06-19	2024-06-29	t
29	65	4	13	f	2024-06-17	2024-06-17	f
40	81	69	12	f	2024-06-18	2024-06-22	f
30	70	55	4	f	2024-06-17	2024-06-17	t
10	39	\N	10	f	2024-06-15	2024-06-19	f
20	56	\N	13	f	2024-06-16	2024-06-25	f
23	60	\N	13	f	2024-06-16	2024-06-17	f
31	71	\N	4	f	2024-06-17	2024-06-17	t
38	80	70	12	f	2024-06-18	2024-06-22	f
45	86	62	4	t	2024-06-19	2024-06-23	t
49	92	65	5	t	2024-06-19	2024-06-28	t
43	94	53	13	f	2024-06-19	2024-06-24	f
37	79	5	10	f	2024-06-18	2024-06-24	f
50	91	53	3	f	2024-06-19	2024-06-24	f
\.


--
-- Data for Name: sala; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sala (id_sala, id_piso, nombre_sala) FROM stdin;
4	1	Sala A
5	1	Sala AA
6	1	Sala AAAA
7	1	Sala AAAAA
8	5	Sala Para Niños
9	4	Sala 1
10	7	Sala Costa
11	8	Sala Sur
12	9	Sala Infantil
13	10	Sala Mujer
14	6	Sala Sol
15	11	1
16	12	Sala Maternidad
17	13	Sala 1
18	3	Sala Ninos
\.


--
-- Data for Name: transaccion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaccion (id_transaccion, id_huesped, valor, fecha, becada) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, id_persona, id_hospital, nickname, contrasena, rol) FROM stdin;
2	2	2	user2	$2b$10$Kw3/BAFAs6U93H905nwHxuxWEJkO6lwbSSiNOuA.Euv34bm6L2mBW	usuario
9	21	7	kenny	$2b$10$Fgl0NY9oWlYxP.OipKkjTesoDQrv0SiCeKEOlOHaeyAcGV52SkDJG	usuario
12	28	18	Juan	$2b$10$LMdJf0gXUb7nZ2Govu91GeS/A4fbLNAkwJCuOfWON9GChMXAwgJAW	admin
14	5	12	david.jimenez	$2b$10$4ww0hBbUZLNXwdTIdLqtaeMUpNNoRJtaDRInM1LDby.KBXUc534Xa	usuario
17	47	13	kelvon.salgado	$2b$10$PBej3itw3v0zlN9MygvlVOmz/JPM11JoIil2A6dcuffCDZa5J1IfO	usuario
18	48	3	salgero.tgu	$2b$10$xNj3wp.uNSS6xb0Nf20H0OoGpYnJFzlpfr2PsCsyGA6aJWFuBnVZq	admin
1	1	4	user1	$2b$10$gC1RaIJAn4dmhcV1dDKn4uqM306/4kzWhU5Vkek45WlUep89PBJMa	admin
\.


--
-- Data for Name: usuario_privilegio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario_privilegio (id_usuario_privilegio, id_usuario, id_privilegio) FROM stdin;
23	2	2
27	2	10
\.


--
-- Name: afiliado_huesped_id_afiliado_huesped_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.afiliado_huesped_id_afiliado_huesped_seq', 6, true);


--
-- Name: afiliado_huesped_id_afiliado_huesped_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.afiliado_huesped_id_afiliado_huesped_seq1', 1, false);


--
-- Name: afiliado_id_afiliado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.afiliado_id_afiliado_seq', 8, true);


--
-- Name: cama_id_cama_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cama_id_cama_seq', 78, true);


--
-- Name: causa_visita_id_causa_visita_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.causa_visita_id_causa_visita_seq', 36, true);


--
-- Name: habitacion_id_habitacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.habitacion_id_habitacion_seq', 40, true);


--
-- Name: hospital_id_hospital_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hospital_id_hospital_seq', 21, true);


--
-- Name: huesped_id_huesped_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.huesped_id_huesped_seq', 26, true);


--
-- Name: iglesia_huesped_id_iglesia_huesped_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.iglesia_huesped_id_iglesia_huesped_seq', 1, false);


--
-- Name: iglesia_id_iglesia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.iglesia_id_iglesia_seq', 1, false);


--
-- Name: lista_espera_id_lista_espera_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_espera_id_lista_espera_seq', 1, false);


--
-- Name: lista_negra_id_lista_negra_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_negra_id_lista_negra_seq', 8, true);


--
-- Name: lista_solicitud_id_lista_solicitud; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_solicitud_id_lista_solicitud', 10, true);


--
-- Name: lista_solicitud_id_lista_solicitud_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lista_solicitud_id_lista_solicitud_seq', 85, true);


--
-- Name: lugar_id_lugar_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lugar_id_lugar_seq', 2, true);


--
-- Name: ocupacion_id_ocupacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ocupacion_id_ocupacion_seq', 35, true);


--
-- Name: ofrenda_id_ofrenda_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ofrenda_id_ofrenda_seq', 24, true);


--
-- Name: paciente_huesped_id_paciente_huesped_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paciente_huesped_id_paciente_huesped_seq', 96, true);


--
-- Name: paciente_id_paciente_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.paciente_id_paciente_seq', 73, true);


--
-- Name: pago_id_pago; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_id_pago', 1, false);


--
-- Name: pago_id_pago_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pago_id_pago_seq', 1, false);


--
-- Name: patrono_afiliado_id_patrono_afiliado_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patrono_afiliado_id_patrono_afiliado_seq', 8, true);


--
-- Name: patrono_id_patrono_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patrono_id_patrono_seq', 2, true);


--
-- Name: persona_id_persona_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.persona_id_persona_seq', 49, true);


--
-- Name: piso_id_piso_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.piso_id_piso_seq', 13, true);


--
-- Name: procedencia_id_procedencia_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.procedencia_id_procedencia_seq', 332, true);


--
-- Name: reglamento_id_regla_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reglamento_id_regla_seq', 1, false);


--
-- Name: reservacion_id_reservacion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservacion_id_reservacion_seq', 50, true);


--
-- Name: sala_id_sala_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sala_id_sala_seq', 18, true);


--
-- Name: transaccion_id_transaccion_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaccion_id_transaccion_seq', 1, false);


--
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 18, true);


--
-- Name: usuario_privilegio_id_usuario_privilegio_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_privilegio_id_usuario_privilegio_seq', 27, true);


--
-- Name: afiliado_huesped afiliado_huesped_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_huesped
    ADD CONSTRAINT afiliado_huesped_pkey PRIMARY KEY (id_afiliado_huesped);


--
-- Name: afiliado afiliado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado
    ADD CONSTRAINT afiliado_pkey PRIMARY KEY (id_afiliado);


--
-- Name: afiliado_reservacion afiliado_reservacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_reservacion
    ADD CONSTRAINT afiliado_reservacion_pkey PRIMARY KEY (id_afiliado_reservacion);


--
-- Name: cama cama_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_pkey PRIMARY KEY (id_cama);


--
-- Name: causa_visita causa_visita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.causa_visita
    ADD CONSTRAINT causa_visita_pkey PRIMARY KEY (id_causa_visita);


--
-- Name: habitacion habitacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitacion
    ADD CONSTRAINT habitacion_pkey PRIMARY KEY (id_habitacion);


--
-- Name: hospital hospital_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hospital
    ADD CONSTRAINT hospital_pkey PRIMARY KEY (id_hospital);


--
-- Name: huesped huesped_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT huesped_pkey PRIMARY KEY (id_huesped);


--
-- Name: iglesia_huesped iglesia_huesped_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iglesia_huesped
    ADD CONSTRAINT iglesia_huesped_pkey PRIMARY KEY (id_iglesia_huesped);


--
-- Name: iglesia iglesia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iglesia
    ADD CONSTRAINT iglesia_pkey PRIMARY KEY (id_iglesia);


--
-- Name: lista_espera lista_espera_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_espera
    ADD CONSTRAINT lista_espera_pkey PRIMARY KEY (id_lista_espera);


--
-- Name: lista_negra lista_negra_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_negra
    ADD CONSTRAINT lista_negra_pkey PRIMARY KEY (id_lista_negra);


--
-- Name: lista_solicitud lista_solicitud_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_solicitud
    ADD CONSTRAINT lista_solicitud_pkey PRIMARY KEY (id_lista_solicitud);


--
-- Name: lugar lugar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar
    ADD CONSTRAINT lugar_pkey PRIMARY KEY (id_lugar);


--
-- Name: ocupacion ocupacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ocupacion
    ADD CONSTRAINT ocupacion_pkey PRIMARY KEY (id_ocupacion);


--
-- Name: ofrenda ofrenda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ofrenda
    ADD CONSTRAINT ofrenda_pkey PRIMARY KEY (id_ofrenda);


--
-- Name: paciente_huesped paciente_huesped_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente_huesped
    ADD CONSTRAINT paciente_huesped_pkey PRIMARY KEY (id_paciente_huesped);


--
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id_paciente);


--
-- Name: pago pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_pkey PRIMARY KEY (id_pago);


--
-- Name: patrono_afiliado patrono_afiliado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrono_afiliado
    ADD CONSTRAINT patrono_afiliado_pkey PRIMARY KEY (id_patrono_afiliado);


--
-- Name: patrono patrono_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrono
    ADD CONSTRAINT patrono_pkey PRIMARY KEY (id_patrono);


--
-- Name: persona persona_dni_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key UNIQUE (dni);


--
-- Name: persona persona_dni_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key1 UNIQUE (dni);


--
-- Name: persona persona_dni_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key10 UNIQUE (dni);


--
-- Name: persona persona_dni_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key100 UNIQUE (dni);


--
-- Name: persona persona_dni_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key101 UNIQUE (dni);


--
-- Name: persona persona_dni_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key102 UNIQUE (dni);


--
-- Name: persona persona_dni_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key103 UNIQUE (dni);


--
-- Name: persona persona_dni_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key104 UNIQUE (dni);


--
-- Name: persona persona_dni_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key105 UNIQUE (dni);


--
-- Name: persona persona_dni_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key106 UNIQUE (dni);


--
-- Name: persona persona_dni_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key107 UNIQUE (dni);


--
-- Name: persona persona_dni_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key108 UNIQUE (dni);


--
-- Name: persona persona_dni_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key109 UNIQUE (dni);


--
-- Name: persona persona_dni_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key11 UNIQUE (dni);


--
-- Name: persona persona_dni_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key110 UNIQUE (dni);


--
-- Name: persona persona_dni_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key111 UNIQUE (dni);


--
-- Name: persona persona_dni_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key112 UNIQUE (dni);


--
-- Name: persona persona_dni_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key113 UNIQUE (dni);


--
-- Name: persona persona_dni_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key114 UNIQUE (dni);


--
-- Name: persona persona_dni_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key115 UNIQUE (dni);


--
-- Name: persona persona_dni_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key116 UNIQUE (dni);


--
-- Name: persona persona_dni_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key117 UNIQUE (dni);


--
-- Name: persona persona_dni_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key118 UNIQUE (dni);


--
-- Name: persona persona_dni_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key119 UNIQUE (dni);


--
-- Name: persona persona_dni_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key12 UNIQUE (dni);


--
-- Name: persona persona_dni_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key120 UNIQUE (dni);


--
-- Name: persona persona_dni_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key121 UNIQUE (dni);


--
-- Name: persona persona_dni_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key122 UNIQUE (dni);


--
-- Name: persona persona_dni_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key123 UNIQUE (dni);


--
-- Name: persona persona_dni_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key124 UNIQUE (dni);


--
-- Name: persona persona_dni_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key125 UNIQUE (dni);


--
-- Name: persona persona_dni_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key126 UNIQUE (dni);


--
-- Name: persona persona_dni_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key127 UNIQUE (dni);


--
-- Name: persona persona_dni_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key128 UNIQUE (dni);


--
-- Name: persona persona_dni_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key129 UNIQUE (dni);


--
-- Name: persona persona_dni_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key13 UNIQUE (dni);


--
-- Name: persona persona_dni_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key130 UNIQUE (dni);


--
-- Name: persona persona_dni_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key131 UNIQUE (dni);


--
-- Name: persona persona_dni_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key132 UNIQUE (dni);


--
-- Name: persona persona_dni_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key133 UNIQUE (dni);


--
-- Name: persona persona_dni_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key134 UNIQUE (dni);


--
-- Name: persona persona_dni_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key135 UNIQUE (dni);


--
-- Name: persona persona_dni_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key136 UNIQUE (dni);


--
-- Name: persona persona_dni_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key137 UNIQUE (dni);


--
-- Name: persona persona_dni_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key138 UNIQUE (dni);


--
-- Name: persona persona_dni_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key139 UNIQUE (dni);


--
-- Name: persona persona_dni_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key14 UNIQUE (dni);


--
-- Name: persona persona_dni_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key140 UNIQUE (dni);


--
-- Name: persona persona_dni_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key141 UNIQUE (dni);


--
-- Name: persona persona_dni_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key142 UNIQUE (dni);


--
-- Name: persona persona_dni_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key143 UNIQUE (dni);


--
-- Name: persona persona_dni_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key144 UNIQUE (dni);


--
-- Name: persona persona_dni_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key145 UNIQUE (dni);


--
-- Name: persona persona_dni_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key146 UNIQUE (dni);


--
-- Name: persona persona_dni_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key147 UNIQUE (dni);


--
-- Name: persona persona_dni_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key148 UNIQUE (dni);


--
-- Name: persona persona_dni_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key149 UNIQUE (dni);


--
-- Name: persona persona_dni_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key15 UNIQUE (dni);


--
-- Name: persona persona_dni_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key150 UNIQUE (dni);


--
-- Name: persona persona_dni_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key151 UNIQUE (dni);


--
-- Name: persona persona_dni_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key152 UNIQUE (dni);


--
-- Name: persona persona_dni_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key153 UNIQUE (dni);


--
-- Name: persona persona_dni_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key154 UNIQUE (dni);


--
-- Name: persona persona_dni_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key155 UNIQUE (dni);


--
-- Name: persona persona_dni_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key156 UNIQUE (dni);


--
-- Name: persona persona_dni_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key157 UNIQUE (dni);


--
-- Name: persona persona_dni_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key158 UNIQUE (dni);


--
-- Name: persona persona_dni_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key159 UNIQUE (dni);


--
-- Name: persona persona_dni_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key16 UNIQUE (dni);


--
-- Name: persona persona_dni_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key160 UNIQUE (dni);


--
-- Name: persona persona_dni_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key161 UNIQUE (dni);


--
-- Name: persona persona_dni_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key162 UNIQUE (dni);


--
-- Name: persona persona_dni_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key163 UNIQUE (dni);


--
-- Name: persona persona_dni_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key164 UNIQUE (dni);


--
-- Name: persona persona_dni_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key165 UNIQUE (dni);


--
-- Name: persona persona_dni_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key166 UNIQUE (dni);


--
-- Name: persona persona_dni_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key167 UNIQUE (dni);


--
-- Name: persona persona_dni_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key168 UNIQUE (dni);


--
-- Name: persona persona_dni_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key169 UNIQUE (dni);


--
-- Name: persona persona_dni_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key17 UNIQUE (dni);


--
-- Name: persona persona_dni_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key170 UNIQUE (dni);


--
-- Name: persona persona_dni_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key171 UNIQUE (dni);


--
-- Name: persona persona_dni_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key172 UNIQUE (dni);


--
-- Name: persona persona_dni_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key173 UNIQUE (dni);


--
-- Name: persona persona_dni_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key174 UNIQUE (dni);


--
-- Name: persona persona_dni_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key175 UNIQUE (dni);


--
-- Name: persona persona_dni_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key176 UNIQUE (dni);


--
-- Name: persona persona_dni_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key177 UNIQUE (dni);


--
-- Name: persona persona_dni_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key178 UNIQUE (dni);


--
-- Name: persona persona_dni_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key179 UNIQUE (dni);


--
-- Name: persona persona_dni_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key18 UNIQUE (dni);


--
-- Name: persona persona_dni_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key180 UNIQUE (dni);


--
-- Name: persona persona_dni_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key181 UNIQUE (dni);


--
-- Name: persona persona_dni_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key182 UNIQUE (dni);


--
-- Name: persona persona_dni_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key183 UNIQUE (dni);


--
-- Name: persona persona_dni_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key184 UNIQUE (dni);


--
-- Name: persona persona_dni_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key185 UNIQUE (dni);


--
-- Name: persona persona_dni_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key186 UNIQUE (dni);


--
-- Name: persona persona_dni_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key187 UNIQUE (dni);


--
-- Name: persona persona_dni_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key188 UNIQUE (dni);


--
-- Name: persona persona_dni_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key189 UNIQUE (dni);


--
-- Name: persona persona_dni_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key19 UNIQUE (dni);


--
-- Name: persona persona_dni_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key190 UNIQUE (dni);


--
-- Name: persona persona_dni_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key191 UNIQUE (dni);


--
-- Name: persona persona_dni_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key192 UNIQUE (dni);


--
-- Name: persona persona_dni_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key193 UNIQUE (dni);


--
-- Name: persona persona_dni_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key194 UNIQUE (dni);


--
-- Name: persona persona_dni_key195; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key195 UNIQUE (dni);


--
-- Name: persona persona_dni_key196; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key196 UNIQUE (dni);


--
-- Name: persona persona_dni_key197; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key197 UNIQUE (dni);


--
-- Name: persona persona_dni_key198; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key198 UNIQUE (dni);


--
-- Name: persona persona_dni_key199; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key199 UNIQUE (dni);


--
-- Name: persona persona_dni_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key2 UNIQUE (dni);


--
-- Name: persona persona_dni_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key20 UNIQUE (dni);


--
-- Name: persona persona_dni_key200; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key200 UNIQUE (dni);


--
-- Name: persona persona_dni_key201; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key201 UNIQUE (dni);


--
-- Name: persona persona_dni_key202; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key202 UNIQUE (dni);


--
-- Name: persona persona_dni_key203; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key203 UNIQUE (dni);


--
-- Name: persona persona_dni_key204; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key204 UNIQUE (dni);


--
-- Name: persona persona_dni_key205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key205 UNIQUE (dni);


--
-- Name: persona persona_dni_key206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key206 UNIQUE (dni);


--
-- Name: persona persona_dni_key207; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key207 UNIQUE (dni);


--
-- Name: persona persona_dni_key208; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key208 UNIQUE (dni);


--
-- Name: persona persona_dni_key209; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key209 UNIQUE (dni);


--
-- Name: persona persona_dni_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key21 UNIQUE (dni);


--
-- Name: persona persona_dni_key210; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key210 UNIQUE (dni);


--
-- Name: persona persona_dni_key211; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key211 UNIQUE (dni);


--
-- Name: persona persona_dni_key212; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key212 UNIQUE (dni);


--
-- Name: persona persona_dni_key213; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key213 UNIQUE (dni);


--
-- Name: persona persona_dni_key214; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key214 UNIQUE (dni);


--
-- Name: persona persona_dni_key215; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key215 UNIQUE (dni);


--
-- Name: persona persona_dni_key216; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key216 UNIQUE (dni);


--
-- Name: persona persona_dni_key217; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key217 UNIQUE (dni);


--
-- Name: persona persona_dni_key218; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key218 UNIQUE (dni);


--
-- Name: persona persona_dni_key219; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key219 UNIQUE (dni);


--
-- Name: persona persona_dni_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key22 UNIQUE (dni);


--
-- Name: persona persona_dni_key220; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key220 UNIQUE (dni);


--
-- Name: persona persona_dni_key221; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key221 UNIQUE (dni);


--
-- Name: persona persona_dni_key222; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key222 UNIQUE (dni);


--
-- Name: persona persona_dni_key223; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key223 UNIQUE (dni);


--
-- Name: persona persona_dni_key224; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key224 UNIQUE (dni);


--
-- Name: persona persona_dni_key225; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key225 UNIQUE (dni);


--
-- Name: persona persona_dni_key226; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key226 UNIQUE (dni);


--
-- Name: persona persona_dni_key227; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key227 UNIQUE (dni);


--
-- Name: persona persona_dni_key228; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key228 UNIQUE (dni);


--
-- Name: persona persona_dni_key229; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key229 UNIQUE (dni);


--
-- Name: persona persona_dni_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key23 UNIQUE (dni);


--
-- Name: persona persona_dni_key230; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key230 UNIQUE (dni);


--
-- Name: persona persona_dni_key231; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key231 UNIQUE (dni);


--
-- Name: persona persona_dni_key232; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key232 UNIQUE (dni);


--
-- Name: persona persona_dni_key233; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key233 UNIQUE (dni);


--
-- Name: persona persona_dni_key234; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key234 UNIQUE (dni);


--
-- Name: persona persona_dni_key235; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key235 UNIQUE (dni);


--
-- Name: persona persona_dni_key236; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key236 UNIQUE (dni);


--
-- Name: persona persona_dni_key237; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key237 UNIQUE (dni);


--
-- Name: persona persona_dni_key238; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key238 UNIQUE (dni);


--
-- Name: persona persona_dni_key239; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key239 UNIQUE (dni);


--
-- Name: persona persona_dni_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key24 UNIQUE (dni);


--
-- Name: persona persona_dni_key240; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key240 UNIQUE (dni);


--
-- Name: persona persona_dni_key241; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key241 UNIQUE (dni);


--
-- Name: persona persona_dni_key242; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key242 UNIQUE (dni);


--
-- Name: persona persona_dni_key243; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key243 UNIQUE (dni);


--
-- Name: persona persona_dni_key244; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key244 UNIQUE (dni);


--
-- Name: persona persona_dni_key245; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key245 UNIQUE (dni);


--
-- Name: persona persona_dni_key246; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key246 UNIQUE (dni);


--
-- Name: persona persona_dni_key247; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key247 UNIQUE (dni);


--
-- Name: persona persona_dni_key248; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key248 UNIQUE (dni);


--
-- Name: persona persona_dni_key249; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key249 UNIQUE (dni);


--
-- Name: persona persona_dni_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key25 UNIQUE (dni);


--
-- Name: persona persona_dni_key250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key250 UNIQUE (dni);


--
-- Name: persona persona_dni_key251; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key251 UNIQUE (dni);


--
-- Name: persona persona_dni_key252; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key252 UNIQUE (dni);


--
-- Name: persona persona_dni_key253; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key253 UNIQUE (dni);


--
-- Name: persona persona_dni_key254; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key254 UNIQUE (dni);


--
-- Name: persona persona_dni_key255; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key255 UNIQUE (dni);


--
-- Name: persona persona_dni_key256; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key256 UNIQUE (dni);


--
-- Name: persona persona_dni_key257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key257 UNIQUE (dni);


--
-- Name: persona persona_dni_key258; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key258 UNIQUE (dni);


--
-- Name: persona persona_dni_key259; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key259 UNIQUE (dni);


--
-- Name: persona persona_dni_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key26 UNIQUE (dni);


--
-- Name: persona persona_dni_key260; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key260 UNIQUE (dni);


--
-- Name: persona persona_dni_key261; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key261 UNIQUE (dni);


--
-- Name: persona persona_dni_key262; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key262 UNIQUE (dni);


--
-- Name: persona persona_dni_key263; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key263 UNIQUE (dni);


--
-- Name: persona persona_dni_key264; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key264 UNIQUE (dni);


--
-- Name: persona persona_dni_key265; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key265 UNIQUE (dni);


--
-- Name: persona persona_dni_key266; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key266 UNIQUE (dni);


--
-- Name: persona persona_dni_key267; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key267 UNIQUE (dni);


--
-- Name: persona persona_dni_key268; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key268 UNIQUE (dni);


--
-- Name: persona persona_dni_key269; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key269 UNIQUE (dni);


--
-- Name: persona persona_dni_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key27 UNIQUE (dni);


--
-- Name: persona persona_dni_key270; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key270 UNIQUE (dni);


--
-- Name: persona persona_dni_key271; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key271 UNIQUE (dni);


--
-- Name: persona persona_dni_key272; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key272 UNIQUE (dni);


--
-- Name: persona persona_dni_key273; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key273 UNIQUE (dni);


--
-- Name: persona persona_dni_key274; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key274 UNIQUE (dni);


--
-- Name: persona persona_dni_key275; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key275 UNIQUE (dni);


--
-- Name: persona persona_dni_key276; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key276 UNIQUE (dni);


--
-- Name: persona persona_dni_key277; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key277 UNIQUE (dni);


--
-- Name: persona persona_dni_key278; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key278 UNIQUE (dni);


--
-- Name: persona persona_dni_key279; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key279 UNIQUE (dni);


--
-- Name: persona persona_dni_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key28 UNIQUE (dni);


--
-- Name: persona persona_dni_key280; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key280 UNIQUE (dni);


--
-- Name: persona persona_dni_key281; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key281 UNIQUE (dni);


--
-- Name: persona persona_dni_key282; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key282 UNIQUE (dni);


--
-- Name: persona persona_dni_key283; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key283 UNIQUE (dni);


--
-- Name: persona persona_dni_key284; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key284 UNIQUE (dni);


--
-- Name: persona persona_dni_key285; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key285 UNIQUE (dni);


--
-- Name: persona persona_dni_key286; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key286 UNIQUE (dni);


--
-- Name: persona persona_dni_key287; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key287 UNIQUE (dni);


--
-- Name: persona persona_dni_key288; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key288 UNIQUE (dni);


--
-- Name: persona persona_dni_key289; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key289 UNIQUE (dni);


--
-- Name: persona persona_dni_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key29 UNIQUE (dni);


--
-- Name: persona persona_dni_key290; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key290 UNIQUE (dni);


--
-- Name: persona persona_dni_key291; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key291 UNIQUE (dni);


--
-- Name: persona persona_dni_key292; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key292 UNIQUE (dni);


--
-- Name: persona persona_dni_key293; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key293 UNIQUE (dni);


--
-- Name: persona persona_dni_key294; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key294 UNIQUE (dni);


--
-- Name: persona persona_dni_key295; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key295 UNIQUE (dni);


--
-- Name: persona persona_dni_key296; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key296 UNIQUE (dni);


--
-- Name: persona persona_dni_key297; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key297 UNIQUE (dni);


--
-- Name: persona persona_dni_key298; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key298 UNIQUE (dni);


--
-- Name: persona persona_dni_key299; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key299 UNIQUE (dni);


--
-- Name: persona persona_dni_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key3 UNIQUE (dni);


--
-- Name: persona persona_dni_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key30 UNIQUE (dni);


--
-- Name: persona persona_dni_key300; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key300 UNIQUE (dni);


--
-- Name: persona persona_dni_key301; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key301 UNIQUE (dni);


--
-- Name: persona persona_dni_key302; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key302 UNIQUE (dni);


--
-- Name: persona persona_dni_key303; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key303 UNIQUE (dni);


--
-- Name: persona persona_dni_key304; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key304 UNIQUE (dni);


--
-- Name: persona persona_dni_key305; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key305 UNIQUE (dni);


--
-- Name: persona persona_dni_key306; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key306 UNIQUE (dni);


--
-- Name: persona persona_dni_key307; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key307 UNIQUE (dni);


--
-- Name: persona persona_dni_key308; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key308 UNIQUE (dni);


--
-- Name: persona persona_dni_key309; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key309 UNIQUE (dni);


--
-- Name: persona persona_dni_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key31 UNIQUE (dni);


--
-- Name: persona persona_dni_key310; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key310 UNIQUE (dni);


--
-- Name: persona persona_dni_key311; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key311 UNIQUE (dni);


--
-- Name: persona persona_dni_key312; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key312 UNIQUE (dni);


--
-- Name: persona persona_dni_key313; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key313 UNIQUE (dni);


--
-- Name: persona persona_dni_key314; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key314 UNIQUE (dni);


--
-- Name: persona persona_dni_key315; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key315 UNIQUE (dni);


--
-- Name: persona persona_dni_key316; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key316 UNIQUE (dni);


--
-- Name: persona persona_dni_key317; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key317 UNIQUE (dni);


--
-- Name: persona persona_dni_key318; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key318 UNIQUE (dni);


--
-- Name: persona persona_dni_key319; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key319 UNIQUE (dni);


--
-- Name: persona persona_dni_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key32 UNIQUE (dni);


--
-- Name: persona persona_dni_key320; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key320 UNIQUE (dni);


--
-- Name: persona persona_dni_key321; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key321 UNIQUE (dni);


--
-- Name: persona persona_dni_key322; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key322 UNIQUE (dni);


--
-- Name: persona persona_dni_key323; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key323 UNIQUE (dni);


--
-- Name: persona persona_dni_key324; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key324 UNIQUE (dni);


--
-- Name: persona persona_dni_key325; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key325 UNIQUE (dni);


--
-- Name: persona persona_dni_key326; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key326 UNIQUE (dni);


--
-- Name: persona persona_dni_key327; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key327 UNIQUE (dni);


--
-- Name: persona persona_dni_key328; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key328 UNIQUE (dni);


--
-- Name: persona persona_dni_key329; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key329 UNIQUE (dni);


--
-- Name: persona persona_dni_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key33 UNIQUE (dni);


--
-- Name: persona persona_dni_key330; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key330 UNIQUE (dni);


--
-- Name: persona persona_dni_key331; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key331 UNIQUE (dni);


--
-- Name: persona persona_dni_key332; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key332 UNIQUE (dni);


--
-- Name: persona persona_dni_key333; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key333 UNIQUE (dni);


--
-- Name: persona persona_dni_key334; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key334 UNIQUE (dni);


--
-- Name: persona persona_dni_key335; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key335 UNIQUE (dni);


--
-- Name: persona persona_dni_key336; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key336 UNIQUE (dni);


--
-- Name: persona persona_dni_key337; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key337 UNIQUE (dni);


--
-- Name: persona persona_dni_key338; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key338 UNIQUE (dni);


--
-- Name: persona persona_dni_key339; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key339 UNIQUE (dni);


--
-- Name: persona persona_dni_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key34 UNIQUE (dni);


--
-- Name: persona persona_dni_key340; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key340 UNIQUE (dni);


--
-- Name: persona persona_dni_key341; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key341 UNIQUE (dni);


--
-- Name: persona persona_dni_key342; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key342 UNIQUE (dni);


--
-- Name: persona persona_dni_key343; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key343 UNIQUE (dni);


--
-- Name: persona persona_dni_key344; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key344 UNIQUE (dni);


--
-- Name: persona persona_dni_key345; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key345 UNIQUE (dni);


--
-- Name: persona persona_dni_key346; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key346 UNIQUE (dni);


--
-- Name: persona persona_dni_key347; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key347 UNIQUE (dni);


--
-- Name: persona persona_dni_key348; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key348 UNIQUE (dni);


--
-- Name: persona persona_dni_key349; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key349 UNIQUE (dni);


--
-- Name: persona persona_dni_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key35 UNIQUE (dni);


--
-- Name: persona persona_dni_key350; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key350 UNIQUE (dni);


--
-- Name: persona persona_dni_key351; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key351 UNIQUE (dni);


--
-- Name: persona persona_dni_key352; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key352 UNIQUE (dni);


--
-- Name: persona persona_dni_key353; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key353 UNIQUE (dni);


--
-- Name: persona persona_dni_key354; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key354 UNIQUE (dni);


--
-- Name: persona persona_dni_key355; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key355 UNIQUE (dni);


--
-- Name: persona persona_dni_key356; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key356 UNIQUE (dni);


--
-- Name: persona persona_dni_key357; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key357 UNIQUE (dni);


--
-- Name: persona persona_dni_key358; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key358 UNIQUE (dni);


--
-- Name: persona persona_dni_key359; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key359 UNIQUE (dni);


--
-- Name: persona persona_dni_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key36 UNIQUE (dni);


--
-- Name: persona persona_dni_key360; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key360 UNIQUE (dni);


--
-- Name: persona persona_dni_key361; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key361 UNIQUE (dni);


--
-- Name: persona persona_dni_key362; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key362 UNIQUE (dni);


--
-- Name: persona persona_dni_key363; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key363 UNIQUE (dni);


--
-- Name: persona persona_dni_key364; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key364 UNIQUE (dni);


--
-- Name: persona persona_dni_key365; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key365 UNIQUE (dni);


--
-- Name: persona persona_dni_key366; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key366 UNIQUE (dni);


--
-- Name: persona persona_dni_key367; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key367 UNIQUE (dni);


--
-- Name: persona persona_dni_key368; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key368 UNIQUE (dni);


--
-- Name: persona persona_dni_key369; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key369 UNIQUE (dni);


--
-- Name: persona persona_dni_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key37 UNIQUE (dni);


--
-- Name: persona persona_dni_key370; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key370 UNIQUE (dni);


--
-- Name: persona persona_dni_key371; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key371 UNIQUE (dni);


--
-- Name: persona persona_dni_key372; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key372 UNIQUE (dni);


--
-- Name: persona persona_dni_key373; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key373 UNIQUE (dni);


--
-- Name: persona persona_dni_key374; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key374 UNIQUE (dni);


--
-- Name: persona persona_dni_key375; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key375 UNIQUE (dni);


--
-- Name: persona persona_dni_key376; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key376 UNIQUE (dni);


--
-- Name: persona persona_dni_key377; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key377 UNIQUE (dni);


--
-- Name: persona persona_dni_key378; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key378 UNIQUE (dni);


--
-- Name: persona persona_dni_key379; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key379 UNIQUE (dni);


--
-- Name: persona persona_dni_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key38 UNIQUE (dni);


--
-- Name: persona persona_dni_key380; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key380 UNIQUE (dni);


--
-- Name: persona persona_dni_key381; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key381 UNIQUE (dni);


--
-- Name: persona persona_dni_key382; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key382 UNIQUE (dni);


--
-- Name: persona persona_dni_key383; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key383 UNIQUE (dni);


--
-- Name: persona persona_dni_key384; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key384 UNIQUE (dni);


--
-- Name: persona persona_dni_key385; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key385 UNIQUE (dni);


--
-- Name: persona persona_dni_key386; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key386 UNIQUE (dni);


--
-- Name: persona persona_dni_key387; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key387 UNIQUE (dni);


--
-- Name: persona persona_dni_key388; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key388 UNIQUE (dni);


--
-- Name: persona persona_dni_key389; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key389 UNIQUE (dni);


--
-- Name: persona persona_dni_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key39 UNIQUE (dni);


--
-- Name: persona persona_dni_key390; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key390 UNIQUE (dni);


--
-- Name: persona persona_dni_key391; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key391 UNIQUE (dni);


--
-- Name: persona persona_dni_key392; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key392 UNIQUE (dni);


--
-- Name: persona persona_dni_key393; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key393 UNIQUE (dni);


--
-- Name: persona persona_dni_key394; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key394 UNIQUE (dni);


--
-- Name: persona persona_dni_key395; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key395 UNIQUE (dni);


--
-- Name: persona persona_dni_key396; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key396 UNIQUE (dni);


--
-- Name: persona persona_dni_key397; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key397 UNIQUE (dni);


--
-- Name: persona persona_dni_key398; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key398 UNIQUE (dni);


--
-- Name: persona persona_dni_key399; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key399 UNIQUE (dni);


--
-- Name: persona persona_dni_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key4 UNIQUE (dni);


--
-- Name: persona persona_dni_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key40 UNIQUE (dni);


--
-- Name: persona persona_dni_key400; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key400 UNIQUE (dni);


--
-- Name: persona persona_dni_key401; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key401 UNIQUE (dni);


--
-- Name: persona persona_dni_key402; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key402 UNIQUE (dni);


--
-- Name: persona persona_dni_key403; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key403 UNIQUE (dni);


--
-- Name: persona persona_dni_key404; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key404 UNIQUE (dni);


--
-- Name: persona persona_dni_key405; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key405 UNIQUE (dni);


--
-- Name: persona persona_dni_key406; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key406 UNIQUE (dni);


--
-- Name: persona persona_dni_key407; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key407 UNIQUE (dni);


--
-- Name: persona persona_dni_key408; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key408 UNIQUE (dni);


--
-- Name: persona persona_dni_key409; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key409 UNIQUE (dni);


--
-- Name: persona persona_dni_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key41 UNIQUE (dni);


--
-- Name: persona persona_dni_key410; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key410 UNIQUE (dni);


--
-- Name: persona persona_dni_key411; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key411 UNIQUE (dni);


--
-- Name: persona persona_dni_key412; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key412 UNIQUE (dni);


--
-- Name: persona persona_dni_key413; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key413 UNIQUE (dni);


--
-- Name: persona persona_dni_key414; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key414 UNIQUE (dni);


--
-- Name: persona persona_dni_key415; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key415 UNIQUE (dni);


--
-- Name: persona persona_dni_key416; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key416 UNIQUE (dni);


--
-- Name: persona persona_dni_key417; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key417 UNIQUE (dni);


--
-- Name: persona persona_dni_key418; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key418 UNIQUE (dni);


--
-- Name: persona persona_dni_key419; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key419 UNIQUE (dni);


--
-- Name: persona persona_dni_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key42 UNIQUE (dni);


--
-- Name: persona persona_dni_key420; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key420 UNIQUE (dni);


--
-- Name: persona persona_dni_key421; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key421 UNIQUE (dni);


--
-- Name: persona persona_dni_key422; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key422 UNIQUE (dni);


--
-- Name: persona persona_dni_key423; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key423 UNIQUE (dni);


--
-- Name: persona persona_dni_key424; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key424 UNIQUE (dni);


--
-- Name: persona persona_dni_key425; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key425 UNIQUE (dni);


--
-- Name: persona persona_dni_key426; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key426 UNIQUE (dni);


--
-- Name: persona persona_dni_key427; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key427 UNIQUE (dni);


--
-- Name: persona persona_dni_key428; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key428 UNIQUE (dni);


--
-- Name: persona persona_dni_key429; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key429 UNIQUE (dni);


--
-- Name: persona persona_dni_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key43 UNIQUE (dni);


--
-- Name: persona persona_dni_key430; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key430 UNIQUE (dni);


--
-- Name: persona persona_dni_key431; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key431 UNIQUE (dni);


--
-- Name: persona persona_dni_key432; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key432 UNIQUE (dni);


--
-- Name: persona persona_dni_key433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key433 UNIQUE (dni);


--
-- Name: persona persona_dni_key434; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key434 UNIQUE (dni);


--
-- Name: persona persona_dni_key435; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key435 UNIQUE (dni);


--
-- Name: persona persona_dni_key436; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key436 UNIQUE (dni);


--
-- Name: persona persona_dni_key437; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key437 UNIQUE (dni);


--
-- Name: persona persona_dni_key438; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key438 UNIQUE (dni);


--
-- Name: persona persona_dni_key439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key439 UNIQUE (dni);


--
-- Name: persona persona_dni_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key44 UNIQUE (dni);


--
-- Name: persona persona_dni_key440; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key440 UNIQUE (dni);


--
-- Name: persona persona_dni_key441; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key441 UNIQUE (dni);


--
-- Name: persona persona_dni_key442; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key442 UNIQUE (dni);


--
-- Name: persona persona_dni_key443; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key443 UNIQUE (dni);


--
-- Name: persona persona_dni_key444; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key444 UNIQUE (dni);


--
-- Name: persona persona_dni_key445; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key445 UNIQUE (dni);


--
-- Name: persona persona_dni_key446; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key446 UNIQUE (dni);


--
-- Name: persona persona_dni_key447; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key447 UNIQUE (dni);


--
-- Name: persona persona_dni_key448; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key448 UNIQUE (dni);


--
-- Name: persona persona_dni_key449; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key449 UNIQUE (dni);


--
-- Name: persona persona_dni_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key45 UNIQUE (dni);


--
-- Name: persona persona_dni_key450; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key450 UNIQUE (dni);


--
-- Name: persona persona_dni_key451; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key451 UNIQUE (dni);


--
-- Name: persona persona_dni_key452; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key452 UNIQUE (dni);


--
-- Name: persona persona_dni_key453; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key453 UNIQUE (dni);


--
-- Name: persona persona_dni_key454; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key454 UNIQUE (dni);


--
-- Name: persona persona_dni_key455; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key455 UNIQUE (dni);


--
-- Name: persona persona_dni_key456; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key456 UNIQUE (dni);


--
-- Name: persona persona_dni_key457; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key457 UNIQUE (dni);


--
-- Name: persona persona_dni_key458; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key458 UNIQUE (dni);


--
-- Name: persona persona_dni_key459; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key459 UNIQUE (dni);


--
-- Name: persona persona_dni_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key46 UNIQUE (dni);


--
-- Name: persona persona_dni_key460; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key460 UNIQUE (dni);


--
-- Name: persona persona_dni_key461; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key461 UNIQUE (dni);


--
-- Name: persona persona_dni_key462; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key462 UNIQUE (dni);


--
-- Name: persona persona_dni_key463; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key463 UNIQUE (dni);


--
-- Name: persona persona_dni_key464; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key464 UNIQUE (dni);


--
-- Name: persona persona_dni_key465; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key465 UNIQUE (dni);


--
-- Name: persona persona_dni_key466; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key466 UNIQUE (dni);


--
-- Name: persona persona_dni_key467; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key467 UNIQUE (dni);


--
-- Name: persona persona_dni_key468; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key468 UNIQUE (dni);


--
-- Name: persona persona_dni_key469; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key469 UNIQUE (dni);


--
-- Name: persona persona_dni_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key47 UNIQUE (dni);


--
-- Name: persona persona_dni_key470; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key470 UNIQUE (dni);


--
-- Name: persona persona_dni_key471; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key471 UNIQUE (dni);


--
-- Name: persona persona_dni_key472; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key472 UNIQUE (dni);


--
-- Name: persona persona_dni_key473; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key473 UNIQUE (dni);


--
-- Name: persona persona_dni_key474; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key474 UNIQUE (dni);


--
-- Name: persona persona_dni_key475; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key475 UNIQUE (dni);


--
-- Name: persona persona_dni_key476; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key476 UNIQUE (dni);


--
-- Name: persona persona_dni_key477; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key477 UNIQUE (dni);


--
-- Name: persona persona_dni_key478; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key478 UNIQUE (dni);


--
-- Name: persona persona_dni_key479; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key479 UNIQUE (dni);


--
-- Name: persona persona_dni_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key48 UNIQUE (dni);


--
-- Name: persona persona_dni_key480; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key480 UNIQUE (dni);


--
-- Name: persona persona_dni_key481; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key481 UNIQUE (dni);


--
-- Name: persona persona_dni_key482; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key482 UNIQUE (dni);


--
-- Name: persona persona_dni_key483; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key483 UNIQUE (dni);


--
-- Name: persona persona_dni_key484; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key484 UNIQUE (dni);


--
-- Name: persona persona_dni_key485; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key485 UNIQUE (dni);


--
-- Name: persona persona_dni_key486; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key486 UNIQUE (dni);


--
-- Name: persona persona_dni_key487; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key487 UNIQUE (dni);


--
-- Name: persona persona_dni_key488; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key488 UNIQUE (dni);


--
-- Name: persona persona_dni_key489; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key489 UNIQUE (dni);


--
-- Name: persona persona_dni_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key49 UNIQUE (dni);


--
-- Name: persona persona_dni_key490; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key490 UNIQUE (dni);


--
-- Name: persona persona_dni_key491; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key491 UNIQUE (dni);


--
-- Name: persona persona_dni_key492; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key492 UNIQUE (dni);


--
-- Name: persona persona_dni_key493; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key493 UNIQUE (dni);


--
-- Name: persona persona_dni_key494; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key494 UNIQUE (dni);


--
-- Name: persona persona_dni_key495; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key495 UNIQUE (dni);


--
-- Name: persona persona_dni_key496; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key496 UNIQUE (dni);


--
-- Name: persona persona_dni_key497; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key497 UNIQUE (dni);


--
-- Name: persona persona_dni_key498; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key498 UNIQUE (dni);


--
-- Name: persona persona_dni_key499; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key499 UNIQUE (dni);


--
-- Name: persona persona_dni_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key5 UNIQUE (dni);


--
-- Name: persona persona_dni_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key50 UNIQUE (dni);


--
-- Name: persona persona_dni_key500; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key500 UNIQUE (dni);


--
-- Name: persona persona_dni_key501; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key501 UNIQUE (dni);


--
-- Name: persona persona_dni_key502; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key502 UNIQUE (dni);


--
-- Name: persona persona_dni_key503; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key503 UNIQUE (dni);


--
-- Name: persona persona_dni_key504; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key504 UNIQUE (dni);


--
-- Name: persona persona_dni_key505; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key505 UNIQUE (dni);


--
-- Name: persona persona_dni_key506; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key506 UNIQUE (dni);


--
-- Name: persona persona_dni_key507; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key507 UNIQUE (dni);


--
-- Name: persona persona_dni_key508; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key508 UNIQUE (dni);


--
-- Name: persona persona_dni_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key51 UNIQUE (dni);


--
-- Name: persona persona_dni_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key52 UNIQUE (dni);


--
-- Name: persona persona_dni_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key53 UNIQUE (dni);


--
-- Name: persona persona_dni_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key54 UNIQUE (dni);


--
-- Name: persona persona_dni_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key55 UNIQUE (dni);


--
-- Name: persona persona_dni_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key56 UNIQUE (dni);


--
-- Name: persona persona_dni_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key57 UNIQUE (dni);


--
-- Name: persona persona_dni_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key58 UNIQUE (dni);


--
-- Name: persona persona_dni_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key59 UNIQUE (dni);


--
-- Name: persona persona_dni_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key6 UNIQUE (dni);


--
-- Name: persona persona_dni_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key60 UNIQUE (dni);


--
-- Name: persona persona_dni_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key61 UNIQUE (dni);


--
-- Name: persona persona_dni_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key62 UNIQUE (dni);


--
-- Name: persona persona_dni_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key63 UNIQUE (dni);


--
-- Name: persona persona_dni_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key64 UNIQUE (dni);


--
-- Name: persona persona_dni_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key65 UNIQUE (dni);


--
-- Name: persona persona_dni_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key66 UNIQUE (dni);


--
-- Name: persona persona_dni_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key67 UNIQUE (dni);


--
-- Name: persona persona_dni_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key68 UNIQUE (dni);


--
-- Name: persona persona_dni_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key69 UNIQUE (dni);


--
-- Name: persona persona_dni_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key7 UNIQUE (dni);


--
-- Name: persona persona_dni_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key70 UNIQUE (dni);


--
-- Name: persona persona_dni_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key71 UNIQUE (dni);


--
-- Name: persona persona_dni_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key72 UNIQUE (dni);


--
-- Name: persona persona_dni_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key73 UNIQUE (dni);


--
-- Name: persona persona_dni_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key74 UNIQUE (dni);


--
-- Name: persona persona_dni_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key75 UNIQUE (dni);


--
-- Name: persona persona_dni_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key76 UNIQUE (dni);


--
-- Name: persona persona_dni_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key77 UNIQUE (dni);


--
-- Name: persona persona_dni_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key78 UNIQUE (dni);


--
-- Name: persona persona_dni_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key79 UNIQUE (dni);


--
-- Name: persona persona_dni_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key8 UNIQUE (dni);


--
-- Name: persona persona_dni_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key80 UNIQUE (dni);


--
-- Name: persona persona_dni_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key81 UNIQUE (dni);


--
-- Name: persona persona_dni_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key82 UNIQUE (dni);


--
-- Name: persona persona_dni_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key83 UNIQUE (dni);


--
-- Name: persona persona_dni_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key84 UNIQUE (dni);


--
-- Name: persona persona_dni_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key85 UNIQUE (dni);


--
-- Name: persona persona_dni_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key86 UNIQUE (dni);


--
-- Name: persona persona_dni_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key87 UNIQUE (dni);


--
-- Name: persona persona_dni_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key88 UNIQUE (dni);


--
-- Name: persona persona_dni_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key89 UNIQUE (dni);


--
-- Name: persona persona_dni_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key9 UNIQUE (dni);


--
-- Name: persona persona_dni_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key90 UNIQUE (dni);


--
-- Name: persona persona_dni_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key91 UNIQUE (dni);


--
-- Name: persona persona_dni_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key92 UNIQUE (dni);


--
-- Name: persona persona_dni_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key93 UNIQUE (dni);


--
-- Name: persona persona_dni_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key94 UNIQUE (dni);


--
-- Name: persona persona_dni_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key95 UNIQUE (dni);


--
-- Name: persona persona_dni_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key96 UNIQUE (dni);


--
-- Name: persona persona_dni_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key97 UNIQUE (dni);


--
-- Name: persona persona_dni_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key98 UNIQUE (dni);


--
-- Name: persona persona_dni_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_dni_key99 UNIQUE (dni);


--
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id_persona);


--
-- Name: piso piso_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piso
    ADD CONSTRAINT piso_pkey PRIMARY KEY (id_piso);


--
-- Name: privilegio privilegio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.privilegio
    ADD CONSTRAINT privilegio_pkey PRIMARY KEY (id_privilegio);


--
-- Name: procedencia procedencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.procedencia
    ADD CONSTRAINT procedencia_pkey PRIMARY KEY (id_procedencia);


--
-- Name: reglamento reglamento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reglamento
    ADD CONSTRAINT reglamento_pkey PRIMARY KEY (id_regla);


--
-- Name: reservacion reservacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservacion
    ADD CONSTRAINT reservacion_pkey PRIMARY KEY (id_reservacion);


--
-- Name: sala sala_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_pkey PRIMARY KEY (id_sala);


--
-- Name: transaccion transaccion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT transaccion_pkey PRIMARY KEY (id_transaccion);


--
-- Name: usuario usuario_nickname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key1 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key10 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key100; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key100 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key101; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key101 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key102; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key102 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key103; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key103 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key104; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key104 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key105; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key105 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key106; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key106 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key107; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key107 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key108; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key108 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key109; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key109 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key11 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key110; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key110 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key111; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key111 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key112; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key112 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key113; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key113 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key114; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key114 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key115; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key115 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key116; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key116 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key117; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key117 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key118; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key118 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key119; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key119 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key12 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key120; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key120 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key121; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key121 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key122; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key122 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key123; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key123 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key124; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key124 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key125; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key125 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key126; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key126 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key127; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key127 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key128; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key128 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key129; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key129 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key13 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key130; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key130 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key131; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key131 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key132; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key132 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key133; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key133 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key134; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key134 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key135; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key135 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key136; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key136 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key137; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key137 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key138; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key138 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key139; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key139 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key14 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key140; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key140 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key141 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key142 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key143; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key143 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key144; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key144 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key145; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key145 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key146; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key146 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key147; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key147 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key148; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key148 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key149; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key149 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key15 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key150; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key150 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key151; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key151 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key152; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key152 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key153; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key153 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key154; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key154 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key155; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key155 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key156; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key156 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key157; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key157 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key158; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key158 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key159; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key159 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key16 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key160; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key160 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key161; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key161 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key162; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key162 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key163; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key163 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key164; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key164 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key165; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key165 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key166; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key166 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key167; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key167 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key168; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key168 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key169; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key169 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key17 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key170; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key170 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key171; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key171 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key172; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key172 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key173; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key173 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key174; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key174 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key175; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key175 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key176; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key176 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key177; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key177 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key178; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key178 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key179; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key179 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key18 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key180; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key180 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key181; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key181 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key182; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key182 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key183; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key183 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key184; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key184 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key185; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key185 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key186; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key186 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key187; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key187 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key188; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key188 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key189; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key189 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key19 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key190; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key190 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key191; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key191 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key192; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key192 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key193; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key193 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key194; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key194 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key195; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key195 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key196; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key196 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key197; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key197 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key198; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key198 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key199; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key199 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key2 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key20 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key200; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key200 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key201; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key201 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key202; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key202 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key203; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key203 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key204; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key204 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key205; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key205 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key206; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key206 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key207; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key207 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key208; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key208 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key209; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key209 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key21 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key210; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key210 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key211; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key211 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key212; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key212 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key213; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key213 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key214; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key214 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key215; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key215 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key216; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key216 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key217; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key217 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key218; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key218 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key219; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key219 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key22 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key220; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key220 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key221; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key221 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key222; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key222 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key223; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key223 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key224; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key224 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key225; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key225 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key226; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key226 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key227; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key227 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key228; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key228 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key229; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key229 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key23 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key230; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key230 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key231; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key231 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key232; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key232 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key233; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key233 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key234; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key234 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key235; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key235 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key236; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key236 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key237; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key237 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key238; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key238 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key239; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key239 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key24 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key240; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key240 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key241; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key241 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key242; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key242 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key243; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key243 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key244; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key244 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key245; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key245 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key246; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key246 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key247; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key247 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key248; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key248 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key249; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key249 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key25 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key250; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key250 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key251; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key251 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key252; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key252 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key253; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key253 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key254; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key254 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key255; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key255 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key256; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key256 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key257; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key257 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key258; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key258 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key259; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key259 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key26 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key260; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key260 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key261; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key261 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key262; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key262 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key263; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key263 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key264; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key264 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key265; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key265 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key266; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key266 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key267; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key267 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key268; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key268 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key269; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key269 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key27 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key270; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key270 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key271; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key271 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key272; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key272 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key273; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key273 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key274; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key274 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key275; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key275 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key276; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key276 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key277; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key277 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key278; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key278 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key279; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key279 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key28 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key280; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key280 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key281; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key281 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key282; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key282 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key283; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key283 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key284; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key284 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key285; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key285 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key286; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key286 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key287; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key287 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key288; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key288 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key289; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key289 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key29 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key290; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key290 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key291; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key291 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key292; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key292 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key293; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key293 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key294; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key294 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key295; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key295 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key296; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key296 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key297; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key297 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key298; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key298 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key299; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key299 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key3 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key30 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key300; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key300 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key301; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key301 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key302; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key302 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key303; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key303 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key304; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key304 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key305; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key305 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key306; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key306 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key307; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key307 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key308; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key308 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key309; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key309 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key31; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key31 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key310; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key310 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key311; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key311 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key312; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key312 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key313; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key313 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key314; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key314 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key315; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key315 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key316; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key316 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key317; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key317 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key318; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key318 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key319; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key319 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key32; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key32 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key320; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key320 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key321; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key321 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key322; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key322 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key323; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key323 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key324; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key324 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key325; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key325 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key326; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key326 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key327; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key327 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key328; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key328 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key329; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key329 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key33 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key330; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key330 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key331; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key331 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key332; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key332 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key333; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key333 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key334; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key334 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key335; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key335 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key336; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key336 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key337; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key337 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key338; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key338 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key339; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key339 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key34; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key34 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key340; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key340 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key341; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key341 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key342; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key342 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key343; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key343 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key344; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key344 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key345; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key345 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key346; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key346 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key347; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key347 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key348; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key348 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key349; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key349 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key35; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key35 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key350; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key350 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key351; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key351 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key352; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key352 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key353; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key353 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key354; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key354 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key355; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key355 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key356; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key356 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key357; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key357 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key358; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key358 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key359; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key359 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key36; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key36 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key360; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key360 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key361; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key361 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key362; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key362 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key363; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key363 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key364; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key364 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key365; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key365 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key366; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key366 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key367; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key367 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key368; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key368 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key369; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key369 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key37; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key37 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key370; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key370 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key371; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key371 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key372; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key372 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key373; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key373 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key374; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key374 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key375; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key375 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key376; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key376 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key377; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key377 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key378; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key378 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key379; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key379 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key38; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key38 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key380; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key380 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key381; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key381 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key382; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key382 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key383; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key383 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key384; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key384 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key385; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key385 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key386; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key386 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key387; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key387 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key388; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key388 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key389; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key389 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key39; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key39 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key390; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key390 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key391; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key391 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key392; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key392 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key393; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key393 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key394; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key394 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key395; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key395 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key396; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key396 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key397; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key397 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key398; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key398 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key399; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key399 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key4 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key40; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key40 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key400; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key400 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key401; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key401 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key402; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key402 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key403; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key403 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key404; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key404 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key405; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key405 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key406; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key406 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key407; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key407 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key408; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key408 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key409; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key409 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key41; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key41 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key410; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key410 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key411; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key411 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key412; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key412 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key413; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key413 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key414; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key414 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key415; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key415 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key416; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key416 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key417; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key417 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key418; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key418 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key419; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key419 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key42; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key42 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key420; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key420 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key421; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key421 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key422; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key422 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key423; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key423 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key424; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key424 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key425; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key425 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key426; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key426 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key427; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key427 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key428; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key428 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key429; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key429 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key43; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key43 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key430; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key430 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key431; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key431 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key432; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key432 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key433 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key434; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key434 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key435; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key435 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key436; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key436 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key437; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key437 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key438; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key438 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key439 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key44; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key44 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key440; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key440 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key441; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key441 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key442; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key442 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key443; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key443 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key444; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key444 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key445; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key445 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key446; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key446 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key447; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key447 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key448; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key448 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key449; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key449 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key45 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key450; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key450 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key451; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key451 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key452; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key452 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key453; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key453 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key454; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key454 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key455; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key455 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key456; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key456 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key457; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key457 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key458; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key458 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key459; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key459 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key46; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key46 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key460; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key460 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key461; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key461 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key462; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key462 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key463; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key463 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key464; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key464 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key465; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key465 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key466; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key466 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key467; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key467 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key468; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key468 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key469; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key469 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key47; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key47 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key470; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key470 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key471; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key471 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key472; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key472 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key473; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key473 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key474; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key474 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key475; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key475 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key476; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key476 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key477; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key477 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key478; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key478 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key479; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key479 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key48 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key480; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key480 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key481; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key481 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key482; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key482 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key483; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key483 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key49; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key49 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key5 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key50; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key50 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key51; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key51 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key52; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key52 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key53 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key54 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key55; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key55 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key56; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key56 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key57; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key57 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key58; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key58 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key59; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key59 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key6 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key60 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key61; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key61 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key62; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key62 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key63; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key63 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key64 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key65; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key65 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key66; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key66 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key67; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key67 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key68 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key69; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key69 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key7 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key70; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key70 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key71; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key71 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key72; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key72 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key73 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key74; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key74 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key75; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key75 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key76; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key76 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key77; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key77 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key78; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key78 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key79; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key79 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key8 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key80; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key80 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key81; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key81 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key82; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key82 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key83; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key83 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key84; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key84 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key85; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key85 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key86; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key86 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key87; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key87 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key88; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key88 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key89; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key89 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key9 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key90 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key91; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key91 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key92; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key92 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key93; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key93 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key94; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key94 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key95; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key95 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key96; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key96 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key97; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key97 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key98 UNIQUE (nickname);


--
-- Name: usuario usuario_nickname_key99; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_nickname_key99 UNIQUE (nickname);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- Name: usuario_privilegio usuario_privilegio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_privilegio
    ADD CONSTRAINT usuario_privilegio_pkey PRIMARY KEY (id_usuario_privilegio);


--
-- Name: afiliado_huesped afiliado_huesped_id_afiliado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_huesped
    ADD CONSTRAINT afiliado_huesped_id_afiliado_fkey FOREIGN KEY (id_afiliado) REFERENCES public.afiliado(id_afiliado) ON UPDATE CASCADE;


--
-- Name: afiliado_huesped afiliado_huesped_id_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_huesped
    ADD CONSTRAINT afiliado_huesped_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huesped(id_huesped) ON UPDATE CASCADE;


--
-- Name: afiliado_reservacion afiliado_reservacion_id_afiliado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_reservacion
    ADD CONSTRAINT afiliado_reservacion_id_afiliado_fkey FOREIGN KEY (id_afiliado) REFERENCES public.afiliado(id_afiliado) NOT VALID;


--
-- Name: afiliado_reservacion afiliado_reservacion_id_reservacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.afiliado_reservacion
    ADD CONSTRAINT afiliado_reservacion_id_reservacion_fkey FOREIGN KEY (id_reservacion) REFERENCES public.reservacion(id_reservacion) NOT VALID;


--
-- Name: cama cama_id_habitacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cama
    ADD CONSTRAINT cama_id_habitacion_fkey FOREIGN KEY (id_habitacion) REFERENCES public.habitacion(id_habitacion) ON UPDATE CASCADE;


--
-- Name: habitacion habitacion_id_lugar_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitacion
    ADD CONSTRAINT habitacion_id_lugar_fkey FOREIGN KEY (id_lugar) REFERENCES public.lugar(id_lugar) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: huesped huesped_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.huesped
    ADD CONSTRAINT huesped_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona) ON UPDATE CASCADE;


--
-- Name: iglesia_huesped iglesia_huesped_id_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iglesia_huesped
    ADD CONSTRAINT iglesia_huesped_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huesped(id_huesped) ON UPDATE CASCADE;


--
-- Name: iglesia_huesped iglesia_huesped_id_iglesia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iglesia_huesped
    ADD CONSTRAINT iglesia_huesped_id_iglesia_fkey FOREIGN KEY (id_iglesia) REFERENCES public.iglesia(id_iglesia) ON UPDATE CASCADE;


--
-- Name: lista_negra lista_negra_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_negra
    ADD CONSTRAINT lista_negra_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona) ON UPDATE CASCADE;


--
-- Name: lista_negra lista_negra_id_regla_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_negra
    ADD CONSTRAINT lista_negra_id_regla_fkey FOREIGN KEY (id_regla) REFERENCES public.reglamento(id_regla) ON UPDATE CASCADE;


--
-- Name: lista_solicitud lista_solicitud_id_afiliado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_solicitud
    ADD CONSTRAINT lista_solicitud_id_afiliado_fkey FOREIGN KEY (id_afiliado) REFERENCES public.afiliado(id_afiliado) NOT VALID;


--
-- Name: lista_solicitud lista_solicitud_id_paciente_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lista_solicitud
    ADD CONSTRAINT lista_solicitud_id_paciente_huesped_fkey FOREIGN KEY (id_paciente_huesped) REFERENCES public.paciente_huesped(id_paciente_huesped) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ofrenda ofrenda_id_reservacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ofrenda
    ADD CONSTRAINT ofrenda_id_reservacion_fkey FOREIGN KEY (id_reservacion) REFERENCES public.reservacion(id_reservacion) ON UPDATE CASCADE;


--
-- Name: paciente_huesped paciente_huesped_id_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente_huesped
    ADD CONSTRAINT paciente_huesped_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huesped(id_huesped) ON UPDATE CASCADE;


--
-- Name: paciente_huesped paciente_huesped_id_paciente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente_huesped
    ADD CONSTRAINT paciente_huesped_id_paciente_fkey FOREIGN KEY (id_paciente) REFERENCES public.paciente(id_paciente) ON UPDATE CASCADE;


--
-- Name: paciente paciente_id_causa_visita_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_causa_visita_fkey FOREIGN KEY (id_causa_visita) REFERENCES public.causa_visita(id_causa_visita) ON UPDATE CASCADE;


--
-- Name: paciente paciente_id_hospital_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_hospital_fkey FOREIGN KEY (id_hospital) REFERENCES public.hospital(id_hospital) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: paciente paciente_id_person_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_person_fkey FOREIGN KEY (id_person) REFERENCES public.persona(id_persona) ON UPDATE CASCADE;


--
-- Name: paciente paciente_id_piso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_piso_fkey FOREIGN KEY (id_piso) REFERENCES public.piso(id_piso) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: paciente paciente_id_sala_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_id_sala_fkey FOREIGN KEY (id_sala) REFERENCES public.sala(id_sala) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: pago pago_id_reservacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pago
    ADD CONSTRAINT pago_id_reservacion_fkey FOREIGN KEY (id_reservacion) REFERENCES public.reservacion(id_reservacion) ON UPDATE CASCADE;


--
-- Name: patrono_afiliado patrono_afiliado_id_afiliado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrono_afiliado
    ADD CONSTRAINT patrono_afiliado_id_afiliado_fkey FOREIGN KEY (id_afiliado) REFERENCES public.afiliado(id_afiliado) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: patrono_afiliado patrono_afiliado_id_patrono_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patrono_afiliado
    ADD CONSTRAINT patrono_afiliado_id_patrono_fkey FOREIGN KEY (id_patrono) REFERENCES public.patrono(id_patrono) ON UPDATE CASCADE;


--
-- Name: persona persona_id_lugar_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_id_lugar_fkey FOREIGN KEY (id_lugar) REFERENCES public.lugar(id_lugar) ON UPDATE CASCADE;


--
-- Name: persona persona_id_ocupacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_id_ocupacion_fkey FOREIGN KEY (id_ocupacion) REFERENCES public.ocupacion(id_ocupacion) ON UPDATE CASCADE;


--
-- Name: persona persona_id_procedencia_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_id_procedencia_fkey FOREIGN KEY (id_procedencia) REFERENCES public.procedencia(id_procedencia) ON UPDATE CASCADE;


--
-- Name: piso piso_id_hospital_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.piso
    ADD CONSTRAINT piso_id_hospital_fkey FOREIGN KEY (id_hospital) REFERENCES public.hospital(id_hospital) ON UPDATE CASCADE;


--
-- Name: reservacion reservacion_id_cama_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservacion
    ADD CONSTRAINT reservacion_id_cama_fkey FOREIGN KEY (id_cama) REFERENCES public.cama(id_cama) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reservacion reservacion_id_hospital_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservacion
    ADD CONSTRAINT reservacion_id_hospital_fkey FOREIGN KEY (id_hospital) REFERENCES public.hospital(id_hospital) ON UPDATE CASCADE;


--
-- Name: reservacion reservacion_id_paciente_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservacion
    ADD CONSTRAINT reservacion_id_paciente_huesped_fkey FOREIGN KEY (id_paciente_huesped) REFERENCES public.paciente_huesped(id_paciente_huesped) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sala sala_id_piso_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sala
    ADD CONSTRAINT sala_id_piso_fkey FOREIGN KEY (id_piso) REFERENCES public.piso(id_piso) ON UPDATE CASCADE;


--
-- Name: transaccion transaccion_id_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaccion
    ADD CONSTRAINT transaccion_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huesped(id_huesped) ON UPDATE CASCADE;


--
-- Name: usuario usuario_id_hospital_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_hospital_fkey FOREIGN KEY (id_hospital) REFERENCES public.hospital(id_hospital) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuario usuario_id_persona_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_id_persona_fkey FOREIGN KEY (id_persona) REFERENCES public.persona(id_persona) ON UPDATE CASCADE;


--
-- Name: usuario_privilegio usuario_privilegio_id_privilegio_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_privilegio
    ADD CONSTRAINT usuario_privilegio_id_privilegio_fkey FOREIGN KEY (id_privilegio) REFERENCES public.privilegio(id_privilegio) ON UPDATE CASCADE;


--
-- Name: usuario_privilegio usuario_privilegio_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_privilegio
    ADD CONSTRAINT usuario_privilegio_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO pg_database_owner;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

