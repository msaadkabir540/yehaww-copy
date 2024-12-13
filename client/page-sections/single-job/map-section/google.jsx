import { GoogleMap } from "@react-google-maps/api";
import { useLoadScript } from "@react-google-maps/api";

import Loading from "components/loading";

export default function GoogleMaps({ coordinates, cStyles }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  if (loadError) return "Error loading Maps";
  if (!isLoaded)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={{ ...mapContainerStyle, ...cStyles }}
      zoom={11}
      center={coordinates}
    />
  );
}

const mapContainerStyle = {
  width: "20vw",
  height: "20vh",
  width: "-webkit-fill-available",
  height: "28vh",
  maxHeight: "280px",
};
