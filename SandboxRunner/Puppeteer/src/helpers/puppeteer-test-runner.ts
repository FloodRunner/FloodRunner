import { Keys } from "../constants/keys";
import { NodeVM } from "vm2";
import fs from "fs";
import { fs as memfs } from "memfs";
import process from "process";
// import { path } from "app-root-path"; //was for NodeVM
import * as path from "path";

const vm = new NodeVM({
  console: "redirect",
  sandbox: {},
  require: {
    external: ["puppeteer", "lodash"],
    builtin: ["fs", "path"],
    mock: {
      fs: {
        readFileSync() {
          return "Function not whitelisted!";
        },
      },
    },
  },
});

let testResultBasePath: string;

const calculatePuppeteerTestResultPath = (
  isDevelopment: boolean,
  testRunId: string,
  testName: string
) => {
  if (isDevelopment) {
    testResultBasePath = "./Puppeteer/testResults";
  } else {
    testResultBasePath = "../../../tmp"; //only writeable directory when using an Azure Function
  }

  return path.join(testResultBasePath, testName, testRunId);
};

const runPuppeteerTest = (
  testRunId: string,
  testName: string,
  testScript: string,
  systemLogger: any,
  applicationLogger: any,
  isDevelopment: boolean
) => {
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

  return new Promise((resolve: any, reject: any) => {
    try {
      systemLogger.info(`Current Puppeteer directory is: ${process.cwd()}`);

      var puppeteerScript = fs.readFileSync(`${testScript}`, {
        encoding: "utf-8",
      });

      //create directory in temporary storage
      let screenshotPath = calculatePuppeteerTestResultPath(
        isDevelopment,
        testRunId,
        testName
      );

      if (!fs.existsSync(screenshotPath)) {
        systemLogger.info(`Creating directory ${screenshotPath}`);
        fs.mkdirSync(screenshotPath, { recursive: true }); //create directory based on file and run name
      } else {
        systemLogger.info(`Directory ${screenshotPath} already exists`);
      }

      var wrappedPuppeteerCode = `
      module.exports = async function (callback) {
          
          (async () => {
            try{
              const screenshotPath = "${testResultBasePath}/${testName}/${testRunId}"; //for some reason this has to be done like this to keep the slashes

              const puppeteer = require('puppeteer');
              const path = require('path');

              const browser = await puppeteer.launch({
                product: "chrome",
                headless: true,
              });
              
              ${puppeteerScript}

              browser.close(); //ends puppeteer script
  
              \n callback(true, null)
            }catch(err){
              console.log(err)
              callback(false, err)
            }
          })()
      }
    `;

      let puppeteerSandbox = vm.run(wrappedPuppeteerCode, "vm.js");
      puppeteerSandbox((passed: boolean, error: string) => {
        systemLogger.info("----Puppeteer script completed---");

        if (passed) {
          resolve();
        } else {
          systemLogger.error(`Failed with error: ${error}`);
          reject();
        }
      });
    } catch (err) {
      systemLogger.error("--- Test run failed ---");
      systemLogger.error(err);
      reject(err);
    } finally {
    }
  });
};

export default {
  runPuppeteerTest: runPuppeteerTest,
  calculateTestPath: calculatePuppeteerTestResultPath,
};
