export interface EnhancedReportConfig {
    reportTitle: string;
    reportDir: string;
    includeScreenshots: boolean;
    includeVideos: boolean;
    includeTraces: boolean;
    includeHarFiles: boolean;
    includeConsoleLogs: boolean;
    includeNetworkLogs: boolean;
    maxConsoleLogsPerScenario: number;
    maxNetworkRequestsPerScenario: number;
    embedArtifacts: boolean;
    traceViewerInstructions: boolean;
    includeBrowserInfo: boolean;
    includeEnvironmentInfo: boolean;
}
export declare const defaultEnhancedReportConfig: EnhancedReportConfig;
export declare class ReportConfigManager {
    private config;
    constructor(customConfig?: Partial<EnhancedReportConfig>);
    getConfig(): EnhancedReportConfig;
    updateConfig(updates: Partial<EnhancedReportConfig>): void;
    static getEnvironmentConfig(): Partial<EnhancedReportConfig>;
}
//# sourceMappingURL=ReportConfig.d.ts.map