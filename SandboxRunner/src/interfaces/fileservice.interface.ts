import { TestResult } from "./test-result.interface";

export interface IFileService {
  uploadTestResults(id: string, testResults: TestResult): void;
  downloadFile(id: string): Promise<string>;
}
