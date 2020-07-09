export interface IQueueService {
  sendQueueMessage(message: string): void;
  registerQueueListener(
    queueName: string,
    callbackFunction: (message: string) => void,
  );
}
