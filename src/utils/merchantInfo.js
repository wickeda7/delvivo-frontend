import { getStorage, setStorage } from '../utils/helpers';
import { CLOVER } from '../utils/constants';
import { getAddress } from '../services/apiProducts';


export const merchantInfo = () => {
  let info = getStorage(CLOVER);
  info = JSON.parse(info);
  return info;
};

export const getStoreName = () => {
  let address = getStorage('address');
  if (!address) {
    getAddress(merchantInfo());
  }
};
export const getStoreAddress = () => {
  let address = getStorage('address');
  return JSON.parse(address);
};
