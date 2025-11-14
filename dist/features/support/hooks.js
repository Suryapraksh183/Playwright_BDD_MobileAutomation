"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const world_1 = require("./world");
(0, cucumber_1.setWorldConstructor)(world_1.CustomWorld);
(0, cucumber_1.BeforeAll)(async function () {
    console.log('🚀 Starting Playwright BDD Mobile Automation tests');
});
(0, cucumber_1.Before)({ timeout: 60000 }, async function (scenario) {
    console.log(`🔧 Starting scenario: ${scenario.pickle.name}`);
    // Determine browser and device based on scenario tags
    const scenarioTags = scenario.pickle.tags.map(tag => tag.name);
    let browserName = 'chrome';
    let selectedDeviceName = 'Pixel 5';
    if (scenarioTags.includes('@safari')) {
        browserName = 'safari';
        selectedDeviceName = 'iPhone 15 Pro';
    }
    this.browserName = browserName;
    this.deviceName = selectedDeviceName;
    // Launch browser
    let browser;
    if (browserName === 'safari') {
        browser = await test_1.webkit.launch({ headless: false });
    }
    else {
        browser = await test_1.chromium.launch({ headless: false });
    }
    this.browser = browser;
    // Create context with device emulation
    const device = test_1.devices[selectedDeviceName];
    this.context = await browser.newContext({
        ...device,
        recordVideo: {
            dir: 'reports/videos',
            size: { width: 1280, height: 720 }
        }
    });
    // Create page
    this.page = await this.context.newPage();
    // Initialize page objects
    await this.initializePageObjects();
    console.log(`📱 Test started with ${selectedDeviceName} on ${browserName.toUpperCase()}`);
});
(0, cucumber_1.After)({ timeout: 15000 }, async function (scenario) {
    // Capture screenshot on failure
    if (scenario.result?.status === 'FAILED' && this.page) {
        const screenshot = await this.page.screenshot({
            path: `reports/screenshots/failed-${scenario.pickle.name}-${Date.now()}.png`,
            fullPage: true
        });
        if (typeof this.attach === 'function') {
            await this.attach(screenshot, 'image/png');
        }
    }
    // Clean up resources
    try {
        if (this.page && !this.page.isClosed()) {
            await this.page.close();
        }
        if (this.context) {
            await this.context.close();
        }
        if (this.browser) {
            await this.browser.close();
        }
    }
    catch (error) {
        console.log('⚠️ Cleanup error:', error instanceof Error ? error.message : String(error));
    }
    console.log(`📊 Test completed: ${scenario.pickle.name} - ${scenario.result?.status}`);
});
(0, cucumber_1.AfterAll)(async function () {
    console.log('🏁 All Playwright BDD tests completed');
});
//# sourceMappingURL=hooks.js.map