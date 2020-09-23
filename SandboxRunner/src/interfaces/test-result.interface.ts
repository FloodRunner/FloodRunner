export interface TestResult {
  name: string;
  isSuccessful: boolean;
  numberTimesExecuted: number;
  executionTimeInSeconds: number;
}
