import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { apiDrivers } from '../../../api/apiDrivers';

const ImageUpload = ({ setValues, type, values }) => {
  const [file, setFile] = useState();
  const props = {
    listType: 'picture-card',
    headers: {
      accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
    },
    file,

    onRemove: (image) => {
      setFile((state) => {
        return null;
      });
    },
    beforeUpload: (image) => {
      setFile(image);
      return false;
    },
  };

  const handleUpload = async (img) => {
    const formData = new FormData();
    formData.append('files', img);
    const res = await apiDrivers.postUpload(formData);
    setValues((state) => {
      return { ...state, [type]: res.data[0].formats.thumbnail.url };
    });
  };
  const onChange = (res) => {
    if (res.fileList.length > 0) {
      handleUpload(res.file);
    }
  };
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const onDelete = () => {
    setValues((state) => {
      return { ...state, [type]: '' };
    });
  };
  if (values && values[type] !== null) {
    return (
      <span className='ant-upload-wrapper css-dev-only-do-not-override-byeoj0 ant-upload-picture-card-wrapper'>
        <div className='ant-upload-list ant-upload-list-picture-card'>
          <div className='ant-upload-list-item-container'>
            <div className='ant-upload-list-item ant-upload-list-item-undefined'>
              <img
                src={`http://localhost:1337${values[type]}`}
                alt='Logo'
                width={86}
              />
            </div>
          </div>
        </div>
        <Button type='primary' danger size='small' onClick={onDelete}>
          <DeleteOutlined />
        </Button>
      </span>
    );
  }
  return (
    <>
      <ImgCrop rotationSlider>
        <Upload {...props} onChange={onChange}>
          {!file && '+ Upload'}
        </Upload>
      </ImgCrop>
    </>
  );
};

export default ImageUpload;
