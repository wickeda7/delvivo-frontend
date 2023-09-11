import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { FormRow, RegisterForm } from '../components';
import { useModalContext } from '../context/modal_context';
import { useUserContext } from '../context/user_context';

const initialState = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: 'CA',
  zip: '',
  country: 'US',
  email: '',
  password: '',
  phoneNumber: '',
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading, members } = useUserContext();
  const { closeModal } = useModalContext();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      city,
      state,
      zip,
      phoneNumber,
      isMember,
    } = values;
    if (
      !email ||
      !password ||
      (!isMember &&
        !firstName &&
        !lastName &&
        !address &&
        !city &&
        !state &&
        !zip &&
        !phoneNumber)
    ) {
      toast.error('Please fill out all fields');
      return;
    }
    const data = await members(values);
    if (data) {
      setValues(initialState);
      closeModal();
    }
  };
  const close = () => {
    setValues(initialState);
    closeModal();
  };
  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const btnText = values.isMember ? 'Login' : 'Register';

  return (
    <Wrapper>
      <form className='form' onSubmit={onSubmit}>
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {/* name field */}
        {!values.isMember ? (
          <RegisterForm
            values={values}
            handleChange={handleChange}
            admin={false}
          />
        ) : (
          <>
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
        )}
      </form>
      <button type='button' className='btn btn-cancel' onClick={close}>
        Cancel
      </button>
      <button
        type='submit'
        className='btn btn-block'
        disabled={isLoading}
        onClick={onSubmit}
      >
        {isLoading ? 'loading...' : `${btnText}`}
      </button>
      <p>
        {values.isMember ? 'Not a member yet? ' : 'Already a member? '}
        <button type='button' onClick={toggleMember} className='member-btn'>
          {values.isMember ? 'Register' : 'Login'}
        </button>
      </p>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  p {
    margin: 1rem;
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
  .form {
    border-radius: none;
    box-shadow: none;
    min-height: 0;
  }
  .form:hover {
    box-shadow: none;
  }
`;
export default Register;
