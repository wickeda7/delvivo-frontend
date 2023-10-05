import { api } from './configs/axiosConfigs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { RESTURL } from '../utils/constants';
import { setStorage } from '../utils/helpers';
import { merchantInfo } from '../utils/merchantInfo';
import { CLOVER } from '../utils/constants';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
export const apiMerchant = {
  getAddress1: async function (merchant_id, cancel = false) {
    const response = await api.request({
      url: `/api/merchants/${merchant_id}`,
      method: 'get',
      headers: {
        accept: 'application/json',
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const data = await response.data;
    return data;
  },
  getOrderType: async function (cancel = false) {
    const { access_token, merchant_id } = merchantInfo();
    const response = await api.request({
      url: `${RESTURL}/v3/merchants/${merchant_id}/order_types`,
      method: 'get',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const data = await response.data;
    console.log(data);
  },
  getAuthToken: async function (
    code,
    employee_id,
    merchant_id,
    cancel = false
  ) {
    const response = await api.request({
      method: 'POST',
      url: `/api/clover`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ code, employee_id, merchant_id }),
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const res = await response.data;
    return res;
  },
  getAddress2: async function (info, cancel = false) {
    const { access_token, merchant_id } = info;
    const response = await api.request({
      url: `${RESTURL}/v3/merchants/${merchant_id}/address`,
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const data = await response.data;
    data.address = data.address1;
    delete data.href;
    delete data.country;
    delete data.address1;

    console.log('todo: address to reduce??');
    setStorage('address', JSON.stringify(data));
    return data;
  },
  getAddress: async function (info, cancel = false) {
    const { access_token, merchant_id } = info;
    try {
      const response = await api.request({
        url: `${RESTURL}/v3/merchants/${merchant_id}/address`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        signal: cancel
          ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
              .signal
          : undefined,
      });
      const address = await response.data;
      if (address.address1) {
        const addr = `${address.address1}, ${address.city}, ${address.state} ${address.zip}`;
        const response = await api.request({
          url: `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_API_KEY}&address=${addr}`,
          method: 'get',

          signal: cancel
            ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
                .signal
            : undefined,
        });
        const res = await response.data;
        delete address.href;
        delete address.country;
        address.address = address.address1;
        address.lat = res.results[0].geometry.location.lat;
        address.lng = res.results[0].geometry.location.lng;
        delete address.address1;
      }
      info.address = address;
      setStorage(CLOVER, JSON.stringify(info));
      console.log(
        'todo: address to reduce??',
        JSON.stringify({ address: address })
      );
      await api.request({
        method: 'PUT',
        url: `/api/merchants/${merchant_id}`,
        data: JSON.stringify({ address: address }),
        headers: {
          'Content-Type': 'application/json',
        },
        signal: cancel
          ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
              .signal
          : undefined,
      });
      return address;
    } catch (error) {}
  },
  getMechant: async function (id, cancel) {
    const response = await api.request({
      method: 'GET',
      url: `/api/merchants?filters[merchant_id][$eq]=${id}`,
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    //console.log(response.data.data[0].attributes);
    return response.data.data[0].attributes;
  },
  postMerchant: async function (
    merchant_id,
    employee_id,
    client_id,
    access_token,
    cancel
  ) {
    const info = {
      merchant_id,
      employee_id,
      client_id,
      access_token,
    };
    await api.request({
      method: 'POST',
      url: `/api/merchants`,
      data: JSON.stringify({ data: info }),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
  },
  putMerchant: async function (data, cancel) {
    const { info, values, email } = data;
    info.orderTypes.delivery.minOrderAmount = values.minOrderAmount
      ? Math.round(values.minOrderAmount * 100)
      : '';
    info.orderTypes.delivery.fee = values.fee
      ? Math.round(values.fee * 100)
      : '';
    info.orderTypes.delivery.maxRadius = values.maxRadius;
    info['notify_email'] = email;
    const response = await api.request({
      method: 'PUT',
      url: `/api/merchants/${info.merchant_id}`,
      data: JSON.stringify({ data: info }),
      headers: {
        'Content-Type': 'application/json',
      },
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    return response.data;
  },
};

const cancelApiObject = defineCancelApiObject(apiMerchant);
