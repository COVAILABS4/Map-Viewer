import connectToDatabase from "@/lib/mongodb";
import Location from "@/models/Location";

export async function GET(req, context) {
  try {
    await connectToDatabase();

    // ✅ Await params because it's now a Promise in Next.js 15
    const params = await context.params;

    if (!params?.id) {
      return new Response(
        JSON.stringify({ message: "Location ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ message: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let data = await Location.findOne({ _id: params.id, userId });

    if (!data) {
      return new Response(JSON.stringify({ message: "Location not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Location retrieved", location: data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error retrieving location",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PATCH(req, context) {
  try {
    await connectToDatabase();
    const params = await context.params;

    if (!params?.id) {
      return new Response(
        JSON.stringify({ message: "Location ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { locationName } = await req.json();
    if (!locationName) {
      return new Response(
        JSON.stringify({ message: "Location name is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await Location.findByIdAndUpdate(params.id, { locationName });

    return new Response(JSON.stringify({ message: "Location updated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error updating location",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, context) {
  try {
    await connectToDatabase();
    const params = await context.params;

    if (!params?.id) {
      return new Response(
        JSON.stringify({ message: "Location ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await Location.findByIdAndDelete(params.id);

    return new Response(JSON.stringify({ message: "Location deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Error deleting location",
        error: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
