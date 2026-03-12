import z from "zod";

export const IndexQueryParams = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z
    .array(
      z.object({
        key: z.string(),
        direction: z.enum(["asc", "desc"]),
      }),
    )
    .optional(),
});

export type TIndexQueryParams = z.infer<typeof IndexQueryParams>;
