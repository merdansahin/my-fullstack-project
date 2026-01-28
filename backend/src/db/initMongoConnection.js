import mongoose from "mongoose";

export async function initMongoConnection() {
  const uri = process.env.MONGODB_URI;
  try {
    await mongoose.connect(uri);
    console.log("Mongo connection successfully established!");
  } catch (err) {
    console.error("Mongo connection error:", err);
  }
}
