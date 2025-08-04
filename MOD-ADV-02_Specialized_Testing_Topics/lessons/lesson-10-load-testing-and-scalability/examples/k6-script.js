import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * This is an example of a k6 load test script.
 * It is NOT a Playwright script and should be run with k6.
 *
 * This script simulates a user browsing a product catalog.
 *
 * How to run (requires k6 to be installed):
 * `k6 run k6-script.js`
 */

// This configures the load profile.
// It will ramp up from 1 to 50 virtual users over 30 seconds,
// stay at 50 users for 1 minute, then ramp down to 0.
export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
};

export default function () {
  // 1. Visit the homepage
  const homepageRes = http.get('https://test.k6.io/');
  check(homepageRes, { 'homepage status was 200': (r) => r.status === 200 });
  sleep(1); // Wait for 1 second

  // 2. Go to the contacts page
  const contactsRes = http.get('https://test.k6.io/contacts.php');
  check(contactsRes, {
    'contacts page status was 200': (r) => r.status === 200,
  });
  sleep(2);
}