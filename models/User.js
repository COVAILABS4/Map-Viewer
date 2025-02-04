import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    email_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "users", timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
