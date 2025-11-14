/**
 * Centralized Test Configuration
 * All main variables like browsers, resolutions, mobile/desktop settings in one place
 * Change any configuration value here to apply across the entire framework
 */
export declare class TestConfig {
    static readonly BROWSERS: {
        readonly CHROME: "chrome";
        readonly SAFARI: "webkit";
        readonly FIREFOX: "firefox";
        readonly EDGE: "msedge";
    };
    static readonly DEFAULT_BROWSER: "chrome";
    static readonly DEVICES: {
        readonly PIXEL_5: "Pixel 5";
        readonly IPHONE_15_PRO: "iPhone 15 Pro";
        readonly IPHONE_12: "iPhone 12";
        readonly SAMSUNG_GALAXY_S21: "Galaxy S21";
        readonly IPAD_PRO: "iPad Pro";
        readonly GALAXY_TAB_S4: "Galaxy Tab S4";
        readonly DESKTOP_CHROME: "Desktop Chrome";
        readonly DESKTOP_SAFARI: "Desktop Safari";
        readonly DESKTOP_FIREFOX: "Desktop Firefox";
    };
    static readonly DEFAULT_MOBILE_DEVICE: "Pixel 5";
    static readonly DEFAULT_SAFARI_DEVICE: "iPhone 15 Pro";
    static readonly RESOLUTIONS: {
        readonly PIXEL_5: {
            readonly width: 393;
            readonly height: 851;
        };
        readonly IPHONE_15_PRO: {
            readonly width: 393;
            readonly height: 852;
        };
        readonly IPHONE_12: {
            readonly width: 390;
            readonly height: 844;
        };
        readonly SAMSUNG_S21: {
            readonly width: 384;
            readonly height: 854;
        };
        readonly PIXEL_5_LANDSCAPE: {
            readonly width: 851;
            readonly height: 393;
        };
        readonly IPHONE_15_PRO_LANDSCAPE: {
            readonly width: 852;
            readonly height: 393;
        };
        readonly IPHONE_12_LANDSCAPE: {
            readonly width: 844;
            readonly height: 390;
        };
        readonly MOBILE_PORTRAIT: {
            readonly width: 375;
            readonly height: 812;
        };
        readonly MOBILE_LANDSCAPE: {
            readonly width: 812;
            readonly height: 375;
        };
        readonly IPAD_PRO: {
            readonly width: 1024;
            readonly height: 1366;
        };
        readonly GALAXY_TAB_S4: {
            readonly width: 712;
            readonly height: 1138;
        };
        readonly TABLET_LANDSCAPE: {
            readonly width: 1024;
            readonly height: 768;
        };
        readonly DESKTOP_SMALL: {
            readonly width: 1366;
            readonly height: 768;
        };
        readonly DESKTOP_MEDIUM: {
            readonly width: 1920;
            readonly height: 1080;
        };
        readonly DESKTOP_LARGE: {
            readonly width: 2560;
            readonly height: 1440;
        };
        readonly DESKTOP_DEFAULT: {
            readonly width: 1280;
            readonly height: 720;
        };
    };
    static readonly DEFAULT_MOBILE_RESOLUTION: {
        readonly width: 393;
        readonly height: 851;
    };
    static readonly DEFAULT_SAFARI_RESOLUTION: {
        readonly width: 393;
        readonly height: 852;
    };
    static readonly DEVICE_TYPES: {
        readonly MOBILE: "mobile";
        readonly TABLET: "tablet";
        readonly DESKTOP: "desktop";
    };
    static readonly DEFAULT_DEVICE_TYPE: "mobile";
    static readonly ORIENTATIONS: {
        readonly PORTRAIT: "portrait";
        readonly LANDSCAPE: "landscape";
    };
    static readonly DEFAULT_ORIENTATION: "portrait";
    static readonly URLS: {
        readonly BASE_URL: "https://loginq.cat.com/CwsLogin/cws/login.htm?appid=login";
        readonly LOGIN_URL: "https://loginq.cat.com/CwsLogin/cws/login.htm?appid=login";
        readonly PROCESS_LOGIN_URL: "https://loginq.cat.com/CwsLogin/cws/processlogin.htm";
        readonly CAT_HOMEPAGE: "https://cirde-pprod.cat.com/catSite/en";
    };
    static readonly DEFAULT_BASE_URL: "https://loginq.cat.com/CwsLogin/cws/login.htm?appid=login";
    static readonly CREDENTIALS: {
        readonly USERNAME: "shivaa2";
        readonly PASSWORD: "Deloitte@2028";
        readonly DEV_USERNAME: "dev_user";
        readonly DEV_PASSWORD: "dev_pass";
        readonly STAGING_USERNAME: "staging_user";
        readonly STAGING_PASSWORD: "staging_pass";
    };
    static readonly TIMEOUTS: {
        readonly ELEMENT_VISIBLE: 10000;
        readonly ELEMENT_CLICK: 5000;
        readonly ELEMENT_FILL: 3000;
        readonly ELEMENT_ATTACHED: 5000;
        readonly PAGE_LOAD: 30000;
        readonly NAVIGATION: 30000;
        readonly ACTION_TIMEOUT: 15000;
        readonly NETWORK_IDLE: 10000;
        readonly NETWORK_IDLE_FAST: 15000;
        readonly TEST_TIMEOUT: 120000;
        readonly SUITE_TIMEOUT: 300000;
        readonly CUCUMBER_DEFAULT: 60000;
        readonly TOUCH_DELAY: 500;
        readonly SCROLL_DELAY: 1000;
        readonly SWIPE_DURATION: 1000;
        readonly COOKIE_BANNER: 5000;
        readonly MODAL_CLOSE: 3000;
        readonly SEARCH_RESULT: 2000;
        readonly LOADING_INDICATOR: 1000;
        readonly FAST_DELAY: 50;
        readonly MEDIUM_DELAY: 300;
        readonly SLOW_DELAY: 1500;
        readonly ORIENTATION_DELAY: 1000;
        readonly SHORT_WAIT: 1000;
        readonly MEDIUM_WAIT: 5000;
        readonly LONG_WAIT: 10000;
        readonly EXTRA_LONG_WAIT: 20000;
    };
    static readonly EXECUTION: {
        readonly PARALLEL_EXECUTION: false;
        readonly WORKERS_COUNT: 1;
        readonly RETRIES: 0;
        readonly RETRIES_CI: 2;
        readonly HEADLESS: false;
        readonly HEADLESS_CI: false;
    };
    static readonly REPORTING: {
        readonly HTML_REPORT: true;
        readonly JSON_REPORT: false;
        readonly JUNIT_REPORT: false;
        readonly LINE_REPORT: true;
        readonly ALLURE_REPORT: false;
        readonly HTML_REPORT_PATH: "playwright-report";
        readonly JSON_REPORT_PATH: "test-results/results.json";
        readonly JUNIT_REPORT_PATH: "test-results/junit.xml";
        readonly SCREENSHOTS_PATH: "test-results/screenshots";
        readonly VIDEOS_PATH: "test-results/videos";
        readonly OUTPUT_DIR: "test-results/";
        readonly HTML_OPEN: "on-failure";
        readonly TRACE_MODE: "retain-on-failure";
        readonly SCREENSHOT_MODE: "only-on-failure";
        readonly VIDEO_MODE: "retain-on-failure";
    };
    static readonly MOBILE: {
        readonly HAS_TOUCH: true;
        readonly IS_MOBILE: true;
        readonly SIMULATE_SLOW_3G: false;
        readonly SIMULATE_OFFLINE: false;
        readonly DEFAULT_GEOLOCATION: {
            readonly latitude: 40.7128;
            readonly longitude: -74.006;
        };
        readonly MOBILE_USER_AGENT: "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36";
        readonly IPHONE_USER_AGENT: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15";
    };
    static readonly CUCUMBER: {
        readonly FEATURES_PATH: "features/**/*.feature";
        readonly STEP_DEFINITIONS_PATH: "features/step-definitions/**/*.ts";
        readonly SUPPORT_PATH: "features/support/**/*.ts";
        readonly HTML_REPORT_PATH: "reports/cucumber_report.html";
        readonly JSON_REPORT_PATH: "reports/cucumber_report.json";
        readonly PARALLEL: false;
        readonly FAIL_FAST: false;
        readonly DRY_RUN: false;
    };
    static readonly ENVIRONMENTS: {
        readonly DEVELOPMENT: "development";
        readonly STAGING: "staging";
        readonly PRODUCTION: "production";
        readonly LOCAL: "local";
    };
    static readonly DEFAULT_ENVIRONMENT: "production";
    /**
     * Get current environment from process.env or default
     */
    static getCurrentEnvironment(): string;
    /**
     * Get credentials based on current environment
     */
    static getCredentials(): {
        username: string;
        password: string;
    };
    /**
     * Get base URL based on current environment
     */
    static getBaseUrl(): string;
    /**
     * Get device configuration by name
     */
    static getDeviceConfig(deviceName: string): {
        width: number;
        height: number;
    };
    /**
     * Check if current configuration is mobile
     */
    static isMobileDevice(): boolean;
    /**
     * Get all mobile devices
     */
    static getMobileDevices(): string[];
    /**
     * Get device resolution by device name
     */
    static getDeviceResolution(deviceName?: string): {
        width: number;
        height: number;
    };
    /**
     * Get simplified Playwright projects configuration - ONLY Chrome and Safari Mobile
     */
    static getPlaywrightProjects(): Array<{
        name: string;
        use: any;
    }>;
    /**
     * Get reporter configuration array
     */
    static getReporterConfig(): Array<[string, any] | [string]>;
    /**
     * Get comprehensive 'use' configuration object
     */
    static getUseConfig(): any;
}
export type DeviceType = typeof TestConfig.DEVICE_TYPES[keyof typeof TestConfig.DEVICE_TYPES];
export type BrowserType = typeof TestConfig.BROWSERS[keyof typeof TestConfig.BROWSERS];
export type OrientationType = typeof TestConfig.ORIENTATIONS[keyof typeof TestConfig.ORIENTATIONS];
export type EnvironmentType = typeof TestConfig.ENVIRONMENTS[keyof typeof TestConfig.ENVIRONMENTS];
//# sourceMappingURL=TestConfig.d.ts.map