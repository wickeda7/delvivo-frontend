import React, { useContext, useState } from 'react';
import { Form, Tag } from 'antd';
import EditableComponents from '../components/EditableComponents';
import dayjs from 'dayjs';
import { formatPrice } from '../../../utils/helpers';
const EditableContext = React.createContext(null);
const defaultColumns = [
  {
    title: 'Order ID',
    dataIndex: 'orderId',
    width: 100,
    key: 'orderId',
    // render: (text) => < dangerouslySetInnerHTML={{ __html: text }} />,
    render: (_, { orderId, orderContent }) => (
      <>
        {orderId}
        <br /> <b>{formatPrice(orderContent.total)}</b>
      </>
    ),
  },
  {
    title: 'Purchase Time',
    dataIndex: 'created',
    width: 100,
    key: 'created',
    //render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} />,
    render: (_, { isPickup, created, orderContent }) => {
      const time = dayjs(created).format('h:mm A');
      if (isPickup) {
        return (
          <>
            {time}
            <br /> <b>{orderContent.note}</b>
          </>
        );
      } else {
        return (
          <>
            {time}
            <br /> <b>Delivery</b>
          </>
        );
      }
    },
  },

  {
    title: 'Driver',
    dataIndex: 'driverId',
    width: 100,
    key: 'driverId',
    editable: true,
  },
  {
    title: 'Start Delivery',
    dataIndex: 'departureTime',
    width: 100,
    editable: true,
    key: 'departureTime',
    render: (_, { departureTime }) =>
      departureTime && (
        <>
          <Tag color={'yellow'} key={departureTime}>
            {dayjs(departureTime).format('h:mm A')}
          </Tag>
        </>
      ),
  },
  {
    title: 'Delivered',
    dataIndex: 'arriveTime',
    width: 100,
    editable: true,
    key: 'arriveTime',
    render: (_, { arriveTime }) =>
      arriveTime && (
        <>
          <Tag color={'green'} key={arriveTime}>
            {dayjs(arriveTime).format('h:mm A')}
          </Tag>
        </>
      ),
  },
];

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);

  const form = useContext(EditableContext);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      const [val] = Object.entries(values)[0];
      if (val) {
        handleSave(record, values);
      }
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    //dataIndex == 'driverId' use select else use timepicker;
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: false,
            message: `${title} is required.`,
          },
        ]}
      >
        <EditableComponents
          dataIndex={dataIndex}
          onChange={save}
          toggleEdit={toggleEdit}
        />
        {/* <Input ref={inputRef} onPressEnter={save} onBlur={save} /> */}
        {/* EditableComponents(dataIndex, onChange) */}
      </Form.Item>
    ) : (
      //   <TimePicker use12Hours format='h:mm a' />
      <div
        className='editable-cell-value-wrap'
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export { defaultColumns, EditableCell, EditableRow };
