import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routersPath = path.join(__dirname, "..", "routers", "*.js");

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Contacts API",
      version: "1.0.0",
      description: "API documentation for Contacts service",
    },
    servers: [{ url: "http://localhost:3000", description: "Local server" }],
    apis: [path.join(__dirname, "..", "routers", "*.js")],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Contact: {
          type: "object",
          properties: {
            _id: { type: "string", example: "65f1b2c3d4e5f6a7b8c9d0e1" },
            name: { type: "string", example: "Merdan Sahin" },
            phoneNumber: { type: "string", example: "+90 533 760 5954" },
            email: { type: "string", example: "merdan@example.com" },
            isFavourite: { type: "boolean", example: false },
            contactType: { type: "string", example: "personal" },
            photo: { type: "string", example: "" },
            createdAt: { type: "string", example: "2026-01-19T10:00:00.000Z" },
            updatedAt: { type: "string", example: "2026-01-19T10:00:00.000Z" },
          },
        },
        CreateContact: {
          type: "object",
          required: ["name", "phoneNumber", "contactType"],
          properties: {
            name: { type: "string", minLength: 3, maxLength: 20 },
            phoneNumber: { type: "string", minLength: 3, maxLength: 20 },
            email: { type: "string" },
            isFavourite: { type: "boolean" },
            contactType: { type: "string", enum: ["work", "home", "personal"] },
          },
        },
        PatchContact: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 3, maxLength: 20 },
            phoneNumber: { type: "string", minLength: 3, maxLength: 20 },
            email: { type: "string" },
            isFavourite: { type: "boolean" },
            contactType: { type: "string", enum: ["work", "home", "personal"] },
          },
        },
      },
    },
  },
  apis: ["./src/routers/*.js"],
});
