import { NotFoundException } from "@/common/exception/not-found.exception";
import { TCreateGoodsReceipt, TIndexGoodsReceiptQuery, TUpdateGoodsReceipt } from "@/schemas/goods-receipt.schema";
import {
  createGoodsReceiptRepository,
  getGoodsReceiptsWithPaginationRepository,
  getGoodsReceiptByIdRepository,
  deleteGoodsReceiptByIdRepository,
  updateGoodsReceiptByIdRepository,
  updateGoodsReceiptHeaderRepository,
  replaceGoodsReceiptItemsRepository,
} from "./goods-receipt.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TGoodsReceiptDetail, TGoodsReceiptWithItems } from "@/types/database";

export const createGoodsReceiptService = async (data: TCreateGoodsReceipt) => {
  return await createGoodsReceiptRepository(data);
};

export const getGoodsReceiptsWithPaginationService = async (queryParams: TIndexGoodsReceiptQuery) => {
  const { data, total } = await getGoodsReceiptsWithPaginationRepository(queryParams);
  return paginationResponseMapper<TGoodsReceiptWithItems>(data, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

// Tambahkan fungsi-fungsi berikut
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
  // Cek apakah receipt ada
  await getGoodsReceiptByIdService(id);

  // Update header
  const updateHeader = {
    receivedDate: new Date(data.receivedDate),
    note: data.note || null,
  };
  await updateGoodsReceiptHeaderRepository(id, updateHeader);

  // Update items
  const items = data.items.map(item => ({
    bookId: item.bookId,
    quantity: item.quantity,
  }));
  await replaceGoodsReceiptItemsRepository(id, items);

  // Kembalikan data terbaru
  return await getGoodsReceiptByIdService(id);
};