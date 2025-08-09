/**
 * Solution: Modules and Namespaces
 *
 * This file contains the solution to the 'Modules and Namespaces' exercise.
 * It demonstrates how to import and use code from other modules.
 */

// 1. Import the 'User' interface and 'Browser' type from './solution/types'.
//    Using 'import type' is a good practice when you are only importing type definitions.
import type { User, Browser } from './solution/types';

// 2. Import the 'logUserAction' function from './solution/utils'.
import { logUserAction } from './solution/utils';

// 3. Create a 'User' object. The 'User' type is enforced here.
const testUser: User = {
  id: 1,
  name: "Test User"
};

// 4. Call the imported function with the typed object and other data.
const currentBrowser: Browser = 'Chrome';
logUserAction(testUser, "Logged In", currentBrowser);
logUserAction({ id: 2, name: "Admin" }, "Viewed Dashboard", "Firefox");