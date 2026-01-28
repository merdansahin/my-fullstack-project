import mongoose from "mongoose";

export async function initMongoConnection() {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URI, MONGODB_DB } =
    process.env;

  const uri = `mongodb+srv://${MONGODB_USER}:${encodeURIComponent(
    MONGODB_PASSWORD,
  )}@${MONGODB_URI}/${MONGODB_DB}?retryWrites=true&w=majority`;

  await mongoose.connect(uri);
  console.log("Mongo connection successfully established!");
}
