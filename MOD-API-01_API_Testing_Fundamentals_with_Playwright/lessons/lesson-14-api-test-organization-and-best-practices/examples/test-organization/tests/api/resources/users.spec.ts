/**
 * @fileoverview This file contains all tests for the /users API resource.
 * It demonstrates good organization using describe blocks and an API client.
 */

import { test, expect } from '@playwright/test';
import { UserApiClient } from '../utils/userApiClient';
import { getAuthToken } from '../utils/api-helpers';
import { generateUserData } from '../utils/test-data-generators';

test.describe('Users API Resource', () => {
  let userClient: UserApiClient;
  let authToken: string;

  // Authenticate once before all tests in this suite
  test.beforeAll(async ({ request }) => {
    authToken = await getAuthToken(request);
  });

  // Create a new instance of our API client before each test
  test.beforeEach(({ request }) => {
    userClient = new UserApiClient(request, authToken);
  });

  test.describe('GET /api/users', () => {
    test('should return a list of users', async () => {
      const response = await userClient.getUsers();
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(Array.isArray(body.data)).toBe(true);
    });
  });

  test.describe('User Creation and Deletion', () => {
    let newUserId: number;

    test('should create a new user', async () => {
      const userData = generateUserData();
      const response = await userClient.createUser(userData);

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.name).toBe(userData.name);
      expect(body).toHaveProperty('id');
      newUserId = body.id;
    });

    // This test depends on the one above. In a real scenario, you might
    // create the user in a beforeAll hook for this describe block.
    test('should delete the created user', async () => {
      test.skip(!newUserId, 'Cannot run without a user ID from the creation test.');
      const response = await userClient.deleteUser(newUserId);
      expect(response.status()).toBe(204);
    });
  });
});