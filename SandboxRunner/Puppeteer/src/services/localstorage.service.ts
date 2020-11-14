import path from "path";
import fs from "fs";
import { IFileService } from "../interfaces/fileservice.interface";
import { TestResult } from "../interfaces/test-result.interface";

export class LocalStorageService implements IFileService {
  constructor(private systemLogger) {}

  private _testDirectory = path.join(__dirname, `../testScripts`);

  public createTestScriptPath(id: string): string {
    return `testscript_${id}.ts`;
  }

  uploadTestResults(
    id: string,
    containerFolderName: string,
    maximumAllowedScreenshots: number,
    systemLogs: string[],
    applicationLogs: string[]
  ): void {
    throw new Error("Method not implemented.");
  }

  async downloadFile(id: string): Promise<string> {
    let testScript: string = null;
    try {
      this.systemLogger.info(`Reading script: ${id}.ts`);
      testScript = fs.readFileSync(
        `./Puppeteer/src/floodTests/${id}.ts`,
        "utf-8"
      );
    } catch (e) {
      throw new Error(`script does not exist`);
    }

    //create directory
    if (!fs.existsSync(this._testDirectory)) {
      this.systemLogger.info(
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
