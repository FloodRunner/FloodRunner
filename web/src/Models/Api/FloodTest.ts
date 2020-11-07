export enum TestType {
  Puppeteer = "puppeteer",
  Element = "element",
}

export enum TestUploadType {
  File = "file",
  Script = "script",
}

export interface CreateFloodTest {
  userId: string;
  name: string;
  description: string;
  interval: number;
  testFile: any;
  testScript: string;
  type: TestType;
}

export function createFloodTestDto() {
  var newTest: CreateFloodTest = {
    userId: null,
    name: "",
    description: "",
    interval: 60,
    testFile: null,
    testScript: null,
    type: TestType.Puppeteer,
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
  type: TestType;
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
  executionTimeInSeconds: number;
  logFileUris: string[];
  screenShotUris: string[];
  runOn: Date;
}

export interface AccessToken {
  readonly _id: string;

  readonly name: string;

  readonly description: string;

  readonly createdAt: Date;

  readonly expiresAt: Date;
}

export interface CreateAccessToken {
  readonly name: string;

  readonly description: string;

  readonly expiresAt: string;
}
