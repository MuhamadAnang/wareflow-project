import { handleException } from "@/common/exception/helper";
import { parseQueryParams, validateSchema } from "@/lib/validation";
import { CreateOrUpdateSupplierSchema, IndexSupplierQuerySchema } from "@/schemas/supplier.schema";
import { NextRequest } from "next/server";
import {
  createSupplierService,
  deleteSupplierService,
  getSupplierByIdService,
  getSuppliersWithPaginationService,
  updateSupplierService,
} from "./supplier.service";
import { responseFormatter } from "@/lib/response-formatter";
import { parseSortParams } from "@/lib/query-param";
import { TSupplier } from "@/types/database";

export const createSupplierController = async (req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdateSupplierSchema, body);

    await createSupplierService(body);

    return responseFormatter.created({ message: "Supplier berhasil dibuat" });
  } catch (error) {
    return handleException(error);
  }
};

export const getSuppliersWithPaginationController = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);

    const rawQueryParams = {
      page: searchParams.get("page"),
      pageSize: searchParams.get("pageSize"),
      // limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined, // paksa Number di sini
      search: searchParams.get("search") || undefined,
      sort: parseSortParams(searchParams),
    };

    const result = parseQueryParams(IndexSupplierQuerySchema, rawQueryParams);

    if (!result.success) {
      return responseFormatter.validationError({
        error: result.error,
        message: "Parameter query tidak valid",
      });
    }

    const queryParams = result.data;

    // Handle limit di service
    const effectiveParams = {
      ...queryParams,
      pageSize: queryParams.limit ?? queryParams.pageSize ?? 20,
    };

    const { data, meta } = await getSuppliersWithPaginationService(effectiveParams);

    return responseFormatter.successWithPagination<TSupplier>({
      data,
      meta,
      message: "Daftar supplier berhasil diambil",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const getSupplierByIdController = async (id: number) => {
  try {
    const supplier = await getSupplierByIdService(id);
    return responseFormatter.successWithData<TSupplier>({
      data: supplier,
      message: "Supplier berhasil diambil",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const updateSupplierController = async (id: number, req: NextRequest) => {
  try {
    const body = await req.json();
    validateSchema(CreateOrUpdateSupplierSchema, body);

    const updated = await updateSupplierService(id, body);

    return responseFormatter.successWithData<TSupplier>({
      data: updated,
      message: "Supplier berhasil diperbarui",
    });
  } catch (error) {
    return handleException(error);
  }
};

export const deleteSupplierController = async (id: number) => {
  try {
    await deleteSupplierService(id);
    return responseFormatter.success({ message: "Supplier berhasil dihapus" });
  } catch (error) {
    return handleException(error);
  }
};