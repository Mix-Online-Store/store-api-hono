import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { variants } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";

import type {
  VariantByIdRoute,
  VariantCreateRoute,
  VariantListRoute,
  VariantRemoveRoute,
  VariantUpdateRoute,
} from "./variants.routes";

export const list: AppRouteHandler<VariantListRoute> = async (c) => {
  const variants = await db.query.variants.findMany();
  return c.json({
    success: true,
    message: "Variants retrieved successful.",
    data: variants,
  });
};

export const create: AppRouteHandler<VariantCreateRoute> = async (c) => {
  const variant = c.req.valid("json");

  const [createdVariant] = await db
    .insert(variants)
    .values(variant)
    .returning();

  return c.json(
    {
      success: true,
      message: "Variant created successful.",
      data: createdVariant,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<VariantByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const variant = await db.query.variants.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!variant) {
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
      message: "Get variant success.",
      data: variant,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<VariantUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [variant] = await db
    .update(variants)
    .set(updates)
    .where(eq(variants.id, id))
    .returning();

  if (!variant) {
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
      message: "Update variant success.",
      data: variant,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<VariantRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(variants).where(eq(variants.id, id));

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
      message: "Delete variant success.",
    },
    HttpStatusCodes.OK
  );
};
