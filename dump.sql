CREATE TABLE "users" (
	"id" serial NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	"token" varchar(36) NOT NULL,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "subscribers" (
	"id" serial NOT NULL,
	"user_id" int NOT NULL,
	"subscription_type" varchar(10) NOT NULL,
	"deliver_option" varchar(10) NOT NULL,
	"teas" BOOLEAN NOT NULL DEFAULT 'false',
	"incenses" BOOLEAN NOT NULL DEFAULT 'false',
	"organics" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "subscribers_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "deliver_infos" (
	"id" serial NOT NULL,
	"subscriber_id" int NOT NULL,
	"name" varchar(255) NOT NULL,
	"cep" varchar(8) NOT NULL,
	"address" varchar(500) NOT NULL,
	"city" varchar(255) NOT NULL,
	"uf" varchar(2) NOT NULL
) WITH (
  OIDS=FALSE
);



CREATE TABLE "deliveries" (
	"id" serial NOT NULL,
	"subscriber_id" int NOT NULL,
	"delivered_at" bigint NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW()),
	"avaliation" BOOLEAN,
	"avaliation_type" varchar(255),
	"avaliation_desc" varchar(255),
	CONSTRAINT "deliveries_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "subscribers" ADD CONSTRAINT "subscribers_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "deliver_infos" ADD CONSTRAINT "deliver_infos_fk0" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers"("id");

ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_fk0" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers"("id");





