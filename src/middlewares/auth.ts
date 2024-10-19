import type { Context, Next } from "hono";

import { and, eq } from "drizzle-orm";
import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types";

import { db } from "@/db";
import { tokens } from "@/db/schema";
import env from "@/env";
import { unauthorizedResponseMessage } from "@/lib/constants";
import { attachCookiesToResponse, isValid } from "@/lib/jwt";

export async function isAuth(c: Context<AppBindings>, next: Next) {
  const signedCookie = await getSignedCookie(c, env.COOKIE_SECRET);

  if (signedCookie.accessToken) {
    const payload = await isValid(signedCookie.accessToken as string);
    const user = {
      id: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    };
    c.set("user", user);
    return await next();
  }

  if (!signedCookie.refreshToken) {
    return c.json(unauthorizedResponseMessage, HttpStatusCodes.UNAUTHORIZED);
  }

  const payload = await isValid(signedCookie.refreshToken as string);
  const user = {
    id: payload.userId as string,
    name: payload.name as string,
    email: payload.email as string,
    role: payload.role as string,
  };
  const refreshToken = payload.refreshToken as string;
  const existingToken = await db.query.tokens.findFirst({
    where: and(
      eq(tokens.userId, user.id),
      eq(tokens.refreshToken, refreshToken)
    ),
  });

  if (!existingToken || !existingToken?.isValid) {
    return c.json(unauthorizedResponseMessage, HttpStatusCodes.UNAUTHORIZED);
  }

  attachCookiesToResponse(c, user, refreshToken);

  c.set("user", user);

  await next();
}

export function authorizePermissions(...roles: string[]) {
  return createMiddleware<AppBindings>(async (c, next) => {
    if (!roles.includes(c.get("user").role)) {
      return c.json(
        { message: "Unauthorized to make this operations." },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    await next();
  });
}
