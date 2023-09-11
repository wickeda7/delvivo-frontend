import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { useUserContext } from '../../../context/user_context';
import dayjs from 'dayjs';
import { useGetOrdersData } from '../../../hooks/useOrders';

const MerchantName = () => {
  const { user } = useUserContext();
  const today = dayjs().format('M-DD-YYYY');
  const data = useGetOrdersData();
  const [total, setTotal] = useState(0);
  useEffect(() => {
    if (data) {
      setTotal(data.length);
    }
  }, [data]);

  const location = useLocation();
  const path = location.pathname.split('/').pop();
  let content = '';
  if (path === 'admin') {
    content = `Total ${total} Orders For Today (${today})`;
  }
  if (path === 'drivers') {
    content = `Drivers`;
  }
  return (
    <Wrapper>
      <div className='section-center'>
        <h3>Welcome {user?.merchant_name}</h3>
        <h5>{content}</h5>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: var(--clr-primary-10);
  width: 100%;
  min-height: 7vh;
  display: flex;
  align-items: center;

  color: var(--clr-primary-1);
  h3 {
    font-size: 1.2rem;
  }
  h5 {
    font-size: 0.7rem;
  }
  a {
    color: var(--clr-primary-3);
    padding: 0.5rem;
    transition: var(--transition);
  }
  a:hover {
    color: var(--clr-primary-1);
  }
`;
export default MerchantName;
