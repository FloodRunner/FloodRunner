import * as fs from "fs";
import { IFileService } from "../interfaces/fileservice.interface";
import { Keys } from "../constants/keys";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobDownloadResponseModel,
  ContainerClient,
} from "@azure/storage-blob";
import * as path from "path";

export class AzureblobService implements IFileService {
  private _testDirectory = path.join(__dirname, `../testScripts`);
  private _logDirectory = path.join(__dirname, `../../logs`);
  private _testResultDirectory = path.join(
    __dirname,
    `../../../${Keys.testResultFolderName}`
  );
  private _screenshotDirectoryName = Keys.testScreenshotFolderName; //this is a element script convention

  // Use StorageSharedKeyCredential with storage account and account key
  // StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
  private _sharedKeyCredential: StorageSharedKeyCredential;
  private _blobServiceClient: BlobServiceClient;

  constructor(
    azureStorageAccountName: string,
    azureStorageAccountAccessKey: string,
    private systemLogger
  ) {
    this._sharedKeyCredential = new StorageSharedKeyCredential(
      azureStorageAccountName,
      azureStorageAccountAccessKey
    );

    this._blobServiceClient = new BlobServiceClient(
      `https://${azureStorageAccountName}.blob.core.windows.net`,
      this._sharedKeyCredential
    );
  }

  public createTestScriptPath(id: string): string {
    return `testscript_${id}.ts`;
  }

  private createContainerName(id: string): string {
    return `floodtest-${id}`;
  }

  // A helper method used to read a Node.js readable stream into string
  private async streamToString(
    readableStream: NodeJS.ReadableStream
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: string[] = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }

  async downloadFile(id: string): Promise<string> {
    const containerName = this.createContainerName(id);
    const containerClient = this._blobServiceClient.getContainerClient(
      containerName
    );

    const blobName = this.createTestScriptPath(id);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      var downloadBlockBlobResponse: BlobDownloadResponseModel = await blockBlobClient.download(
        0
      );
      this.systemLogger.info(`Downloaded test: ${blobName}`);
    } catch (e) {
      throw new Error(
        `Test script: ${blobName} in container: ${containerName} does not exist`
      );
    }

    var testScript: string = await this.streamToString(
      downloadBlockBlobResponse.readableStreamBody
    );

    //create directory
    if (fs.existsSync(this._testDirectory)) {
      fs.rmdirSync(this._testDirectory, { recursive: true });
    }

    if (!fs.existsSync(this._testDirectory)) {
      this.systemLogger.info(
        `Creating directory for downloaded test: ${this._testDirectory}`
      );
      fs.mkdirSync(this._testDirectory, { recursive: true });
      this.systemLogger.info(
        `Created directory for downloaded test: ${this._testDirectory}`
      );
    }

    //save file to disk
    const testScriptName = this.createTestScriptPath(id);
    const testFilePath = path.join(this._testDirectory, testScriptName);

    try {
      fs.writeFileSync(testFilePath, testScript);
    } catch (e) {
      throw new Error(`Failed to write test to file system`);
    }

    return testScript;
  }

  async uploadTestResults(
    id: string,
    containerFolderName: string,
    testResultPath: string,
    maximumAllowedScreenshots: number,
    systemLogs: string[],
    applicationLogs: string[]
  ): Promise<void> {
    //create container to hold test script and results
    const containerName = this.createContainerName(id);

    //get reference to container client (this will upload to floodtest-<testId>/<sample date, eg. 2020-07-16T10:49+00:00>/screenshots/)
    const screenshotContainerClient = this._blobServiceClient.getContainerClient(
      `${containerName}/${containerFolderName}/${this._screenshotDirectoryName}`
    );

    await this.uploadScreenshotsAsync(
      screenshotContainerClient,
      testResultPath,
      maximumAllowedScreenshots
    );

    //get reference to container client (this will upload to floodtest-<testId>/<sample date, eg. 2020-07-16T10:49+00:00>/)
    const logFileContainerClient = this._blobServiceClient.getContainerClient(
      `${containerName}/${containerFolderName}`
    );

    await this.uploadLogsAsync(
      logFileContainerClient,
      systemLogs,
      applicationLogs
    );
  }

  public async uploadScreenshotsAsync(
    screenshotContainerClient: ContainerClient,
    testResultPath: string,
    maximumAllowedScreenshots: number
  ) {
    this.systemLogger.info(`--- Uploading screenshots ---`);

    this.systemLogger.info(
      `Current screenshot upload dir is: ${process.cwd()}`
    );

    this.systemLogger.info(
      `Searching test result directory: ${testResultPath}`
    );

    // //find the directory created inside the testResult directory
    // const mainTestResultDirectory = fs.readdirSync(this._testResultDirectory);

    // //retrieve the name of the directory created from the test run (should only be one when container runs one test)
    // const specificTestResultDirectoryName: string = mainTestResultDirectory[0] as string;

    // this.systemLogger.info(
    //   `Found directory name: ${specificTestResultDirectoryName}`
    // );

    // //find all the screenshots created by the test
    // const specificTestScreenshotDirectoryName = path.join(
    //   this._testResultDirectory,
    //   specificTestResultDirectoryName,
    //   this._screenshotDirectoryName
    // );

    // this.systemLogger.info(
    //   `Searching for results in directory: ${specificTestScreenshotDirectoryName}`
    // );

    const specificTestScreenshots: string[] = fs.readdirSync(
      testResultPath
    ) as string[];

    if (specificTestScreenshots.length === 0) {
      this.systemLogger.info(`--- No screenshots to upload ---`);
      return;
    }

    this.systemLogger.info(`Found screenshots: ${specificTestScreenshots}`);

    //apply max screenshot limitations and then loop through screenshots and upload
    const allowedScreenshots = specificTestScreenshots.slice(
      0,
      maximumAllowedScreenshots
    );

    allowedScreenshots.map(async (screenshotName, index) => {
      const screenshotUploadName = `${index + 1}.jpg`;
      this.systemLogger.info(
        `--- Uploading screenshot: ${screenshotUploadName} ---`
      );

      const blockBlobClient = screenshotContainerClient.getBlockBlobClient(
        screenshotUploadName
      );
      const screenshotFile = fs.readFileSync(
        path.join(testResultPath, screenshotName)
      );
      const uploadBlobResponse = await blockBlobClient.upload(
        screenshotFile,
        screenshotFile.length,
        {}
      );
    });

    this.systemLogger.info(`--- Uploaded all screenshots ---`);
  }

  private async uploadLogsAsync(
    logFileContainerClient: ContainerClient,
    systemLogs: string[],
    applicationLogs: string[]
  ) {
    this.systemLogger.info(
      `--- Uploading file: ${Keys.system_applicationLogFileName} ---`
    );
    await this.uploadFileAsync(
      Keys.system_applicationLogFileName,
      applicationLogs,
      logFileContainerClient
    );

    this.systemLogger.info(
      `--- Uploading file: ${Keys.system_systemLogFileName} ---`
    );
    await this.uploadFileAsync(
      Keys.system_systemLogFileName,
      systemLogs,
      logFileContainerClient
    );

    this.systemLogger.info(`--- Uploaded all log files ---`);
  }

  private async uploadFileAsync(
    fileName: string,
    logArray: string[],
    containerClient: ContainerClient
  ) {
    const logFile = logArray.join("\n");

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const uploadBlobResponse = await blockBlobClient.upload(
      logFile,
      logFile.length,
      {}
    );
  }
}
