import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
// import { hashPassword } from "@/utils/auth";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, phone_number, email_id, password } = await req.json();

    const user = new User({
      name,
      phone_number,
      email_id,
      password: password,
    });
    await user.save();

    return Response.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Registration failed", error },
      { status: 500 }
    );
  }
}
