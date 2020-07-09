import * as appRoot from "app-root-path";
import { Keys } from "../constants/keys";
var winston = require("winston");
const { format } = require("logform");

// define the custom settings for each transport (file, console)
const applicationLogFilePath = `${appRoot}/logs/${Keys.system_applicationLogFileName}`;
const systemLogFilePath = `${appRoot}/logs/${Keys.system_systemLogFileName}`;

var options = {
  applicationFile: {
    level: "info",
    filename: applicationLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  systemFile: {
    level: "debug",
    filename: systemLogFilePath,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
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

// instantiate a new Winston Logger with the settings defined above
var applicationLogger = new winston.createLogger({
  format: combine(
    label({
      label: "SandboxRunner",
    }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File(options.applicationFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
applicationLogger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    applicationLogger.info(message);
  },
};

// instantiate a new Winston Logger with the settings defined above
var systemLogger = new winston.createLogger({
  format: combine(
    label({
      label: "SandboxRunner",
    }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File(options.systemFile),
    new winston.transports.Console(options.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
systemLogger.stream = {
  write: function (message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    systemLogger.info(message);
  },
};

export { applicationLogger, systemLogger };
