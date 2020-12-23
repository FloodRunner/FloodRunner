// import { systemLogger } from "./logger";
import { TestResult } from "../interfaces/test-result.interface";
import { Keys } from "../constants/keys";
import process from "process";
import { TestType } from "../constants/test-type.enum";
import puppeteerRunner from "./puppeteer-test-runner";
import elementRunner from "./element-test-runner";
import winston from "winston/lib/winston/config";

const presentWorkingDirectory = process.cwd();

// enabled browser depending on environment
// systemLogger.info(`Running browser setting: ${Keys.showBrowser}`);

// set maximum number of retries
// systemLogger.info(`Maximum retries set to: ${Keys.flood_maximumRetries}`);

// delay helper function
const delay = (millis: number) =>
  new Promise((resolve: any) => {
    setTimeout((_) => resolve(), millis);
  });

//function for printing test results
function logResults(results: TestResult[], systemLogger: any) {
  systemLogger.info("--- Results ---");
  for (const result of results) {
    var timesFailed = result.isSuccessful
      ? result.numberTimesExecuted - 1
      : result.numberTimesExecuted;
    systemLogger.info(
      `Test: ${result.name} -> ${
        result.isSuccessful ? "successful!" : "failed!"
      } -> failed: ${timesFailed} times`
    );
  }
}

async function runTests(
  testRunId: string,
  testName: string,
  floodTests: string[],
  testType: TestType,
  maximumRetries: number,
  systemLogger: any,
  applicationLogger: any,
  isDevelopment: boolean
) {
  var testResults: TestResult[] = [];

  for (const test of floodTests) {
    var testSuccessful = false;

    //get around transient failures by rerunning failed tests
    var numTimesRan = 0;
    var executionTimeInSeconds = -1;

    while (numTimesRan < maximumRetries && testSuccessful === false) {
      systemLogger.info(`--- Running test: ${test} ---`);

      try {
        var startTime = process.hrtime();

        if (testType === TestType.Element) {
          await elementRunner.runElementTest(
            test,
            systemLogger,
            applicationLogger
          );
        } else if (testType === TestType.Puppeteer) {
          await puppeteerRunner.runPuppeteerTest(
            testRunId,
            testName,
            test,
            systemLogger,
            applicationLogger,
            isDevelopment
          );
          process.chdir(presentWorkingDirectory);
        }

        testSuccessful = true;
        systemLogger.info(`--- Test successful: ${test} ---`);
      } catch (err) {
        systemLogger.error(`--- Test failed: ${test} ---`);
        systemLogger.error(err);
        testSuccessful = false;
      } finally {
        numTimesRan++;

        executionTimeInSeconds = parseHrtimeToSeconds(
          process.hrtime(startTime)
        );
      }
    }

    //store test result
    testResults.push({
      name: test,
      isSuccessful: testSuccessful,
      numberTimesExecuted: numTimesRan,
      executionTimeInSeconds: executionTimeInSeconds,
    });
  }

  return testResults;
}

function parseHrtimeToSeconds(hrtime): number {
  var seconds = hrtime[0] + hrtime[1] / 1e9;
  //ensure that minimum seconds is 1
  return Math.max(Math.round(seconds), 1);
}

export default {
  delay: delay,
  logResults: logResults,
  runTests: runTests,
};
