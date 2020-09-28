import { Injectable } from '@nestjs/common';
import { IFileService } from '../interfaces/fileservice.interface';
import { TestFileDto } from '../../floodtest/dtos/test-file.dto';

//dummy service to allow replacement with a specific strategy
@Injectable()
export class FileService implements IFileService {
  uploadFile(id: string, testScript: string | TestFileDto): Promise<string> {
    throw new Error('Method not implemented.');
  }
  getTestResults(
    id: string,
    testFolder: string,
  ): Promise<{ logFileUris: string[]; screenShotUris: string[] }> {
    throw new Error('Method not implemented.');
  }

  downloadFile(id: string): Promise<string> {
    throw new Error('Method not implemented.');
  }

  deleteContainer(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
