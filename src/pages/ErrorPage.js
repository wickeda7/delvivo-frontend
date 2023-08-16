import React from 'react';
import styled from 'styled-components';
import { Link, useRouteError } from 'react-router-dom';
const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);
  if (error.status == 426) {
    return (
      <Wrapper className='page-100'>
        <section>
          <h3>Welcome to Delvivo please click continue to synch data.</h3>
          <Link to='/' className='btn' reloadDocument>
            Continue
          </Link>
        </section>
      </Wrapper>
    );
  }
  if (error.status == 403) {
    return (
      <Wrapper className='page-100'>
        <section>
          <h3>There is something wrong please contact Clover</h3>
        </section>
      </Wrapper>
    );
  }
  return (
    <Wrapper className='page-100'>
      <section>
        <h1>404</h1>
        <h3>Sorry, the page you tried cannot be found</h3>
        <Link to='/' className='btn'>
          back home
        </Link>
      </section>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  background: var(--clr-primary-10);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  h1 {
    font-size: 10rem;
  }
  h3 {
    text-transform: none;
    margin-bottom: 2rem;
  }
`;

export default ErrorPage;
