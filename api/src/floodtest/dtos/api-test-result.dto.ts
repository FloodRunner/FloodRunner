/**
 * Dto given when test is invoked from via API call
 */
export interface ApiTestResultDto {
  testId: string;
  isSuccessful: boolean;
  numberTimesExecuted: number;
  executionTimeInSeconds: number;
  applicationLogs: string[];
  screenShotUris: string[];
}
