import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import app from "./server.js";

async function bootstrap() {
  await initMongoConnection();
}

bootstrap();
