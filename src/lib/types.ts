import type { PinoLogger } from "hono-pino";

import {
  type OpenAPIHono,
  type RouteConfig,
  type RouteHandler,
  z,
} from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "@/db/schema";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      refreshToken?: string;
    };
  };
}

export type ZodSchema =
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  z.ZodUnion | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

export type AppOpenApi = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;

// Users
export const selectUsersSchema = createSelectSchema(users).omit({
  password: true,
});

export const selectUsersWithSchema = createSelectSchema(users).pick({
  id: true,
  email: true,
  name: true,
});

export const selectProfileSchema = createSelectSchema(users).pick({
  id: true,
  name: true,
  email: true,
  isVerified: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  updateCounter: true,
});

export const insertUserSchema = createInsertSchema(users, {
  name: (schema) => schema.name.min(1).max(255),
  password: (schema) => schema.password.min(6),
  email: (schema) => schema.email.email(),
}).pick({
  name: true,
  email: true,
  password: true,
});

export const updateUserSchema = createInsertSchema(users)
  .pick({ name: true, role: true })
  .partial();
export const adminUpdateUserSchema = createInsertSchema(users)
  .omit({
    createdAt: true,
    updatedAt: true,
    passwordToken: true,
    passwordTokenExpirationDate: true,
    password: true,
    updateCounter: true,
  })
  .partial();

// Auth
export const authResponseSchema = selectUsersSchema
  .pick({
    id: true,
    name: true,
    email: true,
    role: true,
  })
  .merge(
    z.object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
  );

export const verifyEmailSchema = z.object({
  token: z.string(),
  email: z.string().email(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});
