import { z } from "zod";
import { customerOrderStatusEnum } from "@/drizzle/schema";


export const CustomerOrderItemSchema = z.object({
  bookId: z.number().int().positive({ message: "Pilih buku terlebih dahulu" }),
  quantity: z.number().int().positive({ message: "Jumlah harus lebih besar dari 0" }),
  price: z.number().positive({ message: "Harga harus lebih besar dari 0" }),
});

export const CreateCustomerOrderFormSchema = z.object({
  customerId: z.number().int().positive({ message: "Pilih customer terlebih dahulu" }),
  orderDate: z.string().min(1, "Tanggal order harus diisi"),
  deadline: z.coerce.date().optional().nullable(),  // ← TAMBAHKAN
  note: z.string().max(500).optional().nullable(),
  items: z
    .array(CustomerOrderItemSchema)
    .min(1, "Minimal satu item"),
});

export const UpdateCustomerOrderStatusSchema = z.object({
  status: z.enum(customerOrderStatusEnum.enumValues),
});

export const IndexCustomerOrderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
  sort: z.record(z.enum(["asc", "desc"])).optional(),
  customerId: z.coerce.number().int().positive().optional(),
  status: z.string().optional(), // Terima string, bisa berisi CSV
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type TCreateCustomerOrder = z.infer<typeof CreateCustomerOrderFormSchema>;
export type TUpdateCustomerOrderStatus = z.infer<typeof UpdateCustomerOrderStatusSchema>;
export type TIndexCustomerOrderQuery = z.infer<typeof IndexCustomerOrderQuerySchema>;
export type TCustomerOrderItemInput = z.infer<typeof CustomerOrderItemSchema>;