import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
  await connectToDatabase();
  const users = await User.find({});
  return Response.json(users);
}
