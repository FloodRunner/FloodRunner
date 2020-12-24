import fs from "fs";
import { IFileService } from "../interfaces/fileservice.interface";

export class LocalStorageService implements IFileService {
  constructor(private systemLogger) {}

  public createTestScriptPath(id: string): string {
    return `testscript_${id}.ts`;
  }

  uploadTestResults(
    id: string,
    containerFolderName: string,
    testResultPath: string,
    maximumAllowedScreenshots: number,
    systemLogs: string[],
    applicationLogs: string[]
  ): void {
    throw new Error("Method not implemented.");
  }

  async downloadFile(id: string): Promise<string> {
    let testScript: string = null;
    const testScriptName = this.createTestScriptPath(id);
    const scriptFile = `./Puppeteer/src/floodTests/${testScriptName}`;
    try {
      this.systemLogger.info(
        `Current directory ${process.cwd()}. Reading script: ${scriptFile}`
      );

      testScript = fs.readFileSync(scriptFile, "utf-8") as string;

      this.systemLogger.info(`Found script: ${scriptFile}`);
    } catch (e) {
      throw new Error(
        `Current directory ${process.cwd()}. Script ${scriptFile} does not exist.`
      );
    }

    return null;
  }
}
