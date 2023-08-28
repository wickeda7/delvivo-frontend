import React, { useState } from 'react';
import styled from 'styled-components';
import { Spin, Alert } from 'antd';
import { toast } from 'react-toastify';
import { LoadingOutlined } from '@ant-design/icons';
import { FormRow } from '../../components';
import { apiUser } from '../../api/apiUser';

const Synch = () => {
  const [clover, setClover] = useState(null);
  const [isLoading, setIsLoading] = useState('');
  const [error, setError] = useState({});
  const antIcon = (
    <LoadingOutlined style={{ fontSize: 24, color: '#eaded7' }} spin />
  );

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    if (name === 'clover') {
      setClover(value);
    }
  };
  const handleClover = async () => {
    setIsLoading('customer');
    try {
      const res = await apiUser.getUser(clover);
      if (res) {
        toast.success(`Clover Id ${res.data.cloverId} is already synched`);
        setIsLoading(false);
        setClover('');
      }
    } catch (error) {
      const { response } = error;
      if (response) {
        setError({ customer: true, message: response.data.error.message });
        setIsLoading(false);
        return;
      }
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (clover) {
      handleClover();
    }
  };
  return (
    <Wrapper>
      <div className='section-center container'>
        <div>
          <form className='form'>
            <h3>Customers</h3>
            {error?.customer && (
              <Alert variant='danger' type='error' message={error.message} />
            )}
            <FormRow
              type='text'
              name='clover'
              labelText={'Clover Customer Id'}
              value={clover ? clover : null}
              handleChange={handleChange}
            />
            <button
              type='submit'
              className='btn btn-block'
              disabled={isLoading === 'customer'}
              onClick={onSubmit}
            >
              <span>Synch Customer </span>
              {isLoading === 'customer' ? <Spin indicator={antIcon} /> : ''}
            </button>
          </form>
        </div>
        <div>
          <form className='form'>
            <h3>Orders</h3>
          </form>
        </div>
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
    display: grid;
    grid-template-columns: 2fr 1fr;
    padding: 1.5rem;
  }
  .form {
    border-top: 8px solid var(--clr-primary-5);
    background: var(--clr-white);
    min-height: 25vh;
  }
  h3 {
    font-size: 1rem;
  }
  .form-label {
    font-size: 0.8rem;
  }
  span {
    margin-right: 1rem;
  }
`;

export default Synch;
