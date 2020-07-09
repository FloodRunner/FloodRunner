import { TestResult } from "./test-result.interface";

export interface IQueueService {
  sendQueueMessage(testId: string, testResult: TestResult): void;
}
