import { TestType } from '../../common/enums/test-types.enum';

/**
 * Interface that SandboxRunner API requires to execute browser test
 */
export interface BrowserTestSettings {
  isDevelopment: boolean;
  testSettings: {
    id: string;
    type: TestType;
    maximumAllowedScreenshots: number;
    maximumRetries: number;
  };
  azureStorage: {
    uploadResults: boolean;
    accountName: string;
    accountAccessKey: string;
    containerFolderName: string;
  };
}
