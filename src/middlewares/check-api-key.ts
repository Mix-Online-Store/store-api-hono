import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types";

import { db } from "@/db";
import { apikeys } from "@/db/schema";
import { unauthorizedResponseMessage } from "@/lib/constants";

export const checkApiKey = createMiddleware<AppBindings>(async (c, next) => {
  const apiKeyHeader = c.req.header("x-api-key");
  c.var.logger.debug({ apiKeyHeader });

  if (apiKeyHeader) {
    const result = await db.query.apikeys.findFirst({
      where: eq(apikeys.accessKey, apiKeyHeader),
    });
    if (!result) {
      return c.json(unauthorizedResponseMessage, HttpStatusCodes.UNAUTHORIZED);
    }

    await next();
  } else {
    const { apiKey } = c.req.query();
    c.var.logger.debug({ apiKey });

    const result = await db.query.apikeys.findFirst({
      where: eq(apikeys.accessKey, apiKey),
    });
    if (!result) {
      return c.json(unauthorizedResponseMessage, HttpStatusCodes.UNAUTHORIZED);
    }
    await next();
  }
});
