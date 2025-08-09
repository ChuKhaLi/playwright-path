/**
 * Advanced Browser Context Configuration
 * 
 * This example demonstrates sophisticated browser context management including
 * role-based testing, device simulation, permission handling, and network
 * condition simulation for enterprise testing scenarios.
 * 
 * @author Playwright Learning Module
 * @version 1.0.0
 */

import { test, expect, Browser, BrowserContext, Page, Route, devices } from '@playwright/test';

// =============================================================================
// CONTEXT PROFILE MANAGER
// =============================================================================

/**
 * Centralized context profile management for different user roles and scenarios
 */
export class ContextProfiles {
  
  /**
   * Create an admin user context with full permissions
   */
  static async createAdminContext(browser: Browser): Promise<BrowserContext> {
    return await browser.newContext({
      storageState: {
        cookies: [],
        origins: [{
          origin: 'https://app.example.com',
          localStorage: [
            {
              name: 'userRole',
              value: 'admin'
            },
            {
              name: 'permissions',
              value: JSON.stringify([
                'read', 'write', 'delete', 'manage', 'admin',
                'user-management', 'system-settings', 'reports'
              ])
            },
            {
              name: 'userId',
              value: 'admin_001'
            },
            {
              name: 'sessionToken',
              value: 'admin-session-token-12345'
            }
          ]
        }]
      },
      extraHTTPHeaders: {
        'X-User-Role': 'admin',
        'X-Test-Environment': 'automation',
        'X-User-ID': 'admin_001',
        'Authorization': 'Bearer admin-auth-token'
      },
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Playwright/Admin',
      permissions: ['camera', 'microphone', 'geolocation', 'notifications'],
      colorScheme: 'light'
    });
  }

  /**
   * Create a standard user context with limited permissions
   */
  static async createStandardUserContext(browser: Browser): Promise<BrowserContext> {
    return await browser.newContext({
      storageState: {
        cookies: [],
        origins: [{
          origin: 'https://app.example.com',
          localStorage: [
            {
              name: 'userRole',
              value: 'user'
            },
            {
              name: 'permissions',
              value: JSON.stringify(['read', 'write-own', 'profile-edit'])
            },
            {
              name: 'userId',
              value: 'user_001'
            },
            {
              name: 'sessionToken',
              value: 'user-session-token-67890'
            }
          ]
        }]
      },
      extraHTTPHeaders: {
        'X-User-Role': 'user',
        'X-Test-Environment': 'automation',
        'X-User-ID': 'user_001',
        'Authorization': 'Bearer user-auth-token'
      },
      viewport: { width: 1366, height: 768 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Playwright/User',
      permissions: ['notifications'],
      colorScheme: 'light'
    });
  }

  /**
   * Create a guest context with no authentication
   */
  static async createGuestContext(browser: Browser): Promise<BrowserContext> {
    return await browser.newContext({
      // No authentication state - clean slate
      extraHTTPHeaders: {
        'X-User-Role': 'guest',
        'X-Test-Environment': 'automation',
        'X-Guest-Session': `guest-${Date.now()}`
      },
      viewport: { width: 1024, height: 768 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Playwright/Guest',
      permissions: [], // No permissions for guest
      colorScheme: 'light'
    });
  }

  /**
   * Create a context for API testing with custom headers
   */
  static async createAPITestContext(browser: Browser): Promise<BrowserContext> {
    return await browser.newContext({
      extraHTTPHeaders: {
        'X-Test-Type': 'api',
        'X-API-Version': 'v1',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Playwright-API-Test/1.0'
      },
      ignoreHTTPSErrors: true, // For testing environments
      viewport: null, // No viewport for API testing
      javaScriptEnabled: true
    });
  }
}

// =============================================================================
// DEVICE SIMULATION PROFILES
// =============================================================================

/**
 * Device-specific context configurations
 */
export class DeviceProfiles {

  /**
   * Create a mobile context with network simulation
   */
  static async createMobileContext(browser: Browser, options: {
    device?: string;
    networkType?: '3g' | '4g' | '5g';
    orientation?: 'portrait' | 'landscape';
  } = {}): Promise<BrowserContext> {
    const device = options.device || 'iPhone 13';
    const deviceConfig = devices[device] || devices['iPhone 13'];
    
    return await browser.newContext({
      ...deviceConfig,
      // Override with mobile-specific settings
      isMobile: true,
      hasTouch: true,
      extraHTTPHeaders: {
        'X-Device-Type': 'mobile',
        'X-Network-Type': options.networkType || '4g',
        'X-Orientation': options.orientation || 'portrait',
        'X-Device-Model': device,
        'X-Test-Environment': 'mobile-automation'
      },
      // Mobile-specific viewport if landscape
      viewport: options.orientation === 'landscape' && deviceConfig.viewport ? {
        width: deviceConfig.viewport.height,
        height: deviceConfig.viewport.width
      } : deviceConfig.viewport
    });
  }

  /**
   * Create a tablet context with split-screen capabilities
   */
  static async createTabletContext(browser: Browser, options: {
    orientation?: 'portrait' | 'landscape';
  } = {}): Promise<BrowserContext> {
    const isLandscape = options.orientation === 'landscape';
    
    return await browser.newContext({
      ...devices['iPad Pro'],
      viewport: isLandscape ? 
        { width: 1366, height: 1024 } : 
        { width: 1024, height: 1366 },
      extraHTTPHeaders: {
        'X-Device-Type': 'tablet',
        'X-Orientation': options.orientation || 'portrait',
        'X-Device-Model': 'iPad Pro',
        'X-Test-Environment': 'tablet-automation'
      },
      isMobile: true,
      hasTouch: true
    });
  }

  /**
   * Create a desktop context with high-resolution display
   */
  static async createDesktopContext(browser: Browser, options: {
    resolution?: 'fhd' | '4k' | 'ultrawide';
    colorScheme?: 'light' | 'dark';
  } = {}): Promise<BrowserContext> {
    const resolutions = {
      fhd: { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 },
      ultrawide: { width: 3440, height: 1440 }
    };
    
    const viewport = resolutions[options.resolution || 'fhd'];
    
    return await browser.newContext({
      viewport,
      extraHTTPHeaders: {
        'X-Device-Type': 'desktop',
        'X-Resolution': options.resolution || 'fhd',
        'X-Color-Scheme': options.colorScheme || 'light',
        'X-Test-Environment': 'desktop-automation'
      },
      colorScheme: options.colorScheme || 'light',
      isMobile: false,
      hasTouch: false
    });
  }
}

// =============================================================================
// NETWORK CONDITION SIMULATION
// =============================================================================

/**
 * Network condition simulation for performance testing
 */
export class NetworkSimulation {

  /**
   * Apply slow 3G network conditions
   */
  static async apply3GConditions(page: Page): Promise<void> {
    await page.route('**/*', async (route: Route) => {
      // Simulate 3G network delay (100-500ms)
      const delay = Math.random() * 400 + 100;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      await route.continue();
    });
  }

  /**
   * Apply fast 4G network conditions
   */
  static async apply4GConditions(page: Page): Promise<void> {
    await page.route('**/*', async (route: Route) => {
      // Simulate 4G network delay (20-100ms)
      const delay = Math.random() * 80 + 20;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      await route.continue();
    });
  }

  /**
   * Apply offline simulation
   */
  static async simulateOffline(context: BrowserContext): Promise<void> {
    await context.setOffline(true);
  }

  /**
   * Apply slow connection with packet loss
   */
  static async applySlowConnection(page: Page): Promise<void> {
    await page.route('**/*', async (route: Route) => {
      // Simulate packet loss (5% chance of failure)
      if (Math.random() < 0.05) {
        await route.abort('connectionfailed');
        return;
      }
      
      // Simulate slow connection (500-2000ms)
      const delay = Math.random() * 1500 + 500;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      await route.continue();
    });
  }
}

// =============================================================================
// PERMISSION AND SECURITY TESTING
// =============================================================================

/**
 * Permission-based testing scenarios
 */
export class SecurityContexts {

  /**
   * Create context with camera and microphone permissions
   */
  static async createMediaPermissionsContext(browser: Browser): Promise<BrowserContext> {
    return await browser.newContext({
      permissions: ['camera', 'microphone'],
      extraHTTPHeaders: {
        'X-Feature-Test': 'media-permissions',
        'X-Test-Type': 'media-access'
      }
    });
  }

  /**
   * Create context with geolocation permissions
   */
  static async createLocationContext(browser: Browser, location: {
    latitude: number;
    longitude: number;
  }): Promise<BrowserContext> {
    return await browser.newContext({
      permissions: ['geolocation'],
      geolocation: location,
      extraHTTPHeaders: {
        'X-Feature-Test': 'location-permissions',
        'X-Test-Type': 'geolocation'
      }
    });
  }

  /**
   * Create context with notification permissions
   */
  static async createNotificationContext(browser: Browser): Promise<BrowserContext> {
    return await browser.newContext({
      permissions: ['notifications'],
      extraHTTPHeaders: {
        'X-Feature-Test': 'notification-permissions',
        'X-Test-Type': 'notifications'
      }
    });
  }

  /**
   * Create context with no permissions (security testing)
   */
  static async createRestrictedContext(browser: Browser): Promise<BrowserContext> {
    return await browser.newContext({
      permissions: [], // No permissions granted
      extraHTTPHeaders: {
        'X-Feature-Test': 'permission-restrictions',
        'X-Test-Type': 'security'
      }
    });
  }
}

// =============================================================================
// PRACTICAL TEST EXAMPLES
// =============================================================================

test.describe('Advanced Context Configuration Examples', () => {

  test.describe('Role-based Access Testing', () => {
    
    test('admin user has full system access', async ({ browser }) => {
      const adminContext = await ContextProfiles.createAdminContext(browser);
      const page = await adminContext.newPage();
      
      await page.goto('https://example.com/dashboard');
      
      // Admin-specific functionality should be visible
      await expect(page.locator('[data-testid="admin-panel"]')).toBeVisible();
      await expect(page.locator('[data-testid="user-management"]')).toBeVisible();
      await expect(page.locator('[data-testid="system-settings"]')).toBeVisible();
      await expect(page.locator('[data-testid="reports-section"]')).toBeVisible();
      
      // Verify admin permissions in localStorage
      const permissions = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('permissions') || '[]');
      });
      
      expect(permissions).toContain('admin');
      expect(permissions).toContain('user-management');
      expect(permissions).toContain('system-settings');
      
      await adminContext.close();
    });

    test('standard user has limited access', async ({ browser }) => {
      const userContext = await ContextProfiles.createStandardUserContext(browser);
      const page = await userContext.newPage();
      
      await page.goto('https://example.com/dashboard');
      
      // User should see their dashboard but not admin features
      await expect(page.locator('[data-testid="user-dashboard"]')).toBeVisible();
      await expect(page.locator('[data-testid="profile-settings"]')).toBeVisible();
      
      // Admin features should not be visible
      await expect(page.locator('[data-testid="admin-panel"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="user-management"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="system-settings"]')).not.toBeVisible();
      
      // Verify limited permissions
      const permissions = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('permissions') || '[]');
      });
      
      expect(permissions).toContain('read');
      expect(permissions).toContain('write-own');
      expect(permissions).not.toContain('admin');
      
      await userContext.close();
    });

    test('guest user requires authentication', async ({ browser }) => {
      const guestContext = await ContextProfiles.createGuestContext(browser);
      const page = await guestContext.newPage();
      
      await page.goto('https://example.com/dashboard');
      
      // Guest should be redirected to login
      await expect(page).toHaveURL(/.*\/login/);
      await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
      await expect(page.locator('[data-testid="guest-access-notice"]')).toBeVisible();
      
      await guestContext.close();
    });
  });

  test.describe('Device Simulation Testing', () => {
    
    test('mobile experience displays mobile-optimized UI', async ({ browser }) => {
      const mobileContext = await DeviceProfiles.createMobileContext(browser, {
        device: 'iPhone 13',
        networkType: '4g',
        orientation: 'portrait'
      });
      
      const page = await mobileContext.newPage();
      
      // Apply network conditions
      await NetworkSimulation.apply4GConditions(page);

      await page.goto('https://example.com/mobile');
      
      // Mobile-specific UI elements
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      await expect(page.locator('[data-testid="hamburger-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="touch-optimized-buttons"]')).toBeVisible();
      
      // Desktop elements should be hidden
      await expect(page.locator('[data-testid="desktop-sidebar"]')).not.toBeVisible();
      await expect(page.locator('[data-testid="desktop-navigation"]')).not.toBeVisible();
      
      // Test touch interactions
      await page.locator('[data-testid="swipe-carousel"]').tap();
      await page.locator('[data-testid="mobile-menu"]').tap();
      
      await expect(page.locator('[data-testid="mobile-menu-overlay"]')).toBeVisible();
      
      await mobileContext.close();
    });

    test('tablet experience shows hybrid layout', async ({ browser }) => {
      const tabletContext = await DeviceProfiles.createTabletContext(browser, {
        orientation: 'landscape'
      });
      
      const page = await tabletContext.newPage();
      
      await page.goto('https://example.com/tablet');
      
      // Tablet-specific layout
      await expect(page.locator('[data-testid="tablet-sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="split-view-container"]')).toBeVisible();
      await expect(page.locator('[data-testid="touch-navigation"]')).toBeVisible();
      
      // Test tablet-specific interactions
      await page.locator('[data-testid="split-view-divider"]').tap();
      
      await tabletContext.close();
    });

    test('desktop experience utilizes full screen real estate', async ({ browser }) => {
      const desktopContext = await DeviceProfiles.createDesktopContext(browser, {
        resolution: '4k',
        colorScheme: 'dark'
      });
      
      const page = await desktopContext.newPage();
      
      await page.goto('https://example.com/desktop');
      
      // Desktop-specific features
      await expect(page.locator('[data-testid="full-sidebar"]')).toBeVisible();
      await expect(page.locator('[data-testid="multi-column-layout"]')).toBeVisible();
      await expect(page.locator('[data-testid="keyboard-shortcuts"]')).toBeVisible();
      
      // Dark theme should be applied
      const backgroundColor = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor;
      });
      
      expect(backgroundColor).toMatch(/rgb\(.*[12][0-9].*\)/); // Dark background
      
      await desktopContext.close();
    });
  });

  test.describe('Network Condition Testing', () => {
    
    test('application handles slow network gracefully', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // Apply slow network conditions
      await NetworkSimulation.applySlowConnection(page);
      
      await page.goto('https://example.com/heavy-content');
      
      // Verify loading states are shown
      await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
      await expect(page.locator('[data-testid="loading-progress"]')).toBeVisible();
      
      // Wait for content to eventually load
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible({ timeout: 10000 });
      
      // Verify graceful handling of slow responses
      await expect(page.locator('[data-testid="error-boundary"]')).not.toBeVisible();
      
      await context.close();
    });

    test('application works offline with cached content', async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      
      // First, load content while online
      await page.goto('https://example.com/cacheable-content');
      await expect(page.locator('[data-testid="content-loaded"]')).toBeVisible();
      
      // Go offline
      await NetworkSimulation.simulateOffline(context);
      
      // Navigate to cached page
      await page.goto('https://example.com/cacheable-content');
      
      // Should show offline message but still display cached content
      await expect(page.locator('[data-testid="offline-notice"]')).toBeVisible();
      await expect(page.locator('[data-testid="cached-content"]')).toBeVisible();
      
      await context.close();
    });
  });

  test.describe('Permission and Security Testing', () => {
    
    test('camera access works when permissions granted', async ({ browser }) => {
      const mediaContext = await SecurityContexts.createMediaPermissionsContext(browser);
      const page = await mediaContext.newPage();
      
      // Mock camera stream for testing
      await page.addInitScript(() => {
        // Mock getUserMedia for consistent testing
        (navigator.mediaDevices as any).getUserMedia = async (constraints: MediaStreamConstraints) => {
          console.log('Mock camera access granted', constraints);
          return new MediaStream();
        };
      });
      
      await page.goto('https://example.com/video-call');
      
      await page.click('[data-testid="enable-camera"]');
      
      // Verify camera functionality
      await expect(page.locator('[data-testid="camera-preview"]')).toBeVisible();
      await expect(page.locator('[data-testid="camera-controls"]')).toBeVisible();
      
      await mediaContext.close();
    });

    test('geolocation works with granted permissions', async ({ browser }) => {
      const locationContext = await SecurityContexts.createLocationContext(browser, {
        latitude: 37.7749,  // San Francisco
        longitude: -122.4194
      });
      
      const page = await locationContext.newPage();
      
      await page.goto('https://example.com/location-app');
      
      await page.click('[data-testid="get-location"]');
      
      // Should display location-based content
      await expect(page.locator('[data-testid="location-display"]')).toContainText('San Francisco');
      await expect(page.locator('[data-testid="local-weather"]')).toBeVisible();
      
      await locationContext.close();
    });

    test('restricted context blocks unauthorized access', async ({ browser }) => {
      const restrictedContext = await SecurityContexts.createRestrictedContext(browser);
      const page = await restrictedContext.newPage();
      
      await page.goto('https://example.com/permission-required');
      
      await page.click('[data-testid="request-permissions"]');
      
      // Should show permission denied messages
      await expect(page.locator('[data-testid="permission-denied"]')).toBeVisible();
      await expect(page.locator('[data-testid="feature-disabled"]')).toBeVisible();
      
      await restrictedContext.close();
    });
  });

  test.describe('Multi-Context Testing', () => {
    
    test('multiple user sessions work independently', async ({ browser }) => {
      // Create multiple contexts for different users
      const adminContext = await ContextProfiles.createAdminContext(browser);
      const userContext = await ContextProfiles.createStandardUserContext(browser);
      
      const adminPage = await adminContext.newPage();
      const userPage = await userContext.newPage();
      
      // Navigate both users to the same application
      await Promise.all([
        adminPage.goto('https://example.com/dashboard'),
        userPage.goto('https://example.com/dashboard')
      ]);
      
      // Verify different experiences based on roles
      await expect(adminPage.locator('[data-testid="admin-panel"]')).toBeVisible();
      await expect(userPage.locator('[data-testid="admin-panel"]')).not.toBeVisible();
      
      // Verify session isolation
      const adminUserId = await adminPage.evaluate(() => localStorage.getItem('userId'));
      const userUserId = await userPage.evaluate(() => localStorage.getItem('userId'));
      
      expect(adminUserId).toBe('admin_001');
      expect(userUserId).toBe('user_001');
      expect(adminUserId).not.toBe(userUserId);
      
      // Cleanup both contexts
      await Promise.all([
        adminContext.close(),
        userContext.close()
      ]);
    });
  });
});

// Export classes for use in other test files
export { ContextProfiles, DeviceProfiles, NetworkSimulation, SecurityContexts };