import mongoose from "mongoose";

// Define the schema
const locationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    geoaxis: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: String, required: true },
      },
    ],
  },
  { collection: "locationCollection" } // Specify the collection name here
);

// Check if the model already exists, if so, use the existing model, else create a new one
const Location =
  mongoose.models.locationCollection ||
  mongoose.model("locationCollection", locationSchema);

export default Location;
