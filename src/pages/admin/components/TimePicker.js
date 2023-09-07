import React, { useState } from 'react';
import styled from 'styled-components';
import { TimePicker, Tag } from 'antd';
import dayjs from 'dayjs';

const TimePickers = ({ type, time, onChange }) => {
  const [editing, setEditing] = useState(false);
  const format = 'h:mm A';
  const now = dayjs();
  const defaultTime = time ? dayjs(time, format) : dayjs(now, format);
  const tagText = time ? dayjs(time).format('h:mm A') : `Select Time`;
  const color = type === 'departureTime' ? 'yellow' : 'green';

  const toggleEdit = () => {
    setEditing(!editing);
  };
  const handleChange = (time, timeString) => {
    toggleEdit();
    if (time === null) return;
    onChange(time, timeString);
  };
  if (!editing)
    return (
      <Tag onClick={toggleEdit} color={color}>
        {tagText}
      </Tag>
    );
  return (
    <TimePicker
      use12Hours
      format={format}
      defaultValue={defaultTime}
      onChange={handleChange}
      changeOnBlur={true}
    />
  );
};
const Wrapper = styled.div`
  display: inline;
`;
export default TimePickers;
