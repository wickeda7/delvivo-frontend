import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiDrivers } from '../../../api/apiDrivers';
import { FormRow } from '../../../components';
import { Switch, Button } from 'antd';
import ImageUpload from './ImageUpload';

const initialState = {
  id: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: 'CA',
  zip: '',
  dl: '',
  make: '',
  model: '',
  year: '',
  color: '',
  plate: '',
  available: true,
  profileImg: '',
  carImg: '',
  merchant_id: '',
};

const DriverDetail = () => {
  const queryClient = useQueryClient();
  const [values, setValues] = useState(initialState);
  const data = queryClient.getQueryData(['drivers']);

  const mutation = useMutation({
    mutationFn: async (newEntry) => {
      return apiDrivers.putDriver(newEntry);
    },
    onSuccess: (newData) => {
      const { id, attributes } = newData;
      queryClient.setQueryData(['drivers'], (old) => {
        return old.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              ...attributes,
            };
          }
          return item;
        });
      });
    },
  });

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };
  const onChange = (checked) => {
    setValues({ ...values, available: checked });
  };
  useEffect(() => {
    const detail = data ? data[0] : initialState;
    setValues(detail);
  }, []);
  //

  const onSubmit = (e) => {
    e.preventDefault();
    return false;
  };
  const handleAdd = async () => {
    mutation.mutate({ id: data[0].id, data: values });
    return false;
  };
  return (
    <Wrapper>
      <form className='form' onSubmit={onSubmit}>
        <h3>Driver Detail</h3>
        <div className='form-contrainer'>
          <div className='form-row4'>
            <FormRow
              type='text'
              name='firstName'
              labelText='First Name'
              value={values?.firstName}
              handleChange={handleChange}
            />
            <FormRow
              type='text'
              name='lastName'
              labelText='Last Name'
              value={values?.lastName}
              handleChange={handleChange}
            />
            <FormRow
              type='text'
              name='phone'
              value={values?.phone}
              handleChange={handleChange}
            />
            <FormRow
              type='text'
              name='email'
              value={values?.email}
              handleChange={handleChange}
            />
          </div>
          <section>
            <div className='form-row6'>
              <FormRow
                type='text'
                name='address'
                value={values?.address}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='city'
                value={values?.city}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='state'
                value={values?.state}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='zip'
                value={values?.zip}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='dl'
                labelText='DL '
                value={values?.dl}
                handleChange={handleChange}
              />
            </div>
            <div className='form-row4 '>
              <div className='form-row ' style={{ textAlign: 'center' }}>
                <label htmlFor='plate' className='form-label'>
                  Profile Image
                </label>
                <ImageUpload
                  setValues={setValues}
                  type='profileImg'
                  values={values}
                />
              </div>
            </div>
          </section>
          <h3>Car Info</h3>
          <section>
            <div className='form-row5'>
              <FormRow
                type='text'
                name='make'
                value={values?.make}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='model'
                value={values?.model}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='year'
                value={values?.year}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='color'
                value={values?.color}
                handleChange={handleChange}
              />
              <FormRow
                type='text'
                name='plate'
                value={values?.plate}
                handleChange={handleChange}
              />
              <div className='form-row ' style={{ textAlign: 'center' }}>
                <label htmlFor='plate' className='form-label'>
                  Availability
                </label>
                <Switch
                  defaultChecked={values?.available}
                  onChange={onChange}
                  size='small'
                />
              </div>
            </div>
            <div className='form-row4 '>
              <div className='form-row ' style={{ textAlign: 'center' }}>
                <label htmlFor='plate' className='form-label'>
                  Vihicle Image
                </label>
                <ImageUpload
                  setValues={setValues}
                  type='carImg'
                  values={values}
                />
              </div>
            </div>
          </section>
          <section>
            <div className='form-footer '>
              <Button
                onClick={handleAdd}
                type='primary'
                style={{
                  marginBottom: 16,
                  float: 'right',
                }}
              >
                Submit
              </Button>
            </div>
          </section>
        </div>
      </form>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  width: 50%;
  .form {
    border-top: 8px solid var(--clr-primary-5);
    background: var(--clr-white);
    width: 100%;
    max-width: 100%;
    padding: 1rem;
  }
  .form h3 {
    font-size: 1rem;
  }
  .form-label {
    font-size: 12px;
  }
  .form-container {
    display: flex;
    flex-direction: column;
  }
  .form-row4 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 0.4rem;
  }
  .form-row5 {
    display: grid;
    grid-template-columns: 2fr 2fr 0.8fr 1fr 1fr 1fr;
    gap: 0.4rem;
  }
  .form-row6 {
    display: grid;
    grid-template-columns: 3fr 2fr 0.5fr 1fr 1fr;
    gap: 0.4rem;
  }
  .form-footer {
    display: flex;
    justify-content: flex-end;
  }
  //   .form-contrainer {
  //     display: grid;
  //     grid-template-columns: 1fr 1fr 1fr 1fr;
  //     gap: 0.5rem;
  //   }
`;
export default DriverDetail;
