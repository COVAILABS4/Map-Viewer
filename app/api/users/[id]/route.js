import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req, { params }) {
  await connectToDatabase();
  const user = await User.findById(params.id);
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  return Response.json(user);
}
