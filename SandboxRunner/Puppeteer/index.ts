import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import {
  createSystemLogger,
  createApplicationLogger,
} from "./src/helpers/logger";
import testHelpers from "./src/helpers/test-helper";
import { AzureblobService } from "./src/services/azureblob.service";
import { LocalStorageService } from "./src/services/localstorage.service";
import { TestType } from "./src/constants/test-type.enum";
import { TestResultDto } from "./src/dtos/test-result.dto";

interface BrowserTestSettings {
  isDevelopment: boolean;
  testSettings: {
    id: string;
    type: TestType;
    maximumAllowedScreenshots: number;
    maximumRetries: number;
  };
  azureStorage: {
    accountName: string;
    accountAccessKey: string;
    containerFolderName: string;
  };
}

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const browserTestSettings = req.body as BrowserTestSettings;
  console.log(browserTestSettings);

  const { systemLogger, systemLogs } = createSystemLogger();
  const { applicationLogger, applicationLogs } = createApplicationLogger();

  let testsPassedSuccessfully: boolean = false;

  //download flood element script
  const localStorageService = new LocalStorageService(systemLogger);
  const azureBlobService = new AzureblobService(
    browserTestSettings.azureStorage.accountName,
    browserTestSettings.azureStorage.accountAccessKey,
    systemLogger
  );

  //determine environment
  // const isDevelopment = process.env.NODE_ENV == "DEV" ? true : false;
  const isDevelopment = browserTestSettings.isDevelopment;

  // register tests to run
  const sourcePath = !isDevelopment ? "" : "build";

  const testScriptPath = azureBlobService.createTestScriptPath(
    browserTestSettings.testSettings.id
  );

  const tests = [
    `${
      !isDevelopment
        ? `./build/src/testScripts/${testScriptPath}`
        : `./build/src/testScripts/${testScriptPath}`
    }`,
  ];

  // determine test type
  const testType = browserTestSettings.testSettings.type;
  systemLogger.info(`--- Test type: ${testType} ---`);
  systemLogger.info(`--- Starting ${testType} test ---`);

  //run tests
  if (isDevelopment) {
    await localStorageService.downloadFile(browserTestSettings.testSettings.id);
  } else {
    //download test
    await azureBlobService.downloadFile(browserTestSettings.testSettings.id);
  }

  //run test
  const testResults = await testHelpers.runTests(
    tests,
    testType,
    browserTestSettings.testSettings.maximumRetries,
    systemLogger,
    applicationLogger
  );

  //log results
  testHelpers.logResults(testResults, systemLogger);

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
    await azureBlobService.uploadTestResults(
      browserTestSettings.testSettings.id,
      browserTestSettings.azureStorage.containerFolderName,
      browserTestSettings.testSettings.maximumAllowedScreenshots,
      systemLogs,
      applicationLogs
    );

  const result: TestResultDto = {
    testId: browserTestSettings.testSettings.id,
    testRunName: browserTestSettings.azureStorage.containerFolderName,
    numberTimesExecuted: testResults[0].numberTimesExecuted,
    isSuccessful: testResults[0].isSuccessful,
    executionTimeInSeconds: testResults[0].executionTimeInSeconds,
  };

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: result,
  };
};

export default httpTrigger;
