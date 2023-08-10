import React from 'react';
import { useFilterContext } from '../context/filter_context';
import GridView from './GridView';
import ListView from './ListView';
import { useProducts } from '../hooks/useProducts';
import Loading from './Loading';

import { useParams } from 'react-router-dom';

const ProductList = () => {
  const { grid_view } = useFilterContext();
  let categoryId = undefined;
  const params = useParams();
  if (params) {
    categoryId = params.categoryId;
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
