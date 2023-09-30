import React, { useContext, useReducer, useEffect, useState } from 'react';
const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapsContext = React.createContext();
export const MapsProvider = ({ children }) => {
  const [orderId, setOrderId] = useState(null);
  const GOOOGLE_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`;
  const mapConfig = {
    center: { lat: 18.559008, lng: -68.388881 },
    store: { lat: 37.785834, lng: -122.406417 },
    home: { lat: 37.707539, lng: -122.455769 },
    zoom: 15,
    url: GOOOGLE_URL,
  };
  useEffect(() => {
    if (!orderId) return;
    console.log(orderId);
  }, [orderId]);
  const value = {
    orderId,
    setOrderId,
    mapConfig,
  };
  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
};
export default MapsProvider;

export const useMapsContext = () => useContext(MapsContext);
