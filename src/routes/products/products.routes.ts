import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentOneOf from "stoker/openapi/helpers/json-content-one-of";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import {
  notFoundResponseSchema,
  unauthorizedResponseSchema,
} from "@/lib/constants";
import createResponseSchema, {
  createPaginatedResponseSchema,
} from "@/lib/schemas/create-response-schema";
import FilterQuerySchema from "@/lib/schemas/filter-query";
import {
  insertProductSchema,
  selectProductSchema,
  updateProductSchema,
} from "@/lib/schemas/products";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["Products"];

export const list = createRoute({
  tags,
  path: "/products",
  method: "get",
  request: {
    query: FilterQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createPaginatedResponseSchema(selectProductSchema),
      "The list of products."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(FilterQuerySchema),
      "The validation error(s)."
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/products",
  method: "post",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    body: jsonContentRequired(insertProductSchema, "The product to create."),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createResponseSchema(selectProductSchema),
      "The created product."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertProductSchema),
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
  path: "/products/{id}",
  method: "get",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectProductSchema),
      "The requested product by id."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Product not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export const update = createRoute({
  tags,
  path: "/products/{id}",
  method: "patch",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(updateProductSchema, "The product to update."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectProductSchema),
      "The updated product."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Product not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(updateProductSchema),
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
  path: "/products/{id}",
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(),
      "Product deleted."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Product not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export type ProductListRoute = typeof list;
export type ProductCreateRoute = typeof create;
export type ProductByIdRoute = typeof getById;
export type ProductUpdateRoute = typeof update;
export type ProductRemoveRoute = typeof remove;
