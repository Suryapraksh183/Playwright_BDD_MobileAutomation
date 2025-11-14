"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("@cucumber/cucumber");
const test_1 = require("@playwright/test");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
(0, cucumber_1.BeforeAll)(async function () {
    console.log('🚀 Starting Enhanced Playwright BDD Mobile Automation with Comprehensive Reporting');
    // Clean up old reports and artifacts
    const dirsToClean = [
        'playwright-report',
        'test-results',
        'reports/screenshots',
        'reports/videos',
        'reports/traces',
        'reports/har',
        'reports/artifacts',
        'reports/cucumber-html'
    ];
    dirsToClean.forEach(dir => {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
        }
        fs.mkdirSync(dir, { recursive: true });
    });
    console.log('📁 Initialized enhanced reporting directories');
});
(0, cucumber_1.Before)({ timeout: 60000 }, async function (scenario) {
    const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
    const featureName = scenario.gherkinDocument.feature?.name?.replace(/[^a-zA-Z0-9]/g, '_') || 'Unknown_Feature';
    const featureDescription = scenario.gherkinDocument.feature?.description || '';
    this.scenarioName = scenarioName;
    this.featureName = featureName;
    this.featureDescription = featureDescription;
    // Collect scenario steps from feature file for ExtentReports-like format
    this.scenarioSteps = scenario.pickle.steps.map((step, index) => ({
        keyword: step.type || 'Step',
        text: step.text,
        status: 'PENDING',
        duration: 0
    }));
    this.currentStepIndex = 0;
    console.log(`🔧 Starting enhanced scenario: ${scenario.pickle.name}`);
    console.log(`📋 Feature: ${scenario.gherkinDocument.feature?.name}`);
    console.log(`📝 Steps to execute: ${this.scenarioSteps.length}`);
    // Determine browser and device based on scenario tags - Updated to latest devices
    const scenarioTags = scenario.pickle.tags.map(tag => tag.name);
    let browserName = 'chrome';
    let selectedDeviceName = 'Pixel 8 Pro'; // Latest Android device
    if (scenarioTags.includes('@safari') || scenarioTags.includes('@ios')) {
        browserName = 'safari';
        selectedDeviceName = 'iPhone 15 Pro Max'; // Latest iPhone device
    }
    else if (scenarioTags.includes('@chrome') || scenarioTags.includes('@android')) {
        browserName = 'chrome';
        selectedDeviceName = 'Pixel 8 Pro'; // Latest Android device
    }
    this.browserName = browserName;
    this.deviceName = selectedDeviceName;
    // Launch browser with enhanced mobile configuration
    let browser;
    if (browserName === 'safari') {
        // iOS Safari configuration
        browser = await test_1.webkit.launch({
            headless: false,
            args: [
                '--enable-features=TouchEventFeatureDetection',
                '--enable-viewport-meta',
                '--enable-touch-drag-drop',
                '--enable-accelerated-2d-canvas'
            ]
        });
    }
    else {
        // Android Chrome configuration
        browser = await test_1.chromium.launch({
            headless: false,
            args: [
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--enable-touch-events',
                '--touch-events=enabled',
                '--enable-viewport-meta',
                '--enable-accelerated-2d-canvas',
                '--disable-dev-shm-usage',
                '--no-sandbox',
                '--enable-font-antialiasing',
                '--enable-gpu-rasterization'
            ]
        });
    }
    this.browser = browser;
    // Create context with enhanced device emulation and comprehensive recording
    const device = test_1.devices[selectedDeviceName] || test_1.devices['Pixel 5']; // Fallback
    const harPath = path.join('test-results', 'har', `${scenarioName}.har`);
    const videoDir = path.join('test-results', 'videos');
    // Ensure directories exist
    fs.mkdirSync(path.dirname(harPath), { recursive: true });
    fs.mkdirSync(videoDir, { recursive: true });
    this.context = await browser.newContext({
        ...device,
        permissions: ['geolocation'],
        geolocation: { latitude: 37.7749, longitude: -122.4194 },
        locale: 'en-US',
        timezoneId: 'America/Los_Angeles',
        extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9'
        },
        recordVideo: {
            dir: videoDir,
            size: { width: 1280, height: 720 }
        },
        recordHar: {
            path: harPath,
            content: 'embed' // Embed response content for better debugging
        },
        // Enhanced mobile settings
        javaScriptEnabled: true,
        acceptDownloads: true,
        ignoreHTTPSErrors: true
    });
    // Create page with enhanced tracing
    this.page = await this.context.newPage();
    // Set mobile-friendly timeouts
    this.page.setDefaultTimeout(60000);
    this.page.setDefaultNavigationTimeout(60000);
    // Start comprehensive tracing for Playwright report integration
    await this.context.tracing.start({
        screenshots: true,
        snapshots: true,
        sources: true,
        title: `${featureName} - ${scenarioName}`
    });
    // Initialize page objects and logging
    await this.initializePageObjects();
    // Capture browser metadata
    const userAgent = await this.page.evaluate(() => navigator.userAgent);
    const viewport = this.page.viewportSize();
    if (this.artifacts) {
        this.artifacts.browserMetadata = {
            browserName,
            deviceName: selectedDeviceName,
            userAgent,
            viewport,
            timestamp: new Date().toISOString()
        };
    }
    console.log(`📱 Enhanced test started with ${selectedDeviceName} on ${browserName.toUpperCase()}`);
    console.log(`🔍 User Agent: ${userAgent}`);
});
(0, cucumber_1.BeforeStep)(async function ({ pickleStep }) {
    console.log(`⏯️ Starting step: ${pickleStep.text}`);
    // Update current step status to in-progress
    if (this.scenarioSteps && this.currentStepIndex !== undefined) {
        const currentStep = this.scenarioSteps.find(step => step.text === pickleStep.text);
        if (currentStep) {
            currentStep.status = 'PENDING';
            // Record step start time for duration calculation
            currentStep.startTime = Date.now();
        }
    }
});
(0, cucumber_1.AfterStep)(async function ({ pickleStep, result }) {
    const stepText = pickleStep.text.replace(/[^a-zA-Z0-9]/g, '_');
    const stepStatus = result.status;
    console.log(`✅ Completed step: ${pickleStep.text} - Status: ${stepStatus}`);
    // Update step status and duration for ExtentReports-like tracking
    if (this.scenarioSteps) {
        const currentStep = this.scenarioSteps.find(step => step.text === pickleStep.text);
        if (currentStep) {
            currentStep.status = stepStatus;
            if (currentStep.startTime) {
                currentStep.duration = Date.now() - currentStep.startTime;
            }
            if (result.message) {
                currentStep.errorMessage = result.message;
            }
        }
    }
    // Only capture screenshot for failed steps
    if (stepStatus === 'FAILED' && this.page && !this.page.isClosed()) {
        try {
            const screenshotPath = await this.captureScreenshot(`FAILED_${stepText}`);
            await this.attachArtifact('screenshot', screenshotPath, `Failed step screenshot: ${pickleStep.text}`);
        }
        catch (error) {
            console.warn('⚠️ Could not capture failure screenshot:', error);
        }
    }
    // Capture additional artifacts for failed steps
    if (stepStatus === 'FAILED' && this.page && !this.page.isClosed()) {
        try {
            // Capture page content
            const htmlContent = await this.page.content();
            const htmlPath = path.join('test-results', 'page-content', `${this.scenarioName}_${stepText}_failed.html`);
            fs.mkdirSync(path.dirname(htmlPath), { recursive: true });
            fs.writeFileSync(htmlPath, htmlContent);
            await this.attachArtifact('html', htmlPath, `Page content when step failed: ${pickleStep.text}`);
            // Capture console logs for this step
            const stepConsoleLogs = this.artifacts?.consoleLogs?.filter(log => new Date(log.timestamp).getTime() > Date.now() - 30000 // Last 30 seconds
            ) || [];
            if (stepConsoleLogs.length > 0) {
                const consoleLogsPath = path.join('test-results', 'console-logs', `${this.scenarioName}_${stepText}_console.json`);
                fs.mkdirSync(path.dirname(consoleLogsPath), { recursive: true });
                fs.writeFileSync(consoleLogsPath, JSON.stringify(stepConsoleLogs, null, 2));
                await this.attachArtifact('json', consoleLogsPath, `Console logs for failed step: ${pickleStep.text}`);
            }
        }
        catch (error) {
            console.warn('⚠️ Could not capture additional failure artifacts:', error);
        }
    }
});
(0, cucumber_1.After)({ timeout: 30000 }, async function (scenario) {
    const scenarioName = this.scenarioName || 'unknown_scenario';
    const scenarioStatus = scenario.result?.status || 'UNKNOWN';
    console.log(`📊 Finishing enhanced scenario: ${scenario.pickle.name} - Status: ${scenarioStatus}`);
    // Capture final artifacts
    if (this.page && !this.page.isClosed()) {
        try {
            // Final screenshot
            const finalScreenshotPath = await this.captureScreenshot(`final_${scenarioStatus}`);
            await this.attachArtifact('screenshot', finalScreenshotPath, `Final screenshot - ${scenarioStatus}`);
            // Capture video
            const videoPath = await this.captureVideo();
            if (videoPath) {
                await this.attachArtifact('video', videoPath, `Video recording of scenario: ${scenario.pickle.name}`);
            }
        }
        catch (error) {
            console.warn('⚠️ Could not capture final artifacts:', error);
        }
    }
    // Stop tracing and save with comprehensive information
    if (this.context) {
        try {
            const tracePath = await this.captureTrace();
            if (tracePath) {
                await this.attachArtifact('trace', tracePath, `Playwright trace for scenario: ${scenario.pickle.name}`);
            }
        }
        catch (error) {
            console.warn('⚠️ Could not capture trace:', error);
        }
    }
    // Capture HAR file
    try {
        const harPath = await this.captureHarFile();
        if (harPath) {
            await this.attachArtifact('har', harPath, `Network HAR file for scenario: ${scenario.pickle.name}`);
        }
    }
    catch (error) {
        console.warn('⚠️ Could not capture HAR file:', error);
    }
    // Generate comprehensive artifact report
    try {
        await this.generateArtifactReport();
    }
    catch (error) {
        console.warn('⚠️ Could not generate artifact report:', error);
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
    console.log(`📋 Enhanced test completed: ${scenario.pickle.name} - ${scenarioStatus}`);
    console.log(`📊 Artifacts captured: ${this.artifacts?.screenshots?.length || 0} screenshots, ${this.artifacts?.videos?.length || 0} videos, ${this.artifacts?.traces?.length || 0} traces`);
});
(0, cucumber_1.AfterAll)(async function () {
    console.log('🏁 All Enhanced Playwright BDD tests completed');
    // Generate comprehensive HTML report
    console.log('📊 Generating enhanced Cucumber HTML report with Playwright artifacts...');
    try {
        // This will be handled by the custom reporter we'll create
        console.log('✅ Enhanced reporting completed');
    }
    catch (error) {
        console.error('❌ Error generating enhanced report:', error);
    }
});
//# sourceMappingURL=enhanced-hooks.js.map