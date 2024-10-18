import { createRouter } from "@/lib/create-app";
import * as handlers from "@/routes/notifications/notifications.handlers";
import * as routes from "@/routes/notifications/notifications.routes";

const router = createRouter()
  .openapi(routes.sendNotification, handlers.sendNotification)
  .openapi(routes.trackNotification, handlers.trackNotification)
  .openapi(routes.allNotification, handlers.allNotification)
  .openapi(routes.deleteNotification, handlers.deleteNotification);

export default router;
