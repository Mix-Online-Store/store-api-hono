import type { SQL } from "drizzle-orm";

import { relations, sql } from "drizzle-orm";
import * as t from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

import { timestamps } from "./columns.helpers";

// ================= Enums ===================================
export const userRoleEnum = t.pgEnum("role", ["admin", "user", "delivery"]);

export const discountTypeEnum = t.pgEnum("discountType", [
  "fixed",
  "percentage",
]);

export const couponStatusEnum = t.pgEnum("couponStatus", [
  "active",
  "inactive",
]);

export const paymentMethodEnum = t.pgEnum("paymentMethod", [
  "cash_on_delivery",
  "prepaid",
]);

export const orderSatusEnum = t.pgEnum("orderStatus", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const apiKeyPlanEnum = t.pgEnum("plan", [
  "admin",
  "free",
  "basic",
  "premium",
  "custom",
]);

// ================= Tables =================================
export const users = t.pgTable("users", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: t.text().notNull(),
  email: t.text().notNull().unique(),
  password: t.text().notNull(),
  isActive: t.boolean().default(true).notNull(),
  role: userRoleEnum().default("user").notNull(),
  verificationToken: t.text(),
  isVerified: t.boolean().default(false).notNull(),
  verified: t.timestamp(),
  passwordToken: t.text(),
  passwordTokenExpirationDate: t.timestamp(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${users.updateCounter} + 1`),
});

export const apikeys = t.pgTable("apiKeys", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  userId: t
    .text()
    .notNull()
    .references(() => users.id),

  accessKey: t.text().notNull(),
  expired: t.timestamp().notNull(),
  plan: apiKeyPlanEnum().default("free"),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${apikeys.updateCounter} + 1`),
});

export const addresses = t.pgTable("addresses", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  phone: t.text().notNull(),
  street: t.text(),
  city: t.text(),
  state: t.text(),
  postalCode: t.text(),
  country: t.text(),

  userId: t
    .text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${addresses.updateCounter} + 1`),
});

export const tokens = t.pgTable("tokens", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  refreshToken: t.text().notNull(),
  ip: t.text(),
  userAgent: t.text(),
  isValid: t.boolean().default(true).notNull(),

  userId: t
    .text()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${tokens.updateCounter} + 1`),
});

export const categories = t.pgTable("categories", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: t.text().notNull(),
  imageUrl: t.text(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${categories.updateCounter} + 1`),
});

export const subCategories = t.pgTable("subcategories", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: t.text().notNull(),

  categoryId: t
    .text()
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${subCategories.updateCounter} + 1`),
});

export const brands = t.pgTable("brands", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: t.text().notNull(),

  subCategoryId: t
    .text()
    .notNull()
    .references(() => subCategories.id),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${brands.updateCounter} + 1`),
});

export const variantTypes = t.pgTable("variantTypes", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  name: t.text().notNull(),
  type: t.text().notNull(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${variantTypes.updateCounter} + 1`),
});

export const variants = t.pgTable("variants", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  name: t.text().notNull(),

  variantTypeId: t
    .text()
    .notNull()
    .references(() => variantTypes.id),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${variants.updateCounter} + 1`),
});

export const products = t.pgTable("products", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  name: t.text().notNull(),
  description: t.text().notNull(),
  quantity: t.integer().default(0).notNull(),
  price: t.doublePrecision().notNull(),
  offerPrice: t.doublePrecision(),

  categoryId: t
    .text()
    .notNull()
    .references(() => categories.id),
  subCategoryId: t.text().references(() => subCategories.id),
  brandId: t.text().references(() => brands.id),
  variantTypeId: t.text().references(() => variantTypes.id),
  variantId: t.text().references(() => variants.id),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${products.updateCounter} + 1`),
});

export const images = t.pgTable("images", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  url: t.text().notNull(),
  position: t.integer().default(0).notNull(),

  productId: t
    .text()
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${images.updateCounter} + 1`),
});

export const posters = t.pgTable("posters", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  name: t.text().notNull(),
  imageUrl: t.text(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${posters.updateCounter} + 1`),
});

export const notifications = t.pgTable("notifications", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  notificationId: t.text().notNull().unique(),
  name: t.text().notNull(),
  description: t.text().notNull(),
  imageUrl: t.text(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${notifications.updateCounter} + 1`),
});

export const couponCodes = t.pgTable("couponCodes", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  code: t.text().notNull(),
  discountType: discountTypeEnum().notNull(),
  discountAmount: t.doublePrecision().notNull(),
  minimunPurchaseAmount: t.doublePrecision().notNull(),
  endDate: t.timestamp().notNull(),
  status: couponStatusEnum().default("active").notNull(),

  applicableCategoryId: t.text().references(() => categories.id),
  applicableSubCategoryId: t.text().references(() => subCategories.id),
  applicableProductId: t.text().references(() => products.id),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${couponCodes.updateCounter} + 1`),
});

export const orderTotals = t.pgTable("orderTotals", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  subtotal: t.doublePrecision(),
  discount: t.doublePrecision(),
  total: t.doublePrecision(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${orderTotals.updateCounter} + 1`),
});

export const orders = t.pgTable("orders", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  userId: t
    .text()
    .notNull()
    .references(() => users.id),
  orderTotalId: t.text().references(() => orderTotals.id),
  shippingAddressId: t.text().references(() => addresses.id),

  date: t.timestamp().defaultNow().notNull(),
  status: orderSatusEnum().default("pending"),
  totalPrice: t.doublePrecision().notNull(),
  paymentMethod: paymentMethodEnum(),
  trackingUrl: t.text(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${orders.updateCounter} + 1`),
});

export const orderItems = t.pgTable("orderItems", {
  id: t
    .text()
    .primaryKey()
    .$defaultFn(() => uuidv4()),

  orderId: t
    .text()
    .notNull()
    .references(() => orders.id),
  productId: t
    .text()
    .notNull()
    .references(() => products.id),
  variantId: t.text().references(() => variants.id),

  quantity: t.integer().notNull(),
  price: t.doublePrecision().notNull(),

  ...timestamps,
  updateCounter: t
    .integer()
    .default(sql`1`)
    .$onUpdateFn((): SQL => sql`${orderItems.updateCounter} + 1`),
});

// ============== Relations ===================================
export const usersRelations = relations(users, ({ one, many }) => ({
  token: one(tokens),
  addresses: many(addresses),
  orders: many(orders),
  apiKeys: many(apikeys),
}));

export const tokensRelations = relations(tokens, ({ one }) => ({
  user: one(users, {
    fields: [tokens.userId],
    references: [users.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  orders: many(orders),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  subCategories: many(subCategories),
  products: many(products),
  couponCodes: many(couponCodes),
}));

export const subCategoriesRelations = relations(
  subCategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subCategories.categoryId],
      references: [categories.id],
    }),
    brands: many(brands),
    products: many(products),
    couponCodes: many(couponCodes),
  })
);

export const brandsRelations = relations(brands, ({ one, many }) => ({
  subCategory: one(subCategories, {
    fields: [brands.subCategoryId],
    references: [subCategories.id],
  }),
  products: many(products),
}));

export const variantTypesRelations = relations(variantTypes, ({ many }) => ({
  variants: many(variants),
  products: many(products),
}));

export const variantsRelations = relations(variants, ({ one, many }) => ({
  variantType: one(variantTypes, {
    fields: [variants.variantTypeId],
    references: [variantTypes.id],
  }),
  products: many(products),
  // orderItems: many(orderItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  subCategory: one(subCategories, {
    fields: [products.subCategoryId],
    references: [subCategories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variantType: one(variantTypes, {
    fields: [products.variantTypeId],
    references: [variantTypes.id],
  }),
  variant: one(variants, {
    fields: [products.variantId],
    references: [variants.id],
  }),
  images: many(images),
  couponCodes: many(couponCodes),
  // orderItems: many(orderItems),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.productId],
    references: [products.id],
  }),
}));

export const couponCodesRelations = relations(couponCodes, ({ one }) => ({
  category: one(categories, {
    fields: [couponCodes.applicableCategoryId],
    references: [categories.id],
  }),
  subCategory: one(subCategories, {
    fields: [couponCodes.applicableSubCategoryId],
    references: [subCategories.id],
  }),
  product: one(products, {
    fields: [couponCodes.applicableProductId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
  orderTotal: one(orderTotals, {
    fields: [orders.orderTotalId],
    references: [orderTotals.id],
  }),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(variants, {
    fields: [orderItems.variantId],
    references: [variants.id],
  }),
}));

export const orderTotalsRelations = relations(orderTotals, ({ one }) => ({
  order: one(orders),
}));

export const apiKeysRelations = relations(apikeys, ({ one }) => ({
  user: one(users, {
    fields: [apikeys.userId],
    references: [users.id],
  }),
}));
