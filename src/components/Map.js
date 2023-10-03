import React, { useContext, useReducer, useEffect, useState } from 'react';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker as GoogleMarker,
  Polyline,
} from 'react-google-maps';
import { useMapsContext } from '../context/maps_context';
import { AiOutlineHome, AiOutlineShop } from 'react-icons/ai';
/* global google */
const Map = () => {
  const { mapConfig, initPaths, updatePath } = useMapsContext();
  const [updateRoute, setUpdatRoute] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [path, setPath] = useState([]);

  const velocity = 100;
  const initialDate = new Date();

  const getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - initialDate) / 1000; // pass to seconds
    return differentInTime * velocity; // d = v*t -- thanks Newton!
  };

  const icon = {
    url: 'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png',
    scaledSize: new window.google.maps.Size(20, 20),
    anchor: { x: 10, y: 10 },
  };

  const addPath = () => {
    const { lat: lat1, lng: lng1 } = updatePath;
    const latLong1 = new window.google.maps.LatLng(lat1, lng1);

    const { lat: lat2, lng: lng2 } = path[0];
    const latLong2 = new window.google.maps.LatLng(lat2, lng2);

    const distance =
      window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      );
    setPath((prev) => {
      setRoutes([...prev, { lat: lat1, lng: lng1, distance }]);
      return [...prev, { lat: lat1, lng: lng1, distance }];
    });
  };
  const updateInitPaths = () => {
    const path = initPaths.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 }; // it begins here!
      }
      const { lat: lat1, lng: lng1 } = coordinates;
      const latLong1 = new window.google.maps.LatLng(lat1, lng1);

      const { lat: lat2, lng: lng2 } = array[0];
      const latLong2 = new window.google.maps.LatLng(lat2, lng2);

      // in meters:
      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          latLong1,
          latLong2
        );

      return { ...coordinates, distance };
    });
    setPath(path);
    setRoutes(path);
  };

  const moveObject = () => {
    const distance = getDistance();
    if (!distance) {
      return;
    }
    if (path.length < 2) {
      return;
    }
    let progress = path[path.length - 2];
    const nextLine = path[path.length - 1];
    const lastLineLatLng = new window.google.maps.LatLng(
      progress.lat,
      progress.lng
    );
    const nextLineLatLng = new window.google.maps.LatLng(
      nextLine.lat,
      nextLine.lng
    );

    // distance of this line
    const totalDistance = nextLine.distance - progress.distance;
    const percentage = (distance - progress.distance) / totalDistance;

    const position = window.google.maps.geometry.spherical.interpolate(
      lastLineLatLng,
      nextLineLatLng,
      percentage
    );

    setRoutes((prev) => {
      return [...prev, position];
    });
    setUpdatRoute(true);
  };
  const updateRoutes = () => {
    const distance = getDistance();
    if (!distance) {
      return;
    }
    if (routes.length < 3) {
      setUpdatRoute(false);
      return;
    }
    let point1, point2;

    point1 = routes[routes.length - 3];
    point2 = routes[routes.length - 2];
    const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng);
    const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng);

    const angle = window.google.maps.geometry.spherical.computeHeading(
      point1LatLng,
      point2LatLng
    );
    const actualAngle = angle - 90;
    const markerUrl =
      'https://images.vexels.com/media/users/3/154573/isolated/preview/bd08e000a449288c914d851cb9dae110-hatchback-car-top-view-silhouette-by-vexels.png';
    const marker = document.querySelector(`[src="${markerUrl}"]`);
    if (marker) {
      // when it hasn't loaded, it's null
      marker.style.transform = `rotate(${actualAngle}deg)`;
    }
    setUpdatRoute(false);
  };

  useEffect(() => {
    updateInitPaths();
  }, [initPaths]);

  useEffect(() => {
    if (!updatePath) return;
    addPath();
  }, [updatePath]);

  useEffect(() => {
    if (path.length < 1) return;
    moveObject();
  }, [path]);

  useEffect(() => {
    if (!updateRoute) return;
    updateRoutes();
  }, [updateRoute]);

  const handleMapClick = (e) => {
    console.log('latitide = ', e.latLng.lat());
    console.log('longitude = ', e.latLng.lng());
  };

  return (
    <>
      {path.length > 0 && (
        <>
          <GoogleMap
            defaultZoom={mapConfig.zoom}
            defaultCenter={{
              lat: path[path.length - 1].lat,
              lng: path[path.length - 1].lng,
            }}
            onClick={handleMapClick}
          >
            <GoogleMarker
              position={{ lat: mapConfig.home.lat, lng: mapConfig.home.lng }}
              icon={{
                path: AiOutlineHome().props.children[0].props.d,
                fillColor: '#EADED7',
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 0.035,
                strokeColor: '#453227',
              }}
            />
            <GoogleMarker
              position={{ lat: mapConfig.store.lat, lng: mapConfig.store.lng }}
              icon={{
                path: AiOutlineShop().props.children[0].props.d,
                fillColor: '#EADED7',
                fillOpacity: 1,
                strokeWeight: 1,
                scale: 0.035,
                strokeColor: '#453227',
              }}
            />
            {/* {directions && <DirectionsRenderer directions={directions} />} */}
            {routes && (
              <>
                <Polyline path={path} options={{ strokeColor: '#453227 ' }} />
                <GoogleMarker icon={icon} position={path[path.length - 1]} />
              </>
            )}
          </GoogleMap>
        </>
      )}
    </>
  );
};
const MapComponent = withScriptjs(withGoogleMap(Map));
export default MapComponent;
//  import { AiOutlineShoppingCart, AiOutlineHome } from "react-icons/ai";
