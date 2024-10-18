import { asc, count, eq, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import type {
  CategoryByIdRoute,
  CategoryCreateRoute,
  CategoryListRoute,
  CategoryRemoveRoute,
  CategoryUpdateRoute,
} from "@/routes/categories/categories.routes";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";

export const list: AppRouteHandler<CategoryListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db
    .select({ count: count() })
    .from(categories)
    .where(
      query.search ? ilike(categories.name, `%${query.search}%`) : undefined
    );

  const result = await db.query.categories.findMany({
    where: query.search
      ? ilike(categories.name, `%${query.search}%`)
      : undefined,
    orderBy: asc(categories.createdAt),
    limit: pageSize,
    offset: skip,
  });

  return c.json(
    {
      success: true,
      message: "Categories retrieved successful.",
      data: result,
      page,
      pages: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<CategoryCreateRoute> = async (c) => {
  const category = c.req.valid("json");

  if (!category.imageUrl) {
    category.imageUrl = "https://loremflickr.com/g/320/240/paris";
  } else {
    // TODO: category image upload
  }

  const [createdCategory] = await db
    .insert(categories)
    .values(category)
    .returning();

  return c.json(
    {
      success: true,
      message: "Categories created successful.",
      data: createdCategory,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<CategoryByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const category = await db.query.categories.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!category) {
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
      message: "Get category success.",
      data: category,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<CategoryUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [category] = await db
    .update(categories)
    .set(updates)
    .where(eq(categories.id, id))
    .returning();

  if (!category) {
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
      message: "Update category success.",
      data: category,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<CategoryRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(categories).where(eq(categories.id, id));

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
      message: "Delete category success.",
    },
    HttpStatusCodes.OK
  );
};
