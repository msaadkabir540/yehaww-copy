/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import GoogleMaps from "./google";

import { getCoordinates } from "helpers/map-helper";

import style from "./map.module.scss";

const MapSection = ({ city, cStyles }) => {
  const [coordinates, setCoordinates] = useState({});

  useEffect(async () => {
    city && setCoordinates(await getCoordinates(city));
  }, [city]);

  return (
    <div className={style.map}>
      {coordinates?.lat && <GoogleMaps coordinates={coordinates} cStyles={cStyles} />}
    </div>
  );
};

export default MapSection;
