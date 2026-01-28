import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Single", "Double Deluxe", "Family Deluxe", "Presidential Deluxe"],
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // URL veya dosya yolu
      },
    ],
    amenities: [
      {
        type: String, // Örn: "Free WiFi", "Shuttle Service"
      },
    ],
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
