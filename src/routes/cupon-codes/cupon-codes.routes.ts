import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentOneOf from "stoker/openapi/helpers/json-content-one-of";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import {
  notFoundResponseSchema,
  unauthorizedResponseSchema,
} from "@/lib/constants";
import { CategoryIdParamsSchema } from "@/lib/schemas/categories";
import createResponseSchema, {
  createPaginatedResponseSchema,
} from "@/lib/schemas/create-response-schema";
import {
  checkCouponCodeSchema,
  insertCouponCodeSchema,
  selectCouponCodeSchema,
  updateCouponCodeSchema,
} from "@/lib/schemas/cupon-codes";
import FilterQuerySchema from "@/lib/schemas/filter-query";
import { ProductIdParamsSchema } from "@/lib/schemas/images";
import { SubCategoryIdParamsSchema } from "@/lib/schemas/sub-categories";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["Cupon Codes"];

export const list = createRoute({
  tags,
  path: "/cupon-codes",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    query: FilterQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createPaginatedResponseSchema(selectCouponCodeSchema),
      "The list of cupon codes."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponseSchema,
      "Unauthorized request."
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/cupon-codes",
  method: "post",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    body: jsonContentRequired(
      insertCouponCodeSchema,
      "The cupon code to create."
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createResponseSchema(selectCouponCodeSchema),
      "The created cupon code."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertCouponCodeSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponseSchema,
      "Unauthorized request."
    ),
  },
});

export const getById = createRoute({
  tags,
  path: "/cupon-codes/{id}",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectCouponCodeSchema),
      "The requested cupon code."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Cupon code not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponseSchema,
      "Unauthorized request."
    ),
  },
});

export const update = createRoute({
  tags,
  path: "/cupon-codes/{id}",
  method: "patch",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(
      updateCouponCodeSchema,
      "The cupon code to update."
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectCouponCodeSchema),
      "The updated cupon code."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Cupon code not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(updateCouponCodeSchema),
        createErrorSchema(IdUUIDParamsSchema),
      ],
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponseSchema,
      "Unauthorized request."
    ),
  },
});

export const remove = createRoute({
  tags,
  path: "/cupon-codes/{id}",
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(),
      "Cupon code deleted."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Cupon code not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedResponseSchema,
      "Unauthorized request."
    ),
  },
});

export const getByProductId = createRoute({
  tags,
  path: "/cupon-codes/product/{productId}",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: ProductIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.array(selectCouponCodeSchema)),
      "The list of available cupon codes by product."
    ),
  },
});

export const getByCategoryId = createRoute({
  tags,
  path: "/cupon-codes/category/{categoryId}",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: CategoryIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.array(selectCouponCodeSchema)),
      "The list of available cupon codes by category."
    ),
  },
});

export const getBySubCategoryId = createRoute({
  tags,
  path: "/cupon-codes/sub-category/{subCategoryId}",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: SubCategoryIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.array(selectCouponCodeSchema)),
      "The list of available cupon codes by sub-category."
    ),
  },
});

export const checkCoupon = createRoute({
  tags,
  path: "/cupon-codes/check",
  method: "post",
  request: {
    body: jsonContentRequired(
      checkCouponCodeSchema,
      "Necessary data to check cupon."
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectCouponCodeSchema),
      "Status of coupon whether applicable or not for the provided products."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Cupon code not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export type CouponCodeListRoute = typeof list;
export type CouponCodeCreateRoute = typeof create;
export type CouponCodeByIdRoute = typeof getById;
export type CouponCodeUpdateRoute = typeof update;
export type CouponCodeRemoveRoute = typeof remove;
export type CouponCodeByProductIdRoute = typeof getByProductId;
export type CouponCodeByCategoryIdRoute = typeof getByCategoryId;
export type CouponCodeBySubCategoryIdRoute = typeof getBySubCategoryId;
export type CouponCodeCheckRoute = typeof checkCoupon;
