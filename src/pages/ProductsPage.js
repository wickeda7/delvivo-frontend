import React from 'react';
import styled from 'styled-components';
import { Filters, ProductList, Sort, PageHero } from '../components';
import { merchantInfo } from '../utils/merchantInfo';
import { categoriesListQuery } from '../hooks/useProducts';

export const loader = (queryClient) => async () => {
  const info = merchantInfo();
  let data = queryClient.getQueryData(categoriesListQuery(info));
  if (!data) {
    data = await queryClient.fetchQuery(categoriesListQuery(info));
  }
  return { data };
};

const ProductsPage = () => {
  return (
    <main>
      <PageHero title='products' />
      <Wrapper className='page'>
        <div className='section-center products'>
          <Filters />
          <div>
            <Sort />
            <ProductList />
          </div>
        </div>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.div`
  .products {
    display: grid;
    gap: 3rem 1.5rem;
    margin: 4rem auto;
  }
  @media (min-width: 768px) {
    .products {
      grid-template-columns: 200px 1fr;
    }
  }
`;

export default ProductsPage;
