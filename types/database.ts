import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  bookTable,
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
  percetakanTable,
  customerReturnTable,
  customerReturnItemTable,
  supplierReturnTable,
  supplierReturnItemTable,
  bookLevelEnum,
  curriculumEnum,
} from "@/drizzle/schema";

// ==================== CUSTOMER TYPES ====================

export type TCustomer = InferSelectModel<typeof customerTable>;
export type TNewCustomer = InferInsertModel<typeof customerTable>;
export type TUpdateCustomer = Omit<TNewCustomer, "createdAt" | "updatedAt">;

// ==================== PERCETAKAN TYPES ====================

export type TPercetakan = InferSelectModel<typeof percetakanTable>;
export type TNewPercetakan = InferInsertModel<typeof percetakanTable>;
export type TUpdatePercetakan = Omit<TNewPercetakan, "createdAt" | "updatedAt">;

// ==================== SUBJECT TYPES ====================

export type TSubject = InferSelectModel<typeof subjectTable>;
export type TNewSubject = InferInsertModel<typeof subjectTable>;
export type TUpdateSubject = Omit<TNewSubject, "createdAt" | "updatedAt">;

// ==================== SUPPLIER TYPES ====================

export type TSupplier = InferSelectModel<typeof supplierTable>;
export type TNewSupplier = InferInsertModel<typeof supplierTable>;
export type TUpdateSupplier = Omit<TNewSupplier, "createdAt" | "updatedAt">;

// ==================== BOOK TYPES (Master Identitas) ====================

export type TNewBook = InferInsertModel<typeof bookTable>;
export type TBookLevelEnum = (typeof bookLevelEnum.enumValues)[number];
export type TCurriculumEnum = (typeof curriculumEnum.enumValues)[number];
export type TUpdateBook = Partial<Omit<TNewBook, "createdAt" | "updatedAt" | "currentStock">>;

export type TBookListItem = {
  id: number;
  code: string;
  name: string;
  subjectId: number;
  grade: number;
  level: string;
  curriculum: string;
  semester: string;
  image: string | null;
  pages: number | null;
  productionYear: number | null;
  percetakanId: number;
  currentStock: number;
  subjectName: string | null; // boleh null
  percetakanName: string | null; // boleh null
  displayTitle: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

// ==================== PURCHASE ORDER TYPES ====================

type TPurchaseOrder = InferSelectModel<typeof purchaseOrderTable>;
export type TNewPurchaseOrder = InferInsertModel<typeof purchaseOrderTable>;
export type TUpdatePurchaseOrder = Partial<Omit<TNewPurchaseOrder, "createdAt" | "updatedAt">>;

type TPurchaseOrderItem = InferSelectModel<typeof purchaseOrderItemTable>;
export type TNewPurchaseOrderItem = InferInsertModel<typeof purchaseOrderItemTable>;

export type TPurchaseOrderWithSupplier = TPurchaseOrder & {
  supplierName: string | null;
};

export type TPurchaseOrderDetail = TPurchaseOrderWithSupplier & {
  items: (TPurchaseOrderItem & {
    bookCode: string;
    bookName: string;
  })[];
};
// ==================== GOODS RECEIPT TYPES ====================

type TGoodsReceipt = InferSelectModel<typeof goodsReceiptTable>;
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

// ✅ Fix TGoodsReceiptDetail di types/database.ts
export type TGoodsReceiptDetail = TGoodsReceipt & {
  supplierName: string | null;
  items: (TGoodsReceiptItem & {
    bookCode: string;
    bookName: string; // ✅ konsisten dengan PO
  })[];
};

// ==================== CUSTOMER ORDER TYPES ====================

type TCustomerOrder = InferSelectModel<typeof customerOrderTable>;
export type TNewCustomerOrder = InferInsertModel<typeof customerOrderTable>;

type TCustomerOrderItem = InferSelectModel<typeof customerOrderItemTable>;
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
    bookCode: string;
    bookName: string;
    currentStock: number;
    shippedQuantity?: number;
    remainingQuantity?: number;
  })[];
};

export type TCustomerOrderListItem = {
  id: number;
  customerId: number;
  customerName: string;
  orderDate: Date;
  status: TCustomerOrder["status"];
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ==================== GOODS OUT TYPES ====================

type TGoodsOut = InferSelectModel<typeof goodsOutTable>;

type TGoodsOutItem = InferSelectModel<typeof goodsOutItemTable>;

export type TGoodsOutListItem = {
  id: number;
  customerOrderId: number;
  customerName: string;
  customerAddress: string | null;
  shippedDate: Date;
  note: string | null;
  totalItems: number;
  totalQuantity: number;
  createdAt: Date;
};

export type TGoodsOutDetail = TGoodsOut & {
  customerOrder: {
    id: number;
    orderDate: string;
    status: string;
    customer: {
      id: number;
      name: string;
      phone: string;
      address: string;
    };
  };
  items: (TGoodsOutItem & {
    bookCode: string;
    bookName: string;
  })[];
};

// ==================== CUSTOMER RETURN TYPES ====================

type TCustomerReturn = InferSelectModel<typeof customerReturnTable>;

type TCustomerReturnItem = InferSelectModel<typeof customerReturnItemTable>;

export type TCustomerReturnListItem = {
  id: number;
  customerName: string;
  returnDate: Date;
  reason: string | null;
  totalItems: number;
  totalQuantity: number;
  createdAt: Date;
};

export type TCustomerReturnDetail = TCustomerReturn & {
  customer: {
    id: number;
    name: string;
    phone: string;
    address: string;
    institution: string;
  };
  items: (TCustomerReturnItem & {
    book: {
      id: number;
      code: string;
      name: string;
    };
  })[];
};

// ==================== SUPPLIER RETURN TYPES ====================

type TSupplierReturn = InferSelectModel<typeof supplierReturnTable>;

type TSupplierReturnItem = InferSelectModel<typeof supplierReturnItemTable>;

export type TSupplierReturnListItem = {
  id: number;
  supplierName: string;
  returnDate: Date;
  reason: string | null;
  totalItems: number;
  totalQuantity: number;
  createdAt: Date;
};

export type TSupplierReturnDetail = TSupplierReturn & {
  supplier: {
    id: number;
    name: string;
    phone: string;
    address: string | null;
  };
  items: (TSupplierReturnItem & {
    book: {
      id: number;
      code: string;
      name: string;
      currentStock: number;
    };
  })[];
};
