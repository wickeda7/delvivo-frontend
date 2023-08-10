import React from 'react';
import styled from 'styled-components';
import { useLoaderData } from 'react-router-dom';
import { Filters, ProductList, Sort, PageHero } from '../components';
import { merchantInfo } from '../utils/merchantInfo';
import { getCategories } from '../services/apiProducts';
import { QueryCache, useQuery } from '@tanstack/react-query';

const queryCache = new QueryCache();
const categoriesListQuery = (info) => ({
  queryKey: ['categories'],
  queryFn: () => getCategories(info),
  cache: queryCache,
  refetchOnMount: false,
});

export const loader = (queryClient) => async () => {
  const info = merchantInfo();
  if (!queryClient.getQueryData(categoriesListQuery(info))) {
    await queryClient.fetchQuery(categoriesListQuery(info));
  }
  return { info };
};

const ProductsPage = () => {
  const { info } = useLoaderData();
  const { data } = useQuery(categoriesListQuery(info));
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
