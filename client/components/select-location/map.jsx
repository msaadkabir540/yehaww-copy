import React, { useState } from "react";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";

function Map({ marker, styles, className, onMapClick }) {
  const [activeMarker, setActiveMarker] = useState(null);

  const handleActiveMarker = (mark) => {
    if (mark === activeMarker) {
      return;
    }
    setActiveMarker(mark);
  };

  const handleOnLoad = (map) => {
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(marker?.position);
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

  const handleMapClick = (event) => {
    const clickedPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setActiveMarker(null);
    onMapClick(clickedPosition);
  };

  return (
    <GoogleMap
      onLoad={handleOnLoad}
      onClick={(event) => handleMapClick(event)}
      mapContainerStyle={styles}
      zoom={11}
      mapContainerClassName={className}
    >
      {marker && (
        <Marker
          key={marker?.id}
          position={marker?.position}
          onClick={() => handleActiveMarker(marker?.position)}
        >
          {activeMarker && (
            <InfoWindow onCloseClick={() => setActiveMarker(null)}>
              <div></div>
            </InfoWindow>
          )}
        </Marker>
      )}
    </GoogleMap>
  );
}

export default Map;
