import { Product } from '../types';

const storageKey = '@RocketShoes:cart';

export const readCart = () => {
    const storagedCart = localStorage.getItem(storageKey);
    return storagedCart ? JSON.parse(storagedCart) : [];
}

export const saveCart = (cart: Product[]) => {
    localStorage.setItem(storageKey, JSON.stringify(cart));
}
