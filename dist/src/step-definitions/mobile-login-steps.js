"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const TestConfig_1 = require("../utils/TestConfig");
// Updated Browser Launch Steps with Latest Devices
(0, cucumber_1.Given)('I launch Chrome browser on Android device', async function () {
    console.log('🤖 Chrome browser launched on Android device (Pixel 8 Pro)');
    const userAgent = await this.page.evaluate(() => navigator.userAgent);
    console.log(`📱 User Agent: ${userAgent}`);
    (0, test_1.expect)(userAgent).toContain('Mobile');
    console.log('✅ Chrome browser launched successfully on Android device');
});
(0, cucumber_1.Given)('I launch Safari browser on iOS device', async function () {
    console.log('🍎 Safari browser launched on iOS device (iPhone 15 Pro Max)');
    const userAgent = await this.page.evaluate(() => navigator.userAgent);
    console.log(`📱 User Agent: ${userAgent}`);
    (0, test_1.expect)(userAgent).toContain('Mobile');
    console.log('✅ Safari browser launched successfully on iOS device');
});
// Navigation Steps
(0, cucumber_1.When)('I navigate to the login page', { timeout: 60000 }, async function () {
    console.log('🔐 Navigating to login page');
    try {
        await this.loginPage.navigateTo(TestConfig_1.TestConfig.URLS.LOGIN_URL);
        // Wait for page to be fully loaded
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
        console.log('✅ Successfully navigated to login page');
    }
    catch (error) {
        console.error('❌ Navigation failed:', error);
        throw new Error(`Failed to navigate to login page: ${error}`);
    }
});
// Login Steps
(0, cucumber_1.When)('I enter valid username', async function () {
    try {
        console.log('👤 Starting username entry step');
        await this.loginPage.enterUsername(TestConfig_1.TestConfig.CREDENTIALS.USERNAME);
        console.log('✅ Username entry completed successfully');
    }
    catch (error) {
        console.error('❌ Username entry failed:', error);
        throw new Error(`Failed to enter username: ${error}`);
    }
});
(0, cucumber_1.When)('I click login after username', async function () {
    try {
        console.log('🔘 Starting first login button click after username');
        await this.loginPage.clickLoginAfterUsername();
        console.log('✅ First login button click completed successfully');
    }
    catch (error) {
        console.error('❌ First login button click failed:', error);
        throw new Error(`Failed to click first login button: ${error}`);
    }
});
(0, cucumber_1.When)('I enter valid password', async function () {
    try {
        console.log('🔑 Starting password entry step');
        await this.loginPage.enterPassword(TestConfig_1.TestConfig.CREDENTIALS.PASSWORD);
        console.log('✅ Password entry completed successfully');
    }
    catch (error) {
        console.error('❌ Password entry failed:', error);
        throw new Error(`Failed to enter password: ${error}`);
    }
});
(0, cucumber_1.When)('I click the login button', async function () {
    try {
        console.log('🔘 Starting final login button click after password');
        await this.loginPage.clickLoginButton();
        console.log('✅ Final login button click completed successfully');
    }
    catch (error) {
        console.error('❌ Final login button click failed:', error);
        throw new Error(`Failed to click final login button: ${error}`);
    }
});
(0, cucumber_1.When)('I click continue button', async function () {
    try {
        console.log('🔘 Starting continue button click step');
        await this.loginPage.clickContinueButton();
        console.log('✅ Continue button handling completed successfully');
    }
    catch (error) {
        console.error('❌ Continue button handling failed:', error);
        throw new Error(`Failed to handle continue button: ${error}`);
    }
});
(0, cucumber_1.When)('I wait and close browser', async function () {
    try {
        console.log('⏳ Starting wait and close step');
        await this.loginPage.waitAndClose();
        console.log('✅ Wait and close completed successfully');
    }
    catch (error) {
        console.error('❌ Wait and close failed:', error);
        throw new Error(`Failed to wait and close: ${error}`);
    }
});
(0, cucumber_1.When)('I click the final login button', async function () {
    try {
        console.log('🔘 Starting final login button click step');
        await this.loginPage.clickFinalLoginButton();
        console.log('✅ Final login button click completed successfully');
    }
    catch (error) {
        console.error('❌ Final login button click failed:', error);
        throw new Error(`Failed to click final login button: ${error}`);
    }
});
// Verification Steps
(0, cucumber_1.Then)('I should see the password page', async function () {
    try {
        console.log('🔍 Validating password page is visible');
        const isPasswordPageVisible = await this.loginPage.isPasswordPageVisible();
        (0, test_1.expect)(isPasswordPageVisible).toBe(true);
        console.log('✅ Password page is visible');
    }
    catch (error) {
        console.error('❌ Password page validation failed:', error);
        throw new Error(`Password page validation failed: ${error}`);
    }
});
(0, cucumber_1.Then)('I should be successfully logged in', async function () {
    try {
        console.log('🎯 Validating successful login');
        await this.page.waitForTimeout(3000); // Wait for login completion
        const isLoggedIn = await this.loginPage.isLoggedIn();
        (0, test_1.expect)(isLoggedIn).toBe(true);
        const pageTitle = await this.loginPage.getTitle();
        (0, test_1.expect)(pageTitle).toBeTruthy();
        console.log(`✅ Login successful - Page Title: ${pageTitle}`);
        console.log('🎉 Mobile login flow completed successfully!');
    }
    catch (error) {
        console.error('❌ Login validation failed:', error);
        const currentUrl = await this.page.url();
        console.log(`🔍 Current URL: ${currentUrl}`);
        throw new Error(`Login validation failed: ${error}`);
    }
});
//# sourceMappingURL=mobile-login-steps.js.map