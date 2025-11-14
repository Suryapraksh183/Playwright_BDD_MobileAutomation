import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
export interface ICustomWorld {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    loginPage?: LoginPage;
    browserName?: string;
    deviceName?: string;
    attach?: (data: string | Buffer, mediaType: string) => void;
    initializePageObjects(): Promise<void>;
}
export declare class CustomWorld implements ICustomWorld {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    loginPage?: LoginPage;
    browserName?: string;
    deviceName?: string;
    attach?: (data: string | Buffer, mediaType: string) => void;
    constructor();
    initializePageObjects(): Promise<void>;
}
//# sourceMappingURL=world.d.ts.map