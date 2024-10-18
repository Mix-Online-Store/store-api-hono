import { z } from "@hono/zod-openapi";

export const ApiKeyQuerySchema = z.object({
  apiKey: z.string().openapi({
    example:
      "1c15348f2047c93b671a0133dd13b4caddd47b8405a0fbeb84109bc17354315d221d370dadd44490e5835143addbb9261dce2aedd1b678fd0ebc777fb451d7ecae2d97113324",
  }),
});
export default ApiKeyQuerySchema;
