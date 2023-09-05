import React, { useState } from 'react';
import styled from 'styled-components';

import DriversTable from './components/DriversTable';
import DriverDetail from './components/DriverDetail';
import { Loading } from '../../components';
import { useGetDrivers } from '../../hooks/useDrivers';

const Drivers = () => {
  const { data, isLoading } = useGetDrivers();
  const [newDriver, setNewDriver] = useState(false);

  if (!data) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div className='container'>
        <DriversTable setNewDriver={setNewDriver} />
        <DriverDetail newDriver={newDriver} setNewDriver={setNewDriver} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: block;

  .right-padding {
    padding-right: 2rem;
  }
  .container {
    padding: 1.5rem;
    display: flex;
    margin: 0 auto;
  }

  .half {
    width: 50%;
  }
`;
export default Drivers;
