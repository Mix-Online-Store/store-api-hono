import { createRouter } from "@/lib/create-app";
import * as handlers from "@/routes/variant-types/variant-types.handlers";
import * as routes from "@/routes/variant-types/variant-types.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove);

export default router;