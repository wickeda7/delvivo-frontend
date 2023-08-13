import React, { useState } from 'react';
import styled from 'styled-components';
import { API } from '../../utils/constants';
import {
  cardHelper,
  GetCardType,
  cc_format,
  expriy_format,
} from '../../utils/cardHelper';
import { useCartContext } from '../../context/cart_context';

const initialState = {
  name: '',
  number: '',
  exp: '',
  exp_month: '',
  exp_year: '',
  brand: '',
  cvv: '',
  cardtype: 'fa fa-credit-card',
};
const CloverCheckout = () => {
  const { cart } = useCartContext();
  const [values, setValues] = useState(initialState);
  const pay = async () => {
    const card = cardHelper(values);
    delete card.cardtype;
    delete card.exp;
    let items = [];
    cart.forEach((val) => {
      items.push({
        item: { id: val.id },
        print: 'false',
        exchange: 'false',
        price: val.price,
        refunded: 'false',
        isRevenue: 'false',
        unitQty: val.amount,
        currency: 'usd',
        name: val.name,
      });
    });
    const orderCart = {
      lineItems: items,
    };
    const state2 = {
      token: null,
      showUserInfo: false,
      customerId: '',
      currency: 'usd',
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'John.Doe@corona.com',
      },
      card: {
        brand: 'VISA',
        number: '4005562231212123',
        exp_month: '04',
        exp_year: '2025',
        cvv: '123',
        country: 'us',
      },
      items: [
        {
          amount: 350,
          currency: 'usd',
          quantity: 1,
          inventory_id: 'M5X6AGB6T4JCJ',
          name: 'Cup of Soup',
        },
        {
          amount: 750,
          currency: 'usd',
          quantity: 1,
          inventory_id: 'WNJ0DWTEQ38VM',
          name: 'California Salad',
        },
      ],
    };
    const state = {
      token: null,
      customerId: '',
      currency: 'usd',
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'John.Doe@corona.com',
      },
      card: card,
      orderCart,
    };

    const data = JSON.stringify(state);
    const response = await fetch(`${API}/clover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    const resp = await response.json();
    console.log(resp);
    if (response.status !== 200) {
      throw Error(resp.message);
    }
  };

  const handleChangeCC = (e) => {
    let cartype_new = '';
    const cardtype = GetCardType(e.target.value);
    if (cardtype === 'VISA') {
      cartype_new = 'fa fa-3x fa-cc-visa';
    } else if (cardtype === 'Mastercard') {
      cartype_new = 'fa fa-3x fa-cc-mastercard';
    } else if (cardtype === 'AMEX') {
      cartype_new = 'fa fa-3x fa-cc-amex ';
    } else if (cardtype === 'Discover') {
      cartype_new = ' fa fa-3x fa-cc-discover';
    } else if (cardtype === 'Diners') {
      cartype_new = ' fa fa-3x fa-cc-diners-club';
    } else if (cardtype === 'JCB') {
      cartype_new = ' fa fa-3x fa-cc-jcb';
    } else {
      cartype_new = ' fa fa-credit-card';
    }

    setValues({
      ...values,
      brand: cardtype,
      number: e.target.value,
      cardtype: cartype_new,
    });
  };
  const onChangeExp = (e) => {
    const value = e.target.value;

    const exp = expriy_format(value);
    setValues({
      ...values,
      exp,
      exp_month: value.substr(0, 2),
      exp_year: value.substr(-2),
    });
  };
  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setValues({ ...values, [name]: value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Wrapper>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-row gridspan2 icon-relative'>
          <label htmlFor=''>Card Number</label>
          <input
            className='form-input'
            required
            type='text'
            name='number'
            data-mask='0000 0000 0000 0000'
            placeholder='XXXX-XXXX-XXXX-XXXX'
            value={cc_format(values.number)}
            onChange={handleChangeCC}
            onKeyUpCapture={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
          <i className={`${values.cardtype} far`} id='cardtype'></i>
        </div>
        <div className='form-row gridspan1 icon-relative'>
          <label htmlFor=''>Expiration Date</label>
          <input
            className='form-input'
            required
            type='text'
            name='exp'
            placeholder='mm / yy'
            value={values.exp}
            onChange={onChangeExp}
          />
          <i className='fa fa-calendar far' id='cardtype'></i>
        </div>
        <div className='form-row gridspan1 icon-relative'>
          <label htmlFor=''>CVV</label>
          <input
            className='form-input'
            required
            type='text'
            name='cvv'
            placeholder='000'
            value={values.cvv}
            onChange={handleChange}
            onKeyUpCapture={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
          />
          <i className='fa fa-lock far' id='cardtype'></i>
        </div>
        <div className='form-row gridspan2 icon-relative'>
          <label htmlFor=''>Card Name</label>
          <input
            className='form-input'
            required
            type='text'
            name='name'
            value={values.name}
            onChange={handleChange}
          />
          <i className='fa fa-user far' id='cardtype'></i>
        </div>

        <button onClick={pay} className='btn gridspan2'>
          Pay
        </button>
      </form>
    </Wrapper>
  );
};
const Wrapper = styled.section`
  margin-top: 5rem;
  display: flex;
  justify-content: center;
  .icon-relative {
    position: relative;
  }
  .form-input {
    padding-left: 40px;
  }
  .far {
    position: absolute;
    bottom: 8px;
    left: 8px;
    font-size: 20px;
    color: #555;
    padding-right: 10px;
  }
  form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 8px;
    width: auto;
    min-height: auto;
  }
  .gridspan1 {
    grid-column: span 1;
  }
  .gridspan2 {
    grid-column: span 2;
  }
  article {
    border: 1px solid var(--clr-grey-8);
    border-radius: var(--radius);
    padding: 1.5rem 3rem;
  }
  h4,
  h5,
  p {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
  p {
    text-transform: capitalize;
  }
  h4 {
    margin-top: 2rem;
  }
  @media (min-width: 776px) {
    justify-content: flex-end;
  }
  .btn {
    width: 100%;
    margin-top: 1rem;
    text-align: center;
    font-weight: 700;
  }
`;

export default CloverCheckout;
