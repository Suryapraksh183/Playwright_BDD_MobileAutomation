export interface ArtifactData {
    type: string;
    path: string;
    description: string;
    timestamp: string;
}
export interface ScenarioStep {
    keyword: string;
    text: string;
    status: 'PASSED' | 'FAILED' | 'SKIPPED' | 'PENDING';
    duration?: number;
    errorMessage?: string;
}
export interface ScenarioArtifacts {
    scenario: string;
    feature: string;
    featureDescription: string;
    steps: ScenarioStep[];
    browser: string;
    device: string;
    timestamp: string;
    status: 'PASSED' | 'FAILED' | 'SKIPPED';
    artifacts: {
        screenshots: string[];
        videos: string[];
        traces: string[];
        harFiles: string[];
        consoleLogs: any[];
        networkLogs: any[];
        browserMetadata: any;
    };
    summary: {
        totalScreenshots: number;
        totalVideos: number;
        totalTraces: number;
        totalHarFiles: number;
        totalConsoleLogs: number;
        totalNetworkRequests: number;
    };
}
export declare class EnhancedCucumberReporter {
    private reportDir;
    private artifactsDir;
    private scenarios;
    constructor(reportDir?: string);
    generateEnhancedReport(): Promise<void>;
    private loadScenarioArtifacts;
    private generateMainReportHTML;
    private generateScenarioHTML;
    private copyArtifactsToReportDir;
    private generateArtifactIndex;
}
//# sourceMappingURL=EnhancedCucumberReporter.d.ts.map
