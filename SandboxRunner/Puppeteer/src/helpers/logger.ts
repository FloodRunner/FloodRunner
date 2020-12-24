var winston = require("winston");
const { format } = require("logform");
const Transport = require("winston-transport");

// define custom transport
//
// Inherit from `winston-transport` so you can take advantage
// of the base functionality and `.exceptions.handle()`.
//
class CustomTransport extends Transport {
  constructor() {
    super();
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    // Perform the writing to the remote service
    callback();
  }
}

var options = {
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const createApplicationLogger = () => {
  var applicationLoggerArray = [];
  const transport = new CustomTransport();
  transport.on("logged", (info) => {
    const { level, message, label, timestamp } = info;
    const formattedLog = `${timestamp} [${label}] ${level}: ${message}`;
    applicationLoggerArray.push(formattedLog);
  });

  var logger = new winston.createLogger({
    format: combine(
      label({
        label: "SandboxRunner",
      }),
      timestamp(),
      myFormat
    ),
    transports: [new winston.transports.Console(options.console), transport],
    exitOnError: false, // do not exit on handled exceptions
  });

  return { applicationLogger: logger, applicationLogs: applicationLoggerArray };
};

const createSystemLogger = () => {
  var systemLoggerArray = [];
  const transport = new CustomTransport();
  transport.on("logged", (info) => {
    const { level, message, label, timestamp } = info;
    const formattedLog = `${timestamp} [${label}] ${level}: ${message}`;
    systemLoggerArray.push(formattedLog);
  });

  var logger = new winston.createLogger({
    format: combine(
      label({
        label: "SandboxRunner",
      }),
      timestamp(),
      myFormat
    ),
    transports: [new winston.transports.Console(options.console), transport],
    exitOnError: false, // do not exit on handled exceptions
  });

  return { systemLogger: logger, systemLogs: systemLoggerArray };
};

export { createSystemLogger, createApplicationLogger };
