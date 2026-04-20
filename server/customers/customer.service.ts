import { TCreateOrUpdateCustomer, TIndexCustomerQuery } from "@/schemas/customer.schema";
import {
  createCustomerRepository,
  deleteCustomerByIdRepository,
  getCustomerByIdRepository,
  getCustomersCountRepository,
  getCustomersWithPaginationRepository,
  updateCustomerByIdRepository,
} from "./customer.repository";
import { paginationResponseMapper } from "@/lib/pagination";
import { TCustomer } from "@/types/database";
import { NotFoundException } from "@/common/exception/not-found.exception";

export const createCustomerService = async (customerData: TCreateOrUpdateCustomer) => {
  const result = await createCustomerRepository(customerData);
  return result; // ini sudah mengembalikan array of customer
};

export const getCustomersWithPaginationService = async (queryParams: TIndexCustomerQuery) => {
  const [entries, total] = await Promise.all([
    getCustomersWithPaginationRepository(queryParams),
    getCustomersCountRepository(queryParams),
  ]);

  return paginationResponseMapper<TCustomer>(entries, {
    currentPage: queryParams.page,
    pageSize: queryParams.pageSize,
    totalItems: total,
  });
};

export const getCustomerByIdService = async (id: number): Promise<TCustomer> => {
  const customer = await getCustomerByIdRepository(id);

  if (customer.length === 0) {
    throw new NotFoundException(`Customer with ID ${id} not found`);
  }

  return customer[0];
};

export const deleteCustomerService = async (id: number) => {
  return await deleteCustomerByIdRepository(id);
};

export const updateCustomerService = async (
  id: number,
  updateData: TCreateOrUpdateCustomer,
): Promise<TCustomer> => {
  const customer = await getCustomerByIdService(id);

  if (!customer) {
    throw new NotFoundException(`Customer with ID ${id} not found`);
  }

  const updatedCustomer = await updateCustomerByIdRepository(id, updateData);

  return updatedCustomer[0];
};
