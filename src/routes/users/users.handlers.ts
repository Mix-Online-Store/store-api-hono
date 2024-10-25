import { asc, count, eq, ilike } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { users } from "@/db/schema";
import { notFoundResponseMessage } from "@/lib/constants";

import type {
  AdminUpdateRoute,
  GetByIdRoute,
  ListRoute,
  MeRoute,
  RemoveUserRoute,
  UpdateRoute,
} from "./users.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const query = c.req.valid("query");

  const page = query.page || 1;
  const pageSize = query.limit || 20;
  const skip = pageSize * (page - 1);

  const [totalCount] = await db
    .select({ count: count() })
    .from(users)
    .where(query.search ? ilike(users.name, `%${query.search}%`) : undefined);

  const result = await db.query.users.findMany({
    where: query.search ? ilike(users.name, `%${query.search}%`) : undefined,
    orderBy: asc(users.createdAt),
    limit: pageSize,
    offset: skip,
    columns: { password: false },
  });

  return c.json(
    {
      success: true,
      message: "Users retrieved successful.",
      data: result,
      page,
      limit: pageSize,
      totalPage: Math.ceil(totalCount.count / pageSize),
    },
    HttpStatusCodes.OK
  );
};

export const getById: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, id),
    columns: {
      password: false,
    },
  });

  if (!user) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get user success",
      data: user,
    },
    HttpStatusCodes.OK
  );
};

export const me: AppRouteHandler<MeRoute> = async (c) => {
  const { userId } = c.var.jwtPayload;

  const user = await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      updateCounter: true,
    },
  });

  if (!user) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get profile success",
      data: user,
    },
    HttpStatusCodes.OK
  );
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [user] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  if (!user) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get user success",
      data: { ...user, password: "" },
    },
    HttpStatusCodes.OK
  );
};

export const adminUpdate: AppRouteHandler<AdminUpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  const [user] = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, id))
    .returning();

  if (!user) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Get user success",
      data: { ...user, password: "" },
    },
    HttpStatusCodes.OK
  );
};

export const remove: AppRouteHandler<RemoveUserRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(users).where(eq(users.id, id));

  if (result.rowCount === 0) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      message: "User deleted.",
    },
    HttpStatusCodes.OK
  );
};
