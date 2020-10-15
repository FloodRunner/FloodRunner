import path from "path";
import fs from "fs";
import { Keys } from "../constants/keys";
import { IFileService } from "../interfaces/fileservice.interface";
import { TestResult } from "../interfaces/test-result.interface";
import { systemLogger } from "../helpers/logger";

export class LocalStorageService implements IFileService {
  private _testDirectory = path.join(__dirname, `../testScripts`);
  private _logDirectory = path.join(__dirname, `../../logs`);
  private _testResultDirectory = path.join(__dirname, `../../testResult`);
  private _screenshotDirectoryName = Keys.testScreenshotFolderName; //this is a element script convention
  private _maximumScreenshotsAllowed = Keys.maximumAllowedScreenshots;

  public createTestScriptPath(id: string): string {
    return `testscript_${id}.ts`;
  }

  uploadTestResults(id: string, testResults: TestResult): void {
    throw new Error("Method not implemented.");
  }

  async downloadFile(id: string): Promise<string> {
    let testScript: string = null;
    try {
      testScript = fs.readFileSync(`./src/floodTests/${id}.ts`, "utf-8");
    } catch (e) {
      throw new Error(`script does not exist`);
    }

    //create directory
    if (!fs.existsSync(this._testDirectory)) {
      systemLogger.info(
        `Creating directory for downloaded test: ${this._testDirectory}`
      );
      fs.mkdirSync(this._testDirectory);
    }

    //save file to disk
    const testScriptName = this.createTestScriptPath(id);
    const testFilePath = path.join(this._testDirectory, testScriptName);

    fs.writeFileSync(testFilePath, testScript);

    return testScript;
  }
}
