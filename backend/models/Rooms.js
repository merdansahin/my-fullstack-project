import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: String,
  price: Number,
  imageUrl: String, // resim URL’si burada tutulacak
});

export default mongoose.model("Room", roomSchema);
