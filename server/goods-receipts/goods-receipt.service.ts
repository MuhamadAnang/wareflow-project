import { NotFoundException } from "@/common/exception/not-found.exception";
import { TCreateGoodsReceipt, TIndexGoodsReceiptQuery, TUpdateGoodsReceipt } from "@/schemas/goods-receipt.schema";
import {
  createGoodsReceiptRepository,
  getGoodsReceiptsWithPaginationRepository,
  getGoodsReceiptByIdRepository,
  deleteGoodsReceiptByIdRepository,
  updateGoodsReceiptHeaderRepository,
  replaceGoodsReceiptItemsRepository,
} from "./goods-receipt.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TGoodsReceiptDetail, TGoodsReceiptWithItems } from "@/types/database";
import { processStockMovement } from "@/server/stock-movements/stock-movement.service";

export const createGoodsReceiptService = async (data: TCreateGoodsReceipt) => {
  return await createGoodsReceiptRepository(data, async (tx, receipt, items) => {
    for (const item of items) {
      await processStockMovement({
        bookId: item.bookId,
        type: "IN_PURCHASE",
        quantity: item.quantity,
        referenceType: "goods_receipt",
        referenceId: receipt.id,
        note: `Penerimaan dari PO #${data.purchaseOrderId}`,
      }, tx); // 👈 PASS TX
    }
  });
};

export const getGoodsReceiptsWithPaginationService = async (queryParams: TIndexGoodsReceiptQuery) => {
  const { data, total } = await getGoodsReceiptsWithPaginationRepository(queryParams);
  return paginationResponseMapper<TGoodsReceiptWithItems>(data, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getGoodsReceiptByIdService = async (id: number): Promise<TGoodsReceiptDetail> => {
  const receipt = await getGoodsReceiptByIdRepository(id);
  if (!receipt) throw new NotFoundException(`Goods Receipt dengan ID ${id} tidak ditemukan`);
  return receipt;
};

export const deleteGoodsReceiptService = async (id: number) => {
  await getGoodsReceiptByIdService(id);
  return await deleteGoodsReceiptByIdRepository(id);
};

export const updateGoodsReceiptService = async (id: number, data: TUpdateGoodsReceipt) => {
  await getGoodsReceiptByIdService(id);

  const updateHeader = {
    receivedDate: new Date(data.receivedDate),
    note: data.note || null,
  };
  await updateGoodsReceiptHeaderRepository(id, updateHeader);

  const items = data.items.map(item => ({
    bookId: item.bookId,
    quantity: item.quantity,
  }));
  await replaceGoodsReceiptItemsRepository(id, items);

  return await getGoodsReceiptByIdService(id);
};