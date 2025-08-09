import { UserApiClient } from '../clients/UserApiClient';

// Add your User-related types here, e.g.:
// export interface User { ... }
// export interface CreateUserRequest { ... }

export interface IUserRepository {
  create(data: any): Promise<any>;
  findById(id: string): Promise<any | null>;
  login(credentials: any): Promise<any>;
}

export class UserRepository implements IUserRepository {
  constructor(private apiClient: UserApiClient) {}

  async create(data: any): Promise<any> {
    return this.apiClient.createUser(data);
  }

  async findById(id: string): Promise<any | null> {
    try {
      return await this.apiClient.getUserById(id);
    } catch (error: any) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async login(credentials: any): Promise<any> {
      return this.apiClient.login(credentials);
  }
}