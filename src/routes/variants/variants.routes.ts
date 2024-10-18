import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentOneOf from "stoker/openapi/helpers/json-content-one-of";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import { notFoundResponseSchema, unauthorizedSchema } from "@/lib/constants";
import createResponseSchema from "@/lib/schemas/create-response-schema";
import {
  insertVariantSchema,
  selectVariantSchema,
  updateVariantSchema,
} from "@/lib/schemas/variants";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["Variants"];

export const list = createRoute({
  tags,
  path: "/variants",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.array(selectVariantSchema)),
      "The list of variants."
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/variants",
  method: "post",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    body: jsonContentRequired(insertVariantSchema, "The variant to create."),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createResponseSchema(selectVariantSchema),
      "The created variant."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertVariantSchema),
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
  path: "/variants/{id}",
  method: "get",
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectVariantSchema),
      "The requested variant."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Variant not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export const update = createRoute({
  tags,
  path: "/variants/{id}",
  method: "patch",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(updateVariantSchema, "The variant to update."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectVariantSchema),
      "The updated variant."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Variant not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(updateVariantSchema),
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
  path: "/variants/{id}",
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.object({})),
      "Variant deleted."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Variant not found."
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

export type VariantListRoute = typeof list;
export type VariantCreateRoute = typeof create;
export type VariantByIdRoute = typeof getById;
export type VariantUpdateRoute = typeof update;
export type VariantRemoveRoute = typeof remove;
