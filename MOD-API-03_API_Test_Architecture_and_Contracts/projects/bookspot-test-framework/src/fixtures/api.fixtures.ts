import { test as baseTest } from '@playwright/test';
import { UserApiClient } from '../api/clients/UserApiClient';
import { UserRepository, IUserRepository } from '../api/repositories/UserRepository';
import { config } from '../config';

type MyFixtures = {
  userApiClient: UserApiClient;
  userRepository: IUserRepository;
};

export const test = baseTest.extend<MyFixtures>({
  userApiClient: async ({ request }, use) => {
    const client = new UserApiClient(request, { baseUrl: config.api.baseUrl });
    await use(client);
  },

  userRepository: async ({ userApiClient }, use) => {
    const repository = new UserRepository(userApiClient);
    await use(repository);
  },
});

export { expect } from '@playwright/test';