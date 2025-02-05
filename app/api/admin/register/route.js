import Admin from "@/models/Admin";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req) {
  await connectToDatabase();
  const { name, phone_number, email_id, password } = await req.json();

  const admin = new Admin({
    name,
    phone_number,
    email_id,
    password: password,
  });
  await admin.save();
  return Response.json({ message: "Admin registered successfully" });
}
