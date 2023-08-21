export const cardCheckoutCss = (inputtxt) => {
  var matches = inputtxt.match(/(\d+)/);
  var cardno = '';
  if (matches) {
    cardno = inputtxt.split(' - ').join('');
  }
  var cardtype1 = '';
  //var visa = /^(?:4[0-9]{16}(?:[0-9]{3})?)$/;
  var visa = /^(?:4[0-9]{2}?)$/;
  var mastercardRegEx = /^(?:5[1-5][0-9]{3})$/;
  var amexpRegEx = /^(?:3[47][0-9]{3})$/;
  var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{5})$/;
  if (visa.test(cardno) === true) {
    //eg:4651970022334445
    cardtype1 = 'fa fa-3x fa-cc-visa';
  } else if (mastercardRegEx.test(cardno) === true) {
    cardtype1 = 'fa fa-3x fa-cc-mastercard';
  } else if (amexpRegEx.test(cardno) === true) {
    cardtype1 = 'fa fa-3x fa-cc-amex ';
  } else if (discovRegEx.test(cardno) === true) {
    cardtype1 = ' fa fa-3x fa-cc-discover';
  }
  return cardtype1;
};
export const cc_format = (value) => {
  const v = value.replace(/[^0-9]/gi, '').substr(0, 16);

  const parts = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.substr(i, 4));
  }
  return parts.length > 1 ? parts.join('-') : value;
};
export const expriy_format = (value) => {
  const expdate = value;
  const expDateFormatter =
    expdate.replace(/\//g, '').substring(0, 2) +
    (expdate.length > 2 ? '/' : '') +
    expdate.replace(/\//g, '').substring(2, 4);

  return expDateFormatter;
};
export const cardHelper = (data) => {
  let res = {};
  const cnumber = data.number.replace(/\D/g, '');
  let brand = GetCardType(cnumber);
  switch (brand) {
    case 'Mastercard':
      brand = 'MC';
      break;
    case 'Diners':
    case 'Diners - Carte Blanche':
      brand = 'DINERS_CLUB';
      break;
    case 'Visa Electron':
      brand = 'VISA';
      break;
    case 'Discover':
      brand = 'DISCOVER';
      break;
    default:
      brand = '';
  }
  res.first6 = cnumber.substr(0, 6);
  res.last4 = cnumber.substr(-4);
  res.brand = brand;
  res.exp_month = data.exp_month;
  res.exp_year = '2025';
  res.cvv = data.cvv;
  res.name = data.name;
  res.number = cnumber;
  res.country = 'us';
  return res;
};

// export const cardHelper = (data) => {
//   const cnumber = data.number;
//   data.first6 = cnumber.substr(0, 6);
//   data.last4 = cnumber.substr(-4);
//   data.brand = GetCardType(cnumber);

//   return data;
// };
export const GetCardType = (number) => {
  let re = number.replace(/\D/g, '');
  // visa
  re = new RegExp('^4');
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
export const checkErrors = (shipping_info, total_amount) => {
  let error = '';

  if (!shipping_info.orderType) {
    error = 'Please select shipping method';
  }
  if (shipping_info.orderType.delivery) {
    const minAmount = shipping_info.orderType.delivery.minOrderAmount;
    const radius = shipping_info.orderType.delivery.maxRadius;

    if (!shipping_info.info || radius < shipping_info.info.range) {
      error = 'Please enter valid address';
    }
    if (total_amount < minAmount) {
      error = 'Minimum order amount is $' + minAmount;
    }
  }

  return error;
};
