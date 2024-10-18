import configOpenApi from "@/lib/config-openapi";
import createApp from "@/lib/create-app";
import addressesRoute from "@/routes/addresses/addresses.index";
import authRoute from "@/routes/auth/auth.index";
import brandsRoute from "@/routes/brands/brands.index";
import categoriesRoute from "@/routes/categories/categories.index";
import cuponCodesRoute from "@/routes/cupon-codes/cupon-codes.index";
import imagesRoute from "@/routes/images/images.index";
import indexRoute from "@/routes/index.route";
import notificationsRoute from "@/routes/notifications/notifications.index";
import ordersRoute from "@/routes/orders/orders.index";
import postersRoute from "@/routes/posters/posters.index";
import productsRoute from "@/routes/products/products.index";
import subCategoriesRoute from "@/routes/sub-categories/sub-categories.index";
import usersRoute from "@/routes/users/users.index";
import variantTypesRoute from "@/routes/variant-types/variant-types.index";
import variantsRoute from "@/routes/variants/variants.index";

const app = createApp();

const routes = [
  indexRoute,
  authRoute,
  usersRoute,
  addressesRoute,
  categoriesRoute,
  subCategoriesRoute,
  brandsRoute,
  variantTypesRoute,
  variantsRoute,
  productsRoute,
  postersRoute,
  notificationsRoute,
  imagesRoute,
  cuponCodesRoute,
  ordersRoute,
] as const;

configOpenApi(app);

routes.forEach((route) => {
  app.route("/", route);
});

/**
 * For client side code.
 *
 * Example:
 * ```js
 * import { hc } from "hono/client";
 *
 * import type { AppType } from "@/app";
 *
 * const client = hc<AppType>("http://localhost:9999");
 * ```
 */
export type AppType = (typeof routes)[number];

export default app;
