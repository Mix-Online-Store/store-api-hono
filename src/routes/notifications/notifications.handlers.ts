import * as OneSignal from "@onesignal/node-onesignal";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import { db } from "@/db";
import { notifications } from "@/db/schema";
import env from "@/env";
import { notFoundResponseMessage } from "@/lib/constants";
import { client } from "@/lib/onesignal";

import type {
  AllNotificationRoute,
  DeleteNotificationRoute,
  NotificationSendRoute,
  TrackNotificationRoute,
} from "./notifications.routes";

export const sendNotification: AppRouteHandler<NotificationSendRoute> = async (
  c
) => {
  const { name, description, imageUrl } = c.req.valid("json");

  const osNotification = new OneSignal.Notification();
  osNotification.app_id = env.ONE_SIGNAL_APP_ID;
  osNotification.name = "Test Notification";
  osNotification.headings = { en: name };
  osNotification.contents = { en: description };
  osNotification.included_segments = ["All"];
  if (imageUrl) {
    osNotification.big_picture = imageUrl;
  }

  const osResult = await client.createNotification(osNotification);
  c.var.logger.debug({ osResult });

  if (osResult.errors) {
    return c.json(
      {
        success: false,
        message: osResult.errors.toString(),
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  if (!osResult.id) {
    return c.json(
      {
        success: false,
        message: "Send notification error",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const notificationId = osResult.id;
  c.var.logger.debug({ notificationId }, "Notification sent to all users:");

  const notification = { notificationId, name, description, imageUrl };

  await db.insert(notifications).values(notification).returning();

  return c.json(
    {
      success: true,
      message: "Notification sent successfully.",
    },
    HttpStatusCodes.OK
  );
};

export const trackNotification: AppRouteHandler<
  TrackNotificationRoute
> = async (c) => {
  const { notificationId } = c.req.valid("param");

  const { platform_delivery_stats } = await client.getNotification(
    env.ONE_SIGNAL_APP_ID,
    notificationId
  );
  const androidStats = platform_delivery_stats;

  const result = {
    platform: "Android",
    success_delivery: androidStats?.android?.successful,
    failed_delivery: androidStats?.android?.failed,
    errored_delivery: androidStats?.android?.errored,
    opened_notification: androidStats?.android?.converted,
  };
  c.var.logger.debug({ androidStats }, "Notification details:");

  return c.json(
    {
      success: true,
      message: "Notification track success.",
      data: result,
    },
    HttpStatusCodes.OK
  );
};

export const allNotification: AppRouteHandler<AllNotificationRoute> = async (
  c
) => {
  const notifications = await db.query.notifications.findMany({
    orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
  });

  return c.json(
    {
      success: true,
      message: "Notifications retrieved successfully.",
      data: notifications,
    },
    HttpStatusCodes.OK
  );
};

export const deleteNotification: AppRouteHandler<
  DeleteNotificationRoute
> = async (c) => {
  const { id } = c.req.valid("param");

  const result = await db.delete(notifications).where(eq(notifications.id, id));

  if (result.rowCount === 0) {
    return c.json(notFoundResponseMessage, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(
    {
      success: true,
      message: "Notification deleted successfully.",
    },
    HttpStatusCodes.OK
  );
};
