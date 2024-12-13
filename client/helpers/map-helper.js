import Geocode from "react-geocode";

export const getCoordinates = async (address) => {
  Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);
  Geocode.setLanguage("en");
  Geocode.setLocationType("ROOFTOP");
  // Get latitude & longitude from address.
  try {
    const res = await Geocode.fromAddress(address);
    const { lat, lng } = res.results[0].geometry.location;
    return { lat, lng };
  } catch (err) {
    console.error(err);
  }
};
