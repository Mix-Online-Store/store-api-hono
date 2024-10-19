import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { variantTypes } from "@/db/schema";
import { notFoundResponseMessage } from "@/lib/constants";

import type {
  VariantTypeByIdRoute,
  VariantTypeCreateRoute,
  VariantTypeListRoute,
  VariantTypeRemoveRoute,
  VariantTypeUpdateRoute,
} from "./variant-types.routes";

export const list: AppRouteHandler<VariantTypeListRoute> = async (c) => {
  const brands = await db.query.variantTypes.findMany();
  return c.json({
    success: true,
    message: "Variant types retrieved successful.",
    data: brands,
  });
};

export const create: AppRouteHandler<VariantTypeCreateRoute> = async (c) => {
  const variantType = c.req.valid("json");

  const [createdVariantType] = await db
    .insert(variantTypes)
    .values(variantType)
    .returning();

  return c.json(
    {
      success: true,
      message: "Variant type created successful.",
      data: createdVariantType,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<VariantTypeByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const variantType = await db.query.variantTypes.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!variantType) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get variant type success.",
      data: variantType,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<VariantTypeUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [variantType] = await db
    .update(variantTypes)
    .set(updates)
    .where(eq(variantTypes.id, id))
    .returning();

  if (!variantType) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Update variant type success.",
      data: variantType,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<VariantTypeRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(variantTypes).where(eq(variantTypes.id, id));

  if (result.rowCount === 0) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Delete variant type success.",
    },
    HttpStatusCodes.OK
  );
};
