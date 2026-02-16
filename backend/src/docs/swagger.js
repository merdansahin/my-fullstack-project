import { createRequire } from "module";
const require = createRequire(import.meta.url);

// swagger.json dosyasını yükle ve dışa aktar
const swaggerDocument = require("./swagger.json");

export default swaggerDocument;
