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

export const getToken = (key) => {
  return localStorage.getItem(key);
};

export const setToken = (key, value) => {
  if (value) {
    localStorage.setItem(key, value);
  }
};

export const removeToken = (key) => {
  localStorage.removeItem(key);
};
