import * as config from 'config';

export class Keys {
  static mongoDbHostType =
    process.env.MONGODB_HOSTTYPE || config.get('mongodb.hostType');
  static mongoDbHost = process.env.MONGODB_HOST || config.get('mongodb.host');
  static mongoDbPort = process.env.MONGODB_PORT || config.get('mongodb.port');
  static mongoDbConnectionString =
    process.env.MONGODB_CONNECTIONSTRING ||
    config.get('mongodb.connectionString');
  static mongoDbJobDatabaseName =
    process.env.MONGODB_JOB_DATABASE || config.get('mongodb.jobDatabaseName');
  static mongoDbJobCollectionName =
    process.env.MONGODB_JOB_COLLECTION ||
    config.get('mongodb.jobCollectionName');
  static mongoDbFloodDatabaseName =
    process.env.MONGODB_FLOOD_DATABASE ||
    config.get('mongodb.floodDatabaseName');
  static mongoDbUsername =
    process.env.MONGODB_USERNAME || config.get('mongodb.user');
  static mongoDbPassword =
    process.env.MONGODB_PASSWORD || config.get('mongodb.password');

  static rabbitMqConnectionString =
    process.env.RABBITMQ_CONNECTIONSTRING ||
    config.get('rabbitMq.connectionString');
  static rabbitMqElementQueueName =
    process.env.RABBITMQ_ELEMENTQUEUENAME ||
    config.get('rabbitMq.elementQueueName');

  static azureStorage_AccountName =
    process.env.AZURESTORAGE_ACCOUNTNAME ||
    config.get('azureStorage.accountName');
  static azureStorage_AccessKey =
    process.env.AZURESTORAGE_ACCESSKEY || config.get('azureStorage.accessKey');

  static serverPort = process.env.PORT || config.get('server.port');

  static buildMongoDbConnectionString(database: string): string {
    //this assumes localhost has no authentication
    let connectionString: string;
    if (this.mongoDbHostType === 'localhost') {
      connectionString = `mongodb://${this.mongoDbHost}:${this.mongoDbPort}/${database}`;
    } else if (this.mongoDbHostType === 'atlas') {
      connectionString = this.mongoDbConnectionString;
    } else if (this.mongoDbHostType === 'kubernetes') {
      connectionString = `mongodb://${this.mongoDbUsername}:${this.mongoDbPassword}@${this.mongoDbHost}:${this.mongoDbPort}/${database}?authSource=admin`;
    }
    return connectionString;
  }

  static fileServiceStrategy =
    process.env.FILE_SERVICE_STRATEGY ||
    config.get('server.fileServiceStrategy');

  static auth_domain = process.env.AUTH_DOMAIN || config.get('auth.domain');
  static auth_audience =
    process.env.AUTH_AUDIENCE || config.get('auth.audience');

  static flood_maximumAllowedScreenshots =
    process.env.FLOOD_MAXALLOWEDSCREENSHOTS ||
    config.get('flood.maximumAllowedScreenshots');

  static flood_maxRetries =
    process.env.FLOOD_MAX_RETRIES || config.get('flood.maxRetries');

  //this corresponds to the folder structure stored in blob storag
  //(ie. the logical folder where screenshots are stored)
  static flood_screenshotsSubfolderName = 'screenshots';
}
