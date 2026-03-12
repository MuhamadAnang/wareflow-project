import { create } from "domain";
import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
  numeric,
  date,
} from "drizzle-orm/pg-core";

export const customerStatusEnum = pgEnum("customer_status_enum", [
  "CONTRACT",
  "NON-CONTRACT",
  "MOU",
]);

export const semesterEnum = pgEnum("semester_enum", [
  "GANJIL",
  "GENAP",
  "SETAHUN",
]);

export const customerOrdetStatusEnum = pgEnum("customer_order_status_enum", [
  "DRAFT",
  "CONFIRMED",
  "PARTIALLY_SHIPPED",
  "SHIPPED",
  "CANCELLED",
]);

export const stockMovementTypeEnum = pgEnum("stock_movement_type_enum", [
  "IN_PURCHASE",
  "OUT_SALES",
  "RETURN_CUSTOMER",
  "RETURN_SUPPLIER",
  "ADJUSTMENT",
]);

/* =========================
   CUSTOMERS
========================= */

export const customerTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  status: customerStatusEnum("status").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/* =========================
   SUBJECTS
========================= */

export const subjectTable = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
});

/* =========================
   SUPPLIERS
========================= */

export const supplierTable = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/* =========================
   BOOK TITLES
========================= */

export const bookTitleTable = pgTable("book_titles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subjectId: integer("subject_id")
    .notNull()
    .references(() => subjectTable.id),
  grade: integer("grade").notNull(),
  level: varchar("level", { length: 10 }).notNull(),
  curriculum: varchar("curriculum", { length: 50 }).notNull(),
});

/* =========================
   BOOKS (PRODUCT)
========================= */

export const bookTable = pgTable("books", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  bookTitleId: integer("book_title_id")
    .notNull()
    .references(() => bookTitleTable.id),
  supplierId: integer("supplier_id")
    .notNull()
    .references(() => supplierTable.id),
  semester: semesterEnum("semester").notNull(),
  pages: integer("pages"),
  productionYear: integer("production_year"),
});

/* =========================
   BOOK PRICE HISTORY
========================= */

export const bookPriceTable = pgTable("book_prices", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id")
    .notNull()
    .references(() => bookTable.id),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  startDate: date("start_date").notNull(),
});

/* =========================
   CUSTOMER ORDERS
========================= */

export const customerOrdetTable = pgTable("customer_orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
  .notNull()
  .references(() => customerTable.id),
  orderDate: date("order_date").notNull(),
  status: customerOrdetStatusEnum("status").notNull(), 
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow(),
})

/* =========================
   CUSTOMER ORDERS ITEMS
========================= */

export const customerOrderItemTable = pgTable("customer_order_items", {
  id: serial("id").primaryKey(),
  customerOrderId: integer("customer_order_id")
  .notNull()
  .references(() => customerOrdetTable.id),
  bookId: integer("book_id")
  .notNull()
  .references(() => bookTable.id),
  quantity: integer("quantity").notNull(),
});

/* =========================
   PENGIRIMAN BARANG
========================= */

export const goodsOutTable = pgTable("goods_out", {
  id: serial("id").primaryKey(),
  customerOrderId: integer("customer_order_id")
  .notNull()
  .references(() => customerOrdetTable.id),
  shippedDate: date("shipped_date").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow(),
});

/* =========================
   PENGIRIMAN BARANG ITEMS
========================= */

export const goodsOutItemTable = pgTable("goods_out_items", {
  id: serial("id").primaryKey(),
  goodsOutId: integer("goods_out_id")
  .notNull()
  .references(() => goodsOutTable.id),
  bookId: integer("book_id")
  .notNull()
  .references(() => bookTable.id),
  quantity: integer("quantity").notNull(),
});

/* =========================
   STOCK MOVEMENTS
========================= */

export const stockMovementTable = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  bookId: integer("book_id")
  .notNull()
  .references(() => bookTable.id),
  type: stockMovementTypeEnum("type").notNull(),
  referenceId: integer("reference_id").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow(),
});