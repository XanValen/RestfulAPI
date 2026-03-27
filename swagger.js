import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books API",
      version: "1.0.0",
      description: "Books REST API - use Bearer token to authorize",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        BookCreate: {
          type: "object",
          required: ["title", "author"],
          properties: {
            title:          { type: "string",  example: "The Great Gatsby" },
            author:         { type: "string",  example: "F. Scott Fitzgerald" },
            genre:          { type: "string",  example: "Fiction" },
            published_year: { type: "integer", example: 1925 },
            isbn:           { type: "string",  example: "978-0-7432-7356-5" },
          },
        },
        BookUpdate: {
          type: "object",
          properties: {
            title:          { type: "string"  },
            author:         { type: "string"  },
            genre:          { type: "string"  },
            published_year: { type: "integer" },
            isbn:           { type: "string"  },
          },
        },
      },
    },
  },
  apis: [join(__dirname, "server.js")],
});

export const redocHtml = `
<!DOCTYPE html>
<html>
  <head>
    <title>Books API - ReDoc</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>body { margin: 0; padding: 0; }</style>
  </head>
  <body>
    <redoc spec-url='/openapi.json'></redoc>
    <script src="https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js"></script>
  </body>
</html>
`;
