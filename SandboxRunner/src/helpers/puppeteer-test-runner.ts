import { applicationLogger, systemLogger } from "./logger";
import { Keys } from "../constants/keys";
import { NodeVM } from "vm2";
import fs from "fs";
import process from "process";

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

export default {
  runPuppeteerTest: runPuppeteerTest,
};
