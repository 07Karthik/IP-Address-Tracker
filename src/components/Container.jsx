import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import "./Container.css";
import Error from "./Error";
import PanToLocation from "./PanToLocation";
import icon_arrow from "/assets/icon-arrow.svg";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "/assets/icon-location.svg", // Use your custom marker icon here
  iconSize: [56, 61], // Set the size
  iconAnchor: [28, 61], // Anchor point for the icon (adjust to suit)
  popupAnchor: [1, -34], // Where the popup should open relative to the icon
});

const Container = () => {
  const [defaultInfo, setDefaultInfo] = useState({
    latitude: "",
    longitude: "",
  });
  const [address, setAddress] = useState("");
  const [geoInfo, setGeoInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const ipRef = useRef(null);

  useEffect(() => {
    const fetchUserIP = async () => {
      setLoading(true);
      try {
        const data = await fetch(`https://ipapi.co/json/`);
        const response = await data.json();
        setAddress(response.ip);
        setDefaultInfo({
          latitude: response.latitude,
          longitude: response.longitude,
        });
      } catch (err) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchUserIP();
  }, []);
  useEffect(() => {
    const fetchGeo = async () => {
      setLoading(true);
      setFetchError(false);
      try {
        const data = await fetch(`https://ipapi.co/${address}/json/`);
        const response = await data.json();
        if (response.error) {
          setErrorMessage(response.reason || "Unknown error");
          return;
        }
        setErrorMessage(null);
        setGeoInfo(response);
      } catch (err) {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGeo();
  }, [address]);

  const settingAddress = () => {
    if (ipRef.current.value) {
      setAddress(ipRef.current.value);
    } else {
      setErrorMessage("Please Enter an IP address");
    }
  };
  return (
    <div className="container">
      <div className="container-top">
        <div className="heading">
          <h1>IP Address Tracker</h1>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <div className="search-box">
            <input
              ref={ipRef}
              type="search"
              placeholder="search for any IP address"
            />
            <div onClick={settingAddress} className={`arrow-img `}>
              {!loading ? (
                <img src={icon_arrow} alt="arrow" />
              ) : (
                <div className="load">
                  <div className="line1"></div>
                  <div className="line2"></div>
                </div>
              )}
            </div>
          </div>

          <div className="boxes">
            {loading ? (
              <>
                <div className="line1"></div>
                <div className="line2"></div>
              </>
            ) : (
              ""
            )}
            <div className="box">
              <p>IP Address</p>
              <p>{geoInfo && geoInfo.ip}</p>
            </div>
            <hr />
            <div className="box">
              <p>Location</p>
              <p>{geoInfo && geoInfo.region}</p>
            </div>
            <hr />
            <div className="box">
              <p>TimeZone</p>
              <p>{geoInfo && geoInfo.timezone}</p>
            </div>
            <hr />
            <div className="box">
              <p>ISP</p>
              <p>{geoInfo && geoInfo.org}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container-bottom">
        <MapContainer
          center={
            geoInfo
              ? [geoInfo.latitude, geoInfo.longitude]
              : [defaultInfo.latitude, defaultInfo.longitude]
          }
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="Map data ©2023 Google"
          />
          <PanToLocation
            useMap={useMap}
            geoInfo={geoInfo}
            address={address}
            errorMessage={errorMessage}
          />
          <Marker
            position={
              geoInfo
                ? [geoInfo.latitude, geoInfo.longitude]
                : [defaultInfo.latitude, defaultInfo.longitude]
            }
            icon={customIcon}
          >
            <Popup>
              {geoInfo && geoInfo.region},<br /> {geoInfo && geoInfo.city}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      {fetchError && <Error />}
    </div>
  );
};

export default Container;
