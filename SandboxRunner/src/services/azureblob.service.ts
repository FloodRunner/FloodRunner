import * as fs from "fs";
import { IFileService } from "../interfaces/fileservice.interface";
import { TestResult } from "../interfaces/test-result.interface";
import { Keys } from "../constants/keys";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobDownloadResponseModel,
  ContainerClient,
} from "@azure/storage-blob";
import { systemLogger } from "../helpers/logger";
import * as path from "path";

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(
  Keys.azure_storageAccountName,
  Keys.azure_storageAccountAccessKey
);
const blobServiceClient = new BlobServiceClient(
  `https://${Keys.azure_storageAccountName}.blob.core.windows.net`,
  sharedKeyCredential
);

export class AzureblobService implements IFileService {
  private _testDirectory = path.join(__dirname, `../testScripts`);
  private _logDirectory = path.join(__dirname, `../../logs`);

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
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobName = this.createTestScriptPath(id);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    var downloadBlockBlobResponse: BlobDownloadResponseModel = await blockBlobClient.download(
      0
    );
    var testScript: string = await this.streamToString(
      downloadBlockBlobResponse.readableStreamBody
    );

    //create directory
    if (!fs.existsSync(this._testDirectory)) {
      fs.mkdirSync(this._testDirectory);
    }

    //save file to disk
    const testScriptName = this.createTestScriptPath(id);
    const testFilePath = path.join(this._testDirectory, testScriptName);

    fs.writeFileSync(testFilePath, testScript);

    return testScript;
  }

  async uploadTestResults(id: string, testResults: TestResult): Promise<void> {
    //create container to hold test script and results
    const containerName = this.createContainerName(id);

    //get reference to container client
    const containerClient = blobServiceClient.getContainerClient(
      `${containerName}/${Keys.azure_containerFolderName}`
    );

    systemLogger.info(
      `--- Uploading file: ${Keys.system_applicationLogFileName} ---`
    );
    await this.uploadFileAsync(
      Keys.system_applicationLogFileName,
      containerClient
    );

    systemLogger.info(
      `--- Uploading file: ${Keys.system_systemLogFileName} ---`
    );
    await this.uploadFileAsync(Keys.system_systemLogFileName, containerClient);
  }

  private async uploadFileAsync(
    fileName: string,
    containerClient: ContainerClient
  ) {
    const logFile = fs.readFileSync(path.join(this._logDirectory, fileName));
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    const uploadBlobResponse = await blockBlobClient.upload(
      logFile,
      logFile.length,
      {}
    );
  }
}
