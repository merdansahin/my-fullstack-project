import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import app from "./server.js";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await initMongoConnection();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

bootstrap();
