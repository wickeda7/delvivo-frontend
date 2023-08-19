import React from 'react';
import styled from 'styled-components';
import { Alert } from 'antd';
import { formatPrice } from '../../utils/helpers';
import Card from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';

const PaidInfo = ({ info }) => {
  console.log('paidInfo', info);
  return (
    <Wrapper>
      <div>
        <article>
          <Alert message='Order Success' type='success' showIcon />
          <Card
            number={`${info.source.first6}******${info.source.last4}`}
            name={info.source.name}
            expiry={`${info.source.exp_month}/${info.source.exp_year}`}
            cvc={'***'}
            preview={true}
          />
          <p>
            <b>Transaction ID :</b> {info.id}
          </p>
          <p>
            <b>Ref Num :</b> {info.ref_num}
          </p>
          <p>
            <b>Auth Code :</b> {info.auth_code}
          </p>
          <p>
            <b>Email :</b> {info.email}
          </p>
          <p>
            <b>Tax :</b> {formatPrice(info.tax_amount)}
          </p>
          <p>
            <b>Amount :</b> {formatPrice(info.amount)}
          </p>
        </article>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-bottom: 1.5rem;
  article {
    border: 1px solid var(--clr-grey-8);
    border-radius: var(--radius);
    padding: 1.5rem 3rem;
  }

  p {
    text-transform: capitalize;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.8rem;
  }
  .rccs {
    margin-top: 1rem;
  }
`;
export default PaidInfo;
