/**
 * Dto used by SandboxRunner to share information of test runs
 */
export interface TestResultDto {
  testId: string;
  testRunName: string;
  isSuccessful: boolean;
  numberTimesExecuted: number;
  executionTimeInSeconds: number;
}
