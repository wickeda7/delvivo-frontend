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

export const cardHelper = (data) => {
  const cnumber = data.number;
  data.first6 = cnumber.substr(0, 6);
  data.last4 = cnumber.substr(-4);
  data.brand = GetCardType(cnumber);

  return data;
};
export const GetCardType = (number) => {
  // visa
  var re = new RegExp('^4');
  if (number.match(re) != null) return 'VISA';

  // Mastercard
  // Updated for Mastercard 2017 BINs expansion
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number
    )
  )
    return 'Mastercard';

  // AMEX
  re = new RegExp('^3[47]');
  if (number.match(re) != null) return 'AMEX';

  // Discover
  re = new RegExp(
    '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)'
  );
  if (number.match(re) != null) return 'Discover';

  // Diners
  re = new RegExp('^36');
  if (number.match(re) != null) return 'Diners';

  // Diners - Carte Blanche
  re = new RegExp('^30[0-5]');
  if (number.match(re) != null) return 'Diners - Carte Blanche';

  // JCB
  re = new RegExp('^35(2[89]|[3-8][0-9])');
  if (number.match(re) != null) return 'JCB';

  // Visa Electron
  re = new RegExp('^(4026|417500|4508|4844|491(3|7))');
  if (number.match(re) != null) return 'Visa Electron';

  return '';
};
