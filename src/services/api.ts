import axios from 'axios';
import { Product, Stock } from '../types';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export const fetchStockById = (productId: number) =>
  api.get<Stock>(`/stock/${productId}`).then(response => response.data.amount);

type FetchProductResult = Omit<Product, 'amount'>

export const fetchProductById = (productId: number) =>
  api.get<FetchProductResult>(`/products/${productId}`)

export const fetchAllProducts = () =>
  api.get<Product[]>('products').then(response => response.data)