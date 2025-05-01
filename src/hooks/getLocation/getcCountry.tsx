import { mapBoxToken } from "../../shared/exporter";

export async function getCountryFromCoordinates(lat, lng) {
  const accessToken = mapBoxToken; 
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&types=country`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const countryName = data.features[0].text; 
      const countryCode = data.features[0].properties.short_code.toUpperCase(); 
      
      console.log("Country Name:", countryName);
      console.log("Country Code:", countryCode);
      
      return { countryName, countryCode };
    } else {
      throw new Error("Country not found");
    }
  } catch (error) {
    console.error("Error fetching country:", error);
    return null;
  }
}
