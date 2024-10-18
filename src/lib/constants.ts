import { z } from "@hono/zod-openapi";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import createResponseSchema from "./schemas/create-response-schema";

export const notFoundSchema = createMessageObjectSchema(
  HttpStatusPhrases.NOT_FOUND
);
export const notFoundMessage = { message: HttpStatusPhrases.NOT_FOUND };

export const unauthorizedSchema = createMessageObjectSchema(
  HttpStatusPhrases.UNAUTHORIZED
);
export const unauthorizedMessage = { message: HttpStatusPhrases.UNAUTHORIZED };

export const notFoundResponseSchema = createResponseSchema(
  z.object({}),
  HttpStatusPhrases.NOT_FOUND
);
export const unauthorizedResponseSchema = createResponseSchema(
  null,
  HttpStatusPhrases.UNAUTHORIZED
);

export const badRequestResponseSchema = createResponseSchema(
  z.object({}),
  HttpStatusPhrases.BAD_REQUEST
);

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  EXPECTED_UUID: "Invalid Id",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};
