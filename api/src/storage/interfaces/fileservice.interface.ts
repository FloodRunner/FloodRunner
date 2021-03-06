import { TestFileDto } from '../../floodtest/dtos/test-file.dto';

export interface IFileService {
  uploadFile(id: string, testScript: TestFileDto | string): Promise<string>;
  downloadFile(id: string): Promise<string>;
  deleteContainer(id: string): Promise<void>;
  getTestResults(
    id: string,
    testFolder: string,
  ): Promise<{ logFileUris: string[]; screenShotUris: string[] }>;
}
