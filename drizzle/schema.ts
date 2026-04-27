import { sql } from "drizzle-orm";
import { uniqueIndex } from "drizzle-orm/gel-core";
import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  integer,
  numeric,
  date,
  unique,
  index,
} from "drizzle-orm/pg-core";

/* =========================
   ENUMS
========================= */

export const customerStatusEnum = pgEnum("customer_status_enum", [
  "CONTRACT",
  "NON-CONTRACT",
  "MOU",
]);

export const semesterEnum = pgEnum("semester_enum", ["GANJIL", "GENAP", "SETAHUN"]);

export const bookLevelEnum = pgEnum("book_level", ["SD", "SMP", "SMA", "SMK", "SMA/SMK"]);
export const curriculumEnum = pgEnum("curriculum", ["KURIKULUM_MERDEKA", "K13", "KTSP", "LAINNYA"]);

export const customerOrderStatusEnum = pgEnum("customer_order_status_enum", [
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
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/* =========================
   SUBJECTS
========================= */

export const subjectTable = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
}, (table) => ({
  // Opsi 2: Unique constraint case-insensitive (rekomendasi)
  uniqueNameCaseInsensitive: uniqueIndex("unique_name_case_insensitive_idx")
    .on(sql`LOWER(${table.name})`),
}));

/* =========================
   SUPPLIERS
========================= */

export const supplierTable = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/* =========================
   PERCETAKAN
========================= */

export const percetakanTable = pgTable("percetakans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

/* =========================
   BOOKS
========================= */

export const bookTable = pgTable("books", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 300 }).notNull(),
  subjectId: integer("subject_id").notNull().references(() => subjectTable.id),
  grade: integer("grade").notNull(),
  level: bookLevelEnum("level").notNull(),
  curriculum: curriculumEnum("curriculum").notNull(),
  semester: semesterEnum("semester").notNull(),
  image: varchar("image", { length: 500 }),
  pages: integer("pages"),
  productionYear: integer("production_year"),
  percetakanId: integer("percetakan_id")
    .notNull()
    .references(() => percetakanTable.id),
  currentStock: integer("current_stock").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/* =========================
   BOOK PRICE HISTORY
========================= */

export const bookPriceTable = pgTable(
  "book_prices",
  {
    id: serial("id").primaryKey(),
    bookId: integer("book_id")
      .notNull()
      .references(() => bookTable.id),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    startDate: date("start_date").notNull(),
  },
  (table) => ({
    uniquePriceStart: unique().on(table.bookId, table.startDate),
  }),
);

/* =========================
   PURCHASE ORDERS
========================= */

export const purchaseOrderTable = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id")
    .notNull()
    .references(() => supplierTable.id),
  orderDate: date("order_date").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/* =========================
   PURCHASE ORDER ITEMS
========================= */

export const purchaseOrderItemTable = pgTable(
  "purchase_order_items",
  {
    id: serial("id").primaryKey(),
    purchaseOrderId: integer("purchase_order_id")
      .notNull()
      .references(() => purchaseOrderTable.id, { onDelete: "cascade" }),
    bookId: integer("book_id")
      .notNull()
      .references(() => bookTable.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    uniqueItem: unique().on(table.purchaseOrderId, table.bookId),
  })
);

/* =========================
   GOODS RECEIPTS
========================= */

export const goodsReceiptTable = pgTable("goods_receipts", {
  id: serial("id").primaryKey(),
  purchaseOrderId: integer("purchase_order_id")
    .notNull()
    .references(() => purchaseOrderTable.id),
  receivedDate: date("received_date").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* =========================
   GOODS RECEIPT ITEMS
========================= */

export const goodsReceiptItemTable = pgTable(
  "goods_receipt_items",
  {
    id: serial("id").primaryKey(),
    goodsReceiptId: integer("goods_receipt_id")
      .notNull()
      .references(() => goodsReceiptTable.id),
    bookId: integer("book_id")
      .notNull()
      .references(() => bookTable.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    uniqueItem: unique().on(table.goodsReceiptId, table.bookId),
  }),
);

/* =========================
   CUSTOMER ORDERS
========================= */

export const customerOrderTable = pgTable("customer_orders", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customerTable.id),
  orderDate: date("order_date").notNull(),
  deadline: date("deadline"),
  status: customerOrderStatusEnum("status").notNull().default("DRAFT"),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

/* =========================
   CUSTOMER ORDER ITEMS
========================= */

export const customerOrderItemTable = pgTable(
  "customer_order_items",
  {
    id: serial("id").primaryKey(),
    customerOrderId: integer("customer_order_id")
      .notNull()
      .references(() => customerOrderTable.id),
    bookId: integer("book_id")
      .notNull()
      .references(() => bookTable.id),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    uniqueItem: unique().on(table.customerOrderId, table.bookId),
  }),
);

/* =========================
   GOODS OUT
========================= */

export const goodsOutTable = pgTable("goods_out", {
  id: serial("id").primaryKey(),
  customerOrderId: integer("customer_order_id")
    .notNull()
    .references(() => customerOrderTable.id),
  shippedDate: date("shipped_date").notNull(),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* =========================
   GOODS OUT ITEMS
========================= */

export const goodsOutItemTable = pgTable(
  "goods_out_items",
  {
    id: serial("id").primaryKey(),
    goodsOutId: integer("goods_out_id")
      .notNull()
      .references(() => goodsOutTable.id),
    bookId: integer("book_id")
      .notNull()
      .references(() => bookTable.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => ({
    uniqueItem: unique().on(table.goodsOutId, table.bookId),
  }),
);

/* =========================
   STOCK MOVEMENTS
========================= */

export const stockMovementTable = pgTable(
  "stock_movements",
  {
    id: serial("id").primaryKey(),
    bookId: integer("book_id")
      .notNull()
      .references(() => bookTable.id),
    type: stockMovementTypeEnum("type").notNull(),
    referenceType: varchar("reference_type", { length: 50 }).notNull(),
    referenceId: integer("reference_id").notNull(),
    quantity: integer("quantity").notNull(),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    bookIndex: index("idx_stock_book").on(table.bookId),
  }),
);

/* =========================
   CUSTOMER RETURNS
========================= */

export const customerReturnTable = pgTable("customer_returns", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .notNull()
    .references(() => customerTable.id),
  returnDate: date("return_date").notNull(),
  reason: varchar("reason", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* =========================
   CUSTOMER RETURN ITEMS
========================= */

export const customerReturnItemTable = pgTable("customer_return_items", {
  id: serial("id").primaryKey(),
  customerReturnId: integer("customer_return_id")
    .notNull()
    .references(() => customerReturnTable.id),
  bookId: integer("book_id")
    .notNull()
    .references(() => bookTable.id),
  quantity: integer("quantity").notNull(),
});

/* =========================
   SUPPLIER RETURNS
========================= */

export const supplierReturnTable = pgTable("supplier_returns", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id")
    .notNull()
    .references(() => supplierTable.id),
  returnDate: date("return_date").notNull(),
  reason: varchar("reason", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* =========================
   SUPPLIER RETURN ITEMS
========================= */

export const supplierReturnItemTable = pgTable("supplier_return_items", {
  id: serial("id").primaryKey(),
  supplierReturnId: integer("supplier_return_id")
    .notNull()
    .references(() => supplierReturnTable.id),
  bookId: integer("book_id")
    .notNull()
    .references(() => bookTable.id),
  quantity: integer("quantity").notNull(),
});

/* =========================
   CUSTOMER PAYMENTS
========================= */

export const customerPaymentTable = pgTable("customer_payments", {
  id: serial("id").primaryKey(),
  customerOrderId: integer("customer_order_id")
    .notNull()
    .references(() => customerOrderTable.id),
  paymentDate: date("payment_date").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 50 }),
  note: varchar("note", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});