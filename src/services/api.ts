import axios from 'axios';
import { Product, Stock } from '../types';

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

export const fetchStockById = (productId: number) =>
  api.get<Stock>(`/stock/${productId}`).then(resp => resp.data.amount);

type FetchProductResult = Omit<Product, 'amount'>

export const fetchProductById = (productId: number) =>
  api.get<FetchProductResult>(`/products/${productId}`).then(resp => resp.data)

export const fetchAllProducts = () =>
  api.get<Product[]>('products').then(resp => resp.data)