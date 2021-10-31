import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { fetchAllProducts } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount: CartItemsAmount = cart.reduce((accumulator, product) =>
    ({ ...accumulator, [product.id]: product.amount })
    , {}
  )

  useEffect(() => {
    async function loadProducts() {
      try {
        const apiProducts = await fetchAllProducts()
        const apiProductsFormatted = formatProducts(apiProducts)
        setProducts(apiProductsFormatted)
      } catch (error) {
        toast.error('Houve um erro ao buscar os produtos.')
      }
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id)
  }

  return (
    <ProductList>
      {products.map(({ id, image, title, priceFormatted }) => (
        <li key={id}>
          <img src={image} alt={title} />
          <strong>{title}</strong>
          <span>{priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;

function formatProducts(products: Product[]): ProductFormatted[] {
  return products.map(product => ({
    ...product,
    priceFormatted: formatPrice(product.price)
  }))
}