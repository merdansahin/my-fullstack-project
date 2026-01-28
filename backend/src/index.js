/*import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import app from "./server.js";

async function bootstrap() {
  await initMongoConnection();
}

bootstrap();
*/

import dotenv from "dotenv";
dotenv.config();
import app from "./server.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
