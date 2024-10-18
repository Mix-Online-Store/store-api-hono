import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentOneOf from "stoker/openapi/helpers/json-content-one-of";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema, IdUUIDParamsSchema } from "stoker/openapi/schemas";

import { notFoundResponseSchema, unauthorizedSchema } from "@/lib/constants";
import createResponseSchema from "@/lib/schemas/create-response-schema";
import {
  insertImageSchema,
  ProductIdParamsSchema,
  selectImageSchema,
  updateImageSchema,
} from "@/lib/schemas/images";
import { authorizePermissions, isAuth } from "@/middlewares/auth";

const tags = ["Images"];

export const list = createRoute({
  tags,
  path: "/images",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.array(selectImageSchema)),
      "The list of images."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized request."
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/images",
  method: "post",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    body: jsonContentRequired(insertImageSchema, "The image to create."),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createResponseSchema(selectImageSchema),
      "The created image."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertImageSchema),
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
  path: "/images/{id}",
  method: "get",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectImageSchema),
      "The requested image."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Image not found."
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

export const getByProductId = createRoute({
  tags,
  path: "/images/product/{productId}",
  method: "get",
  request: {
    params: ProductIdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.array(selectImageSchema)),
      "The requested images."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdUUIDParamsSchema),
      "The validation error(s)."
    ),
  },
});

export const update = createRoute({
  tags,
  path: "/images/{id}",
  method: "patch",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
    body: jsonContentRequired(updateImageSchema, "The image to update."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(selectImageSchema),
      "The updated image."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Image not found."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
      [
        createErrorSchema(updateImageSchema),
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
  path: "/images/{id}",
  method: "delete",
  middleware: [isAuth, authorizePermissions("admin")],
  request: {
    params: IdUUIDParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(z.object({})),
      "Image deleted."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "Image not found."
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

export type ImageListRoute = typeof list;
export type ImageCreateRoute = typeof create;
export type ImageByIdRoute = typeof getById;
export type ImageUpdateRoute = typeof update;
export type ImageRemoveRoute = typeof remove;
export type ImageByProductRemoveRoute = typeof getByProductId;
