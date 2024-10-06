import { useEffect } from "react";
const PanToLocation = ({geoInfo,useMap,address,errorMessage}) => {
    const map = useMap(); // Access the map instance
    useEffect(() => {
      if (geoInfo && !errorMessage) {
        // Update the map view (side effect)
        map.setView(
          geoInfo
            ? [geoInfo.latitude, geoInfo.longitude]
            : [defaultInfo.latitude, defaultInfo.longitude],
          13,
          {
            animate: true, // Smooth animation
            duration: 0.5, // Duration in seconds
          }
        );
      }
    }, [geoInfo, map, address]); // Trigger this effect when geoInfo changes

    return null; // No visible UI rendered, just handles the side effect
  };

  export default PanToLocation