import React, { useEffect, useMemo } from "react";
import { useMap, Marker, Popup } from "react-leaflet";
import icon from "./Icon";

export default function MarkerPosition({ address }) {
  const map = useMap();
  const position = useMemo(() => {
    return [address.location.lat, address.location.lng];
  });

  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    });
  }, [map, position]);
  return (
    <>
      <Marker
        icon={icon}
        position={[address.location.lat, address.location.lng]}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
}
