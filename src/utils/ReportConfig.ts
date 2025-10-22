export interface EnhancedReportConfig {
  // Report generation settings
  reportTitle: string;
  reportDir: string;
  
  // Artifact settings
  includeScreenshots: boolean;
  includeVideos: boolean;
  includeTraces: boolean;
  includeHarFiles: boolean;
  includeConsoleLogs: boolean;
  includeNetworkLogs: boolean;
  
  // Display settings
  maxConsoleLogsPerScenario: number;
  maxNetworkRequestsPerScenario: number;
  embedArtifacts: boolean; // true = embed, false = link
  
  // Trace viewer settings
  traceViewerInstructions: boolean;
  
  // Browser metadata
  includeBrowserInfo: boolean;
  includeEnvironmentInfo: boolean;
}

export const defaultEnhancedReportConfig: EnhancedReportConfig = {
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

export class ReportConfigManager {
  private config: EnhancedReportConfig;

  constructor(customConfig?: Partial<EnhancedReportConfig>) {
    this.config = { ...defaultEnhancedReportConfig, ...customConfig };
  }

  getConfig(): EnhancedReportConfig {
    return this.config;
  }

  updateConfig(updates: Partial<EnhancedReportConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  // Environment-based configuration
  static getEnvironmentConfig(): Partial<EnhancedReportConfig> {
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
