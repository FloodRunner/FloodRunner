import { TestResult } from "./test-result.interface";

export interface IFileService {
  uploadTestResults(
    id: string,
    containerFolderName: string,
    testResultPath: string,
    maximumAllowedScreenshots: number,
    systemLogs: string[],
    applicationLogs: string[]
  ): void;
  downloadFile(id: string): Promise<string>;
}
