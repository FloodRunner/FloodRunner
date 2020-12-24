import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { TestResultDto } from '../dtos/test-result.dto';
import { Keys } from '../../constants/keys';
import { BrowserTestSettings } from '../dtos/browser-test-settings.dto';

@Injectable()
export class SandboxRunnerService {
  private _logger = new Logger('SandboxRunnerService');

  constructor(private httpService: HttpService) {}

  async runBrowserTest(
    testSettings: BrowserTestSettings,
  ): Promise<TestResultDto> {
    this._logger.debug(
      `Starting browser test for ${testSettings.testSettings.id}`,
    );
    // return this.httpService.post(Keys.sandboxRunner_url, testSettings);
    const response = await this.httpService
      .post<TestResultDto>(Keys.sandboxRunner_url, testSettings)
      .toPromise();
    return response.data;
  }
}
