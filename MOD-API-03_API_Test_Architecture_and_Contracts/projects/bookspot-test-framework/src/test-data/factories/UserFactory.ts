import { faker } from '@faker-js/faker';

export class UserFactory {
  static create(overrides: any = {}): any {
    return {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
      ...overrides,
    };
  }
}