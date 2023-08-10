import { getToken } from '../utils/helpers';
import { CLOVER } from '../utils/constants';

export const merchantInfo = () => {
  let info = getToken(CLOVER);
  info = JSON.parse(info);
  return info;
};
