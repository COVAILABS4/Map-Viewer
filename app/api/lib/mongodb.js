import mongoose from "mongoose";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(
      "mongodb+srv://covailabs4:KRISHtec5747@cluster0.ny4i2.mongodb.net/locationsDB?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};

export default connectToDatabase;
