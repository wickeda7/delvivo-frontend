import React from 'react';
import { API } from '../utils/constants';
import { cardHelper } from '../utils/helpers';
import { useCartContext } from '../context/cart_context';

const CloverCheckout = () => {
  const { cart, clearCart } = useCartContext();
  console.log(cart);
  const pay = async () => {
    const state = {
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

    const card = cardHelper(state.card);
    state.card = card;
    const data = JSON.stringify(state);
    // const data = JSON.stringify({ card: state.card });
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
  return (
    <div>
      <button onClick={pay} className='btn'>
        Pay
      </button>
    </div>
  );
};

export default CloverCheckout;
