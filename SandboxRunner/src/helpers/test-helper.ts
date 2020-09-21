import { systemLogger } from "./logger";
import { TestResult } from "../interfaces/test-result.interface";
import { Keys } from "../constants/keys";
import process from "process";
import { TestType } from "../constants/test-type.enum";
import puppeteerRunner from "./puppeteer-test-runner";
import elementRunner from "./element-test-runner";

const presentWorkingDirectory = process.cwd();

// enabled browser depending on environment
systemLogger.info(`Running browser setting: ${Keys.showBrowser}`);

// set maximum number of retries
systemLogger.info(`Maximum retries set to: ${Keys.flood_maximumRetries}`);

// delay helper function
const delay = (millis: number) =>
  new Promise((resolve) => {
    setTimeout((_) => resolve(), millis);
  });

//function for printing test results
function logResults(results: TestResult[]) {
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

async function runTests(floodTests: string[], testType: TestType) {
  var testResults: TestResult[] = [];
  for (const test of floodTests) {
    var testSuccessful = false;

    //get around transient failures by rerunning failed tests
    var numTimesRan = 0;

    while (
      numTimesRan < Keys.flood_maximumRetries &&
      testSuccessful === false
    ) {
      systemLogger.info(`--- Running test: ${test} ---`);

      try {
        if (testType === TestType.Element) {
          await elementRunner.runElementTest(test);
        } else if (testType === TestType.Puppeteer) {
          await puppeteerRunner.runPuppeteerTest(test);
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
      }
    }

    //store test result
    testResults.push({
      name: test,
      isSuccessful: testSuccessful,
      numberTimesExecuted: numTimesRan,
    });
  }

  return testResults;
}

export default {
  delay: delay,
  logResults: logResults,
  runTests: runTests,
};
