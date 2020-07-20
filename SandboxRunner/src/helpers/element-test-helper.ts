import childProcessPromise from "child-process-promise";
import { applicationLogger, systemLogger } from "./logger";
import { TestResult } from "../interfaces/test-result.interface";
import { Keys } from "../constants/keys";

const exec = childProcessPromise.exec;

// enabled browser depending on environment
systemLogger.info(`Running browser setting: ${Keys.showBrowser}`);

// set maximum number of retries
systemLogger.info(`Maximum retries set to: ${Keys.maximumRetries}`);

// define test function to run a singular flood element test
const runTest = (testScript: string) =>
  new Promise((resolve, reject) => {
    exec(
      `element run ${testScript} ${Keys.showBrowser} --no-sandbox --work-root ./${Keys.testResultFolderName}`
    )
      .then(function (result) {
        var resultContent = result.stdout;
        if (!resultContent.toLowerCase().includes("error")) {
          systemLogger.info("--- Test run completed successfully ---");
          applicationLogger.info(resultContent);
          resolve();
        } else {
          applicationLogger.error(resultContent);
          systemLogger.error("--- Test run failed ---");
          reject();
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });

// delay helper function
const delay = (millis: number) =>
  new Promise((resolve, reject) => {
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

async function runFloodTests(floodTests: string[]) {
  var testResults: TestResult[] = [];
  for (const test of floodTests) {
    var testSuccessful = false;

    //get around transient failures by rerunning failed tests
    var numTimesRan = 0;

    while (numTimesRan < Keys.maximumRetries && testSuccessful === false) {
      systemLogger.info(`--- Running test: ${test} ---`);

      try {
        await runTest(test);
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
  runFloodTests: runFloodTests,
};
