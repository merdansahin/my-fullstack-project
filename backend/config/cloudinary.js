import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error(
    "❌ ERROR: Cloudinary configuration is missing! Check your .env file.",
  );
  console.error(`CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME ? "Loaded" : "Missing"}`);
  console.error(`API_KEY: ${CLOUDINARY_API_KEY ? "Loaded" : "Missing"}`);
  console.error(`API_SECRET: ${CLOUDINARY_API_SECRET ? "Loaded" : "Missing"}`);
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hotel-rooms", // Folder name on Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Criteria: webp support for performance
    // transformation: [{ width: 1000, height: 600, crop: "limit" }], // Automatic resizing (transformation may not be directly supported in params in multer-storage-cloudinary v4, can be given as a function with public_id etc. if needed)
  },
});

export { cloudinary, storage };
