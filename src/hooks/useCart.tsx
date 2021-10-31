import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchProductById, fetchStockById } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

const storageKey = '@RocketShoes:cart'
export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem(storageKey);

    return storagedCart ? JSON.parse(storagedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cart))
  }, [cart])

  function findProductIndexById(productId: number) {
    return cart.findIndex(product => product.id === productId);
  }

  const addProduct = async (productId: number): Promise<void> => {
    try {
      const productIndex = findProductIndexById(productId)
      const stock = fetchStockById(productId)

      if (productIndex === -1) { // Product not on cart
        if (await stock <= 0) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }

        const product = await fetchProductById(productId);
        setCart(oldCart => [...oldCart, { ...product, amount: 1 }]);
        return;
      }

      if (await stock <= cart[productIndex].amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }
      // Product on cart
      setCart(oldCart => {
        const newCart = oldCart.map(product => ({ ...product }));
        newCart[productIndex].amount++;
        return newCart;
      })
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productIndex = findProductIndexById(productId)
      if (productIndex === -1) throw new Error('Product not in cart.');

      setCart(oldCart =>
        oldCart.slice(0, productIndex).concat(oldCart.slice(productIndex + 1))
      );
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
      if (amount <= 0) return;
      const productIndex = cart.findIndex(product => product.id === productId);
      if (productIndex === -1) throw new Error('Product not in cart.');

      setCart(oldCart => {
        const newCart = oldCart.map(product => ({ ...product }));
        newCart[productIndex].amount = amount;
        return newCart;
      })
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
