import { timestamp } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp({ mode: "date", precision: 3 })
    .$defaultFn(() => new Date())
    .notNull()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp(),
};
