import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { images } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";

import type {
  ImageByIdRoute,
  ImageByProductRemoveRoute,
  ImageCreateRoute,
  ImageListRoute,
  ImageRemoveRoute,
  ImageUpdateRoute,
} from "./images.routes";

export const list: AppRouteHandler<ImageListRoute> = async (c) => {
  const images = await db.query.images.findMany();
  return c.json({
    success: true,
    message: "Images retrieved successful.",
    data: images,
  });
};

export const create: AppRouteHandler<ImageCreateRoute> = async (c) => {
  const image = c.req.valid("json");

  const [createdPoster] = await db.insert(images).values(image).returning();

  return c.json(
    {
      success: true,
      message: "Image created successful.",
      data: createdPoster,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<ImageByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const image = await db.query.images.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!image) {
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
      message: "Get image success.",
      data: image,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<ImageUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [image] = await db
    .update(images)
    .set(updates)
    .where(eq(images.id, id))
    .returning();

  if (!image) {
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
      message: "Update image success.",
      data: image,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<ImageRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(images).where(eq(images.id, id));

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
      message: "Delete image success.",
    },
    HttpStatusCodes.OK
  );
};

export const getByProductId: AppRouteHandler<
  ImageByProductRemoveRoute
> = async (c) => {
  const { productId } = c.req.valid("param");

  const results = await db.query.images.findMany({
    where: eq(images.productId, productId),
  });
  return c.json(
    {
      success: true,
      message: "Images for specific product retrieved successful.",
      data: results,
    },
    HttpStatusCodes.OK
  );
};
