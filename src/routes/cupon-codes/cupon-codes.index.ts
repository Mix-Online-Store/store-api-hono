import { createRouter } from "@/lib/create-app";
import * as handlers from "@/routes/cupon-codes/cupon-codes.handlers";
import * as routes from "@/routes/cupon-codes/cupon-codes.routes";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.update, handlers.update)
  .openapi(routes.remove, handlers.remove)
  .openapi(routes.getByProductId, handlers.getByProductId)
  .openapi(routes.getByCategoryId, handlers.getByCategoryId)
  .openapi(routes.getBySubCategoryId, handlers.getBySubCategoryId)
  .openapi(routes.checkCoupon, handlers.checkCoupon);

export default router;
