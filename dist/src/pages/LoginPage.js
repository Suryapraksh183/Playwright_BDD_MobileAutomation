"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const BasePage_1 = require("./BasePage");
class LoginPage extends BasePage_1.BasePage {
    constructor(page) {
        super(page);
        // CAT login page specific selectors (discovered from actual page structure)
        this.usernameInput = 'input[name="cwsUID"], input[placeholder="Username"], input.cwsuid-input-field';
        this.passwordInput = 'input[name="cwsPWD"], input[placeholder="Password"], input[type="password"]:not([type="hidden"]), input[name="password"], input[id*="pwd"], input[id*="pass"]';
        this.loginButton = 'input[name="btnLogin"], input[type="submit"], button[type="submit"], input[value*="Login"], input[value*="Sign"], button:has-text("Login"), button:has-text("Sign"), input[id*="login"]';
        this.finalLoginButton = 'input[name="btnLogin"], input[type="submit"], button[type="submit"], input[value*="Login"], button:has-text("Login")';
        this.successMessage = '.success, .welcome, .dashboard, h1, h2, .logged-in, .authenticated, .main-content, .dashboard-container';
    }
    async enterUsername(username) {
        console.log('👤 Entering username');
        try {
            // Wait for element with longer timeout for mobile
            await this.waitForElement(this.usernameInput, 15000);
            // Clear any existing value first
            await this.page.locator(this.usernameInput).clear();
            // Type username with mobile-friendly approach
            await this.page.locator(this.usernameInput).type(username, { delay: 100 });
            // Verify the value was entered
            const enteredValue = await this.page.locator(this.usernameInput).inputValue();
            if (enteredValue !== username) {
                throw new Error(`Username not entered correctly. Expected: ${username}, Got: ${enteredValue}`);
            }
            console.log(`✅ Username entered successfully: ${username}`);
        }
        catch (error) {
            console.error('❌ Username entry failed:', error);
            throw error;
        }
    }
    async clickLoginAfterUsername() {
        console.log('� Clicking login button after username entry');
        try {
            // Look for the first login/submit button after username
            const firstLoginSelectors = [
                'input[type="submit"]',
                'button[type="submit"]',
                'input[value*="Login"]',
                'input[value*="Next"]',
                'input[value*="Continue"]',
                'button:has-text("Login")',
                'button:has-text("Next")',
                'button:has-text("Continue")',
                '.btn-primary',
                '.login-button'
            ];
            for (const selector of firstLoginSelectors) {
                try {
                    const button = this.page.locator(selector).first();
                    if (await button.isVisible()) {
                        console.log(`🔘 Found and clicking first login button: ${selector}`);
                        await button.scrollIntoViewIfNeeded();
                        await button.click();
                        await this.page.waitForLoadState('networkidle', { timeout: 15000 });
                        console.log('✅ First login button clicked successfully');
                        return;
                    }
                }
                catch {
                    continue;
                }
            }
            throw new Error('No login button found after username entry');
        }
        catch (error) {
            console.error('❌ First login button click failed:', error);
            throw error;
        }
    }
    async enterPassword(password) {
        console.log('🔑 Entering password');
        try {
            // Wait for password field to appear after first login click
            await this.page.waitForSelector(this.passwordInput, { timeout: 15000, state: 'visible' });
            console.log('📍 Password field found after first login click');
            // Clear any existing value first
            await this.page.locator(this.passwordInput).clear();
            // Type password with mobile-friendly approach
            await this.page.locator(this.passwordInput).type(password, { delay: 100 });
            // Additional verification without exposing password in logs
            const hasValue = await this.page.locator(this.passwordInput).evaluate((el) => el.value.length > 0);
            if (!hasValue) {
                throw new Error('Password field appears to be empty after input');
            }
            console.log('✅ Password entered successfully');
        }
        catch (error) {
            console.error('❌ Password entry failed:', error);
            // Log current page URL and title for debugging
            console.log(`🌐 Current URL: ${this.page.url()}`);
            try {
                console.log(`📄 Page title: ${await this.page.title()}`);
            }
            catch {
                console.log('📄 Could not get page title - page may be navigating');
            }
            throw error;
        }
    }
    async clickLoginButton() {
        console.log('🔘 Clicking final login button after password');
        try {
            // Wait for login button with longer timeout for mobile
            await this.waitForElement(this.loginButton, 15000);
            // Ensure button is visible and enabled
            await this.page.locator(this.loginButton).waitFor({ state: 'visible' });
            // Scroll to button if needed on mobile
            await this.page.locator(this.loginButton).scrollIntoViewIfNeeded();
            // Click the login button
            await this.page.locator(this.loginButton).click();
            // Wait for navigation or response with increased timeout
            await this.page.waitForLoadState('networkidle', { timeout: 30000 });
            console.log('✅ Final login button clicked successfully');
        }
        catch (error) {
            console.error('❌ Final login button click failed:', error);
            throw error;
        }
    }
    async clickContinueButton() {
        console.log('🔘 Looking for and clicking continue button');
        try {
            // Look for continue button with various selectors
            const continueSelectors = [
                'input[value*="Continue"]',
                'button:has-text("Continue")',
                'input[value*="Proceed"]',
                'button:has-text("Proceed")',
                'input[value*="Next"]',
                'button:has-text("Next")',
                'input[type="submit"]',
                'button[type="submit"]',
                '.btn-continue',
                '.continue-button'
            ];
            let continueButtonFound = false;
            for (const selector of continueSelectors) {
                try {
                    const button = this.page.locator(selector).first();
                    if (await button.isVisible({ timeout: 5000 })) {
                        console.log(`🔘 Found continue button: ${selector}`);
                        await button.scrollIntoViewIfNeeded();
                        await button.click();
                        continueButtonFound = true;
                        console.log('✅ Continue button clicked successfully');
                        break;
                    }
                }
                catch {
                    continue;
                }
            }
            if (!continueButtonFound) {
                console.log('⚠️ No continue button found - may have proceeded automatically');
            }
            // Wait for any final navigation
            await this.page.waitForLoadState('networkidle', { timeout: 15000 });
        }
        catch (error) {
            console.warn('⚠️ Continue button handling failed (may be optional):', error);
            // Don't throw error as continue button might be optional
        }
    }
    async waitAndClose() {
        console.log('⏳ Waiting 10 seconds before closing...');
        await this.page.waitForTimeout(10000);
        console.log('✅ Wait completed, browser will be closed by hooks');
    }
    async clickFinalLoginButton() {
        console.log('🔘 Clicking final login button');
        await this.waitForElement(this.finalLoginButton);
        await this.click(this.finalLoginButton);
        await this.page.waitForTimeout(5000); // Wait for login completion
        console.log('✅ Final login button clicked successfully');
    }
    async isPasswordPageVisible() {
        try {
            await this.waitForElement(this.passwordInput, 10000);
            return true;
        }
        catch {
            return false;
        }
    }
    async isLoggedIn() {
        try {
            // Check if we're redirected to a different page after login
            const currentUrl = await this.getCurrentUrl();
            console.log(`🔍 Current URL after login: ${currentUrl}`);
            // Check for success indicators
            const hasSuccessMessage = await this.page.locator(this.successMessage).isVisible().catch(() => false);
            const isOnSecurePage = currentUrl.includes('secure') || currentUrl.includes('dashboard') || currentUrl.includes('welcome');
            const notOnLoginPage = !currentUrl.includes('login');
            console.log(`✅ Success message visible: ${hasSuccessMessage}`);
            console.log(`✅ On secure page: ${isOnSecurePage}`);
            console.log(`✅ Not on login page: ${notOnLoginPage}`);
            return hasSuccessMessage || isOnSecurePage || notOnLoginPage;
        }
        catch (error) {
            console.error('❌ Error checking login status:', error);
            return false;
        }
    }
}
exports.LoginPage = LoginPage;
//# sourceMappingURL=LoginPage.js.map