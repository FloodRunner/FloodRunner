import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FloodTest } from '../repositories/schemas/flood-test.schema';
import { FloodTestResultSummary } from '../repositories/schemas/flood-test-result-summary.schema';
import { FileService } from '../../storage/services/fileservice.service';
import { RabbitQueueService } from '../../messaging/services/rabbit-queue.service';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as moment from 'moment';

import * as ApiClient from 'kubernetes-client';
import { TestResultDto } from '../dtos/test-result.dto';
import { Keys } from '../../constants/keys';
import { TestType } from '../../common/enums/test-types.enum';
const Client = ApiClient.Client1_13;
const client = new Client({ version: '1.13' });
const jobManifestName = 'floodrunner-sandbox-job.yaml';

@Injectable()
export class FloodTestJobService {
  private _logger = new Logger('FloodTestJobService');

  constructor(
    private readonly queueService: RabbitQueueService,
    @InjectModel('FloodTest') private floodTestModel: Model<FloodTest>,
    @InjectModel('FloodTestResultSummary')
    private floodTestResultSummaryModel: Model<FloodTestResultSummary>,
    private readonly fileService: FileService,
  ) {
    this._logger.log('Registering queue callback functions');

    //queue listener for kicking off sandboxrunner job
    this.queueService.registerQueueListener(
      queueService.agendaJobQueueName,
      this.startFloodElementTestRun,
    );

    //queue listener for listening to result of sandboxrunner job
    this.queueService.registerQueueListener(
      queueService.elementQueueName,
      this.processFloodElementTestRun,
    );
  }

  /**
   * Replaces the environment variables in the specified yaml file
   * @param manifest The job manifest describing the kubernetes job to start the floodrunner/sandbox container
   * @param testId The testId to execute in the container
   * @param testRunName The test run name which is a timestamp (eg. 2020-07-16T10:49+00:00)
   */
  private replaceEnvironmentVariables(
    manifest: string,
    testId: string,
    testType: TestType,
    testRunName: string,
  ): string {
    var tokenReplacementMapping = [
      {
        token: '__FLOOD_TESTID__',
        tokenValue: testId,
      },
      {
        token: '__FLOOD_TEST_TYPE__',
        tokenValue: testType.toString(),
      },
      {
        token: '__FLOOD_MAX_RETRIES__',
        tokenValue: Keys.flood_maxRetries,
      },
      {
        token: '__FLOOD_MAXALLOWEDSCREENSHOTS__',
        tokenValue: Keys.flood_maximumAllowedScreenshots,
      },
      {
        token: '__AZURESTORAGE_ACCOUNTNAME__',
        tokenValue: Keys.azureStorage_AccountName,
      },
      {
        token: '__AZURESTORAGE_ACCESSKEY__',
        tokenValue: Keys.azureStorage_AccessKey,
      },
      {
        token: '__AZURESTORAGE_CONTAINERFOLDERNAME__',
        tokenValue: testRunName,
      },
      {
        token: '__RABBITMQ_CONNECTIONSTRING__',
        tokenValue: Keys.rabbitMqConnectionString,
      },
      {
        token: '__RABBITMQ_QUEUENAME__',
        tokenValue: Keys.rabbitMqElementQueueName,
      },
    ];

    tokenReplacementMapping.forEach(tokenMapping => {
      manifest = manifest.replace(tokenMapping.token, tokenMapping.tokenValue);
    });

    return manifest;
  }

  /**
   * Queue processing function that creates a Kubernetes Job to run FloodElement-SandboxRunner container.
   * This function will be executed every time a new test is scheduled
   */
  startFloodElementTestRun = async (testId: string) => {
    this._logger.log(`Starting flood element test run, id: ${testId}`);

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

    //read job manifest file
    // if (!jobManifestYaml) {
    var jobManifestYaml = fs.readFileSync(
      // path.join(__dirname, `floodtest/manifests/${jobManifestName}`),
      path.join(
        __dirname,
        `../../../src/floodtest/manifests/${jobManifestName}`,
      ), //not the ideal path but works while webpack giving issues
      'utf8',
    );
    // }

    //replace environment variables in job manifest
    var modifiedJobManifestYaml = this.replaceEnvironmentVariables(
      jobManifestYaml,
      testId,
      createdFloodTestSummary.type,
      createdFloodTestSummary.testRunName,
    );

    var parsedYaml = yaml.safeLoad(modifiedJobManifestYaml);

    this._logger.log(
      `Deploying kubernetes job, test id: ${testId}, test run: ${testRunName}`,
    );
    try {
      client.apis.batch.v1.namespaces('floodrunner-sandboxrunner').jobs.post({
        body: parsedYaml,
      });
    } catch (err) {
      this._logger.error(err);
    }
  };

  /**
   * Queue processing function that processes the results of the flood element test
   * run completed by the FloodElement-SandboxRunner container.
   * This function will be executed when the flood element test run has completed
   */
  processFloodElementTestRun = async (message: string) => {
    this._logger.log(
      `Processing flood element test run result, message: ${message}`,
    );

    const testResultDto: TestResultDto = JSON.parse(message);

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
