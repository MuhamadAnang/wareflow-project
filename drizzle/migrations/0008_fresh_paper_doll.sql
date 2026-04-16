ALTER TABLE "purchase_order_items" DROP CONSTRAINT "purchase_order_items_purchase_order_id_purchase_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;