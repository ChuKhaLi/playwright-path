import { test, expect } from '../../../src/fixtures/api.fixtures';
import { UserFactory } from '../../../src/test-data/factories/UserFactory';

test.describe('User API', () => {
  test('should allow a user to register and then log in', async ({ userRepository }) => {
    const userData = UserFactory.create();

    // Register a new user
    const createdUser = await userRepository.create(userData);
    expect(createdUser.id).toBeDefined();
    expect(createdUser.email).toBe(userData.email);

    // Log in with the new user's credentials
    const loginResponse = await userRepository.login({
      email: userData.email,
      password: userData.password,
    });
    expect(loginResponse.token).toBeDefined();
  });
});