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
exports.CustomWorld = void 0;
const cucumber_1 = require("@cucumber/cucumber");
const LoginPage_1 = require("../pages/LoginPage");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
class CustomWorld extends cucumber_1.World {
    constructor(options) {
        super(options);
        // Initialize artifacts collection
        this.artifacts = {
            screenshots: [],
            videos: [],
            traces: [],
            harFiles: [],
            consoleLogs: [],
            networkLogs: [],
            browserMetadata: {}
        };
    }
    async initializePageObjects() {
        if (this.page) {
            this.loginPage = new LoginPage_1.LoginPage(this.page);
            // Set up console and network logging
            this.page.on('console', (msg) => {
                this.logConsoleMessage({
                    type: msg.type(),
                    text: msg.text(),
                    location: msg.location(),
                    timestamp: new Date().toISOString()
                });
            });
            this.page.on('request', (request) => {
                this.logNetworkRequest({
                    method: request.method(),
                    url: request.url(),
                    headers: request.headers(),
                    timestamp: new Date().toISOString()
                });
            });
            this.page.on('response', (response) => {
                this.logNetworkRequest({
                    status: response.status(),
                    url: response.url(),
                    headers: response.headers(),
                    timestamp: new Date().toISOString(),
                    type: 'response'
                });
            });
        }
    }
    async captureScreenshot(stepName) {
        if (!this.page)
            throw new Error('Page not initialized');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${this.scenarioName}-${stepName}-${timestamp}.png`;
        const filePath = path.join('test-results', 'screenshots', fileName);
        await fs.ensureDir(path.dirname(filePath));
        await this.page.screenshot({
            path: filePath,
            fullPage: true,
            type: 'png'
        });
        this.artifacts.screenshots.push(filePath);
        return filePath;
    }
    async captureVideo() {
        if (!this.context)
            throw new Error('Context not initialized');
        const videoPath = await this.page?.video()?.path();
        if (videoPath) {
            this.artifacts.videos.push(videoPath);
            return videoPath;
        }
        return '';
    }
    async captureTrace() {
        if (!this.context)
            throw new Error('Context not initialized');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${this.scenarioName}-trace-${timestamp}.zip`;
        const filePath = path.join('test-results', 'traces', fileName);
        await fs.ensureDir(path.dirname(filePath));
        await this.context.tracing.stop({ path: filePath });
        this.artifacts.traces.push(filePath);
        return filePath;
    }
    async captureHarFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${this.scenarioName}-network-${timestamp}.har`;
        const filePath = path.join('test-results', 'har', fileName);
        // HAR file is already being recorded to this path via context options
        if (await fs.pathExists(filePath)) {
            this.artifacts.harFiles.push(filePath);
            return filePath;
        }
        return '';
    }
    async attachArtifact(type, filePath, description) {
        if (await fs.pathExists(filePath)) {
            const buffer = await fs.readFile(filePath);
            const mimeType = this.getMimeType(filePath);
            if (typeof this.attach === 'function') {
                await this.attach(buffer, mimeType);
                // Also attach as link/reference
                const linkData = JSON.stringify({
                    type,
                    path: filePath,
                    description: description || `${type} artifact`,
                    timestamp: new Date().toISOString()
                });
                await this.attach(linkData, 'application/json');
            }
        }
    }
    logConsoleMessage(message) {
        this.artifacts.consoleLogs.push(message);
    }
    logNetworkRequest(request) {
        this.artifacts.networkLogs.push(request);
    }
    getMimeType(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webm': 'video/webm',
            '.mp4': 'video/mp4',
            '.zip': 'application/zip',
            '.har': 'application/json',
            '.json': 'application/json',
            '.html': 'text/html',
            '.txt': 'text/plain'
        };
        return mimeTypes[ext] || 'application/octet-stream';
    }
    async generateArtifactReport() {
        // Determine scenario status based on step results
        const scenarioStatus = this.scenarioSteps?.some(step => step.status === 'FAILED') ? 'FAILED' :
            this.scenarioSteps?.every(step => step.status === 'PASSED') ? 'PASSED' : 'SKIPPED';
        const reportData = {
            scenario: this.scenarioName,
            feature: this.featureName,
            featureDescription: this.featureDescription,
            steps: this.scenarioSteps || [],
            browser: this.browserName,
            device: this.deviceName,
            timestamp: new Date().toISOString(),
            status: scenarioStatus,
            artifacts: this.artifacts,
            summary: {
                totalScreenshots: this.artifacts.screenshots.length,
                totalVideos: this.artifacts.videos.length,
                totalTraces: this.artifacts.traces.length,
                totalHarFiles: this.artifacts.harFiles.length,
                totalConsoleLogs: this.artifacts.consoleLogs.length,
                totalNetworkRequests: this.artifacts.networkLogs.length
            }
        };
        const reportPath = path.join('test-results', 'artifacts', `${this.scenarioName}-artifacts.json`);
        await fs.ensureDir(path.dirname(reportPath));
        await fs.writeJSON(reportPath, reportData, { spaces: 2 });
    }
}
exports.CustomWorld = CustomWorld;
(0, cucumber_1.setWorldConstructor)(CustomWorld);
//# sourceMappingURL=enhanced-world.js.map