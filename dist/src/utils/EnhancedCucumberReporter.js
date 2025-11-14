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
exports.EnhancedCucumberReporter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class EnhancedCucumberReporter {
    constructor(reportDir = 'reports/cucumber-html') {
        this.scenarios = [];
        this.reportDir = reportDir;
        this.artifactsDir = path.join(reportDir, 'artifacts');
        // Ensure directories exist
        fs.mkdirSync(this.reportDir, { recursive: true });
        fs.mkdirSync(this.artifactsDir, { recursive: true });
    }
    async generateEnhancedReport() {
        console.log('📊 Generating Enhanced Cucumber HTML Report with Playwright artifacts...');
        // Load all scenario artifacts
        await this.loadScenarioArtifacts();
        // Generate main HTML report
        const htmlContent = this.generateMainReportHTML();
        const reportPath = path.join(this.reportDir, 'enhanced-cucumber-report.html');
        fs.writeFileSync(reportPath, htmlContent);
        // Copy artifacts to report directory
        await this.copyArtifactsToReportDir();
        // Generate artifact index
        await this.generateArtifactIndex();
        console.log(`✅ Enhanced Cucumber HTML Report generated: ${reportPath}`);
        console.log(`🔗 Open: file://${path.resolve(reportPath)}`);
    }
    async loadScenarioArtifacts() {
        const artifactsDir = path.join('test-results', 'artifacts');
        if (!fs.existsSync(artifactsDir)) {
            console.warn('⚠️ No artifacts directory found');
            return;
        }
        const artifactFiles = fs.readdirSync(artifactsDir).filter(file => file.endsWith('-artifacts.json'));
        for (const file of artifactFiles) {
            try {
                const filePath = path.join(artifactsDir, file);
                const artifactData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                this.scenarios.push(artifactData);
            }
            catch (error) {
                console.warn(`⚠️ Could not load artifact file ${file}:`, error);
            }
        }
        console.log(`📋 Loaded ${this.scenarios.length} scenario artifacts`);
    }
    generateMainReportHTML() {
        const now = new Date().toISOString();
        const totalScenarios = this.scenarios.length;
        const totalScreenshots = this.scenarios.reduce((sum, s) => sum + s.summary.totalScreenshots, 0);
        const totalVideos = this.scenarios.reduce((sum, s) => sum + s.summary.totalVideos, 0);
        const totalTraces = this.scenarios.reduce((sum, s) => sum + s.summary.totalTraces, 0);
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PLAYWRIGHT_BDD_MOBILEAUTOMATION Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        
        .header { background: linear-gradient(135deg, #007ACC, #005C99); color: white; padding: 2rem; text-align: center; }
        .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        .header p { font-size: 1.1rem; opacity: 0.9; }
        
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding: 2rem; }
        .summary-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .summary-card h3 { color: #333; margin-bottom: 0.5rem; }
        .summary-card .number { font-size: 2rem; font-weight: bold; color: #007ACC; }
        
        .scenarios { padding: 2rem; }
        .scenario-card { background: white; margin-bottom: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; }
        .scenario-header { background: #007ACC; color: white; padding: 1rem; }
        .scenario-header h2 { margin-bottom: 0.5rem; }
        .scenario-meta { font-size: 0.9rem; opacity: 0.9; }
        
        .scenario-content { padding: 1.5rem; }
        .artifacts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem; }
        .artifact-section { border: 1px solid #ddd; border-radius: 6px; padding: 1rem; }
        .artifact-section h4 { color: #333; margin-bottom: 0.5rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee; }
        
        .artifact-list { list-style: none; }
        .artifact-item { margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; display: flex; justify-content: between; align-items: center; }
        .artifact-link { color: #007ACC; text-decoration: none; font-weight: 500; }
        .artifact-link:hover { text-decoration: underline; }
        .artifact-meta { font-size: 0.8rem; color: #666; margin-left: auto; }
        
        .feature-description { background: #f5f5f5; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; }
        .feature-description h4 { color: #333; margin-bottom: 0.5rem; }
        
        .scenario-steps { background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 1rem; margin-bottom: 1rem; }
        .scenario-steps h4 { color: #333; margin-bottom: 0.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
        
        .steps-list { margin-top: 0.5rem; }
        .step-item { display: flex; align-items: center; padding: 0.5rem; margin: 0.25rem 0; border-radius: 4px; border-left: 4px solid transparent; }
        .step-item.step-passed { background: #e8f5e8; border-left-color: #4caf50; }
        .step-item.step-failed { background: #ffebee; border-left-color: #f44336; }
        .step-item.step-skipped { background: #fff3e0; border-left-color: #ff9800; }
        .step-item.step-pending { background: #f3f4f6; border-left-color: #9e9e9e; }
        
        .step-status { margin-right: 0.5rem; font-size: 1.1rem; }
        .step-keyword { font-weight: bold; margin-right: 0.5rem; color: #1976d2; }
        .step-text { flex: 1; margin-right: 0.5rem; }
        .step-duration { font-size: 0.8rem; color: #666; }
        .error-message { margin-top: 0.25rem; font-size: 0.8rem; color: #d32f2f; font-style: italic; }
        
        .scenario-status { font-weight: bold; padding: 0.25rem 0.5rem; border-radius: 4px; }
        .status-passed { background: #c8e6c9; color: #2e7d32; }
        .status-failed { background: #ffcdd2; color: #c62828; }
        .status-skipped { background: #ffe0b2; color: #ef6c00; }
        
        .browser-info { background: #e3f2fd; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; }
        .browser-info h4 { color: #1976d2; margin-bottom: 0.5rem; }
        
        .logs-section { margin-top: 1rem; }
        .logs-toggle { background: #f1f3f4; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; width: 100%; text-align: left; }
        .logs-content { display: none; max-height: 200px; overflow-y: auto; background: #f8f9fa; padding: 1rem; margin-top: 0.5rem; border-radius: 4px; }
        .logs-content.active { display: block; }
        
        .log-entry { font-family: 'Courier New', monospace; font-size: 0.85rem; margin: 0.25rem 0; padding: 0.25rem; }
        .log-error { color: #d32f2f; background: #ffebee; }
        .log-warn { color: #f57c00; background: #fff3e0; }
        .log-info { color: #1976d2; background: #e3f2fd; }
        
        .footer { background: #333; color: white; text-align: center; padding: 2rem; margin-top: 2rem; }
        
        @media (max-width: 768px) {
            .artifacts-grid { grid-template-columns: 1fr; }
            .summary { grid-template-columns: repeat(2, 1fr); }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎭 PLAYWRIGHT_BDD_MOBILEAUTOMATION</h1>
        <p>Mobile Automation Test Report with Comprehensive Artifacts</p>
        <p>Generated: ${now}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>📱 Scenarios</h3>
            <div class="number">${totalScenarios}</div>
        </div>
        <div class="summary-card">
            <h3>📸 Screenshots</h3>
            <div class="number">${totalScreenshots}</div>
        </div>
        <div class="summary-card">
            <h3>🎥 Videos</h3>
            <div class="number">${totalVideos}</div>
        </div>
        <div class="summary-card">
            <h3>🔍 Traces</h3>
            <div class="number">${totalTraces}</div>
        </div>
    </div>

    <div class="scenarios">
        ${this.scenarios.map(scenario => this.generateScenarioHTML(scenario)).join('')}
    </div>

    <div class="footer">
        <p>🚀 Enhanced Playwright BDD Mobile Automation Framework</p>
        <p>Complete test artifacts and debugging information included</p>
    </div>

    <script>
        // Toggle logs visibility
        document.querySelectorAll('.logs-toggle').forEach(button => {
            button.addEventListener('click', function() {
                const content = this.nextElementSibling;
                content.classList.toggle('active');
                this.textContent = content.classList.contains('active') ? 
                    this.textContent.replace('▶', '▼') : 
                    this.textContent.replace('▼', '▶');
            });
        });

        // Add click handlers for trace files
        document.querySelectorAll('[data-trace-path]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tracePath = this.getAttribute('data-trace-path');
                alert('📋 Trace File Instructions:\\n\\n' +
                      '1. Download the trace file: ' + tracePath + '\\n' +
                      '2. Open terminal and run: npx playwright show-trace "' + tracePath + '"\\n' +
                      '3. Or drag the trace file to: https://trace.playwright.dev/');
            });
        });
    </script>
</body>
</html>`;
    }
    generateScenarioHTML(scenario) {
        const browserIcon = scenario.browser === 'chrome' ? '🤖' : '🍎';
        const deviceIcon = scenario.device.includes('iPhone') ? '📱' : '📱';
        return `
        <div class="scenario-card">
            <div class="scenario-header">
                <h2>${browserIcon} ${scenario.scenario.replace(/_/g, ' ')}</h2>
                <div class="scenario-meta">
                    📋 Feature: ${scenario.feature.replace(/_/g, ' ')} | 
                    ${deviceIcon} Device: ${scenario.device} | 
                    ⏰ ${new Date(scenario.timestamp).toLocaleString()}
                </div>
            </div>
            
            <div class="scenario-content">
                <div class="feature-description">
                    <h4>📋 Feature Description</h4>
                    <p>${scenario.featureDescription || 'No description available'}</p>
                </div>

                <div class="scenario-steps">
                    <h4>📝 Scenario Steps</h4>
                    <div class="steps-list">
                        ${scenario.steps.map((step, index) => {
            const statusIcon = step.status === 'PASSED' ? '✅' :
                step.status === 'FAILED' ? '❌' :
                    step.status === 'SKIPPED' ? '⏭️' : '⏸️';
            const statusClass = step.status.toLowerCase();
            const duration = step.duration ? `(${step.duration}ms)` : '';
            const errorMsg = step.errorMessage ? `<div class="error-message">❗ ${step.errorMessage}</div>` : '';
            return `
                                <div class="step-item step-${statusClass}">
                                    <span class="step-status">${statusIcon}</span>
                                    <span class="step-keyword">${step.keyword}</span>
                                    <span class="step-text">${step.text}</span>
                                    <span class="step-duration">${duration}</span>
                                    ${errorMsg}
                                </div>
                            `;
        }).join('')}
                    </div>
                </div>

                <div class="browser-info">
                    <h4>🔧 Browser Information</h4>
                    <p><strong>Browser:</strong> ${scenario.browser.toUpperCase()}</p>
                    <p><strong>Device:</strong> ${scenario.device}</p>
                    <p><strong>Status:</strong> <span class="scenario-status status-${scenario.status.toLowerCase()}">${scenario.status}</span></p>
                    <p><strong>User Agent:</strong> ${scenario.artifacts.browserMetadata?.userAgent || 'Not available'}</p>
                    <p><strong>Viewport:</strong> ${scenario.artifacts.browserMetadata?.viewport ?
            `${scenario.artifacts.browserMetadata.viewport.width}x${scenario.artifacts.browserMetadata.viewport.height}` : 'Not available'}</p>
                </div>

                <div class="artifacts-grid">
                    <div class="artifact-section">
                        <h4>📸 Screenshots (${scenario.summary.totalScreenshots})</h4>
                        <ul class="artifact-list">
                            ${scenario.artifacts.screenshots.map(screenshot => `<li class="artifact-item">
                                    <a href="artifacts/${path.basename(screenshot)}" class="artifact-link" target="_blank">
                                        ${path.basename(screenshot)}
                                    </a>
                                    <span class="artifact-meta">PNG</span>
                                </li>`).join('')}
                        </ul>
                    </div>

                    <div class="artifact-section">
                        <h4>🎥 Videos (${scenario.summary.totalVideos})</h4>
                        <ul class="artifact-list">
                            ${scenario.artifacts.videos.map(video => `<li class="artifact-item">
                                    <a href="artifacts/${path.basename(video)}" class="artifact-link" target="_blank">
                                        ${path.basename(video)}
                                    </a>
                                    <span class="artifact-meta">WEBM</span>
                                </li>`).join('')}
                        </ul>
                    </div>

                    <div class="artifact-section">
                        <h4>🔍 Playwright Traces (${scenario.summary.totalTraces})</h4>
                        <ul class="artifact-list">
                            ${scenario.artifacts.traces.map(trace => `<li class="artifact-item">
                                    <a href="#" class="artifact-link" data-trace-path="${trace}">
                                        ${path.basename(trace)}
                                    </a>
                                    <span class="artifact-meta">Interactive Trace</span>
                                </li>`).join('')}
                        </ul>
                        <p style="font-size: 0.8rem; color: #666; margin-top: 0.5rem;">
                            💡 Click trace files for viewing instructions
                        </p>
                    </div>

                    <div class="artifact-section">
                        <h4>🌐 Network HAR Files (${scenario.summary.totalHarFiles})</h4>
                        <ul class="artifact-list">
                            ${scenario.artifacts.harFiles.map(har => `<li class="artifact-item">
                                    <a href="artifacts/${path.basename(har)}" class="artifact-link" target="_blank">
                                        ${path.basename(har)}
                                    </a>
                                    <span class="artifact-meta">HAR</span>
                                </li>`).join('')}
                        </ul>
                    </div>
                </div>

                <div class="logs-section">
                    <button class="logs-toggle">▶ Console Logs (${scenario.summary.totalConsoleLogs})</button>
                    <div class="logs-content">
                        ${scenario.artifacts.consoleLogs.slice(0, 20).map(log => `<div class="log-entry log-${log.type}">
                                [${new Date(log.timestamp).toLocaleTimeString()}] ${log.type.toUpperCase()}: ${log.text}
                            </div>`).join('')}
                        ${scenario.artifacts.consoleLogs.length > 20 ?
            `<div class="log-entry">... and ${scenario.artifacts.consoleLogs.length - 20} more entries</div>` : ''}
                    </div>
                </div>

                <div class="logs-section">
                    <button class="logs-toggle">▶ Network Requests (${scenario.summary.totalNetworkRequests})</button>
                    <div class="logs-content">
                        ${scenario.artifacts.networkLogs.slice(0, 10).map(req => `<div class="log-entry">
                                [${new Date(req.timestamp).toLocaleTimeString()}] ${req.method || 'RESPONSE'} ${req.url}
                                ${req.status ? ` - ${req.status}` : ''}
                            </div>`).join('')}
                        ${scenario.artifacts.networkLogs.length > 10 ?
            `<div class="log-entry">... and ${scenario.artifacts.networkLogs.length - 10} more requests</div>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }
    async copyArtifactsToReportDir() {
        const sourceDir = 'test-results';
        const targetDir = path.join(this.reportDir, 'artifacts');
        // Copy screenshots, videos, traces, and HAR files
        const artifactTypes = ['screenshots', 'videos', 'traces', 'har'];
        for (const type of artifactTypes) {
            const srcPath = path.join(sourceDir, type);
            if (fs.existsSync(srcPath)) {
                const files = fs.readdirSync(srcPath);
                for (const file of files) {
                    const srcFile = path.join(srcPath, file);
                    const destFile = path.join(targetDir, file);
                    try {
                        fs.copyFileSync(srcFile, destFile);
                    }
                    catch (error) {
                        console.warn(`⚠️ Could not copy ${srcFile}:`, error);
                    }
                }
            }
        }
    }
    async generateArtifactIndex() {
        const indexData = {
            generated: new Date().toISOString(),
            totalScenarios: this.scenarios.length,
            scenarios: this.scenarios.map(s => ({
                name: s.scenario,
                feature: s.feature,
                browser: s.browser,
                device: s.device,
                timestamp: s.timestamp,
                summary: s.summary
            }))
        };
        const indexPath = path.join(this.reportDir, 'artifacts-index.json');
        fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
    }
}
exports.EnhancedCucumberReporter = EnhancedCucumberReporter;
//# sourceMappingURL=EnhancedCucumberReporter.js.map