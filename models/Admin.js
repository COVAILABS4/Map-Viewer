import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    email_id: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: "admins", timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
