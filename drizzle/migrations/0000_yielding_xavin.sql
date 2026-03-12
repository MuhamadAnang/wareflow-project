CREATE TYPE "public"."customer_status_enum" AS ENUM('CONTRACT', 'NON-CONTRACT', 'MOU');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"phone" varchar NOT NULL,
	"address" varchar(500) NOT NULL,
	"school" varchar NOT NULL,
	"status" "customer_status_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
