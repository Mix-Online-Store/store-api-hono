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
import {
  insertCategorySchema,
  selectCategorySchema,
  updateCategorySchema,
} from "@/lib/schemas/categories";
import createResponseSchema, {
  createPaginatedResponseSchema,
} from "@/lib/schemas/create-response-schema";
import FilterQuerySchema from "@/lib/schemas/filter-query";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["Categories"];

export const list = createRoute({
  tags,
  path: "/categories",
  method: "get",
  request: {
    query: FilterQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createPaginatedResponseSchema(selectCategorySchema),
      "The list of categories."
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/categories",
  method: "post",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    body: jsonContentRequired(insertCategorySchema, "The category to create."),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createResponseSchema(selectCategorySchema),
      "The created category."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertCategorySchema),
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
  path: "/categories/{id}",
  method: "get",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectCategorySchema),
      "The requested category by id."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Category not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export const update = createRoute({
  tags,
  path: "/categories/{id}",
  method: "patch",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(updateCategorySchema, "The category to update."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectCategorySchema),
      "The updated category."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Category not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(updateCategorySchema),
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
  path: "/categories/{id}",
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(),
      "Category deleted."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Category not found."
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

export type CategoryListRoute = typeof list;
export type CategoryCreateRoute = typeof create;
export type CategoryByIdRoute = typeof getById;
export type CategoryUpdateRoute = typeof update;
export type CategoryRemoveRoute = typeof remove;
