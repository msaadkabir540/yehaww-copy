import { useLoadScript } from "@react-google-maps/api";
import Loading from "components/loading";

import Map from "./map";

export default function GoogleMapsMarker({ markers, styles, className }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  return isLoaded ? (
    <Map markers={markers} styles={styles} className={className} />
  ) : (
    <Loading pageLoader={true} />
  );
}
