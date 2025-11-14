import { World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
export interface ICustomWorld extends World {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    loginPage?: LoginPage;
    browserName?: string;
    deviceName?: string;
    scenarioName?: string;
    featureName?: string;
    featureDescription?: string;
    scenarioSteps?: Array<{
        keyword: string;
        text: string;
        status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'PENDING';
        duration?: number;
        errorMessage?: string;
    }>;
    currentStepIndex?: number;
    artifacts?: {
        screenshots: string[];
        videos: string[];
        traces: string[];
        harFiles: string[];
        consoleLogs: any[];
        networkLogs: any[];
        browserMetadata: any;
    };
    initializePageObjects(): Promise<void>;
    captureScreenshot(stepName: string): Promise<string>;
    captureVideo(): Promise<string>;
    captureTrace(): Promise<string>;
    captureHarFile(): Promise<string>;
    attachArtifact(type: string, filePath: string, description?: string): Promise<void>;
    logConsoleMessage(message: any): void;
    logNetworkRequest(request: any): void;
    generateArtifactReport(): Promise<void>;
}
export declare class CustomWorld extends World implements ICustomWorld {
    browser?: Browser;
    context?: BrowserContext;
    page?: Page;
    loginPage?: LoginPage;
    browserName?: string;
    deviceName?: string;
    scenarioName?: string;
    featureName?: string;
    featureDescription?: string;
    scenarioSteps?: Array<{
        keyword: string;
        text: string;
        status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'PENDING';
        duration?: number;
        errorMessage?: string;
    }>;
    currentStepIndex?: number;
    artifacts: {
        screenshots: string[];
        videos: string[];
        traces: string[];
        harFiles: string[];
        consoleLogs: any[];
        networkLogs: any[];
        browserMetadata: any;
    };
    constructor(options: IWorldOptions);
    initializePageObjects(): Promise<void>;
    captureScreenshot(stepName: string): Promise<string>;
    captureVideo(): Promise<string>;
    captureTrace(): Promise<string>;
    captureHarFile(): Promise<string>;
    attachArtifact(type: string, filePath: string, description?: string): Promise<void>;
    logConsoleMessage(message: any): void;
    logNetworkRequest(request: any): void;
    private getMimeType;
    generateArtifactReport(): Promise<void>;
}
//# sourceMappingURL=enhanced-world.d.ts.map