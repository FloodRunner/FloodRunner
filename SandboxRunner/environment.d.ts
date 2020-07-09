declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      MAX_RETRIES: number;
      FLOOD_TESTID: string;
      AZURESTORAGE_ACCOUNTNAME: string;
      AZURESTORAGE_ACCESSKEY: string;
      AZURESTORAGE_CONTAINERFOLDERNAME: string;
      RABBITMQ_CONNECTIONSTRING: string;
      RABBITMQ_QUEUENAME: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
