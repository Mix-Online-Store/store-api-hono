import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types";

import env from "@/env";
import { unauthorizedResponseMessage } from "@/lib/constants";

export const jwtAuth = createMiddleware<AppBindings>(async (c, next) => {
  const jwtMiddleware = jwt({
    secret: env.JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

export const isAdmin = createMiddleware<AppBindings>(async (c, next) => {
  const { role } = c.var.jwtPayload;
  c.var.logger.debug({ role });

  if (role !== "admin") {
    return c.json(unauthorizedResponseMessage, HttpStatusCodes.UNAUTHORIZED);
  }

  return next();
});
