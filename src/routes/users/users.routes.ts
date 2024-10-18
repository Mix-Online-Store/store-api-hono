import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentOneOf from "stoker/openapi/helpers/json-content-one-of";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema, unauthorizedSchema } from "@/lib/constants";
import createResponseSchema, {
  createPaginatedResponseSchema,
} from "@/lib/schemas/create-response-schema";
import FilterQuerySchema from "@/lib/schemas/filter-query";
import {
  adminUpdateUserSchema,
  selectProfileSchema,
  selectUsersSchema,
  updateUserSchema,
} from "@/lib/types";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["Users"];
const basePath = "/users";

export const list = createRoute({
  tags,
  path: basePath,
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    query: FilterQuerySchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createPaginatedResponseSchema(z.array(selectUsersSchema)),
      "The list users."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized."
    ),
  },
});

export const getById = createRoute({
  tags,
  path: `${basePath}/{id}`,
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectUsersSchema),
      "The requestest user."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found."),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export const me = createRoute({
  tags,
  path: `${basePath}/me`,
  method: "get",
  middleware: [isAuth],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectProfileSchema),
      "The requestest user."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found."),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized request."
    ),
  },
});

export const update = createRoute({
  tags,
  path: `${basePath}/{id}`,
  method: "patch",
  middleware: [isAuth],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(updateUserSchema, "The user to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectProfileSchema),
      "The requestest user."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found."),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(IdUUIDParamsSchema),
        createErrorSchema(updateUserSchema),
      ],
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized request."
    ),
  },
});

export const adminUpdate = createRoute({
  tags,
  path: `${basePath}/{id}/admin`,
  method: "patch",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(adminUpdateUserSchema, "The user to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectProfileSchema),
      "The requestest user."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found."),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(IdUUIDParamsSchema),
        createErrorSchema(adminUpdateUserSchema),
      ],
      "The validation error(s)."
    ),
  },
});

export const remove = createRoute({
  tags,
  path: `${basePath}/{id}`,
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: {
      description: "User deleted.",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "User not found."),
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

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type MeRoute = typeof me;
export type UpdateRoute = typeof update;
export type AdminUpdateRoute = typeof adminUpdate;
export type RemoveUserRoute = typeof remove;
