import React, { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FormRow } from '../components';
import { useModalContext } from '../context/modal_context';
import { useUserContext } from '../context/user_context';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { loginUser, isLoading, registerUser } = useUserContext();
  const { closeModal } = useModalContext();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, isMember } = values;
    let data = null;
    if (!email || !password || (!isMember && !firstName && !lastName)) {
      toast.error('Please fill out all fields');
      return;
    }
    if (isMember) {
      loginUser(email, password).then((res) => {
        if (res.user) {
          setValues(initialState);
          closeModal();
        }
      });
    } else {
      registerUser(firstName, lastName, email, password).then((res) => {
        if (res.user) {
          setValues(initialState);
          closeModal();
        }
      });
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
        {!values.isMember && (
          <FormRow
            type='text'
            name='firstName'
            labelText='First Name'
            value={values.firstName}
            handleChange={handleChange}
          />
        )}
        {!values.isMember && (
          <FormRow
            type='text'
            name='lastName'
            labelText='Last Name'
            value={values.lastName}
            handleChange={handleChange}
          />
        )}
        {/* email field */}
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />
        {/* password field */}
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />
        <button type='button' className='btn btn-cancel' onClick={close}>
          Cancel
        </button>
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'loading...' : `${btnText}`}
        </button>
        <p>
          {values.isMember ? 'Not a member yet? ' : 'Already a member? '}
          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </Wrapper>
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
export default Register;
