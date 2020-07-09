import { Injectable, Logger } from '@nestjs/common';
import { FloodTest } from '../../floodtest/repositories/schemas/flood-test.schema';
import { Keys } from 'src/constants/keys';
import { Helpers } from '../../floodtest/helpers/helpers';
import { IJobService } from '../interfaces/jobservice.interface';
import { RabbitQueueService } from '../../messaging/services/rabbit-queue.service';

const Agenda = require('agenda');

@Injectable()
export class AgendaService implements IJobService {
  private _logger = new Logger('AgendaService');
  private agenda;

  constructor(private readonly queueService: RabbitQueueService) {}

  /**
   * Setup Agenda and register queue callback functions
   */
  async setup() {
    this._logger.debug('Setting up agenda...');

    //setup and start agenda
    this.agenda = new Agenda({
      db: {
        address: Keys.buildMongoDbConnectionString(Keys.mongoDbJobDatabaseName),
        collection: Keys.mongoDbJobCollectionName,
      },
    });
  }

  /**
   * Start Agenda job processing
   */
  async start() {
    this._logger.log('Starting Agenda Scheduler');
    this.agenda.start();
  }

  /**
   * Defines an Agenda job that will post to the queue to kickoff Flood Element test run
   * @param floodTestId id of flood element test
   */
  async defineJob(floodTestId: string) {
    this._logger.log(`Creating definition for job with testId: ${floodTestId}`);

    this.agenda.define(Helpers.createJobName(floodTestId), async job => {
      const { testId } = job.attrs.data;
      this._logger.log(`Queueing job for test id: ${testId}`);
      await this.queueService.sendQueueMessage(testId);
    });
  }

  /**
   * Creates Agenda job and sets schedule
   * @param floodTest Flood Element Test model
   */
  async createJob(floodTest: FloodTest) {
    this._logger.log(
      `Creating job with testId: ${floodTest._id} and schedule: ${floodTest.interval} minutes`,
    );
    await this.defineJob(floodTest._id);
    this.agenda.define(Helpers.createJobName(floodTest._id), async job => {
      const { testId } = job.attrs.data;
      this._logger.log(`Running job, with testId: ${testId}`);
      await this.queueService.sendQueueMessage(testId);
    });
    await this.agenda.every(
      Helpers.createJobSchedule(floodTest.interval),
      Helpers.createJobName(floodTest._id),
      {
        testId: floodTest._id,
      },
    );
  }

  /**
   * Deletes Agenda job
   * @param floodTestId id of flood element test
   */
  async deleteJob(floodTestId: string) {
    this._logger.log(`Deleting job with testId: ${floodTestId}`);
    await this.agenda.cancel({ name: Helpers.createJobName(floodTestId) });
  }

  /**
   * Updates Agenda job
   * @param floodTest Flood Element Test model
   */
  async updateJob(floodTest: FloodTest) {
    this._logger.log(
      `Updating job with testId: ${floodTest._id}, new schedule: ${floodTest.interval} minutes`,
    );
    await this.deleteJob(floodTest._id);
    await this.createJob(floodTest);
  }
}
