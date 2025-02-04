import mongoose from "mongoose";

var MONGODB_URI =
  "mongodb+srv://covailabs4:KRISHtec5747@cluster0.ny4i2.mongodb.net/locationsNewDB?retryWrites=true&w=majority&appName=Cluster0";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectToDatabase;
