import { createRouter } from "@/lib/create-app";
import * as handlers from "@/routes/addresses/addresses.handlers";
import * as routes from "@/routes/addresses/addresses.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.getByUserId, handlers.getByUserId);

export default router;
