import { getStorage } from '../utils/helpers';
import { CLOVER } from '../utils/constants';
import { apiMerchant } from '../api/apiMerchant';
import { setStorage } from '../utils/helpers';

const environment = process.env.REACT_APP_NODE_ENV;
export const initMerchant = async (url) => {
  let info = merchantInfo();

  const isMerchant = url.includes('merchant');
  if (!info && !isMerchant) {
    //get id from db
    console.log('TODO: need to check db if merchant exist');
    // for production only testing purposes B65VCADF79ZR1
    if (environment === 'production') {
      try {
        const tempInfo = await apiMerchant.getMechant('B65VCADF79ZR1');
        if (tempInfo) {
          const clover = {
            merchant_id: 'B65VCADF79ZR1',
            access_token: tempInfo.access_token,
            orderTypes: tempInfo.order_types,
          };
          setStorage(CLOVER, JSON.stringify(clover));
          return clover;
        }
      } catch (error) {
        throw { message: 'unauthorized', status: 403 }; // eslint-disable-line
      }
    } else {
      const tempInfo = await apiMerchant.getMechant('M04E9FZBWVB71');
      if (tempInfo) {
        const clover = {
          merchant_id: 'M04E9FZBWVB71',
          access_token: tempInfo.access_token,
          orderTypes: tempInfo.order_types,
        };
        setStorage(CLOVER, JSON.stringify(clover));
      }
    }
  }
  if (isMerchant) {
    const merchant_regex = new RegExp('merchant_id=(.*)&em.*');
    //const token_regex = new RegExp('access_token=(.*)');
    const merchant_array = merchant_regex.exec(window.location.search);
    // const token_array = token_regex.exec(window.location.hash);

    if (merchant_array) {
      const queryParameters = new URLSearchParams(merchant_array[0]);
      const code = queryParameters.get('code');
      //const client_id = queryParameters.get('client_id');
      const merchant_id = queryParameters.get('merchant_id');
      const employee_id = queryParameters.get('employee_id');
      // get auth token if code is present send merchantID and code to stapi server
      if (code) {
        try {
          const res = await apiMerchant.getAuthToken(
            code,
            employee_id,
            merchant_id
          );
          const clover = {
            merchant_id: queryParameters.get('merchant_id'),
            access_token: res.data.access_token,
            orderTypes: res.data.orderTypes,
          };
          setStorage(CLOVER, JSON.stringify(clover));
        } catch (error) {}
      }
    }
    throw { message: 'No', status: 426 }; // eslint-disable-line
  }
  return info;
};

export const merchantInfo = () => {
  let info = getStorage(CLOVER);
  info = JSON.parse(info);
  return info;
};

export const setStoreAddress = () => {
  let address = getStorage('address');
  if (!address) {
    apiMerchant.getAddress(merchantInfo());
  }
};
export const getStoreAddress = () => {
  let address = getStorage('address');
  return JSON.parse(address);
};
