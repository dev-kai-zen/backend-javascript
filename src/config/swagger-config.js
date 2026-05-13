import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Resolve `.ts` (tsx) vs `.js` (`node dist`) so JSDoc is picked up in dev and production. */
function routeDocGlobs() {
  const ext = __filename.endsWith(".js") ? "js" : "js";
  const root = path.join(__dirname, "..");
  return [
    path.join(root, "modules", "**", `*.${ext}`),
    path.join(root, "shared", "routes", "**", `*.${ext}`),
  ];
}

export function setupSwagger(app) {
  const openapiSpecification = swaggerJsdoc({
    definition: {
      openapi: "3.0.3",
      info: {
        title: "backend-javascript API",
        version: "1.0.0",
        description:
          "REST API documentation. Routes are mounted under `/api/v1`.",
      },
      servers: [{ url: "/api/v1" }],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
    apis: routeDocGlobs(),
  });

  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiSpecification, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "API Docs",
    }),
  );

  /** Raw OpenAPI JSON (useful for code generators and Postman import). */
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openapiSpecification);
  });
}
