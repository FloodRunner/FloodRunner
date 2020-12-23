import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  createSystemLogger,
  createApplicationLogger,
} from "./src/helpers/logger";
import testHelpers from "./src/helpers/test-helper";
import { AzureblobService } from "./src/services/azureblob.service";
import { LocalStorageService } from "./src/services/localstorage.service";
import { TestType } from "./src/constants/test-type.enum";
import { TestResultDto } from "./src/dtos/test-result.dto";
import puppeteerRunner from "./src/helpers/puppeteer-test-runner";

interface BrowserTestSettings {
  isDevelopment: boolean;
  testSettings: {
    id: string;
    type: TestType;
    maximumAllowedScreenshots: number;
    maximumRetries: number;
  };
  azureStorage: {
    uploadResults: boolean;
    accountName: string;
    accountAccessKey: string;
    containerFolderName: string;
  };
}

const executeFunction = async (req: HttpRequest): Promise<TestResultDto> => {
  const browserTestSettings = req.body as BrowserTestSettings;
  console.log(browserTestSettings);

  const testRunId = uuidv4();

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
  const testScriptName = azureBlobService.createTestScriptPath(
    browserTestSettings.testSettings.id
  );

  const tests = [
    `${
      !isDevelopment
        ? `../../../tmp/testScripts/${testScriptName}` //only writeable directory on Azure Function
        : `./Puppeteer/src/floodTests/${testScriptName}`
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

  let testResultPath: string;
  if (testType == TestType.Puppeteer) {
    testResultPath = puppeteerRunner.calculateTestPath(
      isDevelopment,
      testRunId,
      browserTestSettings.testSettings.id
    );
  }

  //run test
  const testResults = await testHelpers.runTests(
    testRunId,
    browserTestSettings.testSettings.id,
    tests,
    testType,
    browserTestSettings.testSettings.maximumRetries,
    systemLogger,
    applicationLogger,
    browserTestSettings.isDevelopment
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
  if (browserTestSettings.azureStorage.uploadResults)
    await azureBlobService.uploadTestResults(
      browserTestSettings.testSettings.id,
      browserTestSettings.azureStorage.containerFolderName,
      testResultPath,
      browserTestSettings.testSettings.maximumAllowedScreenshots,
      systemLogs,
      applicationLogs
    );

  //remove test result directory
  if (fs.existsSync(testResultPath)) {
    systemLogger.info(`Removing test result directory ${testResultPath}`);
    fs.rmdirSync(testResultPath, { recursive: true });
  }

  const result: TestResultDto = {
    testId: browserTestSettings.testSettings.id,
    testRunName: browserTestSettings.azureStorage.containerFolderName,
    numberTimesExecuted: testResults[0].numberTimesExecuted,
    isSuccessful: testResults[0].isSuccessful,
    executionTimeInSeconds: testResults[0].executionTimeInSeconds,
    systemLogs: systemLogs,
    applicationLogs: applicationLogs,
  };

  return result;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const result = await executeFunction(req);

    context.res = {
      // status: 200, /* Defaults to 200 */
      body: result,
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: err.message,
    };
  }
};

export default httpTrigger;
