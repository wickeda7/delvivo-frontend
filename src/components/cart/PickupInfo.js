import React from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { TimePicker } from 'antd';
import { useCartContext } from '../../context/cart_context';
const PickupInfo = () => {
  const { updateShippingInfo } = useCartContext();

  const onChange = (time) => {
    const setTime = time.format('X');
    console.log('onChange');
    updateShippingInfo('pickup', setTime);
  };
  let now = dayjs();
  // To do: Needs to get store hours from Clover API
  const format = 'h:mm A';
  return (
    <Wrapper>
      Please select time to pickup your order:
      <TimePicker
        defaultValue={dayjs(now, format)}
        format={format}
        use12Hours
        onChange={onChange}
        className='timer-margin'
      />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 2rem;
  .timer-margin {
    margin-left: 1rem;
  }
`;

export default PickupInfo;
