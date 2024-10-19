import { asc, count, eq, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { subCategories } from "@/db/schema";
import { notFoundResponseMessage } from "@/lib/constants";

import type {
  SubCategoryByIdRoute,
  SubCategoryCreateRoute,
  SubCategoryListRoute,
  SubCategoryRemoveRoute,
  SubCategoryUpdateRoute,
} from "./sub-categories.routes";

export const list: AppRouteHandler<SubCategoryListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db
    .select({ count: count() })
    .from(subCategories)
    .where(
      query.search ? ilike(subCategories.name, `%${query.search}%`) : undefined
    );

  const result = await db.query.products.findMany({
    where: query.search
      ? ilike(subCategories.name, `%${query.search}%`)
      : undefined,
    orderBy: asc(subCategories.createdAt),
    limit: pageSize,
    offset: skip,
  });

  return c.json(
    {
      success: true,
      message: "Sub-categories retrieved successful.",
      data: result,
      page,
      limit: pageSize,
      totalPage: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<SubCategoryCreateRoute> = async (c) => {
  const subcategory = c.req.valid("json");

  const [createdCategory] = await db
    .insert(subCategories)
    .values(subcategory)
    .returning();

  return c.json(
    {
      success: true,
      message: "Sub-category created successfully.",
      data: createdCategory,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<SubCategoryByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const subcategory = await db.query.subCategories.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!subcategory) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get sub-category success.",
      data: subcategory,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<SubCategoryUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [subcategory] = await db
    .update(subCategories)
    .set(updates)
    .where(eq(subCategories.id, id))
    .returning();

  if (!subcategory) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Update sub-category success.",
      data: subcategory,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<SubCategoryRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(subCategories).where(eq(subCategories.id, id));

  if (result.rowCount === 0) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Sub-category is deleted successfully.",
    },
    HttpStatusCodes.NO_CONTENT
  );
};
