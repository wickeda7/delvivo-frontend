import React, { useState } from 'react';
import { Select, Tag } from 'antd';
import { useGetDriversOptions } from '../../../hooks/useDrivers';
const Selects = ({ driver, onChange }) => {
  const [editing, setEditing] = useState(false);
  const drivers = useGetDriversOptions();
  const toggleEdit = () => {
    setEditing(!editing);
  };
  const handleChange = (value) => {
    toggleEdit();
    onChange(value);
  };
  const tagText = driver
    ? `${driver.firstName} ${driver.lastName} `
    : `Select Driver`;
  if (!editing)
    return (
      <Tag onClick={toggleEdit} color={'blue'}>
        {tagText}
      </Tag>
    );
  return (
    <Select
      options={drivers}
      onChange={handleChange}
      onBlur={toggleEdit}
      autoFocus={true}
      placeholder='Select Driver'
      style={{
        width: 130,
      }}
    />
  );
};

export default Selects;
