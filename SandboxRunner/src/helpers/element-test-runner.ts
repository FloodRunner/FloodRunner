import childProcessPromise from "child-process-promise";
import { applicationLogger, systemLogger } from "./logger";
import { Keys } from "../constants/keys";

const exec = childProcessPromise.exec;

// define test function to run a singular flood element test
const runElementTest = (testScript: string) =>
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

export default {
  runElementTest: runElementTest,
};
