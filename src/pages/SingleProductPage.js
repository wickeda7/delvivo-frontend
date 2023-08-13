import React from 'react';
import { useParams } from 'react-router-dom';
import { formatPrice } from '../utils/helpers';
import { useGetProduct } from '../hooks/useProducts';
import { Loading, Error, ProductImages, Stars, PageHero } from '../components';
import { AddToCart } from '../components/cart';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
const SingleProductPage = () => {
  const { id: productId } = useParams();
  const { isLoading, error, product } = useGetProduct(productId);

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <Error />;
  }

  const { name, price, sku, menuItem } = product;
  const { imageFilename, description } = menuItem;
  const images = [{ url: imageFilename }];
  const stock = 200;
  const reviews = 10;
  const company = 'delvivo';
  const stars = 5;
  product.images = images;
  return (
    <Wrapper>
      <PageHero title={name} product />
      <div className='section section-center page'>
        <Link to='/products' className='btn'>
          back to products
        </Link>
        <div className='product-center'>
          <ProductImages images={images} />
          <section className='content'>
            <h2>{name}</h2>
            <Stars stars={stars} reviews={reviews} />
            <h5 className='price'>{formatPrice(price)}</h5>
            <p className='desc'>{description}</p>
            <p className='info'>
              <span>Available : </span>
              {stock > 0 ? 'In stock' : 'out of stock'}
            </p>
            <p className='info'>
              <span>SKU :</span>
              {sku}
            </p>
            <p className='info'>
              <span>Brand :</span>
              {company}
            </p>
            <hr />
            {stock > 0 && <AddToCart product={product} />}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }
`;

export default SingleProductPage;
