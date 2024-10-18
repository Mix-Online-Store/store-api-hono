import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { addresses } from "@/db/schema";

// TODO: combine with selectUserSchema at `userId`
export const selectAddressSchema = createSelectSchema(addresses);

export const insertAddressSchema = createInsertSchema(addresses, {
  phone: (schema) => schema.phone.min(1),
})
  .required({
    street: true,
    city: true,
    state: true,
    country: true,
    postalCode: true,
  })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    updateCounter: true,
    deletedAt: true,
  });
export const updateAddressSchema = createInsertSchema(addresses).partial();
