import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    locationName: { type: String, required: true },
    geoaxis: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: String, required: true },
      },
    ],
  },
  { collection: "locations", timestamps: true }
);

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);
export default Location;
