import "dotenv/config";
import { initMongoConnection } from "./db/initMongoConnection.js";
import app from "./server.js";

const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısını başlat
initMongoConnection();

// Vercel için app'i dışa aktar
export default app;

// Vercel ortamında değilsek sunucuyu başlat (Localhost veya Render)
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
