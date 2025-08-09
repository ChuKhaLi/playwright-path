/**
 * Solution File: utils.ts
 */

// 1. Import the necessary types from the 'types.ts' module.
import { User, Browser } from './types';

// 2. The exported function can now be imported and used in other parts of the application.
export function logUserAction(user: User, action: string, browser: Browser): void {
  console.log(`User ${user.name} (ID: ${user.id}) performed action "${action}" on ${browser}.`);
}