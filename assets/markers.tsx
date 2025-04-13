// markers.tsx
// This file can now be used to fetch or store dynamic markers based on the user's location.

// Example: Fetch nearby places based on user's location
export const fetchNearbyMarkers = async (
  latitude: number,
  longitude: number
) => {
  try {
    // Replace with your API endpoint or Google Places API
    const response = await fetch(
      `https://your-api-endpoint.com/nearby-places?lat=${latitude}&lng=${longitude}`
    );
    const data = await response.json();
    return data.places; // Assuming the API returns an array of places
  } catch (error) {
    console.error("Error fetching nearby markers:", error);
    return [];
  }
};

// Example static data (optional, can be removed if not needed)
const staticMarkers = [
  {
    name: "Sample Place 1",
    coordinates: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    },
    description: "This is a sample place.",
    image: "https://example.com/sample-image.jpg",
  },
  // Add more static markers if needed
];

export default staticMarkers;
