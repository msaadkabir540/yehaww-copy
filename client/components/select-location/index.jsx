import { useState, useRef, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import Map from "./map";
import Input from "components/input";
import Loading from "components/loading";
import { useOutsideClickHook } from "utils/useOutsideClickHook";

import style from "./search-select.module.scss";
import createNotification from "common/create-notification";

const LocationSelect = ({
  name,
  label,
  setValue,
  className,
  clearErrors,
  placeholder,
  defaultValue,
  errorMessage,
  autocomplete = true,
}) => {
  const wrapperRef = useRef();
  const libraries = ["places"];
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const { loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (loadError) {
      createNotification("error", "Error Loading Map");
    }
  }, [loadError]);

  useOutsideClickHook(wrapperRef, () => {
    setTimeout(() => {
      setOpen(false);
    }, 500);
  });

  const handleMapClick = async (clickedPosition) => {
    try {
      const results = await geocodeByAddress(`${clickedPosition.lat},${clickedPosition.lng}`);
      const address = results[0]?.formatted_address;

      setCoordinates({
        position: clickedPosition,
        id: null,
      });
      setAddress(address);
      setValue && setValue(name, { name: address, coordinates: clickedPosition });
      clearErrors && clearErrors(name);
    } catch (error) {
      console.error("Error reverse geocoding", error);
    }
  };

  const handleSelect = async (value) => {
    setAddress(value);
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);

      setCoordinates({
        position: latLng,
        id: results[0]?.place_id,
      });

      setOpen(false);
      setValue && setValue(name, { name: value, coordinates: latLng });
      clearErrors && clearErrors(name);
    } catch (error) {
      console.error("Error selecting location", error);
    }
  };

  const handleInputChange = (value) => {
    setAddress(value);
    if (value === "") {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  useEffect(() => {
    if (coordinates === null) {
      handleSelect(defaultValue?.name);
    }
  }, [defaultValue]);

  return (
    <div className={style.searchSelect}>
      <PlacesAutocomplete value={address} onChange={handleInputChange} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div>
            <Input
              type="text"
              label={label}
              placeholder={placeholder}
              autocomplete={autocomplete}
              errorMessage={errorMessage}
              className={`${style.field} ${className}`}
              {...getInputProps({
                placeholder: "Search for a location...",
              })}
            />
            {open && (
              <div className={style.searchDropdown}>
                {suggestions?.length > 0 ? (
                  suggestions?.map((ele, index) => (
                    <div
                      key={index}
                      ref={wrapperRef}
                      className={style.innerDiv}
                      {...getSuggestionItemProps(ele)}
                    >
                      <p style={{ cursor: "pointer" }}>{ele?.description}</p>
                    </div>
                  ))
                ) : (
                  <label className={style.noDataFound}>No {placeholder} found</label>
                )}
              </div>
            )}
          </div>
        )}
      </PlacesAutocomplete>
      <div style={{ marginTop: "20px" }}>
        {coordinates && (
          <Map
            marker={coordinates}
            onMapClick={handleMapClick}
            styles={{ width: "100%", height: "400px" }}
          />
        )}
      </div>
    </div>
  );
};

export default LocationSelect;
