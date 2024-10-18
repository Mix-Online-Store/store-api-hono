import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { posters } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";

import type {
  PosterByIdRoute,
  PosterCreateRoute,
  PosterListRoute,
  PosterRemoveRoute,
  PosterUpdateRoute,
} from "./posters.routes";

export const list: AppRouteHandler<PosterListRoute> = async (c) => {
  const posters = await db.query.posters.findMany();
  return c.json({
    success: true,
    message: "Posters retrieved successful.",
    data: posters,
  });
};

export const create: AppRouteHandler<PosterCreateRoute> = async (c) => {
  const poster = c.req.valid("json");

  const [createdPoster] = await db.insert(posters).values(poster).returning();

  return c.json(
    {
      success: true,
      message: "Poster created successful.",
      data: createdPoster,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<PosterByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const poster = await db.query.posters.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!poster) {
    return c.json(
      {
        success: false,
        message: notFoundMessage.message,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      success: true,
      message: "Get poster success.",
      data: poster,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<PosterUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [poster] = await db
    .update(posters)
    .set(updates)
    .where(eq(posters.id, id))
    .returning();

  if (!poster) {
    return c.json(
      {
        success: false,
        message: notFoundMessage.message,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      success: true,
      message: "Update poster success.",
      data: poster,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<PosterRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(posters).where(eq(posters.id, id));

  if (result.rowCount === 0) {
    return c.json(
      {
        success: false,
        message: notFoundMessage.message,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    {
      success: true,
      message: "Delete poster success.",
    },
    HttpStatusCodes.OK
  );
};
