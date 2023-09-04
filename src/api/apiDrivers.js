import { api } from './configs/axiosConfigs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { merchantInfo } from '../utils/merchantInfo';
import { toast } from 'react-toastify';
export const apiDrivers = {
  getDrivers: async function (cancel = false) {
    const { merchant_id } = merchantInfo();
    const res = await api.request({
      method: 'GET',
      url: `/api/drivers?filters[merchant_id][$eq]=${merchant_id}`,
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    const data = await res.data.data;
    const drivers = data.reduce((acc, cur) => {
      let temp = {};
      temp.key = cur.id;
      temp.id = cur.id;
      temp = { ...temp, ...cur.attributes };
      acc.push(temp);
      return acc;
    }, []);
    return drivers;
  },
  postDriver: async function (driver, cancel = false) {
    const { merchant_id, access_token } = merchantInfo();
    if (!driver.merchant_id) {
      driver.merchant_id = merchant_id;
    }
    await api.request({
      method: 'POST',
      url: `/api/drivers`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ driver }),
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
  },
  putDriver: async function (newEntry, cancel = false) {
    const { id, data } = newEntry;

    try {
      const res = await api.request({
        method: 'PUT',
        url: `/api/drivers/${id}`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ data }),
        signal: cancel
          ? cancelApiObject[this.get.id].handleRequestCancellation().signal
          : undefined,
      });
      toast.success(
        `Driver ${data.firstName} ${data.lastName} has been updated successfully!`
      );
      return res.data.data;
    } catch (error) {
      toast.error(
        `Driver ${data.firstName} ${data.lastName} has not been updated!`
      );
    }
  },
  postUpload: async function (data, cancel = false) {
    const { merchant_id, access_token } = merchantInfo();
    const res = await api.request({
      method: 'POST',
      url: `/api/upload`,
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
      },
      data: data,
      signal: cancel
        ? cancelApiObject[this.get.id].handleRequestCancellation().signal
        : undefined,
    });
    return res;
  },
};
const cancelApiObject = defineCancelApiObject(apiDrivers);
