import React, { useContext, useEffect, useState } from 'react';
import { api } from '../api/configs/axiosConfigs';
import socket from 'socket.io-client';
const GOOGLE_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const REACT_APP_STRAPI_URL = process.env.REACT_APP_STRAPI_URL;

const MapsContext = React.createContext();
export const MapsProvider = ({ children }) => {
  const [orderId, setOrderId] = useState(null);
  const [pathId, setPathId] = useState(null);
  const [error, setError] = useState(null);
  const [initPaths, setInitPaths] = useState(null);
  const [updatePath, setUpdatePath] = useState(null);
  const [isLoadind, setIsLoading] = useState(true);
  const io = socket(REACT_APP_STRAPI_URL);

  const GOOOGLE_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&v=3.exp&libraries=geometry,drawing,places`;
  const mapConfig = {
    center: { lat: 18.559008, lng: -68.388881 },
    store: { lat: 37.785834, lng: -122.406417 },
    home: { lat: 37.707539, lng: -122.455769 },
    zoom: 13,
    url: GOOOGLE_URL,
  };
  const fethPath = async (orderId, pathId, cancel = false) => {
    try {
      const res = await api.request({
        method: 'GET',
        url: `/api/order-paths/${pathId}`,
      });
      const { orderId, paths } = res.data.data.attributes;
      if (orderId !== orderId) {
        setError('Order not found');
        return;
      }
      setInitPaths(paths);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
      console.log(error.message);
    }
  };
  useEffect(() => {
    const handlerUpdatePath = (data) => {
      const { orderId, paths, id } = data;
      if (orderId !== orderId && id !== pathId) return;
      setUpdatePath(paths[paths.length - 1]);
    };

    io.on('updatePaths', handlerUpdatePath);
    return () => {
      io.off('updatePaths', handlerUpdatePath);
    };
  }, []);
  useEffect(() => {
    if (!orderId) return;
    fethPath(orderId, pathId);
  }, [orderId]);
  const value = {
    orderId,
    setOrderId,
    setPathId,
    mapConfig,
    error,
    initPaths,
    updatePath,
    isLoadind,
  };
  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
};
export default MapsProvider;

export const useMapsContext = () => useContext(MapsContext);
