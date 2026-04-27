ALTER TABLE "subjects" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "subjects" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "subjects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "subjects" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;