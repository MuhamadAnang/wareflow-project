import { db } from "@/lib/db";
import { and, eq, inArray, sql } from "drizzle-orm";
import {
  customerOrderTable,
  customerOrderItemTable,
  customerTable,
  bookTable,
  customerReturnTable,
  customerReturnItemTable,
} from "@/drizzle/schema";
import { TopsisService } from "./topsis.service";

interface OrderPriorityInput {
  orderId: number;
  customerId: number;
  customerName: string;
  customerInstitution: string;
  stockFulfillment: number;
  urgency: number;
  contractStatus: number;
  returnRate: number;
  orderItems: {
    id: number;
    bookId: number;
    quantity: number;
    price: string;
    bookCode: string;
    bookName: string;
  }[];
  deadline: string | null;
  orderDate: string;
}

/**
 * Hitung pemenuhan stok (C1) - Benefit
 * Persentase stok yang tersedia vs yang dipesan
 */
async function calculateStockFulfillment(orderId: number): Promise<number> {
  const orderItems = await db
    .select({
      bookId: customerOrderItemTable.bookId,
      quantity: customerOrderItemTable.quantity,
    })
    .from(customerOrderItemTable)
    .where(eq(customerOrderItemTable.customerOrderId, orderId));

  if (orderItems.length === 0) return 0;

  let totalStockAvailable = 0;
  let totalOrdered = 0;

  for (const item of orderItems) {
    const book = await db
      .select({ currentStock: bookTable.currentStock })
      .from(bookTable)
      .where(eq(bookTable.id, item.bookId))
      .limit(1);

    const stockAvailable = book[0]?.currentStock || 0;
    totalStockAvailable += Math.min(stockAvailable, item.quantity);
    totalOrdered += item.quantity;
  }

  if (totalOrdered === 0) return 0;
  return (totalStockAvailable / totalOrdered) * 100;
}

/**
 * Hitung urgensi (C2) - Benefit
 * Berdasarkan deadline (jika ada) atau default 10
 */
async function calculateUrgency(order: {
  id: number;
  deadline: string | Date | null;
  orderDate: string | Date;
}): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Tidak ada deadline -> nilai default sedang
  if (!order.deadline) {
    return 10;
  }
  
  const deadline = new Date(order.deadline);
  deadline.setHours(0, 0, 0, 0);
  
  // Sudah melewati deadline -> paling urgent
  if (deadline < today) {
    return 100;
  }
  
  // Hitung sisa hari
  const diffTime = deadline.getTime() - today.getTime();
  let remainingDays = Math.ceil(diffTime / (1000 * 3600 * 24));
  remainingDays = Math.min(remainingDays, 30);
  
  // Urgensi: semakin kecil sisa hari, semakin besar nilainya
  const urgencyScore = (1 / (remainingDays + 1)) * 100;
  
  return Math.round(urgencyScore * 100) / 100;
}

/**
 * Hitung status kontrak (C3) - Benefit
 */
async function calculateContractStatus(customerId: number): Promise<number> {
  const customer = await db
    .select({ status: customerTable.status })
    .from(customerTable)
    .where(eq(customerTable.id, customerId))
    .limit(1);

  const status = customer[0]?.status;
  
  switch (status) {
    case "CONTRACT":
      return 5;
    case "MOU":
      return 3;
    case "NON-CONTRACT":
      return 1;
    default:
      return 1;
  }
}

/**
 * Hitung riwayat retur (C4) - Cost
 * Persentase retur dari total pesanan
 */
async function calculateReturnRate(customerId: number): Promise<number> {
  // Ambil semua order customer
  const orders = await db
    .select({ id: customerOrderTable.id })
    .from(customerOrderTable)
    .where(eq(customerOrderTable.customerId, customerId));

  // Jika belum pernah order
  if (orders.length === 0) {
    return 0;
  }

  let totalOrdered = 0;
  let totalReturned = 0;

  /**
   * =========================
   * HITUNG TOTAL ORDER
   * =========================
   */
  for (const order of orders) {
    const orderItems = await db
      .select({
        quantity: customerOrderItemTable.quantity,
      })
      .from(customerOrderItemTable)
      .where(eq(customerOrderItemTable.customerOrderId, order.id));

    totalOrdered += orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  /**
   * =========================
   * HITUNG TOTAL RETUR
   * =========================
   */
  const returns = await db
    .select({ id: customerReturnTable.id })
    .from(customerReturnTable)
    .where(eq(customerReturnTable.customerId, customerId));

  for (const ret of returns) {
    const returnItems = await db
      .select({
        quantity: customerReturnItemTable.quantity,
      })
      .from(customerReturnItemTable)
      .where(eq(customerReturnItemTable.customerReturnId, ret.id));

    totalReturned += returnItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  // Hindari pembagian nol
  if (totalOrdered === 0) {
    return 0;
  }

  /**
   * Persentase retur
   */
  const returnRate =
    (totalReturned / totalOrdered) * 100;

  /**
   * Maksimal 100%
   * untuk menghindari data anomali
   */
  return Math.min(
    Math.round(returnRate * 100) / 100,
    100
  );
}

/**
 * Ambil semua order yang perlu diprioritaskan
 * Status: CONFIRMED atau PARTIALLY_SHIPPED
 */
export async function getPendingOrdersForPriority(orderIds?: number[]): Promise<OrderPriorityInput[]> {
  const statusCondition = sql`${customerOrderTable.status} IN ('CONFIRMED', 'PARTIALLY_SHIPPED')`;
  const whereCondition = orderIds?.length
    ? and(statusCondition, inArray(customerOrderTable.id, orderIds))
    : statusCondition;

  const orders = await db
    .select({
      id: customerOrderTable.id,
      customerId: customerOrderTable.customerId,
      customerName: customerTable.name,
      customerInstitution: customerTable.institution,
      orderDate: customerOrderTable.orderDate,
      deadline: customerOrderTable.deadline,
      status: customerOrderTable.status,
    })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(whereCondition)
    .orderBy(customerOrderTable.createdAt);

  const result: OrderPriorityInput[] = [];

  for (const order of orders) {
    const [stockFulfillment, urgency, contractStatus, returnRate] = await Promise.all([
      calculateStockFulfillment(order.id),
      calculateUrgency(order),
      calculateContractStatus(order.customerId),
      calculateReturnRate(order.customerId),
    ]);

    // Ambil detail items untuk ditampilkan
    const orderItems = await db
      .select({
        id: customerOrderItemTable.id,
        bookId: customerOrderItemTable.bookId,
        quantity: customerOrderItemTable.quantity,
        price: customerOrderItemTable.price,
        bookCode: bookTable.code,
        bookName: bookTable.name,
      })
      .from(customerOrderItemTable)
      .innerJoin(bookTable, eq(customerOrderItemTable.bookId, bookTable.id))
      .where(eq(customerOrderItemTable.customerOrderId, order.id));

    result.push({
      orderId: order.id,
      customerId: order.customerId,
      customerName: order.customerName,
      customerInstitution: order.customerInstitution,
      stockFulfillment,
      urgency,
      contractStatus,
      returnRate,
      orderItems,
      deadline: order.deadline,
      orderDate: order.orderDate,
    });
  }

  return result;
}

/**
 * Hitung prioritas distribusi untuk semua pending orders
 */
export async function calculateDistributionPriority(orderIds?: number[]) {
  const pendingOrders = await getPendingOrdersForPriority(orderIds);
  
  if (pendingOrders.length === 0) {
    return [];
  }

  const topsis = new TopsisService([0.56, 0.26, 0.12, 0.06]);
  
  const alternatives = pendingOrders.map(order => ({
    id: order.orderId,
    customerName: order.customerName,
    criteria: {
      stockFulfillment: order.stockFulfillment,
      urgency: order.urgency,
      contractStatus: order.contractStatus,
      returnRate: order.returnRate,
    },
    orderDetails: {
      customerId: order.customerId,
      customerInstitution: order.customerInstitution,
      deadline: order.deadline,
      orderDate: order.orderDate,
      items: order.orderItems,
    },
  }));

  const results = topsis.calculate({ alternatives, weights: [0.56, 0.26, 0.12, 0.06] });
  
  return results.map(result => {
    const order = pendingOrders.find(o => o.orderId === result.id);
    return {
      ...result,
      criteria: {
        stockFulfillment: order?.stockFulfillment || 0,
        urgency: order?.urgency || 0,
        contractStatus: order?.contractStatus || 0,
        returnRate: order?.returnRate || 0,
      },
      customerInstitution: order?.customerInstitution || "",
      deadline: order?.deadline,
      orderDate: order?.orderDate,
    };
  });
}
