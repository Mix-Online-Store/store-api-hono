import { asc, count, eq, ilike, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { couponCodes, products } from "@/db/schema";
import { notFoundMessage } from "@/lib/constants";

import type {
  CouponCodeByCategoryIdRoute,
  CouponCodeByIdRoute,
  CouponCodeByProductIdRoute,
  CouponCodeBySubCategoryIdRoute,
  CouponCodeCheckRoute,
  CouponCodeCreateRoute,
  CouponCodeListRoute,
  CouponCodeRemoveRoute,
  CouponCodeUpdateRoute,
} from "./cupon-codes.routes";

export const list: AppRouteHandler<CouponCodeListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db
    .select({ count: count() })
    .from(couponCodes)
    .where(
      query.search ? ilike(couponCodes.code, `%${query.search}%`) : undefined
    );

  const result = await db.query.couponCodes.findMany({
    where: query.search
      ? ilike(couponCodes.code, `%${query.search}%`)
      : undefined,
    orderBy: asc(couponCodes.createdAt),
    limit: pageSize,
    offset: skip,
  });

  return c.json(
    {
      success: true,
      message: "Coupon codes retrieved successful.",
      data: result,
      page,
      pages: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<CouponCodeCreateRoute> = async (c) => {
  const couponCode = c.req.valid("json");
  const endDate = new Date(couponCode.endDate);

  const [createdCuponCode] = await db
    .insert(couponCodes)
    .values({ ...couponCode, endDate })
    .returning();

  return c.json(
    {
      success: true,
      message: "Cupon code created successful.",
      data: createdCuponCode,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<CouponCodeByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const cuponCode = await db.query.couponCodes.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!cuponCode) {
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
      message: "Get cupon code success.",
      data: cuponCode,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<CouponCodeUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  let endDate: Date | undefined;
  if (updates.endDate) {
    endDate = new Date(updates.endDate);
  }
  c.var.logger.debug({ endDate });

  const [cuponCode] = await db
    .update(couponCodes)
    .set({ ...updates, endDate })
    .where(eq(couponCodes.id, id))
    .returning();

  if (!cuponCode) {
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
      message: "Update cupon code success.",
      data: cuponCode,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<CouponCodeRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(couponCodes).where(eq(couponCodes.id, id));

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
      message: "Delete cupon code success.",
    },
    HttpStatusCodes.OK
  );
};

export const getByProductId: AppRouteHandler<
  CouponCodeByProductIdRoute
> = async (c) => {
  const { productId } = c.req.valid("param");

  const result = await db.query.couponCodes.findMany({
    where: eq(couponCodes.applicableProductId, productId),
  });
  return c.json({
    success: true,
    message: "Available cupon codes for this product retrieved successful.",
    data: result,
  });
};
export const getByCategoryId: AppRouteHandler<
  CouponCodeByCategoryIdRoute
> = async (c) => {
  const { categoryId } = c.req.valid("param");

  const result = await db.query.couponCodes.findMany({
    where: eq(couponCodes.applicableCategoryId, categoryId),
  });
  return c.json({
    success: true,
    message: "Available cupon codes for this category retrieved successful.",
    data: result,
  });
};

export const getBySubCategoryId: AppRouteHandler<
  CouponCodeBySubCategoryIdRoute
> = async (c) => {
  const { subCategoryId } = c.req.valid("param");

  const result = await db.query.couponCodes.findMany({
    where: eq(couponCodes.applicableSubCategoryId, subCategoryId),
  });
  return c.json({
    success: true,
    message:
      "Available cupon codes for this sub-category retrieved successful.",
    data: result,
  });
};

export const checkCoupon: AppRouteHandler<CouponCodeCheckRoute> = async (c) => {
  const { couponCode, productIds, purchaseAmount } = c.req.valid("json");

  const coupon = await db.query.couponCodes.findFirst({
    where: eq(couponCodes.code, couponCode),
  });

  // If coupon is not found, return false
  if (!coupon) {
    return c.json(
      {
        success: false,
        message: "Coupon not found",
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Check if the coupon is expired
  const currentDate = new Date();
  if (coupon.endDate < currentDate) {
    return c.json(
      {
        success: false,
        message: "Coupon is expired.",
      },
      HttpStatusCodes.OK
    );
  }

  // Check if the coupon is active
  if (coupon.status !== "active") {
    return c.json(
      {
        success: false,
        message: "Coupon is no longer available.",
      },
      HttpStatusCodes.OK
    );
  }

  // Check if the purchase amount is greater than the minimum purchase amount specified in the coupon
  if (
    coupon.minimunPurchaseAmount &&
    purchaseAmount < coupon.minimunPurchaseAmount
  ) {
    return c.json(
      {
        success: false,
        message: "Minimum purchase amount does not met.",
      },
      HttpStatusCodes.OK
    );
  }

  // Check if the coupon is applicable for all orders
  if (
    !coupon.applicableCategoryId &&
    !coupon.applicableSubCategoryId &&
    !coupon.applicableProductId
  ) {
    return c.json(
      {
        success: true,
        message: "Coupon is applicable for all orders.",
        data: coupon,
      },
      HttpStatusCodes.OK
    );
  }

  // Fetch the products from the database using the provided product IDs
  const filterProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));
  c.var.logger.debug({ filterProducts });

  // Check if any product in the list is not applicable for the coupon
  const isValid = filterProducts.every((product) => {
    if (
      coupon.applicableCategoryId &&
      coupon.applicableCategoryId !== product.categoryId
    ) {
      c.var.logger.debug("In categoryId check");
      return false;
    }

    if (
      coupon.applicableSubCategoryId &&
      coupon.applicableSubCategoryId !== product.subCategoryId
    ) {
      c.var.logger.debug("In sub-categoryId check");
      return false;
    }

    // if (
    //   coupon.applicableProductId &&
    //   coupon.applicableProductId !== product.id
    // ) {
    //   c.var.logger.debug("In productId check");
    //   return false;
    // }
    if (
      coupon.applicableProductId &&
      !product.variantId?.includes(coupon.applicableProductId)
    ) {
      c.var.logger.debug("In productId check");
      return false;
    }

    return true;
  });

  if (!isValid) {
    return c.json(
      {
        success: false,
        message: "Coupon is not applicable for the provided products.",
      },
      HttpStatusCodes.OK
    );
  }

  return c.json(
    {
      success: true,
      message: "Coupon is applicable for the provided products.",
      data: coupon,
    },
    HttpStatusCodes.OK
  );
};
