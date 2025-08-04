import { faker } from '@faker-js/faker';

// Define a strong type for our User data
export interface User {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

/**
 * A factory for creating user data.
 * This centralizes the logic for generating test users,
 * making tests cleaner and more maintainable.
 */
export class UserFactory {
  /**
   * Creates a user with default, randomized data using Faker.js.
   * @returns A complete User object.
   */
  static createDefaultUser(): User {
    return {
      userId: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate(),
      address: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode(),
      },
    };
  }

  /**
   * Creates a user but allows overriding specific fields.
   * This is useful for tests that need specific data values.
   * @param overrides - An object with properties to override in the default user.
   * @returns A User object with the overrides applied.
   */
  static createUser(overrides: Partial<User> = {}): User {
    const defaultUser = this.createDefaultUser();
    // Merge the default user with any overrides provided.
    // The spread operator `...` makes this easy.
    return { ...defaultUser, ...overrides };
  }
}