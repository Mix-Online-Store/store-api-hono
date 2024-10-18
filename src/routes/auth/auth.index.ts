import { createRouter } from "@/lib/create-app";
import * as handlers from "@/routes/auth/auth.handlers";
import * as routes from "@/routes/auth/auth.routes";

const router = createRouter()
  .openapi(routes.register, handlers.register)
  .openapi(routes.verifyEmail, handlers.verifyEmail)
  .openapi(routes.login, handlers.login)
  .openapi(routes.logout, handlers.logout)
  .openapi(routes.forgotPassword, handlers.forgotPassword)
  .openapi(routes.resetPassword, handlers.resetPassword);

export default router;
