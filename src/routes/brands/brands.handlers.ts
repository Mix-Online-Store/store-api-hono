import { asc, count, eq, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { brands } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";

import type {
  BrandByIdRoute,
  BrandCreateRoute,
  BrandListRoute,
  BrandRemoveRoute,
  BrandUpdateRoute,
} from "./brands.routes";

export const list: AppRouteHandler<BrandListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db
    .select({ count: count() })
    .from(brands)
    .where(query.search ? ilike(brands.name, `%${query.search}%`) : undefined);

  const result = await db.query.brands.findMany({
    where: query.search ? ilike(brands.name, `%${query.search}%`) : undefined,
    orderBy: asc(brands.createdAt),
    limit: pageSize,
    offset: skip,
  });

  return c.json(
    {
      success: true,
      message: "Brands retrieved successful.",
      data: result,
      page,
      pages: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<BrandCreateRoute> = async (c) => {
  const brand = c.req.valid("json");

  const [createdBrand] = await db.insert(brands).values(brand).returning();

  return c.json(
    {
      success: true,
      message: "brand created successful.",
      data: createdBrand,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<BrandByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const brand = await db.query.brands.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!brand) {
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
      message: "Get brand success.",
      data: brand,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<BrandUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [brand] = await db
    .update(brands)
    .set(updates)
    .where(eq(brands.id, id))
    .returning();

  if (!brand) {
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
      message: "Update brand success.",
      data: brand,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<BrandRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(brands).where(eq(brands.id, id));

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
      message: "Delete brand success.",
    },
    HttpStatusCodes.OK
  );
};
