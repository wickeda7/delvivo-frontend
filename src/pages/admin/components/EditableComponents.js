import React from 'react';
import { TimePicker, Switch, Select } from 'antd';
import dayjs from 'dayjs';
import { useGetDriversOptions } from '../../../hooks/useDrivers';

const EditableComponents = ({ dataIndex, onChange, toggleEdit }) => {
  const format = 'h:mm A';
  const now = dayjs().format(format);
  const drivers = useGetDriversOptions();
  switch (dataIndex) {
    case 'driverId':
      return (
        <Select
          options={drivers}
          onChange={onChange}
          placeholder='Select Driver'
          style={{
            width: 120,
          }}
        />
      );
    case 'departureTime':
    case 'arriveTime':
      return (
        <TimePicker
          defaultValue={dayjs(now, format)}
          format={format}
          onChange={onChange}
          changeOnBlur={true}
        />
      );
    case 'available':
      return (
        <Switch
          defaultChecked
          onChange={(checked) => {
            console.log(checked);
            toggleEdit(checked);
          }}
        />
      );
    default:
      throw new Error(`unknown dataIndex: ${dataIndex}`); //console.log(dayjs(departureTime).format('h:mm A'));
  }
};

export default EditableComponents;
// <Input ref={inputRef} onPressEnter={save} onBlur={save} />
// const EditableComponents = (dataIndex, onChange) => {
//     const time = dayjs().format('h:mm a');
//     console.log(time);
//     switch (dataIndex) {
//       case 'driverId':
//         console.log('select');
//         return (
//           <TimePicker
//             use12Hours
//             defaultValue={time}
//             format='h:mm a'
//             onChange={onChange}
//           />
//         );
//       case 'departureTime':
//       case 'arriveTime':
//         return (
//           <TimePicker
//             use12Hours
//             defaultValue={time}
//             format='h:mm a'
//             onChange={onChange}
//           />
//         );
//     }
//   };
//const inputRef = useRef(null);
//   useEffect(() => {
//     if (editing) {
//       inputRef.current.focus();
//     }
//   }, [editing]);
