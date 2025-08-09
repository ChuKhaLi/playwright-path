/**
 * Solution File: types.ts
 */

// 1. Exporting an interface makes it available for other modules to import.
export interface User {
  id: number;
  name: string;
}

// 2. Exporting a type alias.
export type Browser = 'Chrome' | 'Firefox' | 'Safari';