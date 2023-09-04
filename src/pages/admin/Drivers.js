import React from 'react';
import styled from 'styled-components';

import DriversTable from './components/DriversTable';
import DriverDetail from './components/DriverDetail';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiDrivers } from '../../api/apiDrivers';
import { Loading } from '../../components';

const Drivers = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      return apiDrivers.getDrivers();
    },
  });
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
