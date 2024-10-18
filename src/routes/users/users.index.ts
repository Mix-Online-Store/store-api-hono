import { createRouter } from "@/lib/create-app";
import * as handlers from "@/routes/users/users.handlers";
import * as routes from "@/routes/users/users.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.me, handlers.me)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.adminUpdate, handlers.adminUpdate)
  .openapi(routes.remove, handlers.remove);

export default router;
