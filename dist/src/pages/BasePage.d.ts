import { Page } from '@playwright/test';
export declare class BasePage {
    protected page: Page;
    constructor(page: Page);
    navigateTo(url: string): Promise<void>;
    waitForElement(selector: string, timeout?: number): Promise<void>;
    click(selector: string): Promise<void>;
    fill(selector: string, text: string): Promise<void>;
    getTitle(): Promise<string>;
    getCurrentUrl(): Promise<string>;
    takeScreenshot(name: string): Promise<void>;
}
//# sourceMappingURL=BasePage.d.ts.map
