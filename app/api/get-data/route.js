import connectToDatabase from "../lib/mongodb";
import Location from "../models/Location";

export async function GET() {
  try {
    await connectToDatabase(); // Connect to MongoDB

    // Fetch all locations from MongoDB
    const locations = await Location.find(); // Only select the id and name fields

    console.log(locations);

    return new Response(JSON.stringify(locations), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return new Response(JSON.stringify({ message: "Error fetching data" }), {
      status: 500,
    });
  }
}
