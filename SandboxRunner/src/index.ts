import { systemLogger } from "./helpers/logger";
import fileCleanup from "./helpers/file-helper";
import testHelpers from "./helpers/test-helper";
import { AzureblobService } from "./services/azureblob.service";
import { LocalStorageService } from "./services/localstorage.service";
import { Keys } from "./constants/keys";
import { RabbitQueueService } from "./services/rabbit-queue.service";
import { TestType } from "./constants/test-type.enum";

let testsPassedSuccessfully: boolean = false;
//remove all old results and logs
systemLogger.info(`--- Cleaning up all old files ---`);
fileCleanup();

//download flood element script
const localStorageService = new LocalStorageService();
const azureBlobService = new AzureblobService();

//initialize queue service
const queueService = new RabbitQueueService();

//determine environment
const isDevelopment = process.env.NODE_ENV == "DEV" ? true : false;

// register tests to run
const sourcePath = !isDevelopment ? "src" : "build";
const tests = [
  `./${sourcePath}/testScripts/${azureBlobService.createTestScriptPath(
    Keys.testId
  )}`,
];

// determine test type
const testType = Keys.testType as TestType;
systemLogger.info(`--- Test type: ${testType} ---`);
systemLogger.info(`--- Starting ${testType} test ---`);

//run tests
(async () => {
  if (isDevelopment) {
    await localStorageService.downloadFile(Keys.testId);
  } else {
    //download test
    await azureBlobService.downloadFile(Keys.testId);
  }

  //run test
  const testResults = await testHelpers.runTests(tests, testType);

  //log results
  testHelpers.logResults(testResults);

  await testHelpers.delay(1000);

  testsPassedSuccessfully = testResults.every(
    (test) => test.isSuccessful === true
  );
  testsPassedSuccessfully
    ? systemLogger.info(`All tests passed successfully!`)
    : systemLogger.info(`One/All tests passed failed!`);
  systemLogger.info("--- Completed browser tests ---");

  systemLogger.info(`--- Uploading results to Azure Blob Storage ---`);

  //upload test results
  if (!isDevelopment)
    await azureBlobService.uploadTestResults(Keys.testId, testResults[0]);

  //send message to api
  systemLogger.info(`--- Sending message to RabbitMq queue ---`);
  if (!isDevelopment)
    queueService.sendQueueMessage(Keys.testId, testResults[0]);

  //delay to allow queue message to send
  await testHelpers.delay(1000);

  systemLogger.info(`--- Exiting SandboxRunner ---`);
  testsPassedSuccessfully ? process.exit(0) : process.exit(1);
})().catch((e) => {
  systemLogger.error(e);
  throw "Failed to execute SandboxRunner";
});
