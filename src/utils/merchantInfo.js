import { getStorage } from '../utils/helpers';
import { CLOVER } from '../utils/constants';
import { apiMerchant } from '../api/apiMerchant';

export const merchantInfo = () => {
  let info = getStorage(CLOVER);
  info = JSON.parse(info);
  return info;
};

export const getStoreName = () => {
  let address = getStorage('address');
  if (!address) {
    apiMerchant.getAddress(merchantInfo());
  }
};
export const getStoreAddress = () => {
  let address = getStorage('address');
  return JSON.parse(address);
};
