import { createRouter } from "@/lib/create-app";
import * as handlers from "@/routes/images/images.handlers";
import * as routes from "@/routes/images/images.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.getByProductId, handlers.getByProductId);

export default router;
