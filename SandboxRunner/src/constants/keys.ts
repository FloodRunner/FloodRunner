import config = require("config");

export class Keys {
  /* Flood Element Settings */
  static showBrowser =
    process.env.NODE_ENV == "Production" ? "" : "--no-headless";
  static maximumRetries =
    process.env.MAX_RETRIES === undefined ? 1 : process.env.MAX_RETRIES;
  static testId = process.env.FLOOD_TESTID || config.get("flood.testId");

  /*Azure Storage Settings*/
  static azure_storageAccountName =
    process.env.AZURESTORAGE_ACCOUNTNAME ||
    config.get("azure-storage.accountName");
  static azure_storageAccountAccessKey =
    process.env.AZURESTORAGE_ACCESSKEY || config.get("azure-storage.accessKey");
  static azure_containerFolderName =
    process.env.AZURESTORAGE_CONTAINERFOLDERNAME ||
    config.get("azure-storage.containerFolderName");

  /*RabbitMQ Settings*/
  static rabbitmq_connectionString =
    process.env.RABBITMQ_CONNECTIONSTRING ||
    config.get("rabbitmq.connectionString");
  static rabbitmq_queueName =
    process.env.RABBITMQ_QUEUENAME || config.get("rabbitmq.queueName");

  /*System Settings*/
  static system_applicationLogFileName = "app.log";
  static system_systemLogFileName = "system.log";
}
