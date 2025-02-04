import connectToDatabase from "@/lib/mongodb";
import Location from "@/models/Location";

export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();
    const { locationName } = await req.json();

    await Location.findByIdAndUpdate(params.id, { locationName });

    return Response.json({ message: "Location updated" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error updating location", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    await Location.findByIdAndDelete(params.id);

    return Response.json({ message: "Location deleted" }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error deleting location", error },
      { status: 500 }
    );
  }
}
