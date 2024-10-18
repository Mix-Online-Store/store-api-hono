import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { couponCodes } from "@/db/schema";

// TODO: combine with selectUserSchema at `userId`
export const selectCouponCodeSchema = createSelectSchema(couponCodes);

export const insertCouponCodeSchema = createInsertSchema(couponCodes, {
  endDate: z.string(),
})
  .required({
    applicableCategoryId: true,
    applicableProductId: true,
    applicableSubCategoryId: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    updateCounter: true,
    deletedAt: true,
  });
export const updateCouponCodeSchema = createInsertSchema(couponCodes, {
  endDate: z.string(),
}).partial();
export const checkCouponCodeSchema = z.object({
  couponCode: z.string().min(1),
  productIds: z.array(z.string().uuid()).nonempty(),
  purchaseAmount: z.coerce.number(),
});
