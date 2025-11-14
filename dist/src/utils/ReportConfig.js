"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportConfigManager = exports.defaultEnhancedReportConfig = void 0;
exports.defaultEnhancedReportConfig = {
    reportTitle: 'Enhanced Cucumber BDD Report with Playwright Artifacts',
    reportDir: 'reports/cucumber-html',
    includeScreenshots: true,
    includeVideos: true,
    includeTraces: true,
    includeHarFiles: true,
    includeConsoleLogs: true,
    includeNetworkLogs: true,
    maxConsoleLogsPerScenario: 50,
    maxNetworkRequestsPerScenario: 20,
    embedArtifacts: false, // Link to artifacts instead of embedding
    traceViewerInstructions: true,
    includeBrowserInfo: true,
    includeEnvironmentInfo: true
};
class ReportConfigManager {
    constructor(customConfig) {
        this.config = { ...exports.defaultEnhancedReportConfig, ...customConfig };
    }
    getConfig() {
        return this.config;
    }
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
    }
    // Environment-based configuration
    static getEnvironmentConfig() {
        const env = process.env.NODE_ENV || 'development';
        switch (env) {
            case 'ci':
            case 'production':
                return {
                    embedArtifacts: false, // Links only in CI to save space
                    maxConsoleLogsPerScenario: 25,
                    maxNetworkRequestsPerScenario: 10
                };
            case 'development':
            case 'test':
            default:
                return {
                    embedArtifacts: false, // Still use links for better performance
                    maxConsoleLogsPerScenario: 50,
                    maxNetworkRequestsPerScenario: 20
                };
        }
    }
}
exports.ReportConfigManager = ReportConfigManager;
//# sourceMappingURL=ReportConfig.js.map