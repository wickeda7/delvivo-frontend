export const formatPrice = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number / 100);
};

export const getUniqueValues = (data, type) => {
  let unique = data.map((item) => item[type]);
  if (type === 'colors') {
    unique = unique.flat();
  }

  return ['all', ...new Set(unique)];
};

export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const setStorage = (key, value) => {
  if (value) {
    localStorage.setItem(key, value);
  }
};
export const getUser = (key) => {
  let user_info = getStorage(key);
  if (!user_info) return null;
  user_info = JSON.parse(user_info);
  const { user, timestamp } = user_info;
  const now = Date.now();
  if (now >= timestamp) {
    removeStorage(key);
    return null;
  }
  return user;
};
export const removeStorage = (key) => {
  localStorage.removeItem(key);
};
