import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email_id, password } = await req.json();
    const user = await User.findOne({ email_id });

    if (!user || !(password === user.password)) {
      return Response.json({ message: "Invalid credentials" }, { status: 401 });
    }

    return Response.json(
      { message: "Login successful", user },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: "Login failed", error }, { status: 500 });
  }
}
