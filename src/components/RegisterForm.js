import React, { useState } from 'react';
import styled from 'styled-components';
import { FormRow } from '../components';

const RegisterForm = ({ values, setValues, handleChange }) => {
  return (
    <>
      <FormRow
        type='text'
        name='firstName'
        labelText='First Name'
        value={values.firstName}
        handleChange={handleChange}
      />
      <FormRow
        type='text'
        name='lastName'
        labelText='Last Name'
        value={values.lastName}
        handleChange={handleChange}
      />
      <FormRow
        type='email'
        name='email'
        value={values.email}
        handleChange={handleChange}
      />
      <FormRow
        type='password'
        name='password'
        value={values.password}
        handleChange={handleChange}
      />
    </>
  );
};
const Wrapper = styled.div`
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn-cancel {
    background: var(--grey-900);
    margin-right: 1rem;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--clr-primary-5);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
  }
`;
export default RegisterForm;
