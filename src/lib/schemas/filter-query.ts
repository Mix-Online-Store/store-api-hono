import { z } from "@hono/zod-openapi";

export const FilterQuerySchema = z.object({
  search: z.string().optional().openapi({
    example: "phone",
  }),
  page: z.coerce.number().optional().openapi({
    example: 1,
  }),
  limit: z.coerce.number().optional().openapi({
    example: 20,
  }),
});
export default FilterQuerySchema;
