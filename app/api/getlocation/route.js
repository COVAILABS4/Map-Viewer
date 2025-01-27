import connectToDatabase from "../lib/mongodb";
import Location from "../models/Location";

function ramerDouglasPeucker(points, epsilon) {
  if (points.length < 3) return points; // If fewer than 3 points, return as is

  // Find the point with the maximum perpendicular distance
  let dmax = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(points[i], points[0], points[end]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  // If max distance is greater than epsilon, recursively simplify
  if (dmax > epsilon) {
    const left = ramerDouglasPeucker(points.slice(0, index + 1), epsilon);
    const right = ramerDouglasPeucker(points.slice(index), epsilon);

    // Concatenate results
    return left.slice(0, -1).concat(right);
  } else {
    // If not, return a straight line from start to end
    return [points[0], points[end]];
  }
}

// Helper function to calculate perpendicular distance
function perpendicularDistance(point, lineStart, lineEnd) {
  const x = point.latitude;
  const y = point.longitude;
  const x1 = lineStart.latitude;
  const y1 = lineStart.longitude;
  const x2 = lineEnd.latitude;
  const y2 = lineEnd.longitude;

  const num = Math.abs((y2 - y1) * x - (x2 - x1) * y + x2 * y1 - y2 * x1);
  const den = Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

  return num / den;
}

// Function to filter small movements (optional)
function filterSmallMovements(points, threshold = 0.00001) {
  return points.filter((point, index, array) => {
    if (index === 0) return true; // Always keep the first point
    const prevPoint = array[index - 1];
    const distance = Math.sqrt(
      (point.latitude - prevPoint.latitude) ** 2 +
        (point.longitude - prevPoint.longitude) ** 2
    );
    return distance > threshold; // Only keep points with movement above the threshold
  });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ message: "ID is required" }), {
        status: 400,
      });
    }

    await connectToDatabase(); // Connect to MongoDB

    // Find the location by ID
    const location = await Location.findById(id);

    if (!location) {
      return new Response(JSON.stringify({ message: "Location not found" }), {
        status: 404,
      });
    }

    // Step 1: Filter small movements
    const threshold = 0.0000001; // Threshold for small movements
    const filteredGeoaxis = filterSmallMovements(location.geoaxis, threshold);

    // Step 2: Simplify the path using RDP
    const epsilon = 0.000005; // Adjust this value for finer or coarser simplifications
    const simplifiedGeoaxis = ramerDouglasPeucker(filteredGeoaxis, epsilon);

    // Return the simplified location
    const simplifiedLocation = {
      ...location._doc,
      geoaxis: simplifiedGeoaxis, // Replace the original geoaxis with the simplified one
    };

    return new Response(JSON.stringify(simplifiedLocation), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    return new Response(JSON.stringify({ message: "Error fetching data" }), {
      status: 500,
    });
  }
}
