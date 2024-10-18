import { asc, count, eq, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { products } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";

import type {
  ProductByIdRoute,
  ProductCreateRoute,
  ProductListRoute,
  ProductRemoveRoute,
  ProductUpdateRoute,
} from "./products.routes";

export const list: AppRouteHandler<ProductListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db
    .select({ count: count() })
    .from(products)
    .where(
      query.search ? ilike(products.name, `%${query.search}%`) : undefined
    );

  const result = await db.query.products.findMany({
    where: query.search ? ilike(products.name, `%${query.search}%`) : undefined,
    orderBy: asc(products.createdAt),
    limit: pageSize,
    offset: skip,
    with: {
      category: {
        columns: { id: true, name: true },
      },
      subCategory: {
        columns: { id: true, name: true },
      },
      brand: {
        columns: { id: true, name: true },
      },
      variantType: {
        columns: { id: true, type: true },
      },
      variant: {
        columns: { id: true, name: true },
      },
      images: {
        columns: { id: true, url: true, position: true },
      },
    },
  });

  return c.json(
    {
      success: true,
      message: "Products retrieved successful.",
      data: result,
      page,
      pages: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<ProductCreateRoute> = async (c) => {
  const product = c.req.valid("json");

  const [createdProduct] = await db
    .insert(products)
    .values(product)
    .returning();

  return c.json(
    {
      success: true,
      message: "Product created successful.",
      data: createdProduct,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<ProductByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const product = await db.query.products.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      category: {
        columns: { id: true, name: true },
      },
      subCategory: {
        columns: { id: true, name: true },
      },
      brand: {
        columns: { id: true, name: true },
      },
      variantType: {
        columns: { id: true, type: true },
      },
      variant: {
        columns: { id: true, name: true },
      },
      images: {
        columns: { id: true, url: true, position: true },
      },
    },
  });

  if (!product) {
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
      message: "Get product success.",
      data: product,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<ProductUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [product] = await db
    .update(products)
    .set(updates)
    .where(eq(products.id, id))
    .returning();

  if (!product) {
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
      message: "Update product success.",
      data: product,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<ProductRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(products).where(eq(products.id, id));

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
      message: "Delete product success.",
    },
    HttpStatusCodes.OK
  );
};
