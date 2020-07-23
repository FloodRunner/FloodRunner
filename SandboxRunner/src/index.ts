import { applicationLogger, systemLogger } from "./helpers/logger";
import fileCleanup from "./helpers/file-helper";
import testHelpers from "./helpers/element-test-helper";
import { AzureblobService } from "./services/azureblob.service";
import { Keys } from "./constants/keys";
import { RabbitQueueService } from "./services/rabbit-queue.service";
import { TestType } from "./constants/test-type.enum";

let testsPassedSuccessfully: boolean = false;

//remove all old results and logs
systemLogger.info(`--- Cleaning up all old files ---`);
fileCleanup();

//download flood element script
const azureBlobService = new AzureblobService();

(async () => {
  await azureBlobService.downloadFile(Keys.testId);
})().catch((e) => {
  systemLogger.error(e);
  throw "Unable to download test script";
});

//initialize queue service
const queueService = new RabbitQueueService();

// register tests to run
const sourcePath = process.env.NODE_ENV == "DEV" ? "src" : "build";
const floodTests = [
  `./${sourcePath}/testScripts/${azureBlobService.createTestScriptPath(
    Keys.testId
  )}`,
];

// determine test type
const testType = Keys.testType as TestType;

systemLogger.info("--- Starting Flood Element tests ---");

//run tests
(async () => {
  const testResults = await testHelpers.runFloodTests(floodTests, testType);

  testHelpers.logResults(testResults);

  await testHelpers.delay(1000);

  testsPassedSuccessfully = testResults.every(
    (test) => test.isSuccessful === true
  );
  testsPassedSuccessfully
    ? systemLogger.info(`All tests passed successfully!`)
    : systemLogger.info(`One/All tests passed failed!`);
  systemLogger.info("--- Completed Flood Element tests ---");

  systemLogger.info(`--- Uploading results to Azure Blob Storage ---`);
  await azureBlobService.uploadTestResults(Keys.testId, testResults[0]);

  systemLogger.info(`--- Sending message to RabbitMq queue ---`);
  queueService.sendQueueMessage(Keys.testId, testResults[0]);

  //delay to allow queue message to send
  await testHelpers.delay(1000);

  systemLogger.info(`--- Exiting SandboxRunner ---`);
  testsPassedSuccessfully ? process.exit(0) : process.exit(1);
})().catch((e) => {
  systemLogger.error(e);
  throw "Failed to execute SandboxRunner";
});
