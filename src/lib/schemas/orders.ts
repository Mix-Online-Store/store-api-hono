import { z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { orders } from "@/db/schema";

import { insertOrderItemSchema } from "./order-items";

/**
 * {
  items: z.array(
    z.object({
      productId: z.string().uuid(),
      variantId: z.string().uuid().nullable(),
      quantity: z.coerce.number(),
      price: z.coerce.number(),
    })
  ),
  orderTotal: z.object({
    subtotal: z.coerce.number(),
    discount: z.coerce.number(),
    total: z.coerce.number(),
  }),
}
  id: string;
    deletedAt: Date | null;
    userId: string;
    totalPrice: number;
    trackingUrl: string | null;
    shippingAddressId: string | null;
    date: Date;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | null;
    paymentMethod: "cash_on_delivery" | "prepaid" | null;
    id: string;
    updateCounter: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    userId: string;
    totalPrice: number;
    trackingUrl: string | null;
    orderTotal: {
        ...;
    } | null;
 */
export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
  orderTotalId: true,
});

export const createOrderSchema = z.object({
  userId: z.string().uuid(),
  orderStaus: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .default("pending"),
  items: z.array(insertOrderItemSchema),
  totalPrice: z.coerce.number().min(0),
  shippingAddressId: z.string().uuid().nullable(),
  paymentMethod: z.enum(["cash_on_delivery", "prepaid"]),
  couponCode: z.string().nullable(),
  orderTotal: z
    .object({
      subtotal: z.coerce.number(),
      discount: z.coerce.number(),
      total: z.coerce.number(),
    })
    .nullable(),
  trackingUrl: z.string().url().nullable(),
});

export const updateOrderSchema = z.object({
  orderStaus: z
    .enum(["pending", "processing", "shipped", "delivered", "cancelled"])
    .nullable(),
  trackingUrl: z.string().url().nullable(),
});
