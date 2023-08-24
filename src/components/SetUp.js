import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { RegisterForm } from '../components';
import { useUserContext } from '../context/user_context';
import { useNavigate } from 'react-router-dom';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  isMember: true,
  admin: true,
};

const SetUp = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading, members } = useUserContext();
  const navigate = useNavigate();
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = values;
    if (!email || !password || !firstName || !lastName) {
      toast.error('Please fill out all fields');
      return;
    }
    const data = await members(values);
    const newUser = await data;
    if (newUser) {
      setValues(initialState);
      navigate('/admin');
    }
  };
  return (
    <Wrapper>
      <section>
        <h3>Welcome to Delvivo please create your admin log in.</h3>
        {/* <Link to='/' className='btn' reloadDocument>
          Continue
        </Link> */}
        <form className='form'>
          <h3>Register</h3>
          <RegisterForm values={values} handleChange={handleChange} />
        </form>
        <div className='container'>
          <button
            className='btn btn-block'
            disabled={isLoading}
            onClick={onSubmit}
          >
            {isLoading ? 'loading...' : `Register`}
          </button>
        </div>
      </section>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  margin: 0;
  height: 100vh;
  display: grid;
  place-items: center;
  .container {
    width: 90vw;
    max-width: var(--fixed-width);
    padding: 1rem 2.5rem;
    margin: 0rem auto;
    background: var(--clr-white);
  }
  .form {
    border-top: 8px solid var(--clr-primary-5);
    background: var(--clr-white);
  }
  .hideContainer {
    display: none;
  }
`;
export default SetUp;
