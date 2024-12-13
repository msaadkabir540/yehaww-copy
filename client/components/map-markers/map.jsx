import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";

import { jobTypeKeys } from "utils/arrayHelper";

import style from "./map.module.scss";

function Map({ markers, styles, className }) {
  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const handleOnLoad = (map) => {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(({ position }) => bounds.extend(position));
    if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
      var extendPoint1 = new google.maps.LatLng(
        bounds.getNorthEast().lat() + 0.01,
        bounds.getNorthEast().lng() + 0.01
      );
      var extendPoint2 = new google.maps.LatLng(
        bounds.getNorthEast().lat() - 0.01,
        bounds.getNorthEast().lng() - 0.01
      );
      bounds.extend(extendPoint1);
      bounds.extend(extendPoint2);
    }
    map.fitBounds(bounds);
  };

  return (
    <GoogleMap
      onLoad={handleOnLoad}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={styles}
      // {...(markers.length === 1 && { zoom: 11 })}
      zoom={11}
      mapContainerClassName={className}
    >
      {markers.map(
        ({
          id,
          img,
          jobId,
          salary,
          currency,
          jobTitle,
          position,
          companyType,
          companyName,
          employmentType,
          currentlyLocated,
        }) => (
          <Marker key={id} position={position} onClick={() => handleActiveMarker(id)}>
            {activeMarker === id ? (
              <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                <div className={style.markerMain}>
                  <Link href={`/job/details/${jobId}`}>
                    <Image
                      src={img || `/assets/imgs/${jobTypeKeys[companyType]}.webp`}
                      alt={`${jobTitle}-img`}
                      width={80}
                      height={80}
                    />
                  </Link>
                  <div className={style.details}>
                    <Link href={`/jobs/details/${jobId}`}>
                      <h4>{`Job Title:  ${jobTitle}`}</h4>
                    </Link>
                    <h5>Location: {`${currentlyLocated?.city}, ${currentlyLocated?.country}`}</h5>
                    <h5>Company Name: {companyName ? companyName : "Anonymous"}</h5>
                    <h5>Employment Type: {employmentType}</h5>
                    <h5>Salary: {salary ? `${currency} ${salary}` : "Salary: To Be Determined"}</h5>
                  </div>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        )
      )}
    </GoogleMap>
  );
}

export default Map;
