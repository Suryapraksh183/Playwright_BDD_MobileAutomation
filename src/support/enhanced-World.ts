import { World, IWorldOptions, setWorldConstructor } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { GoogleHomePage } from '../pages/GoogleHomePage';
import { HomePage } from '../pages/HomePage';
import * as fs from 'fs-extra';
import * as path from 'path';

export interface ICustomWorld extends World {
  // Playwright objects
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  
  // Page objects
  googleHomePage?: GoogleHomePage;
  homePage?: HomePage;
  
  // Test metadata
  browserName?: string;
  deviceName?: string;
  
  // Enhanced reporting artifacts
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
  
  // Utility methods
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

export class CustomWorld extends World implements ICustomWorld {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  
  googleHomePage?: GoogleHomePage;
  homePage?: HomePage;
  
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

  constructor(options: IWorldOptions) {
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

  async initializePageObjects(): Promise<void> {
    if (this.page) {
      this.googleHomePage = new GoogleHomePage(this.page);
      this.homePage = new HomePage(this.page);
      
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

  async captureScreenshot(stepName: string): Promise<string> {
    if (!this.page) throw new Error('Page not initialized');
    
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

  async captureVideo(): Promise<string> {
    if (!this.context) throw new Error('Context not initialized');
    
    const videoPath = await this.page?.video()?.path();
    if (videoPath) {
      this.artifacts.videos.push(videoPath);
      return videoPath;
    }
    return '';
  }

  async captureTrace(): Promise<string> {
    if (!this.context) throw new Error('Context not initialized');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${this.scenarioName}-trace-${timestamp}.zip`;
    const filePath = path.join('test-results', 'traces', fileName);
    
    await fs.ensureDir(path.dirname(filePath));
    await this.context.tracing.stop({ path: filePath });
    
    this.artifacts.traces.push(filePath);
    return filePath;
  }

  async captureHarFile(): Promise<string> {
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

  async attachArtifact(type: string, filePath: string, description?: string): Promise<void> {
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

  logConsoleMessage(message: any): void {
    this.artifacts.consoleLogs.push(message);
  }

  logNetworkRequest(request: any): void {
    this.artifacts.networkLogs.push(request);
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
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

  async generateArtifactReport(): Promise<void> {
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

setWorldConstructor(CustomWorld);
