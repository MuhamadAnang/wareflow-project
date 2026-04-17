CREATE TYPE "public"."book_level" AS ENUM('SD', 'SMP', 'SMA', 'SMK', 'SMA/SMK');--> statement-breakpoint
CREATE TYPE "public"."curriculum" AS ENUM('KURIKULUM_MERDEKA', 'K13', 'KTSP', 'LAINNYA');--> statement-breakpoint
CREATE TYPE "public"."customer_order_status_enum" AS ENUM('DRAFT', 'CONFIRMED', 'PARTIALLY_SHIPPED', 'SHIPPED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."customer_status_enum" AS ENUM('CONTRACT', 'NON-CONTRACT', 'MOU');--> statement-breakpoint
CREATE TYPE "public"."semester_enum" AS ENUM('GANJIL', 'GENAP', 'SETAHUN');--> statement-breakpoint
CREATE TYPE "public"."stock_movement_type_enum" AS ENUM('IN_PURCHASE', 'OUT_SALES', 'RETURN_CUSTOMER', 'RETURN_SUPPLIER', 'ADJUSTMENT');--> statement-breakpoint
CREATE TABLE "book_prices" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"start_date" date NOT NULL,
	CONSTRAINT "book_prices_book_id_start_date_unique" UNIQUE("book_id","start_date")
);
--> statement-breakpoint
CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"book_title_id" integer NOT NULL,
	"supplier_id" integer NOT NULL,
	"semester" "semester_enum" NOT NULL,
	"pages" integer,
	"production_year" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "books_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "book_titles" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject_id" integer NOT NULL,
	"grade" integer NOT NULL,
	"level" "book_level" NOT NULL,
	"curriculum" "curriculum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "customer_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_order_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "customer_order_items_customer_order_id_book_id_unique" UNIQUE("customer_order_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "customer_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"order_date" date NOT NULL,
	"status" "customer_order_status_enum" DEFAULT 'DRAFT' NOT NULL,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "customer_payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_order_id" integer NOT NULL,
	"payment_date" date NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"method" varchar(50),
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_return_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_return_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_returns" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"return_date" date NOT NULL,
	"reason" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address" varchar(500) NOT NULL,
	"institution" varchar(255) NOT NULL,
	"status" "customer_status_enum" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "goods_out_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"goods_out_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "goods_out_items_goods_out_id_book_id_unique" UNIQUE("goods_out_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "goods_out" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_order_id" integer NOT NULL,
	"shipped_date" date NOT NULL,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"goods_receipt_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "goods_receipt_items_goods_receipt_id_book_id_unique" UNIQUE("goods_receipt_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" serial PRIMARY KEY NOT NULL,
	"purchase_order_id" integer NOT NULL,
	"received_date" date NOT NULL,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"purchase_order_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	CONSTRAINT "purchase_order_items_purchase_order_id_book_id_unique" UNIQUE("purchase_order_id","book_id")
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"order_date" date NOT NULL,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" serial PRIMARY KEY NOT NULL,
	"book_id" integer NOT NULL,
	"type" "stock_movement_type_enum" NOT NULL,
	"reference_type" varchar(50) NOT NULL,
	"reference_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "supplier_return_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_return_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supplier_returns" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplier_id" integer NOT NULL,
	"return_date" date NOT NULL,
	"reason" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"address" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "book_prices" ADD CONSTRAINT "book_prices_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_book_title_id_book_titles_id_fk" FOREIGN KEY ("book_title_id") REFERENCES "public"."book_titles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_titles" ADD CONSTRAINT "book_titles_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_order_items" ADD CONSTRAINT "customer_order_items_customer_order_id_customer_orders_id_fk" FOREIGN KEY ("customer_order_id") REFERENCES "public"."customer_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_order_items" ADD CONSTRAINT "customer_order_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_orders" ADD CONSTRAINT "customer_orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_payments" ADD CONSTRAINT "customer_payments_customer_order_id_customer_orders_id_fk" FOREIGN KEY ("customer_order_id") REFERENCES "public"."customer_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_return_items" ADD CONSTRAINT "customer_return_items_customer_return_id_customer_returns_id_fk" FOREIGN KEY ("customer_return_id") REFERENCES "public"."customer_returns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_return_items" ADD CONSTRAINT "customer_return_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_returns" ADD CONSTRAINT "customer_returns_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_out_items" ADD CONSTRAINT "goods_out_items_goods_out_id_goods_out_id_fk" FOREIGN KEY ("goods_out_id") REFERENCES "public"."goods_out"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_out_items" ADD CONSTRAINT "goods_out_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_out" ADD CONSTRAINT "goods_out_customer_order_id_customer_orders_id_fk" FOREIGN KEY ("customer_order_id") REFERENCES "public"."customer_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_goods_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("goods_receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_return_items" ADD CONSTRAINT "supplier_return_items_supplier_return_id_supplier_returns_id_fk" FOREIGN KEY ("supplier_return_id") REFERENCES "public"."supplier_returns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_return_items" ADD CONSTRAINT "supplier_return_items_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_returns" ADD CONSTRAINT "supplier_returns_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_stock_book" ON "stock_movements" USING btree ("book_id");