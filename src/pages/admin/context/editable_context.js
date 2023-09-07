import React, { useContext, useState } from 'react';
import { Form } from 'antd';
import EditableComponents from '../components/EditableComponents';
import dayjs from 'dayjs';

const EditableContext = React.createContext(null);

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
  //handleSave,
  mutation,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);

  const form = useContext(EditableContext);

  const toggleEdit = () => {
    if (dataIndex === 'driverId' && record.isPickup) return;
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      const data = {};
      const [key, value] = Object.entries(values)[0];
      if (value === null) return;
      if (key === 'departureTime' || key === 'arriveTime') {
        data[key] = dayjs(value).valueOf();
        // const connect = { id: 54 };
        //data.user = connect;
      } else {
        data[key] = value.toString();
        const connect = { id: value };
        data.driver = connect;
      }
      mutation.mutate({ record, data });
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

export { EditableCell, EditableRow };
