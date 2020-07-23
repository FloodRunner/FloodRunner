import childProcessPromise from "child-process-promise";
import { applicationLogger, systemLogger } from "./logger";
import { TestResult } from "../interfaces/test-result.interface";
import { Keys } from "../constants/keys";
import { NodeVM } from "vm2";
import fs from "fs";
import process from "process";
import { TestType } from "../constants/test-type.enum";

const vm = new NodeVM({
  console: "redirect",
  sandbox: {},
  require: {
    external: ["puppeteer", "lodash"],
    builtin: ["fs", "path"],
    // root: "./",
    mock: {
      fs: {
        readFileSync() {
          return "Function not whitelisted!";
        },
      },
    },
  },
});

//bind to the console events inside the vm
vm.on("console.log", (data) => {
  applicationLogger.info(data);
});

vm.on("console.info", (data) => {
  applicationLogger.info(data);
});

vm.on("console.error", (data) => {
  applicationLogger.info(data);
});

const exec = childProcessPromise.exec;

const presentWorkingDirectory = process.cwd();

// enabled browser depending on environment
systemLogger.info(`Running browser setting: ${Keys.showBrowser}`);

// set maximum number of retries
systemLogger.info(`Maximum retries set to: ${Keys.flood_maximumRetries}`);

// define test function to run a singular flood element test
const runFloodTest = (testScript: string) =>
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

const runPuppeteerTest = (testScript: string) =>
  new Promise((resolve, reject) => {
    try {
      var puppeteerScript = fs.readFileSync(`${testScript}`, {
        encoding: "utf-8",
      });
      var puppeteerWorkingDirectory = `./${Keys.testResultFolderName}/xx/${Keys.testScreenshotFolderName}`;

      //create directory
      if (!fs.existsSync(puppeteerWorkingDirectory)) {
        systemLogger.info(`Creating directory ${puppeteerWorkingDirectory}`);
        fs.mkdirSync(puppeteerWorkingDirectory, { recursive: true });
      }

      process.chdir(puppeteerWorkingDirectory);

      var wrappedPuppeteerCode = `
      module.exports = async function (callback) {
          (async () => {
            try{
              console.log("running script")
              ${puppeteerScript}
  
              \n callback()
            }catch(err){
              console.log("thrown script")
              console.log(err)
              callback()
            }
          })()
      }
    `;

      let puppeteerSandbox = vm.run(wrappedPuppeteerCode, "vm.js");
      puppeteerSandbox(() => {
        applicationLogger.info("----Puppeteer script completed---");
        resolve();
      });
    } catch (err) {
      systemLogger.error("--- Test run failed ---");
      systemLogger.error(err);
      reject(err);
    } finally {
    }
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

async function runFloodTests(floodTests: string[], testType: TestType) {
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
          await runFloodTest(test);
        } else if (testType === TestType.Puppeteer) {
          await runPuppeteerTest(test);
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
  runFloodTests: runFloodTests,
};
