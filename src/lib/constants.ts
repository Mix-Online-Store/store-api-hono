import * as HttpStatusPhrases from "stoker/http-status-phrases";

import createResponseSchema from "./schemas/create-response-schema";

// export const notFoundSchema = createMessageObjectSchema(
//   HttpStatusPhrases.NOT_FOUND
// );
// export const notFoundMessage = { message: HttpStatusPhrases.NOT_FOUND };

// export const unauthorizedSchema = createMessageObjectSchema(
//   HttpStatusPhrases.UNAUTHORIZED
// );
// export const unauthorizedMessage = { message: HttpStatusPhrases.UNAUTHORIZED };

// ======= Response ==============
export function successResponseMessage(message: string): {
  success: boolean;
  message: string;
} {
  return {
    success: true,
    message,
  };
}

export const notFoundResponseSchema = createResponseSchema(
  null,
  HttpStatusPhrases.NOT_FOUND
);
export const notFoundResponseMessage = {
  success: false,
  message: HttpStatusPhrases.NOT_FOUND,
};

export const unauthorizedResponseSchema = createResponseSchema(
  null,
  HttpStatusPhrases.UNAUTHORIZED
);
export const unauthorizedResponseMessage = {
  success: false,
  message: HttpStatusPhrases.UNAUTHORIZED,
};

export const badRequestResponseSchema = createResponseSchema(
  null,
  HttpStatusPhrases.BAD_REQUEST
);
export const badRequestResponseMessage = {
  success: false,
  message: HttpStatusPhrases.BAD_REQUEST,
};

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  EXPECTED_UUID: "Invalid Id",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};
