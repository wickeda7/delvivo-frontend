import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { PageHero, MapComponent } from '../components';
import { useMapsContext } from '../context/maps_context';
import { Loading } from '../components';
//https://dev.to/zerquix18/let-s-play-with-google-maps-and-react-making-a-car-move-through-the-road-like-on-uber-part-1-4eo0
//https://codesandbox.io/s/googlemaps-react-t5s84?file=/src/Main.js:2873-3027

function MapPage() {
  const { orderId } = useParams();
  const { setOrderId, mapConfig } = useMapsContext();
  setOrderId(orderId);

  return (
    <Wrapper>
      <PageHero title='Traker' />
      <div className='section section-center'>
        <div style={{ width: '100%', height: '80vh' }}>
          <MapComponent
            googleMapURL={mapConfig.url}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  .section-center {
    width: 100%;
  }
  .section {
    padding: 0.5rem;
  }
`;
export default MapPage;
