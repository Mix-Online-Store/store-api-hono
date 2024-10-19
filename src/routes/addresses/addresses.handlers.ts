import { asc, count, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { addresses } from "@/db/schema";
import { notFoundResponseMessage } from "@/lib/constants";

import type {
  AddressByIdRoute,
  AddressByUserIdRoute,
  AddressCreateRoute,
  AddressListRoute,
  AddressRemoveRoute,
  AddressUpdateRoute,
} from "./addresses.routes";

export const list: AppRouteHandler<AddressListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.pageSize || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db.select({ count: count() }).from(addresses);
  const result = await db.query.addresses.findMany({
    orderBy: asc(addresses.createdAt),
    limit: pageSize,
    offset: skip,
    with: {
      user: {
        columns: { id: true, name: true, email: true },
      },
    },
  });

  return c.json(
    {
      success: true,
      message: "Addresses retrieved successful.",
      data: result,
      page,
      limit: pageSize,
      totalPage: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const create: AppRouteHandler<AddressCreateRoute> = async (c) => {
  const address = c.req.valid("json");

  const [createdAddress] = await db
    .insert(addresses)
    .values(address)
    .returning();

  return c.json(
    {
      success: true,
      message: "Address created successful.",
      data: createdAddress,
    },
    HttpStatusCodes.CREATED
  );
};

export const getById: AppRouteHandler<AddressByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const address = await db.query.addresses.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      user: {
        columns: { id: true, name: true, email: true },
      },
    },
  });

  if (!address) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get address success.",
      data: address,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<AddressUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [address] = await db
    .update(addresses)
    .set(updates)
    .where(eq(addresses.id, id))
    .returning();

  if (!address) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Update address success.",
      data: address,
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<AddressRemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(addresses).where(eq(addresses.id, id));

  if (result.rowCount === 0) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Delete address success.",
    },
    HttpStatusCodes.OK
  );
};

export const getByUserId: AppRouteHandler<AddressByUserIdRoute> = async (c) => {
  const { id: userId } = c.req.valid("param");

  const result = await db.query.addresses.findMany({
    where: eq(addresses.userId, userId),
    with: {
      user: {
        columns: { id: true, name: true, email: true },
      },
    },
  });
  return c.json(
    {
      success: true,
      message: "Addresses retrieved successful.",
      data: result,
    },
    HttpStatusCodes.OK
  );
};
