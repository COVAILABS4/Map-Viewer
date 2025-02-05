import Admin from "@/models/Admin";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req) {
  await connectToDatabase();
  const { email_id, password } = await req.json();
  const admin = await Admin.findOne({ email_id });
  if (!admin || !(password === admin.password)) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return Response.json({ message: "Login successful", adminId: admin._id });
}
