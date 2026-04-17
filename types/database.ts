import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  bookTable,
  bookTitleTable,
  customerTable,
  goodsReceiptItemTable,
  goodsReceiptTable,
  purchaseOrderItemTable,
  purchaseOrderTable,
  subjectTable,
  supplierTable,
  customerOrderTable,
  customerOrderItemTable,
  goodsOutTable,
  goodsOutItemTable,
} from "@/drizzle/schema";

// ==================== CUSTOMER TYPES ====================

export type TCustomer = InferSelectModel<typeof customerTable>;
export type TNewCustomer = InferInsertModel<typeof customerTable>;
export type TUpdateCustomer = Omit<TNewCustomer, "createdAt" | "updatedAt">;
export type TCustomerStatus = TCustomer["status"];

// ==================== SUBJECT TYPES ====================

export type TSubject = InferSelectModel<typeof subjectTable>;
export type TNewSubject = InferInsertModel<typeof subjectTable>;
export type TUpdateSubject = Omit<TNewSubject, "createdAt" | "updatedAt">;

// ==================== SUPPLIER TYPES ====================

export type TSupplier = InferSelectModel<typeof supplierTable>;
export type TNewSupplier = InferInsertModel<typeof supplierTable>;
export type TUpdateSupplier = Omit<TNewSupplier, "createdAt" | "updatedAt">;

// ==================== BOOK TITLE TYPES ====================

export type TBookTitle = InferSelectModel<typeof bookTitleTable>;
export type TNewBookTitle = InferInsertModel<typeof bookTitleTable>;
export type TUpdateBookTitle = Omit<TNewBookTitle, "createdAt" | "updatedAt">;

export type TBookTitleEnhanced = TBookTitle & {
  subjectName: string;
  displayTitle: string;
};

export type TBookTitleDetail = {
  id: number;
  subjectId: number;
  grade: number;
  level: string;
  curriculum: string;
  subjectName: string | null;
  displayTitle: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

// ==================== BOOK TYPES ====================

export type TBook = InferSelectModel<typeof bookTable>;
export type TNewBook = InferInsertModel<typeof bookTable>;
export type TUpdateBook = Partial<TNewBook>;

export type TBookEnhanced = TBook & {
  bookTitle: TBookTitleEnhanced;
  supplier: { id: number; name: string };
};

export type TBookListItem = {
  id: number;
  code: string;
  bookTitleId: number;
  supplierId: number;
  semester: "GANJIL" | "GENAP" | "SETAHUN";
  pages: number | null;
  productionYear: number | null;
  deletedAt: Date | null;
  displayTitle: string;
  subjectName: string | null;
  supplierName: string | null;
};

// ==================== PURCHASE ORDER TYPES ====================

export type TPurchaseOrder = InferSelectModel<typeof purchaseOrderTable>;
export type TNewPurchaseOrder = InferInsertModel<typeof purchaseOrderTable>;
export type TUpdatePurchaseOrder = Partial<Omit<TNewPurchaseOrder, "createdAt" | "updatedAt">>;

export type TPurchaseOrderItem = InferSelectModel<typeof purchaseOrderItemTable>;
export type TNewPurchaseOrderItem = InferInsertModel<typeof purchaseOrderItemTable>;

export type TPurchaseOrderWithSupplier = TPurchaseOrder & {
  supplierName: string | null;
};

export type TPurchaseOrderDetail = TPurchaseOrderWithSupplier & {
  items: (TPurchaseOrderItem & {
    bookCode: string;
    displayTitle: string;
  })[];
};

export type TPurchaseOrderWithItems = TPurchaseOrder & {
  supplierName: string;
  items: TPurchaseOrderItem[];
};

// ==================== GOODS RECEIPT TYPES ====================

export type TGoodsReceipt = InferSelectModel<typeof goodsReceiptTable>;
export type TNewGoodsReceipt = InferInsertModel<typeof goodsReceiptTable>;

export type TGoodsReceiptItem = InferSelectModel<typeof goodsReceiptItemTable>;
export type TNewGoodsReceiptItem = InferInsertModel<typeof goodsReceiptItemTable>;

export type TCreateGoodsReceipt = {
  purchaseOrderId: number;
  receivedDate: string;
  note?: string;
  items: Array<{
    bookId: number;
    quantity: number;
  }>;
};

export type TGoodsReceiptWithItems = TGoodsReceipt & {
  items: TGoodsReceiptItem[];
  supplierName?: string;
};

export type TGoodsReceiptDetail = TGoodsReceiptWithItems & {
  items: (TGoodsReceiptItem & {
    bookCode: string;
    displayTitle: string;
  })[];
};

// ==================== CUSTOMER ORDER TYPES ====================

export type TCustomerOrder = InferSelectModel<typeof customerOrderTable>;
export type TNewCustomerOrder = InferInsertModel<typeof customerOrderTable>;
export type TUpdateCustomerOrder = Partial<Omit<TNewCustomerOrder, "createdAt" | "updatedAt">>;

export type TCustomerOrderItem = InferSelectModel<typeof customerOrderItemTable>;
export type TNewCustomerOrderItem = InferInsertModel<typeof customerOrderItemTable>;

export type TCustomerOrderWithCustomer = TCustomerOrder & {
  customerName: string;
};

export type TCustomerOrderDetail = TCustomerOrder & {
  customer: {
    id: number;
    name: string;
    phone: string;
    address: string;
    institution: string;
  };
  items: (TCustomerOrderItem & {
    book: {
      id: number;
      code: string;
      bookTitle: {
        id: number;
        grade: number;
        level: string;
        curriculum: string;
        subject: { name: string } | null;
      };
      supplier: { id: number; name: string } | null;
    };
    shippedQuantity?: number;
    remainingQuantity?: number;
  })[];
};

export type TCustomerOrderListItem = {
  id: number;
  customerId: number;
  customerName: string;
  orderDate: Date;
  status: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ==================== GOODS OUT TYPES ====================

export type TGoodsOut = InferSelectModel<typeof goodsOutTable>;
export type TNewGoodsOut = InferInsertModel<typeof goodsOutTable>;

export type TGoodsOutItem = InferSelectModel<typeof goodsOutItemTable>;
export type TNewGoodsOutItem = InferInsertModel<typeof goodsOutItemTable>;

export type TGoodsOutListItem = {
  id: number;
  customerOrderId: number;
  customerName: string;
  shippedDate: Date;
  note: string | null;
  totalItems: number;
  totalQuantity: number;
  createdAt: Date;
};

export type TGoodsOutDetail = TGoodsOut & {
  customerOrder: {
    id: number;
    orderDate: Date;
    status: string;
    customer: {
      id: number;
      name: string;
      phone: string;
      address: string;
    };
  };
  items: (TGoodsOutItem & {
    book: {
      id: number;
      code: string;
      bookTitle: {
        id: number;
        grade: number;
        level: string;
        curriculum: string;
        subject: { name: string } | null;
      };
    };
  })[];
};