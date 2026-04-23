import { NotFoundException } from "@/common/exception/not-found.exception";
import { TCreatePurchaseOrder, TUpdatePurchaseOrder, TIndexPurchaseOrderQuery } from "@/schemas/purchase-order.schema";
import {
  createPurchaseOrderRepository,
  getPurchaseOrdersWithPaginationRepository,
  getPurchaseOrderByIdRepository,
  deletePurchaseOrderByIdRepository,
  updatePurchaseOrderHeaderRepository,
  replacePurchaseOrderItemsRepository,
} from "./purchase-order.repository";
import { TPurchaseOrderWithSupplier, TPurchaseOrderDetail } from "@/types/database";
import { paginationResponseMapper } from "@/lib/pagination";

export const createPurchaseOrderService = async (data: TCreatePurchaseOrder) => {
  const orderData = {
    supplierId: data.supplierId,
    orderDate: new Date(data.orderDate),
    note: data.note || null,
  };

  const items = data.items.map((item) => ({
    bookId: item.bookId,
    quantity: item.quantity,
  }));

  return await createPurchaseOrderRepository(orderData, items);
};

export const getPurchaseOrdersWithPaginationService = async (queryParams: TIndexPurchaseOrderQuery) => {
  const { data, total } = await getPurchaseOrdersWithPaginationRepository(queryParams);

  return paginationResponseMapper<TPurchaseOrderWithSupplier>(data, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getPurchaseOrderByIdService = async (id: number): Promise<TPurchaseOrderDetail> => {
  const order = await getPurchaseOrderByIdRepository(id);
  if (!order) {
    throw new NotFoundException(`Purchase Order dengan ID ${id} tidak ditemukan`);
  }
  return order;
};

export const deletePurchaseOrderService = async (id: number) => {
  // Check if exists
  await getPurchaseOrderByIdService(id);
  return await deletePurchaseOrderByIdRepository(id);
};

export const updatePurchaseOrderService = async (id: number, data: TUpdatePurchaseOrder) => {
  // Check existence
  await getPurchaseOrderByIdService(id);

  // Update header
  const updateData = {
    supplierId: data.supplierId,
    orderDate: new Date(data.orderDate),
    note: data.note || null,
  };
  await updatePurchaseOrderHeaderRepository(id, updateData);
  
  // Update items
  const items = data.items.map((item) => ({
    bookId: item.bookId,
    quantity: item.quantity,
  }));
  await replacePurchaseOrderItemsRepository(id, items);

  // Return updated order
  return await getPurchaseOrderByIdService(id);
};