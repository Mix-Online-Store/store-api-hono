import { eq } from "drizzle-orm";
import { createMiddleware } from "hono/factory";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppBindings } from "@/lib/types";

import { db } from "@/db";
import { apikeys } from "@/db/schema";
import { unauthorizedMessage } from "@/lib/constants";

export const checkApiKey = createMiddleware<AppBindings>(async (c, next) => {
  const { apiKey } = c.req.query();
  c.var.logger.debug({ apiKey });

  const result = await db.query.apikeys.findFirst({
    where: eq(apikeys.accessKey, apiKey),
  });
  c.var.logger.debug({ result });
  if (!result) {
    return c.json(unauthorizedMessage, HttpStatusCodes.UNAUTHORIZED);
  }

  // currenty, no need to check expired
  //   const currentDate = new Date();
  //   if (result.expired < currentDate) {
  //     return c.json(
  //       { message: "Your api key has been expired." },
  //       HttpStatusCodes.BAD_REQUEST
  //     );
  //   }

  await next();
});
