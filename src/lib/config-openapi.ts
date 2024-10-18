import { apiReference } from "@scalar/hono-api-reference";

import type { AppOpenApi } from "./types";

import packageJSON from "../../package.json" with { type: "json" };

export default function configOpenApi(app: AppOpenApi) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJSON.version,
      title: "Online Store API",
    },
  });

  app.get(
    "/reference",
    apiReference({
      theme: "kepler",
      spec: {
        url: "/doc",
      },
      defaultHttpClient: {
        targetKey: "javascript",
        clientKey: "fetch",
      },
    })
  );
}
