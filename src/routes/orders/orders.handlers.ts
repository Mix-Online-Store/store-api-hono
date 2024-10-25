import { asc, count, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { orderItems, orders, orderTotals } from "@/db/schema";
import { notFoundResponseMessage } from "@/lib/constants";

import type {
  OrderByIdRoute,
  OrderCreateRoute,
  OrderListRoute,
  OrderRemoveRoute,
  OrderUpdateRoute,
} from "./orders.routes";

export const list: AppRouteHandler<OrderListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.limit || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db.select({ count: count() }).from(orders);

  const result = await db.query.orders.findMany({
    orderBy: asc(orders.createdAt),
    limit: pageSize,
    offset: skip,
    with: {
      items: true,
      orderTotal: true,
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      shippingAddress: true,
    },
  });

  return c.json(
    {
      success: true,
      message: "Orders retrieved successful.",
      data: result,
      page,
      limit: pageSize,
      totalPage: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<OrderCreateRoute> = async (c) => {
  const orderReq = c.req.valid("json");

  let otId;
  if (orderReq.orderTotal) {
    const [result] = await db
      .insert(orderTotals)
      .values(orderReq.orderTotal)
      .returning({ orderTotalId: orderTotals.id });
    otId = result.orderTotalId;
  }

  const [createdOrder] = await db
    .insert(orders)
    .values({
      ...orderReq,
      orderTotalId: otId,
    })
    .returning();

  const orderItemsToInsert = orderReq.items.map((item) => {
    return { ...item, orderId: createdOrder.id };
  });
  await db.insert(orderItems).values(orderItemsToInsert).returning();

  return c.json(
    {
      success: true,
      message: "Order created successful.",
      data: createdOrder,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<OrderByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const order = await db.query.orders.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      items: true,
      orderTotal: true,
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get order success.",
      data: order,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<OrderUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [order] = await db
    .update(orders)
    .set(updates)
    .where(eq(orders.id, id))
    .returning();

  if (!order) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Update order success.",
      data: order,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<OrderRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(orders).where(eq(orders.id, id));

  if (result.rowCount === 0) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Delete order success.",
    },
    HttpStatusCodes.OK
  );
};
