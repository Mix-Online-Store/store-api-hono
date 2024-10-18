import type { Context } from "hono";

import { setSignedCookie } from "hono/cookie";
import { sign, verify } from "hono/jwt";

import env from "@/env";

import type { AppBindings } from "./types";

const oneDay = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
const longerExpire = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;

interface AuthJWTPayload {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  refreshToken?: string;
}

export async function createAccessToken({ user }: AuthJWTPayload) {
  const token = await sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: oneDay,
    },
    env.JWT_SECRET
  );
  return token;
}

export async function createRefreshToken({
  user,
  refreshToken,
}: AuthJWTPayload) {
  const token = await sign(
    {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      refreshToken,
      exp: longerExpire,
    },
    env.JWT_SECRET
  );
  return token;
}

export const isValid = (token: string) => verify(token, env.JWT_SECRET);

export async function attachCookiesToResponse(
  c: Context<AppBindings>,
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  },
  refreshToken: string
) {
  c.var.logger.debug("call attachCookiesToResponse()");

  const accessTokenJWT = await createAccessToken({ user });
  const refreshTokenJWT = await createRefreshToken({ user, refreshToken });

  await setSignedCookie(c, "accessToken", accessTokenJWT, env.COOKIE_SECRET, {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: new Date(Date.now() + oneDay),
    sameSite: "Strict",
    maxAge: 1000,
  });

  await setSignedCookie(c, "refreshToken", refreshTokenJWT, env.COOKIE_SECRET, {
    path: "/",
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    expires: new Date(Date.now() + longerExpire),
    sameSite: "Strict",
    maxAge: 1000,
  });

  return { accessTokenJWT, refreshTokenJWT };
}
