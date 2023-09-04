import React from 'react';
import styled from 'styled-components';

import DriversTable from './components/DriversTable';
import DriverDetail from './components/DriverDetail';
import { Loading } from '../../components';
import { useGetDrivers } from '../../hooks/useDrivers';

const Drivers = () => {
  const { data, isLoading } = useGetDrivers();
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
        <DriversTable />
        <DriverDetail />
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
  }

  .half {
    width: 50%;
  }
`;
export default Drivers;
