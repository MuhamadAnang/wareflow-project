import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { customerTable } from "@/drizzle/schema";

// Customer Types
export type TCustomer = InferSelectModel<typeof customerTable>;
export type TNewCustomer = InferInsertModel<typeof customerTable>;
export type TUpdateCustomer = Omit<TNewCustomer, "createdAt" | "updatedAt">;
export type TCustomerStatus = TCustomer["status"];
