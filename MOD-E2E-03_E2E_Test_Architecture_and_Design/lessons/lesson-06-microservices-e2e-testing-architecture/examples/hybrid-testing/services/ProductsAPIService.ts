import { APIRequestContext } from '@playwright/test';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

/**
 * A client class to interact with the Products microservice API.
 * This encapsulates all API logic related to products.
 */
export class ProductsAPIService {
  constructor(private request: APIRequestContext) {}

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    const response = await this.request.post('/api/products', {
      data: productData,
    });
    return response.json();
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.request.delete(`/api/products/${productId}`);
  }

  async getProduct(productId: string): Promise<Product> {
    const response = await this.request.get(`/api/products/${productId}`);
    return response.json();
  }
}