import React from 'react';
import styled from 'styled-components';
import { useUserContext } from '../../../context/user_context';
const MerchantName = () => {
  const { user } = useUserContext();

  return (
    <Wrapper>
      <div className='section-center'>
        <h3>Welcome {user?.merchant_name}</h3>
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
