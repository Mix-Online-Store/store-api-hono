import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import jsonContent from "stoker/openapi/helpers/json-content";
import jsonContentRequired from "stoker/openapi/helpers/json-content-required";
import {
  createErrorSchema,
  createMessageObjectSchema,
} from "stoker/openapi/schemas";

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
      createMessageObjectSchema(
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
      createMessageObjectSchema("Email verified."),
      "The email verified success"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(verifyEmailSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
      "Unauthorized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Not found"),
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
      authResponseSchema,
      "The user login success."
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unauthorized"),
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
      createMessageObjectSchema("User logout success"),
      "The user login success."
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createMessageObjectSchema("Unable to logout"),
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
      createMessageObjectSchema("Forgot password request success."),
      "The request success"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(forgotPasswordSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Unable to request forgot password."),
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
      createMessageObjectSchema("Reset password request success."),
      "The reset password request success"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(resetPasswordSchema),
      "The validation error(s)."
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      createMessageObjectSchema("Unable to reset password."),
      "The user not found"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      createMessageObjectSchema("Unable to reset password."),
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
