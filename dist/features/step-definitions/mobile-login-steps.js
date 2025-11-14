"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const TestConfig_1 = require("../../src/utils/TestConfig");
// Browser Launch Steps
(0, cucumber_1.Given)('I launch Chrome browser on Android device', async function () {
    console.log('🤖 Chrome browser launched on Android device (Pixel 5)');
    const userAgent = await this.page.evaluate(() => navigator.userAgent);
    console.log(`📱 User Agent: ${userAgent}`);
    (0, test_1.expect)(userAgent).toContain('Mobile');
    console.log('✅ Chrome browser launched successfully on Android device');
});
(0, cucumber_1.Given)('I launch Safari browser on iOS device', async function () {
    console.log('🍎 Safari browser launched on iOS device (iPhone 15 Pro)');
    const userAgent = await this.page.evaluate(() => navigator.userAgent);
    console.log(`📱 User Agent: ${userAgent}`);
    (0, test_1.expect)(userAgent).toContain('Mobile');
    console.log('✅ Safari browser launched successfully on iOS device');
});
// Navigation Steps
(0, cucumber_1.When)('I navigate to the login page', async function () {
    console.log('🔐 Navigating to login page');
    await this.loginPage.navigateTo(TestConfig_1.TestConfig.URLS.LOGIN_URL);
    console.log('✅ Successfully navigated to login page');
});
// Login Steps
(0, cucumber_1.When)('I enter valid username', async function () {
    await this.loginPage.enterUsername(TestConfig_1.TestConfig.CREDENTIALS.USERNAME);
});
(0, cucumber_1.When)('I enter valid password', async function () {
    await this.loginPage.enterPassword(TestConfig_1.TestConfig.CREDENTIALS.PASSWORD);
});
(0, cucumber_1.When)('I click the login button', async function () {
    await this.loginPage.clickLoginButton();
});
(0, cucumber_1.When)('I click the final login button', async function () {
    await this.loginPage.clickFinalLoginButton();
});
// Verification Steps
(0, cucumber_1.Then)('I should see the password page', async function () {
    console.log('🔍 Validating password page is visible');
    const isPasswordPageVisible = await this.loginPage.isPasswordPageVisible();
    (0, test_1.expect)(isPasswordPageVisible).toBe(true);
    console.log('✅ Password page is visible');
});
(0, cucumber_1.Then)('I should be successfully logged in', async function () {
    console.log('🎯 Validating successful login');
    await this.page.waitForTimeout(5000); // Wait for login completion
    const isLoggedIn = await this.loginPage.isLoggedIn();
    (0, test_1.expect)(isLoggedIn).toBe(true);
    const pageTitle = await this.loginPage.getTitle();
    (0, test_1.expect)(pageTitle).toBeTruthy();
    console.log(`✅ Login successful - Page Title: ${pageTitle}`);
    console.log('🎉 Mobile login flow completed successfully!');
});
//# sourceMappingURL=mobile-login-steps.js.map
