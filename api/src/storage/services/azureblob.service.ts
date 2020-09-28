import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import { IFileService } from '../interfaces/fileservice.interface';
import { TestFileDto } from '../../floodtest/dtos/test-file.dto';
import { Keys } from '../../constants/keys';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobDownloadResponseModel,
  generateBlobSASQueryParameters,
  ContainerSASPermissions,
} from '@azure/storage-blob';
// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only avaiable in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(
  Keys.azureStorage_AccountName,
  Keys.azureStorage_AccessKey,
);
const blobServiceClient = new BlobServiceClient(
  `https://${Keys.azureStorage_AccountName}.blob.core.windows.net`,
  sharedKeyCredential,
);

@Injectable()
export class AzureBlobService implements IFileService {
  private _logger = new Logger('AzureBlobService');

  private createTestScriptPath(id: string): string {
    return `testscript_${id}.ts`;
  }

  private createContainerName(id: string): string {
    return `floodtest-${id}`;
  }

  private generateSasUrl(
    containerName: string,
    fileName: string,
    testFolder: string = null,
  ): string {
    const blobName =
      testFolder === null ? `${fileName}` : `${testFolder}/${fileName}`;

    this._logger.debug(`Generating sas url for blob name: ${blobName}`);

    let SAS = generateBlobSASQueryParameters(
      {
        containerName: containerName,
        blobName: blobName,
        startsOn: new Date(),
        permissions: ContainerSASPermissions.parse('r'),
        expiresOn: new Date(new Date().valueOf() + 157680000000), //5 years
      },
      sharedKeyCredential,
    );

    return `https://${
      Keys.azureStorage_AccountName
    }.blob.core.windows.net/${containerName}/${blobName}?${SAS.toString()}`;
  }

  // A helper method used to read a Node.js readable stream into string
  private async streamToString(
    readableStream: NodeJS.ReadableStream,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: string[] = [];
      readableStream.on('data', data => {
        chunks.push(data.toString());
      });
      readableStream.on('end', () => {
        resolve(chunks.join(''));
      });
      readableStream.on('error', reject);
    });
  }

  async downloadFile(id: string): Promise<string> {
    return await this.download(
      this.createContainerName(id),
      this.createTestScriptPath(id),
    );
  }

  private async download(
    containerName: string,
    blobName: string,
  ): Promise<string> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    var downloadBlockBlobResponse: BlobDownloadResponseModel = await blockBlobClient.download(
      0,
    );
    var testScript: string = await this.streamToString(
      downloadBlockBlobResponse.readableStreamBody,
    );
    return testScript;
  }

  async uploadFile(
    id: string,
    testScript: TestFileDto | string,
  ): Promise<string> {
    let testBuffer = null;
    if (typeof testScript === 'string') {
      testBuffer = Buffer.from(testScript, 'utf8');
    } else {
      testBuffer = fs.readFileSync(testScript.path);
    }

    return await this.uploadTest(id, testBuffer);
  }

  private async uploadTest(id: string, test: Buffer): Promise<string> {
    //create container to hold test script and results
    const containerName = this.createContainerName(id);
    this._logger.log(`Creating container with name: ${containerName}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerResponse = await containerClient.create();
    this._logger.log(`Created container ${containerName} successfully`);

    //upload test script into container
    const blobName = this.createTestScriptPath(id);
    this._logger.log(`Uploading test script with name: ${blobName}`);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(test, test.length);
    this._logger.log(`Uploaded block blob ${blobName} successfully`);

    this._logger.log(`Generating uri for block blob ${blobName}`);
    var blobSasUrl = this.generateSasUrl(containerName, blobName);
    return blobSasUrl;
  }

  async deleteContainer(id: string): Promise<void> {
    const containerName = this.createContainerName(id);
    this._logger.debug(`Deleting container with name: ${containerName}`);
    const containerClient = blobServiceClient.getContainerClient(
      `${containerName}`,
    );

    var containerDeleteResponse = await containerClient.delete();
  }

  /**
   * Returns an object containering the logFileUris and screenShotUris of the executed test run
   * @param id Id of Flood Element Test
   * @param testFolder Folder where results where uploaded to in Azure Blob Storage which is a timestamp (eg. 2020-07-16T10:49+00:00)
   */
  async getTestResults(
    id: string,
    testFolder: string,
  ): Promise<{ logFileUris: string[]; screenShotUris: string[] }> {
    this._logger.debug(
      `Getting test results for, testId: ${id} and run: ${testFolder}`,
    );

    const containerName = this.createContainerName(id);
    const containerClient = blobServiceClient.getContainerClient(
      `${containerName}`,
    );

    //list blobs in the specific sub folder
    var logFileUris: string[] = [];
    var screenShotUris: string[] = [];
    for await (const blob of containerClient.listBlobsFlat({
      prefix: `${testFolder}`,
    })) {
      //strip test folder from blob name
      this._logger.debug(`Found file with name: ${blob.name}`);

      var fileName = blob.name.replace(`${testFolder}/`, '');
      if (blob.name.includes('.log')) {
        logFileUris.push(
          this.generateSasUrl(containerName, fileName, testFolder),
        );
      } else {
        fileName = fileName.replace(
          `${Keys.flood_screenshotsSubfolderName}/`,
          '',
        );
        screenShotUris.push(
          this.generateSasUrl(
            containerName,
            fileName,
            `${testFolder}/${Keys.flood_screenshotsSubfolderName}`,
          ),
        );
      }
    }

    return { logFileUris, screenShotUris };
  }
}
