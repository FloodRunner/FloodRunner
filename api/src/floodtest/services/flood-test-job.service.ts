import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { FloodTest } from '../repositories/schemas/flood-test.schema';
import { FloodTestResultSummary } from '../repositories/schemas/flood-test-result-summary.schema';
import { FileService } from '../../storage/services/fileservice.service';
import { AgendaService } from '../../scheduling/services/agenda.service';
import { FloodtestService } from './floodtest.service';
import { SandboxRunnerService } from './sandbox-runner.service';
import { TestResultDto } from '../dtos/test-result.dto';
import { Keys } from '../../constants/keys';
import { TestType } from '../../common/enums/test-types.enum';
import { BrowserTestSettings } from '../dtos/browser-test-settings.dto';

@Injectable()
export class FloodTestJobService {
  private _logger = new Logger('FloodTestJobService');

  constructor(
    @InjectModel('FloodTest') private floodTestModel: Model<FloodTest>,
    @InjectModel('FloodTestResultSummary')
    private floodTestResultSummaryModel: Model<FloodTestResultSummary>,
    private readonly floodTestService: FloodtestService,
    private readonly sandboxRunnerService: SandboxRunnerService,
    private readonly agendaService: AgendaService,
    private readonly fileService: FileService,
  ) {
    this._logger.log('Registering queue callback functions');

    //setup job service
    agendaService.setup();

    //redefine all agenda jobs
    this.floodTestService.findAllIds().then(floodTestIds => {
      //re-define all agenda jobs here
      floodTestIds.forEach(floodTestId => {
        agendaService.defineJob(floodTestId);
      });

      //start job service
      agendaService.start(this.startBrowserTestRun);
    });
  }

  /**
   * Function that creates runs browser test using SandboxRunner API.
   * This function will be executed every time a new test is scheduled
   */
  startBrowserTestRun = async (testId: string) => {
    this._logger.log(`Starting browser test, id: ${testId}`);

    //find associated test to get test type (could be improved by sending type in message)
    const testType = (await this.floodTestModel.findById(testId)).type;

    //create a test summary object
    const runOn = moment.utc();
    const testRunName = runOn.format('YYYY-MM-DDTH:mmZ');
    const runOnDate = runOn.toDate();
    let createdFloodTestSummary: FloodTestResultSummary;
    try {
      createdFloodTestSummary = new this.floodTestResultSummaryModel({
        testId: testId,
        testRunName: testRunName,
        isCompleted: null,
        executionTimeInSeconds: -1,
        isSuccessful: null,
        logFileUri: null,
        runOn: runOnDate,
        type: testType ?? TestType.Element,
      });

      //persist flood test summary
      await createdFloodTestSummary.save();
    } catch (err) {
      this._logger.error(err);
    }

    this._logger.log(
      `Invoking SandboxRunner, test id: ${testId}, test run: ${testRunName}`,
    );
    try {
      const testSettings: BrowserTestSettings = {
        isDevelopment: false,
        testSettings: {
          id: testId,
          type: testType,
          maximumRetries: Keys.flood_maxRetries,
          maximumAllowedScreenshots: Keys.flood_maximumAllowedScreenshots,
        },
        azureStorage: {
          uploadResults: true,
          accountName: Keys.azureStorage_AccountName,
          accountAccessKey: Keys.azureStorage_AccessKey,
          containerFolderName: testRunName,
        },
      };

      var testResult = await this.sandboxRunnerService.runBrowserTest(
        testSettings,
      );

      await this.processTestResult(testResult);
    } catch (err) {
      this._logger.error(err);
    }
  };

  /**
   * Function that processes the results of the browser test
   * run completed by the FloodElement-SandboxRunner API.
   * This function will be executed when the browser test run has completed.
   */
  processTestResult = async (testResultDto: TestResultDto) => {
    this._logger.log(
      `Processing browser test run result, test result: ${testResultDto}`,
    );

    //generate test result urls
    var testResults = await this.fileService.getTestResults(
      testResultDto.testId,
      testResultDto.testRunName,
    );
    //update test summary model
    var testSummaryQuery = {
      testId: testResultDto.testId,
      testRunName: testResultDto.testRunName,
    };
    var testSummaryUpdate = {
      $set: {
        logFileUris: testResults.logFileUris,
        screenShotUris: testResults.screenShotUris,
        isCompleted: true,
        isSuccessful: testResultDto.isSuccessful,
        executionTimeInSeconds: testResultDto.executionTimeInSeconds,
      },
    };
    var testSummary = await this.floodTestResultSummaryModel.findOneAndUpdate(
      testSummaryQuery,
      testSummaryUpdate,
    );

    this._logger.log(
      `Saved test summary with id: ${testSummary._id} and run name: ${testSummary.testRunName}`,
    );

    //update test
    var testUpdate = {
      $set: {
        'resultOverview.isPassing': testResultDto.isSuccessful,
        'resultOverview.lastRun': new Date(testResultDto.testRunName),
      },
    };

    var floodTest = await this.floodTestModel.findByIdAndUpdate(
      testResultDto.testId,
      testUpdate,
    );
    this._logger.log(
      `Saved test with id: ${floodTest._id} and run name: ${testSummary.testRunName}`,
    );
  };
}
