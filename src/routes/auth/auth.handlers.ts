import { getConnInfo } from "@hono/node-server/conninfo";
import bcrypt from "bcrypt";
import { addMonths } from "date-fns";
import { eq } from "drizzle-orm";
import { deleteCookie } from "hono/cookie";
import crypto from "node:crypto";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { apikeys, tokens, users } from "@/db/schema";
import env from "@/env";
import { notFoundMessage, unauthorizedMessage } from "@/lib/constants";
import { createHash } from "@/lib/create-hash";
import { attachCookiesToResponse } from "@/lib/jwt";
import { sendPasswordResetMail } from "@/lib/mail/send-password-mail";
import { sendVerificationMail } from "@/lib/mail/send-verification-mail";

import type {
  ForgotPasswordRoute,
  LoginRoute,
  LogoutRoute,
  RegisterRoute,
  ResetPasswordRoute,
  VerifyEmailRoute,
} from "./auth.routes";

// const oneDay = 1000 * 60 * 60 * 24; // 1d
// const longerExpire = 1000 * 60 * 60 * 24 * 30; // 30d

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const user = c.req.valid("json");
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const [createdUser] = await db
    .insert(users)
    .values({ ...user, verificationToken })
    .returning();
  c.var.logger.debug({ createdUser });

  const expired = addMonths(new Date(), 36);
  c.var.logger.debug({ expired });

  const accessKey = crypto.randomBytes(70).toString("hex");
  await db.insert(apikeys).values({
    userId: createdUser.id,
    accessKey,
    expired,
  });

  await sendVerificationMail({
    name: createdUser.name,
    email: createdUser.email,
    verificationToken: createdUser.verificationToken!,
    origin: env.FRONT_BASE_URL,
  });

  return c.json(
    {
      message: "Success! Please check your email to verify account.",
    },
    HttpStatusCodes.CREATED
  );
};

export const verifyEmail: AppRouteHandler<VerifyEmailRoute> = async (c) => {
  const { token, email } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });
  if (!user) {
    return c.json(notFoundMessage, HttpStatusCodes.NOT_FOUND);
  }

  if (user.verificationToken !== token) {
    return c.json(unauthorizedMessage, HttpStatusCodes.UNAUTHORIZED);
  }

  user.isVerified = true;
  user.verified = new Date();
  user.verificationToken = "";

  const [updatedUser] = await db
    .update(users)
    .set({ ...user })
    .where(eq(users.id, user.id))
    .returning();
  c.var.logger.debug({ updatedUser });

  return c.json(
    {
      message: "Email verified.",
    },
    HttpStatusCodes.OK
  );
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });
  c.var.logger.debug({ user });

  if (!user) {
    return c.json(
      { message: "Invalid credentials" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return c.json(
      { message: "Invalid credentials." },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!user.isVerified) {
    return c.json(
      { message: "Please verify your email" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const tokenUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  let refreshToken = "";
  const existingToken = await db.query.tokens.findFirst({
    where(fields, operators) {
      return operators.eq(fields.userId, user.id);
    },
  });
  c.var.logger.debug({ existingToken });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      return c.json(
        { message: "Invalid credentials." },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    refreshToken = existingToken.refreshToken;
    const { accessTokenJWT, refreshTokenJWT } = await attachCookiesToResponse(
      c,
      tokenUser,
      refreshToken
    );
    c.var.logger.debug({ accessTokenJWT, refreshTokenJWT });

    return c.json(
      {
        ...tokenUser,
        accessToken: accessTokenJWT,
        refreshToken: refreshTokenJWT,
      },
      HttpStatusCodes.OK
    );
  }

  refreshToken = crypto.randomBytes(40).toString("hex");

  const userAgent = c.req.header("User-Agent");
  const info = getConnInfo(c);
  c.var.logger.debug({ info });
  const ip = info.remote.address;

  await db.insert(tokens).values({
    refreshToken,
    ip,
    userId: user.id,
    userAgent,
  });

  const { accessTokenJWT, refreshTokenJWT } = await attachCookiesToResponse(
    c,
    tokenUser,
    refreshToken
  );
  c.var.logger.debug({ accessTokenJWT, refreshTokenJWT });

  return c.json(
    {
      ...tokenUser,
      accessToken: accessTokenJWT,
      refreshToken: refreshTokenJWT,
    },
    HttpStatusCodes.OK
  );
};

export const logout: AppRouteHandler<LogoutRoute> = async (c) => {
  const { userId } = c.var.jwtPayload;
  c.var.logger.debug({ userId });
  const result = await db.delete(tokens).where(eq(tokens.userId, userId));

  if (result.rowCount === 0) {
    return c.json(notFoundMessage, HttpStatusCodes.UNAUTHORIZED);
  }

  deleteCookie(c, "accessToken", {
    path: "/",
    secure: env.NODE_ENV === "production",
  });
  deleteCookie(c, "refreshToken", {
    path: "/",
    secure: env.NODE_ENV === "production",
  });

  return c.json(
    {
      message: "User logged out",
    },
    HttpStatusCodes.OK
  );
};

export const forgotPassword: AppRouteHandler<ForgotPasswordRoute> = async (
  c
) => {
  const { email } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });
  if (!user) {
    return c.json(notFoundMessage, HttpStatusCodes.NOT_FOUND);
  }

  const passwordToken = crypto.randomBytes(70).toString("hex");
  c.var.logger.debug({ passwordToken });

  await sendPasswordResetMail({
    name: user.name,
    email: user.email,
    token: passwordToken,
    origin: env.FRONT_BASE_URL,
  });

  const tenMinutes = 1000 * 60 * 10; // 10m
  const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

  await db.update(users).set({
    passwordToken: createHash(passwordToken),
    passwordTokenExpirationDate,
  });

  return c.json(
    {
      message: "Please check your mail box for restting password link.",
    },
    HttpStatusCodes.OK
  );
};

export const resetPassword: AppRouteHandler<ResetPasswordRoute> = async (c) => {
  const { token, email, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    },
  });
  if (!user) {
    return c.json(notFoundMessage, HttpStatusCodes.NOT_FOUND);
  }

  const currentDate = new Date();
  const isPasswordTokenMatch = user.passwordToken === createHash(token);
  c.var.logger.debug({ isPasswordTokenMatch });

  if (
    isPasswordTokenMatch &&
    user.passwordTokenExpirationDate &&
    user.passwordTokenExpirationDate > currentDate
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.update(users).set({ password: hashedPassword });

    return c.json(
      {
        message: "Password reset successful.",
      },
      HttpStatusCodes.OK
    );
  } else {
    return c.json(
      {
        message: "May be your password reset token expired or invalid",
      },
      HttpStatusCodes.BAD_REQUEST
    );
  }
};
