/**
 * Centralized Test Configuration
 * All main variables like browsers, resolutions, mobile/desktop settings in one place
 * Change any configuration value here to apply across the entire framework
 */

export class TestConfig {
  // ====== BROWSER CONFIGURATION ======
  static readonly BROWSERS = {
    CHROME: 'chrome',
    SAFARI: 'webkit',
    FIREFOX: 'firefox',
    EDGE: 'msedge'
  } as const;

  static readonly DEFAULT_BROWSER = TestConfig.BROWSERS.CHROME;

  // ====== DEVICE CONFIGURATION ======
  static readonly DEVICES = {
    // Mobile Devices
    PIXEL_5: 'Pixel 5',
    IPHONE_15_PRO: 'iPhone 15 Pro',
    IPHONE_12: 'iPhone 12',
    SAMSUNG_GALAXY_S21: 'Galaxy S21',
    
    // Tablet Devices
    IPAD_PRO: 'iPad Pro',
    GALAXY_TAB_S4: 'Galaxy Tab S4',
    
    // Desktop Devices
    DESKTOP_CHROME: 'Desktop Chrome',
    DESKTOP_SAFARI: 'Desktop Safari',
    DESKTOP_FIREFOX: 'Desktop Firefox'
  } as const;

  static readonly DEFAULT_MOBILE_DEVICE = TestConfig.DEVICES.PIXEL_5;
  static readonly DEFAULT_SAFARI_DEVICE = TestConfig.DEVICES.IPHONE_15_PRO;

  // ====== SCREEN RESOLUTIONS ======
  static readonly RESOLUTIONS = {
    // Mobile Resolutions - Portrait
    PIXEL_5: { width: 393, height: 851 },
    IPHONE_15_PRO: { width: 393, height: 852 },
    IPHONE_12: { width: 390, height: 844 },
    SAMSUNG_S21: { width: 384, height: 854 },
    
    // Mobile Resolutions - Landscape
    PIXEL_5_LANDSCAPE: { width: 851, height: 393 },
    IPHONE_15_PRO_LANDSCAPE: { width: 852, height: 393 },
    IPHONE_12_LANDSCAPE: { width: 844, height: 390 },
    
    // Generic Mobile Orientations
    MOBILE_PORTRAIT: { width: 375, height: 812 },
    MOBILE_LANDSCAPE: { width: 812, height: 375 },
    
    // Tablet Resolutions
    IPAD_PRO: { width: 1024, height: 1366 },
    GALAXY_TAB_S4: { width: 712, height: 1138 },
    TABLET_LANDSCAPE: { width: 1024, height: 768 },
    
    // Desktop Resolutions
    DESKTOP_SMALL: { width: 1366, height: 768 },
    DESKTOP_MEDIUM: { width: 1920, height: 1080 },
    DESKTOP_LARGE: { width: 2560, height: 1440 },
    DESKTOP_DEFAULT: { width: 1280, height: 720 }
  } as const;

  static readonly DEFAULT_MOBILE_RESOLUTION = TestConfig.RESOLUTIONS.PIXEL_5;
  static readonly DEFAULT_SAFARI_RESOLUTION = TestConfig.RESOLUTIONS.IPHONE_15_PRO;

  // ====== DEVICE TYPE CONFIGURATION ======
  static readonly DEVICE_TYPES = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop'
  } as const;

  static readonly DEFAULT_DEVICE_TYPE = TestConfig.DEVICE_TYPES.MOBILE;

  // ====== ORIENTATION CONFIGURATION ======
  static readonly ORIENTATIONS = {
    PORTRAIT: 'portrait',
    LANDSCAPE: 'landscape'
  } as const;

  static readonly DEFAULT_ORIENTATION = TestConfig.ORIENTATIONS.PORTRAIT;

  // ====== URL CONFIGURATION ======
  static readonly URLS = {
    BASE_URL: 'https://www.google.com',
    GOOGLE_HOMEPAGE: 'https://www.google.com'
  } as const;

  static readonly DEFAULT_BASE_URL = TestConfig.URLS.GOOGLE_HOMEPAGE;

  // ====== TIMEOUT CONFIGURATION ======
  static readonly TIMEOUTS = {
    // Element timeouts
    ELEMENT_VISIBLE: 10000,
    ELEMENT_CLICK: 5000,
    ELEMENT_FILL: 3000,
    ELEMENT_ATTACHED: 5000,
    
    // Navigation timeouts
    PAGE_LOAD: 30000,
    NAVIGATION: 30000,
    ACTION_TIMEOUT: 15000,
    NETWORK_IDLE: 10000,
    NETWORK_IDLE_FAST: 15000,
    
    // Test timeouts
    TEST_TIMEOUT: 120000,
    SUITE_TIMEOUT: 300000,
    CUCUMBER_DEFAULT: 60000,
    
    // Mobile specific timeouts
    TOUCH_DELAY: 500,
    SCROLL_DELAY: 1000,
    SWIPE_DURATION: 1000,
    
    // UI interaction timeouts
    COOKIE_BANNER: 5000,
    MODAL_CLOSE: 3000,
    SEARCH_RESULT: 2000,
    LOADING_INDICATOR: 1000,
    
    // Mobile gesture delays
    FAST_DELAY: 50,
    MEDIUM_DELAY: 300,
    SLOW_DELAY: 1500,
    ORIENTATION_DELAY: 1000,
    
    // Debug and wait timeouts
    SHORT_WAIT: 1000,
    MEDIUM_WAIT: 5000,
    LONG_WAIT: 10000,
    EXTRA_LONG_WAIT: 20000
  } as const;

  // ====== EXECUTION CONFIGURATION ======
  static readonly EXECUTION = {
    // Parallel execution
    PARALLEL_EXECUTION: false,
    WORKERS_COUNT: 1,
    
    // Retry configuration
    RETRIES: 0,
    RETRIES_CI: 2,
    
    // Headless mode configuration
    // HEADLESS: false = Visible browser execution (you can see the browser)
    // HEADLESS: true = Headless execution (browser runs in background)
    HEADLESS: false,          // Local development - visible browsers
    HEADLESS_CI: false        // CI environment - also visible for debugging
  } as const;

  // ====== REPORTING CONFIGURATION ======
  static readonly REPORTING = {
    // Primary report - Playwright HTML Report (default and recommended)
    HTML_REPORT: true,
    JSON_REPORT: false,        // Disabled - HTML report is primary
    JUNIT_REPORT: false,       // Disabled - HTML report is primary  
    LINE_REPORT: true,         // Keep for console output
    ALLURE_REPORT: false,
    
    // Report paths
    HTML_REPORT_PATH: 'playwright-report',
    JSON_REPORT_PATH: 'test-results/results.json',
    JUNIT_REPORT_PATH: 'test-results/junit.xml',
    SCREENSHOTS_PATH: 'test-results/screenshots',
    VIDEOS_PATH: 'test-results/videos',
    OUTPUT_DIR: 'test-results/',
    
    // Enhanced report settings for better debugging
    HTML_OPEN: 'on-failure',   // Auto-open report when tests fail
    TRACE_MODE: 'retain-on-failure',     // Full traces for failed tests
    SCREENSHOT_MODE: 'only-on-failure',  // Screenshots on failure
    VIDEO_MODE: 'retain-on-failure'     // Videos for failed tests
  } as const;

  // ====== MOBILE TESTING CONFIGURATION ======
  static readonly MOBILE = {
    // Touch settings
    HAS_TOUCH: true,
    IS_MOBILE: true,
    
    // Network simulation
    SIMULATE_SLOW_3G: false,
    SIMULATE_OFFLINE: false,
    
    // Geolocation (New York coordinates as default)
    DEFAULT_GEOLOCATION: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    
    // User agents
    MOBILE_USER_AGENT: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36',
    IPHONE_USER_AGENT: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
  } as const;

  // ====== CUCUMBER BDD CONFIGURATION ======
  static readonly CUCUMBER = {
    FEATURES_PATH: 'features/**/*.feature',
    STEP_DEFINITIONS_PATH: 'features/step-definitions/**/*.ts',
    SUPPORT_PATH: 'features/support/**/*.ts',
    
    // Report paths
    HTML_REPORT_PATH: 'reports/cucumber_report.html',
    JSON_REPORT_PATH: 'reports/cucumber_report.json',
    
    // Execution settings
    PARALLEL: false,
    FAIL_FAST: false,
    DRY_RUN: false
  } as const;

  // ====== ENVIRONMENT CONFIGURATION ======
  static readonly ENVIRONMENTS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production',
    LOCAL: 'local'
  } as const;

  static readonly DEFAULT_ENVIRONMENT = TestConfig.ENVIRONMENTS.PRODUCTION;

  // ====== UTILITY METHODS ======
  
  /**
   * Get current environment from process.env or default
   */
  static getCurrentEnvironment(): string {
    return process.env.TEST_ENV || TestConfig.DEFAULT_ENVIRONMENT;
  }

  /**
   * Get base URL based on current environment
   */
  static getBaseUrl(): string {
    const env = TestConfig.getCurrentEnvironment();
    
    switch (env) {
      case TestConfig.ENVIRONMENTS.DEVELOPMENT:
        return process.env.DEV_BASE_URL || TestConfig.URLS.GOOGLE_HOMEPAGE;
      case TestConfig.ENVIRONMENTS.STAGING:
        return process.env.STAGING_BASE_URL || TestConfig.URLS.GOOGLE_HOMEPAGE;
      default:
        return TestConfig.URLS.GOOGLE_HOMEPAGE;
    }
  }

  /**
   * Get device configuration by name
   */
  static getDeviceConfig(deviceName: string): { width: number; height: number } {
    switch (deviceName) {
      case TestConfig.DEVICES.PIXEL_5:
        return TestConfig.RESOLUTIONS.PIXEL_5;
      case TestConfig.DEVICES.IPHONE_15_PRO:
        return TestConfig.RESOLUTIONS.IPHONE_15_PRO;
      case TestConfig.DEVICES.IPHONE_12:
        return TestConfig.RESOLUTIONS.IPHONE_12;
      case TestConfig.DEVICES.SAMSUNG_GALAXY_S21:
        return TestConfig.RESOLUTIONS.SAMSUNG_S21;
      default:
        return TestConfig.RESOLUTIONS.PIXEL_5;
    }
  }

  /**
   * Check if current configuration is mobile
   */
  static isMobileDevice(): boolean {
    return TestConfig.DEFAULT_DEVICE_TYPE === TestConfig.DEVICE_TYPES.MOBILE;
  }

  /**
   * Get all mobile devices
   */
  static getMobileDevices(): string[] {
    return [
      TestConfig.DEVICES.PIXEL_5,
      TestConfig.DEVICES.IPHONE_15_PRO,
      TestConfig.DEVICES.IPHONE_12,
      TestConfig.DEVICES.SAMSUNG_GALAXY_S21
    ];
  }

  /**
   * Get device resolution by device name
   */
  static getDeviceResolution(deviceName?: string): { width: number; height: number } {
    const device = deviceName || TestConfig.DEFAULT_MOBILE_DEVICE;
    
    switch (device) {
      case TestConfig.DEVICES.PIXEL_5:
        return TestConfig.RESOLUTIONS.PIXEL_5;
      case TestConfig.DEVICES.IPHONE_15_PRO:
        return TestConfig.RESOLUTIONS.IPHONE_15_PRO;
      case TestConfig.DEVICES.IPHONE_12:
        return TestConfig.RESOLUTIONS.IPHONE_12;
      case TestConfig.DEVICES.SAMSUNG_GALAXY_S21:
        return TestConfig.RESOLUTIONS.SAMSUNG_S21;
      case TestConfig.DEVICES.IPAD_PRO:
        return TestConfig.RESOLUTIONS.IPAD_PRO;
      case TestConfig.DEVICES.GALAXY_TAB_S4:
        return TestConfig.RESOLUTIONS.GALAXY_TAB_S4;
      case TestConfig.DEVICES.DESKTOP_CHROME:
      case TestConfig.DEVICES.DESKTOP_SAFARI:
      case TestConfig.DEVICES.DESKTOP_FIREFOX:
        return TestConfig.RESOLUTIONS.DESKTOP_DEFAULT;
      default:
        return TestConfig.RESOLUTIONS.PIXEL_5;
    }
  }

  /**
   * Get simplified Playwright projects configuration - ONLY Chrome and Safari Mobile
   */
  static getPlaywrightProjects(): Array<{ name: string; use: any }> {
    return [
      // Mobile Chrome on Android (Pixel 5 resolution)
      {
        name: 'Mobile Chrome',
        use: { 
          viewport: TestConfig.getDeviceResolution(TestConfig.DEVICES.PIXEL_5),
          userAgent: TestConfig.MOBILE.MOBILE_USER_AGENT,
          deviceScaleFactor: 3,
          hasTouch: TestConfig.MOBILE.HAS_TOUCH,
          isMobile: TestConfig.MOBILE.IS_MOBILE,
          channel: TestConfig.BROWSERS.CHROME,
        },
      },

      // Mobile Safari on iPhone 15 Pro (Latest iOS)
      {
        name: 'iPhone 15 Pro Safari',
        use: { 
          viewport: TestConfig.getDeviceResolution(TestConfig.DEVICES.IPHONE_15_PRO),
          userAgent: TestConfig.MOBILE.IPHONE_USER_AGENT,
          deviceScaleFactor: 3,
          hasTouch: TestConfig.MOBILE.HAS_TOUCH,
          isMobile: TestConfig.MOBILE.IS_MOBILE,
          browserName: TestConfig.BROWSERS.SAFARI,  // Use WebKit/Safari browser
        },
      },
    ];
  }

  /**
   * Get reporter configuration array
   */
  static getReporterConfig(): Array<[string, any] | [string]> {
    const reporters: Array<[string, any] | [string]> = [];
    
    if (TestConfig.REPORTING.HTML_REPORT) {
      reporters.push(['html', { 
        outputFolder: TestConfig.REPORTING.HTML_REPORT_PATH, 
        open: TestConfig.REPORTING.HTML_OPEN 
      }]);
    }
    
    if (TestConfig.REPORTING.JSON_REPORT) {
      reporters.push(['json', { 
        outputFile: TestConfig.REPORTING.JSON_REPORT_PATH 
      }]);
    }
    
    if (TestConfig.REPORTING.JUNIT_REPORT) {
      reporters.push(['junit', { 
        outputFile: TestConfig.REPORTING.JUNIT_REPORT_PATH 
      }]);
    }
    
    if (TestConfig.REPORTING.LINE_REPORT) {
      reporters.push(['line']);
    }
    
    return reporters;
  }

  /**
   * Get comprehensive 'use' configuration object
   */
  static getUseConfig(): any {
    return {
      // Base URL for your application
      baseURL: TestConfig.getBaseUrl(),
      
      // Headless mode - from TestConfig (false = visible browser)
      headless: process.env.CI ? TestConfig.EXECUTION.HEADLESS_CI : TestConfig.EXECUTION.HEADLESS,
      
      // Collect trace when retrying the failed test
      trace: TestConfig.REPORTING.TRACE_MODE,
      
      // Capture screenshot on failure
      screenshot: TestConfig.REPORTING.SCREENSHOT_MODE,
      
      // Record video on failure
      video: TestConfig.REPORTING.VIDEO_MODE,
      
      // Action timeout
      actionTimeout: TestConfig.TIMEOUTS.ACTION_TIMEOUT,
      
      // Navigation timeout
      navigationTimeout: TestConfig.TIMEOUTS.NAVIGATION,
    };
  }
}

// Export type definitions
export type DeviceType = typeof TestConfig.DEVICE_TYPES[keyof typeof TestConfig.DEVICE_TYPES];
export type BrowserType = typeof TestConfig.BROWSERS[keyof typeof TestConfig.BROWSERS];
export type OrientationType = typeof TestConfig.ORIENTATIONS[keyof typeof TestConfig.ORIENTATIONS];
export type EnvironmentType = typeof TestConfig.ENVIRONMENTS[keyof typeof TestConfig.ENVIRONMENTS];
