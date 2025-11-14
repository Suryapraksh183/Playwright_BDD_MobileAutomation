"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
class BasePage {
    constructor(page) {
        this.page = page;
    }
    async navigateTo(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }
    async waitForElement(selector, timeout = 30000) {
        try {
            await this.page.waitForSelector(selector, { timeout, state: 'visible' });
        }
        catch (error) {
            console.error(`❌ Element not found: ${selector} within ${timeout}ms`);
            throw new Error(`Element not found: ${selector}`);
        }
    }
    async click(selector) {
        await this.page.click(selector);
    }
    async fill(selector, text) {
        await this.page.fill(selector, text);
    }
    async getTitle() {
        return await this.page.title();
    }
    async getCurrentUrl() {
        return this.page.url();
    }
    async takeScreenshot(name) {
        await this.page.screenshot({
            path: `reports/screenshots/${name}-${Date.now()}.png`,
            fullPage: true
        });
    }
}
exports.BasePage = BasePage;
//# sourceMappingURL=BasePage.js.map