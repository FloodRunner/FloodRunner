import { Injectable, Logger } from '@nestjs/common';
import { IFileService } from '../interfaces/fileservice.interface';
import { TestFileDto } from '../../floodtest/dtos/test-file.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalBlobService implements IFileService {
  deleteContainer(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getTestResults(
    id: string,
    testFolder: string,
  ): Promise<{ logFileUris: string[]; screenShotUris: string[] }> {
    throw new Error('Method not implemented.');
  }

  private _logger = new Logger('LocalBlobService');
  private testDirectory = path.join(__dirname, `testScripts`);

  private createTestScriptPath(id: string): string {
    return `testscript_${id}.ts`;
  }

  async uploadFile(id: string, testFileDto: TestFileDto): Promise<string> {
    try {
      this._logger.log(
        `Reading temporary file with name: ${testFileDto.filename}`,
      );

      const tempFile = fs.readFileSync(testFileDto.path);

      //create directory if not exits
      this._logger.log(this.testDirectory);
      if (!fs.existsSync(this.testDirectory)) {
        this._logger.log(
          `Test directory does not exist, creating temporary directory: ${this.testDirectory}`,
        );
        fs.mkdirSync(this.testDirectory);
      }

      const testScriptName = this.createTestScriptPath(id);
      const testFilePath = path.join(this.testDirectory, testScriptName);
      this._logger.log(
        `Saving test script with name: ${testScriptName}, to directory: ${testFilePath}`,
      );

      fs.writeFileSync(testFilePath, tempFile);

      this._logger.log(
        `Saved test script with name: ${testScriptName}, to directory: ${testFilePath}`,
      );

      return testFilePath;
    } catch (err) {
      this._logger.error(`Error saving test script with id: ${id}`, err);
    }
  }

  async downloadFile(id: string): Promise<string> {
    try {
      const testFileString = fs.readFileSync(
        path.join(this.testDirectory, this.createTestScriptPath(id)),
        'utf8',
      );
      return testFileString;
    } catch (err) {
      this._logger.error(`Error downloading test script with id: ${id}`, err);
    }
  }
}
