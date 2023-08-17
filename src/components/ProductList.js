import React from 'react';
import { useFilterContext } from '../context/filter_context';
import GridView from './GridView';
import ListView from './ListView';
import { useProducts } from '../hooks/useProducts';
import Loading from './Loading';

import { useParams, useAsyncValue } from 'react-router-dom';

const ProductList = () => {
  const { grid_view } = useFilterContext();
  const { categories } = useAsyncValue();
  const params = useParams();
  let categoryId = undefined;

  if (params.categoryId) {
    categoryId = params.categoryId;
  } else {
    categoryId = categories[0].id;
  }
  const { isLoading, products } = useProducts(categoryId);

  if (isLoading) {
    return <Loading />;
  }
  if (products.length < 1) {
    return (
      <h5 style={{ textTransform: 'none' }}>
        Sorry, no products matched your search.
      </h5>
    );
  }

  if (grid_view === false) {
    return <ListView products={products} />;
  }
  return <GridView products={products} />;
};

export default ProductList;
