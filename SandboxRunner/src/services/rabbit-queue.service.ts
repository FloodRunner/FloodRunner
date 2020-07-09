import * as Amqp from "amqp-ts";
import { IQueueService } from "../interfaces/queue-service.interface";
import { TestResult } from "../interfaces/test-result.interface";
import { Keys } from "../constants/keys";
import { systemLogger } from "../helpers/logger";
import { TestResultDto } from "../dtos/test-result.dto";

export class RabbitQueueService implements IQueueService {
  private _connection;
  private _elementQueue;

  constructor() {
    try {
      this._connection = new Amqp.Connection(Keys.rabbitmq_connectionString);
      console.log(Keys.rabbitmq_connectionString);
      this._elementQueue = this._connection.declareQueue(
        Keys.rabbitmq_queueName
      );
      this._connection.completeConfiguration().then(() => {
        systemLogger.debug(`RabbitMq connection established successfully.`);
      });
    } catch (err) {
      systemLogger.error(
        "Error occurred while setting up RabbitMq connection...",
        err
      );
      throw err;
    }
  }

  sendQueueMessage(testId: string, testResult: TestResult): void {
    var message: TestResultDto = {
      testId,
      testRunName: Keys.azure_containerFolderName,
      isSuccessful: testResult.isSuccessful,
      numberTimesExecuted: testResult.numberTimesExecuted,
    };
    var stringMessage = JSON.stringify(message);
    systemLogger.info(
      `Sending message: ${stringMessage} to queue: ${Keys.rabbitmq_queueName}`
    );
    const msg = new Amqp.Message(stringMessage);
    this._elementQueue.send(msg);
    systemLogger.info(
      `Sent message: ${stringMessage} to queue: ${Keys.rabbitmq_queueName}`
    );
  }
}
