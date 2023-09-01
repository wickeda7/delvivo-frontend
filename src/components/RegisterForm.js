import React from 'react';
import { FormRow } from '../components';

const RegisterForm = ({ values, admin, handleChange }) => {
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
      {!admin && (
        <>
          <FormRow
            type='text'
            name='address'
            labelText='Address'
            value={values.address}
            handleChange={handleChange}
          />
          <FormRow
            type='text'
            name='city'
            labelText='City'
            value={values.city}
            handleChange={handleChange}
          />
          <FormRow
            type='text'
            name='state'
            labelText='State'
            value={values.state}
            handleChange={handleChange}
            max={2}
            optClass='stateField'
          />
          <FormRow
            type='text'
            name='zip'
            labelText='Zip'
            value={values.zip}
            handleChange={handleChange}
            max={8}
            optClass='zipcodeField'
          />

          <br style={{ clear: 'both' }} />
          <FormRow
            type='text'
            name='phoneNumber'
            labelText='Phone Number'
            value={values.phoneNumber}
            handleChange={handleChange}
          />
        </>
      )}

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

export default RegisterForm;
