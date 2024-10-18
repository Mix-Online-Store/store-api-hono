import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentOneOf from "stoker/openapi/helpers/json-content-one-of";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import { notFoundResponseSchema, unauthorizedSchema } from "@/lib/constants";
import createResponseSchema, {
  createPaginatedResponseSchema,
} from "@/lib/schemas/create-response-schema";
import FilterQuerySchema from "@/lib/schemas/filter-query";
import {
  insertSubCategorySchema,
  selectSubCategorySchema,
  updateSubCategorySchema,
} from "@/lib/schemas/sub-categories";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["SubCategories"];

export const list = createRoute({
  tags,
  path: "/subcategories",
  method: "get",
  request: {
    query: FilterQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createPaginatedResponseSchema(z.array(selectSubCategorySchema)),
      "The list of sub-categories."
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/subcategories",
  method: "post",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    body: jsonContentRequired(
      insertSubCategorySchema,
      "The category to create."
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createResponseSchema(selectSubCategorySchema),
      "The created sub-category."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertSubCategorySchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized request."
    ),
  },
});

export const getById = createRoute({
  tags,
  path: "/subcategories/{id}",
  method: "get",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectSubCategorySchema),
      "The requested sub-category by id."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Sub-category not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export const update = createRoute({
  tags,
  path: "/subcategories/{id}",
  method: "patch",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(
      updateSubCategorySchema,
      "The category to update."
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectSubCategorySchema),
      "The updated sub-category."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Sub-category not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(updateSubCategorySchema),
        createErrorSchema(IdUUIDParamsSchema),
      ],
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized request."
    ),
  },
});

export const remove = createRoute({
  tags,
  path: "/subcategories/{id}",
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: jsonContent(
      createResponseSchema(z.object({})),
      "Sub-category deleted."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Sub-Category not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized request."
    ),
  },
});

export type SubCategoryListRoute = typeof list;
export type SubCategoryCreateRoute = typeof create;
export type SubCategoryByIdRoute = typeof getById;
export type SubCategoryUpdateRoute = typeof update;
export type SubCategoryRemoveRoute = typeof remove;
