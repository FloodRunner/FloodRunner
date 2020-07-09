export interface CreateFloodTest {
  userId: string;
  name: string;
  description: string;
  interval: number;
  testScript: any;
}

export function createFloodTestDto() {
  var newTest: CreateFloodTest = {
    userId: null,
    name: "",
    description: "",
    interval: 60,
    testScript: null,
  };
  return newTest;
}

export interface FloodTest {
  _id: string;
  userId: string;
  name: string;
  uri: string;
  description: string;
  interval: number;
  resultOverview: FloodTestResultOverview;
}

export interface FloodTestResultOverview {
  isPassing: boolean;
  lastRun: Date;
}

export interface FloodTestResultSummary {
  testId: string;
  testRunName: string;
  isCompleted: boolean;
  isSuccessful: boolean;
  logFileUris: string[];
  screenShotUris: string[];
  runOn: Date;
}
