import { db } from "@/lib/db";
import { eq, sql, and, isNull, desc } from "drizzle-orm";
import {
  bookTable,
  customerOrderTable,
  customerOrderItemTable,
  customerTable,
  goodsOutTable,
  supplierTable,
  subjectTable,
  customerReturnTable,
} from "@/drizzle/schema";
import { calculateDistributionPriority } from "../mcdm/priority.service";

interface DashboardStats {
  totalBooks: number;
  totalStock: number;
  lowStockItems: number;
  totalCustomers: number;
  totalSuppliers: number;
  pendingOrders: number;
  pendingOrdersValue: number;
  shippedOrdersThisMonth: number;
  totalReturnsThisMonth: number;
}

interface LowStockItem {
  id: number;
  code: string;
  name: string;
  currentStock: number;
  subjectName: string | null;
}

interface RecentOrder {
  id: number;
  customerName: string;
  orderDate: Date;
  deadline: Date | null;
  status: string;
  totalItems: number;
  totalQuantity: number;
}

interface TopCustomer {
  customerId: number;
  customerName: string;
  totalOrders: number;
  totalQuantity: number;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Total buku aktif (tidak dihapus)
  const totalBooks = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(bookTable)
    .where(isNull(bookTable.deletedAt));

  // Total stok semua buku
  const totalStockResult = await db
    .select({ sum: sql<number>`SUM(${bookTable.currentStock})` })
    .from(bookTable)
    .where(isNull(bookTable.deletedAt));

  // Jumlah buku dengan stok menipis (< 50)
  const lowStockItems = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(bookTable)
    .where(
      and(
        isNull(bookTable.deletedAt),
        sql`${bookTable.currentStock} < 50 AND ${bookTable.currentStock} > 0`
      )
    );

  // Total customer aktif
  const totalCustomers = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customerTable)
    .where(isNull(customerTable.deletedAt));

  // Total supplier aktif
  const totalSuppliers = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(supplierTable)
    .where(isNull(supplierTable.deletedAt));

  // Pending orders (CONFIRMED atau PARTIALLY_SHIPPED)
  const pendingOrdersResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customerOrderTable)
    .where(
      sql`${customerOrderTable.status} IN ('CONFIRMED', 'PARTIALLY_SHIPPED')`
    );

  // Total nilai pending orders (hitung dari items)
  const pendingOrdersValue = await calculatePendingOrdersValue();

  // Jumlah pengiriman bulan ini
  const shippedOrdersThisMonthResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(goodsOutTable)
    .where(
      sql`${goodsOutTable.shippedDate} >= ${firstDayOfMonth} AND ${goodsOutTable.shippedDate} <= ${lastDayOfMonth}`
    );

  // Total retur bulan ini
  const totalReturnsThisMonthResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(customerReturnTable)
    .where(
      sql`${customerReturnTable.returnDate} >= ${firstDayOfMonth} AND ${customerReturnTable.returnDate} <= ${lastDayOfMonth}`
    );

  return {
    totalBooks: totalBooks[0]?.count || 0,
    totalStock: totalStockResult[0]?.sum || 0,
    lowStockItems: lowStockItems[0]?.count || 0,
    totalCustomers: totalCustomers[0]?.count || 0,
    totalSuppliers: totalSuppliers[0]?.count || 0,
    pendingOrders: pendingOrdersResult[0]?.count || 0,
    pendingOrdersValue: pendingOrdersValue,
    shippedOrdersThisMonth: shippedOrdersThisMonthResult[0]?.count || 0,
    totalReturnsThisMonth: totalReturnsThisMonthResult[0]?.count || 0,
  };
}

/**
 * Calculate total value of pending orders
 */
async function calculatePendingOrdersValue(): Promise<number> {
  const pendingOrders = await db
    .select({ id: customerOrderTable.id })
    .from(customerOrderTable)
    .where(
      sql`${customerOrderTable.status} IN ('CONFIRMED', 'PARTIALLY_SHIPPED')`
    );

  let totalValue = 0;

  for (const order of pendingOrders) {
    const items = await db
      .select({ price: customerOrderItemTable.price, quantity: customerOrderItemTable.quantity })
      .from(customerOrderItemTable)
      .where(eq(customerOrderItemTable.customerOrderId, order.id));

    for (const item of items) {
      totalValue += Number(item.price) * item.quantity;
    }
  }

  return totalValue;
}

/**
 * Get low stock items (stok < 50)
 */
export async function getLowStockItems(limit: number = 10): Promise<LowStockItem[]> {
  const items = await db
    .select({
      id: bookTable.id,
      code: bookTable.code,
      name: bookTable.name,
      currentStock: bookTable.currentStock,
      subjectName: subjectTable.name,
    })
    .from(bookTable)
    .leftJoin(subjectTable, eq(bookTable.subjectId, subjectTable.id))
    .where(
      and(
        isNull(bookTable.deletedAt),
        sql`${bookTable.currentStock} < 50 AND ${bookTable.currentStock} > 0`
      )
    )
    .orderBy(bookTable.currentStock)
    .limit(limit);

  return items;
}

/**
 * Get recent orders (last 5 orders with status CONFIRMED or PARTIALLY_SHIPPED)
 */
export async function getRecentOrders(limit: number = 5): Promise<RecentOrder[]> {
  const orders = await db
    .select({
      id: customerOrderTable.id,
      customerName: customerTable.name,
      orderDate: customerOrderTable.orderDate,
      deadline: customerOrderTable.deadline,
      status: customerOrderTable.status,
    })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .where(
      sql`${customerOrderTable.status} IN ('CONFIRMED', 'PARTIALLY_SHIPPED')`
    )
    .orderBy(desc(customerOrderTable.createdAt))
    .limit(limit);

  const result: RecentOrder[] = [];

  for (const order of orders) {
    // Hitung total items dan quantity
    const items = await db
      .select({
        quantity: customerOrderItemTable.quantity,
      })
      .from(customerOrderItemTable)
      .where(eq(customerOrderItemTable.customerOrderId, order.id));

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    result.push({
      id: order.id,
      customerName: order.customerName,
      orderDate: order.orderDate,
      deadline: order.deadline,
      status: order.status,
      totalItems: items.length,
      totalQuantity: totalQuantity,
    });
  }

  return result;
}

/**
 * Get top customers by order quantity
 */
export async function getTopCustomers(limit: number = 5): Promise<TopCustomer[]> {
  const customers = await db
    .select({
      customerId: customerOrderTable.customerId,
      customerName: customerTable.name,
      totalOrders: sql<number>`COUNT(DISTINCT ${customerOrderTable.id})`,
      totalQuantity: sql<number>`SUM(${customerOrderItemTable.quantity})`,
    })
    .from(customerOrderTable)
    .innerJoin(customerTable, eq(customerOrderTable.customerId, customerTable.id))
    .innerJoin(customerOrderItemTable, eq(customerOrderItemTable.customerOrderId, customerOrderTable.id))
    .groupBy(customerOrderTable.customerId, customerTable.name)
    .orderBy(sql`SUM(${customerOrderItemTable.quantity}) DESC`)
    .limit(limit);

  return customers;
}

/**
 * Get priority preview (top 3 pending orders with highest score)
 */
export async function getPriorityPreview(limit: number = 3) {
  const priorities = await calculateDistributionPriority();
  return priorities.slice(0, limit);
}