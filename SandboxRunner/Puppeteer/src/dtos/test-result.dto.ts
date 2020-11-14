export interface TestResultDto {
  testId: string;
  testRunName: string;
  isSuccessful: boolean;
  numberTimesExecuted: number;
  executionTimeInSeconds: number;
}
