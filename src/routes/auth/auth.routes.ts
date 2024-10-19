import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import { createErrorSchema } from "stoker/openapi/schemas";

import { notFoundResponseSchema } from "@/lib/constants";
import createResponseSchema from "@/lib/schemas/create-response-schema";
import {
  authResponseSchema,
  forgotPasswordSchema,
  insertUserSchema,
  loginSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/lib/types";
import { jwtAuth } from "@/middlewares/jwt-auth";

const tags = ["Auth"];
const basePath = "/auth";

export const register = createRoute({
  tags,
  path: `${basePath}/register`,
  method: "post",
  request: {
    body: jsonContentRequired(insertUserSchema, "The user to create."),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      createResponseSchema(
        null,
        "Success! Please check your email to verify account."
      ),
      "The registered user."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUserSchema),
      "The validation error(s)."
    ),
  },
});

export const verifyEmail = createRoute({
  tags,
  path: `${basePath}/verify-email`,
  method: "post",
  request: {
    body: jsonContentRequired(verifyEmailSchema, "Token and email to verify"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(null, "Email verified."),
      "The email verified success"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(verifyEmailSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createResponseSchema(null, "Unauthorized"),
      "Unauthorized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "User not found"
    ),
  },
});

export const login = createRoute({
  tags,
  path: `${basePath}/login`,
  method: "post",
  request: {
    body: jsonContentRequired(loginSchema, "The data to login user."),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(authResponseSchema),
      "The user login success."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createResponseSchema(null, "Unauthorized"),
      "Unauthorized request"
    ),
  },
});

export const logout = createRoute({
  tags,
  path: `${basePath}/logout`,
  method: "delete",
  middleware: jwtAuth,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(null, "User logout success"),
      "The user login success."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createResponseSchema(null, "Unable to logout"),
      "Unauthorized request"
    ),
  },
});

export const forgotPassword = createRoute({
  tags,
  path: `${basePath}/forgot-password`,
  method: "post",
  request: {
    body: jsonContentRequired(forgotPasswordSchema, "Require data for request"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(null, "Forgot password request success."),
      "The request success"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(forgotPasswordSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "The user not found"
    ),
  },
});

export const resetPassword = createRoute({
  tags,
  path: `${basePath}/reset-password`,
  method: "post",
  request: {
    body: jsonContentRequired(resetPasswordSchema, "Require data for request"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createResponseSchema(null, "Reset password request success."),
      "The reset password request success"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(resetPasswordSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundResponseSchema,
      "The user not found"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createResponseSchema(null, "Unable to reset password."),
      "Bad request"
    ),
  },
});

export type RegisterRoute = typeof register;
export type VerifyEmailRoute = typeof verifyEmail;
export type LoginRoute = typeof login;
export type LogoutRoute = typeof logout;
export type ForgotPasswordRoute = typeof forgotPassword;
export type ResetPasswordRoute = typeof resetPassword;
