import connectToDatabase from "@/lib/mongodb";
import Location from "@/models/Location";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { userId, locationName, geoaxis } = await req.json();

    const location = new Location({ userId, locationName, geoaxis });
    await location.save();

    return Response.json({ message: "Location created" }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Error creating location", error },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId)
      return Response.json({ message: "User ID is required" }, { status: 400 });

    const locations = await Location.find({ userId });

    return Response.json(locations, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error fetching locations", error },
      { status: 500 }
    );
  }
}
