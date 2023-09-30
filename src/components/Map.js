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
  const { orderId, mapConfig } = useMapsContext();
  const [count, setCount] = useState(0);
  const [routes, setRoutes] = useState([]);
  const path = [
    { lat: 37.784696619459424, lng: -122.40453095257669 },
    { lat: 37.78383173603549, lng: -122.40350098431497 },
    { lat: 37.78206118290115, lng: -122.40475416183472 },
    { lat: 37.78072824749402, lng: -122.399724434022 },
    { lat: 37.77965980325348, lng: -122.40090460598856 },
    { lat: 37.77815038745164, lng: -122.40283579647928 },
    { lat: 37.77611517128496, lng: -122.40541071713358 },
    { lat: 37.775250187447526, lng: -122.40614027798563 },
    { lat: 37.7701109571536, lng: -122.40583651277926 },
    { lat: 37.763461653973046, lng: -122.4049782058945 },
    { lat: 37.76103586648903, lng: -122.40628712389376 },
    { lat: 37.758202853129276, lng: -122.40495674822238 },
    { lat: 37.75397857783035, lng: -122.40304701540377 },
    { lat: 37.74937395833757, lng: -122.40245819091797 },
    { lat: 37.74551950385969, lng: -122.40489354482838 },
    { lat: 37.74266892831028, lng: -122.40671744695851 },
    { lat: 37.73910851323627, lng: -122.40750074386597 },
    { lat: 37.73754440334996, lng: -122.4078332459087 },
    { lat: 37.73611897573249, lng: -122.40869155279347 },
    { lat: 37.73386199254345, lng: -122.4114166771526 },
    { lat: 37.731961321757495, lng: -122.41620173803517 },
    { lat: 37.73160494055353, lng: -122.42216697088429 },
    { lat: 37.73148614643772, lng: -122.42401233068654 },
    { lat: 37.73199526273508, lng: -122.42920508733937 },
    { lat: 37.73162191112596, lng: -122.4343978439922 },
    { lat: 37.73012848586486, lng: -122.43866792074391 },
    { lat: 37.72829856378686, lng: -122.44073867797852 },
    { lat: 37.7271076017836, lng: -122.44506754976808 },
    { lat: 37.72737914696622, lng: -122.44487443071901 },
    { lat: 37.72507098117783, lng: -122.44669833284914 },
    { lat: 37.72221961824333, lng: -122.4477712164551 },
    { lat: 37.7192493317994, lng: -122.44839348894655 },
    { lat: 37.71626195216797, lng: -122.44903721911012 },
    { lat: 37.710069110137994, lng: -122.4570894241333 },
    { lat: 37.70865350099043, lng: -122.45635733736339 },
    { lat: 37.70770284823871, lng: -122.455026961692 },
    { lat: 37.707533087535545, lng: -122.45416865480723 },
  ];
  console.log('path = ', path.length);
  // 28;
  setTimeout(() => {
    if (count === path.length) {
      return;
    }
    setRoutes((oldArray) => [...oldArray, path[count]]);
    setCount(count + 1);
    console.log('count = ', routes);
  }, 2000);
  useEffect(() => {}, []);
  const handleMapClick = (e) => {
    console.log('latitide = ', e.latLng.lat());
    console.log('longitude = ', e.latLng.lng());
  };
  return (
    <>
      {count}
      <GoogleMap
        defaultZoom={mapConfig.zoom}
        defaultCenter={{ lat: mapConfig.home.lat, lng: mapConfig.home.lng }}
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
        <Polyline path={routes} options={{ strokeColor: '#453227 ' }} />
      </GoogleMap>
    </>
  );
};
const MapComponent = withScriptjs(withGoogleMap(Map));
export default MapComponent;
//  import { AiOutlineShoppingCart, AiOutlineHome } from "react-icons/ai";
