import { customerTable } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { buildCountQuery, buildPaginatedQuery, TColumnsDefinition } from "@/lib/query-builder";
import { TIndexCustomerQuery } from "@/schemas/customer.schema";
import { TNewCustomer, TUpdateCustomer } from "@/types/database";
import { eq } from "drizzle-orm";

export const createCustomerRepository = async (customerData: TNewCustomer) => {
  return await db.insert(customerTable).values(customerData).returning();
};

const CUSTOMER_COLUMNS: TColumnsDefinition<typeof customerTable> = {
  name: { searchable: true, sortable: true },
  school: { searchable: true },
  status: { filterable: true },
};

export const getCustomersWithPaginationRepository = async (queryParams: TIndexCustomerQuery) => {
  return await buildPaginatedQuery({
    table: customerTable,
    columns: CUSTOMER_COLUMNS,
    queryParams,
  });
};

export const getCustomersCountRepository = async (queryParams: TIndexCustomerQuery) => {
  return await buildCountQuery({
    table: customerTable,
    columns: CUSTOMER_COLUMNS,
    queryParams,
  });
};

export const getCustomerByIdRepository = async (id: number) => {
  return await db.select().from(customerTable).where(eq(customerTable.id, id));
};

export const deleteCustomerByIdRepository = async (id: number) => {
  return await db
    .update(customerTable)
    .set({ deletedAt: new Date() })
    .where(eq(customerTable.id, id))
    .returning();
};

export const updateCustomerByIdRepository = async (id: number, updateData: TUpdateCustomer) => {
  return await db.update(customerTable).set(updateData).where(eq(customerTable.id, id)).returning();
};
