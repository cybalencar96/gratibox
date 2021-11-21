
CREATE TABLE deliver_infos (
    id serial NOT NULL,
    subscriber_id integer NOT NULL,
    name character varying(255) NOT NULL,
    cep character varying(8) NOT NULL,
    address character varying(500) NOT NULL,
    city character varying(255) NOT NULL,
    uf character varying(2) NOT NULL
);


CREATE TABLE deliveries (
    id serial NOT NULL,
    subscriber_id integer NOT NULL,
    delivered_at bigint DEFAULT EXTRACT(epoch FROM now()) NOT NULL,
    avaliation boolean,
    avaliation_type character varying(255),
    avaliation_desc character varying(255)
);


CREATE TABLE sessions (
    id serial NOT NULL,
    user_id integer NOT NULL,
    token character varying(36) NOT NULL
);


CREATE TABLE subscribers (
    id serial NOT NULL,
    user_id integer NOT NULL,
    subscription_type character varying(10) NOT NULL,
    deliver_option character varying(10) NOT NULL,
    teas boolean DEFAULT false NOT NULL,
    incenses boolean DEFAULT false NOT NULL,
    organics boolean DEFAULT false NOT NULL,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()),
    next_deliver_date bigint
);


CREATE TABLE users (
    id serial NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);



ALTER TABLE ONLY deliveries
    ADD CONSTRAINT deliveries_pk PRIMARY KEY (id);


ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_pk PRIMARY KEY (id);



ALTER TABLE ONLY subscribers
    ADD CONSTRAINT subscribers_pk PRIMARY KEY (id);



ALTER TABLE ONLY users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);



ALTER TABLE ONLY deliver_infos
    ADD CONSTRAINT deliver_infos_fk0 FOREIGN KEY (subscriber_id) REFERENCES public.subscribers(id);


ALTER TABLE ONLY deliveries
    ADD CONSTRAINT deliveries_fk0 FOREIGN KEY (subscriber_id) REFERENCES public.subscribers(id);


ALTER TABLE ONLY sessions
    ADD CONSTRAINT sessions_fk0 FOREIGN KEY (user_id) REFERENCES public.users(id);


ALTER TABLE ONLY subscribers
    ADD CONSTRAINT subscribers_fk0 FOREIGN KEY (user_id) REFERENCES public.users(id);





