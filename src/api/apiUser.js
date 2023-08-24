import { api } from './configs/axiosConfigs';
import { defineCancelApiObject } from './configs/axiosUtils';
import { merchantInfo } from '../utils/merchantInfo';

export const apiUser = {
  register: async function (value, cancel = false) {
    const { merchant_id } = merchantInfo();
    value.merchant_id = merchant_id;
    const response = await api.request({
      method: 'POST',
      url: `/api/users/register`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(value),
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const res = await response.data;
    return res;
  }, ///api/users/login
  login: async function (value, cancel = false) {
    const { merchant_id } = merchantInfo();
    value.merchant_id = merchant_id;
    const response = await api.request({
      method: 'POST',
      url: `/api/users/login`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(value),
      signal: cancel
        ? cancelApiObject[this.get.merchant_id].handleRequestCancellation()
            .signal
        : undefined,
    });
    const res = await response.data;
    return res;
  },
};
const cancelApiObject = defineCancelApiObject(apiUser);
