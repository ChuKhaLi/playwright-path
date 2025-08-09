import fetch from 'node-fetch';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    return response.json() as Promise<T>;
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json() as Promise<T>;
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json() as Promise<T>;
  }

  async delete(endpoint: string): Promise<void> {
    await fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE' });
  }
}