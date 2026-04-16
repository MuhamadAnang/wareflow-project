CREATE TYPE "public"."book_level" AS ENUM('SD', 'SMP', 'SMA', 'SMK', 'SMA/SMK');--> statement-breakpoint
CREATE TYPE "public"."curriculum" AS ENUM('KURIKULUM_MERDEKA', 'K13', 'KTSP', 'LAINNYA');--> statement-breakpoint
ALTER TABLE "book_titles" DROP CONSTRAINT "book_titles_subject_id_subjects_id_fk";
--> statement-breakpoint
ALTER TABLE "book_titles" ALTER COLUMN "level" SET DATA TYPE "public"."book_level" USING "level"::"public"."book_level";--> statement-breakpoint
ALTER TABLE "book_titles" ALTER COLUMN "curriculum" SET DATA TYPE "public"."curriculum" USING "curriculum"::"public"."curriculum";--> statement-breakpoint
ALTER TABLE "book_titles" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "book_titles" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "book_titles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "book_titles" ADD CONSTRAINT "book_titles_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE restrict ON UPDATE no action;